import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { storagePut } from "./storage";
import {
  createClientInterest,
  createCompany,
  upsertUser,
  createLead,
  deleteLeadForOwner,
  getClientArea,
  getCompanyById,
  createVehicle,
  getPublisherDashboard,
  getVehicleById,
  listCompaniesByOwner,
  listVehicleImages,
  listVehicles,
  removeFavorite,
  saveFavorite,
  listAdminVehicles,
  updateVehicleStatus,
  updateVehicleFeatured,
  createVehicleImage,
  deleteAdminVehicle,
  recordVehicleView,
  getUserByEmail,
  createLocalUser,
  invalidateLocalSessions,
  updateLocalPassword,
  updateLocalPhone,
} from "./db";
import { sdk } from "./_core/sdk";
import {
  createLocalOpenId,
  hashPassword,
  isPublicSignupRole,
  isValidEmail,
  normalizeEmail,
  safeDisplayName,
  verifyPassword,
  validatePassword,
} from "./auth-local";

const clientProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "cliente" && ctx.user.role !== "user") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Apenas clientes podem acessar esta área." });
  }
  return next({ ctx });
});

const publisherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "locador" && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Apenas locadores e administradores podem anunciar." });
  }
  return next({ ctx });
});

const vehicleInput = z.object({
  companyId: z.number().int().positive(),
  brand: z.string().min(2).max(80),
  model: z.string().min(1).max(120),
  version: z.string().max(120).optional(),
  year: z.number().int().min(2016).max(2027),
  category: z.enum(["carro", "moto", "eletrico", "hibrido", "utilitario", "van", "caminhonete"]),
  fuel: z.enum(["flex", "gasolina", "diesel", "eletrico", "hibrido", "plug_in"]),
  transmission: z.enum(["manual", "automatico", "automatizado"]),
  state: z.string().length(2),
  city: z.string().min(2).max(100),
  weeklyPrice: z.string().optional(),
  monthlyPrice: z.string().optional(),
  deposit: z.string().optional(),
  kmLimitMonthly: z.number().int().nonnegative().optional(),
  insuranceIncluded: z.boolean().optional(),
  acceptsApp: z.boolean().optional(),
  acceptsUberX: z.boolean().optional(),
  acceptsUberComfort: z.boolean().optional(),
  acceptsUberBlack: z.boolean().optional(),
  accepts99: z.boolean().optional(),
  description: z.string().min(10),
  rentalRequirements: z.string().optional(),
  status: z.enum(["draft", "active", "paused", "rented"]).optional(),
});

function toPublicSessionUser(user: {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: "user" | "admin" | "cliente" | "locador";
} | null) {
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role };
}

function normalizeBrazilianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const validLength = digits.length === 10 || digits.length === 11;
  if (!validLength || !/^[1-9][1-9]/.test(digits)) return null;
  return digits;
}

export const appRouter = router({
  system: systemRouter,
  admin: router({
    health: adminProcedure.query(({ ctx }) => ({ ok: true, role: ctx.user.role })),
    dashboard: adminProcedure.query(({ ctx }) => ({ ok: true, role: ctx.user.role, canManage: true })),
    vehicles: adminProcedure.query(() => listAdminVehicles()),
    vehicleStatus: adminProcedure
      .input(z.object({ vehicleId: z.number().int().positive(), status: z.enum(["draft", "active", "paused", "rented"]) }))
      .mutation(({ input }) => updateVehicleStatus(input.vehicleId, input.status)),
    vehicleFeatured: adminProcedure
      .input(z.object({ vehicleId: z.number().int().positive(), isFeatured: z.boolean(), featuredOrder: z.number().int().min(0).max(99).optional() }))
      .mutation(({ input }) => updateVehicleFeatured(input.vehicleId, input.isFeatured, input.featuredOrder ?? 0)),
    vehicleDelete: adminProcedure
      .input(z.object({ vehicleId: z.number().int().positive() }))
      .mutation(({ input }) => deleteAdminVehicle(input.vehicleId)),
  }),
  auth: router({
    me: publicProcedure.query((opts) => toPublicSessionUser(opts.ctx.user)),
    register: publicProcedure
      .input(z.object({
        name: z.string().min(2).max(160),
        email: z.string().email(),
        password: z.string().min(8).max(128),
        role: z.enum(["cliente", "locador"]),
      }))
      .mutation(async ({ input }) => {
        const email = normalizeEmail(input.email);
        if (!isValidEmail(email) || !isPublicSignupRole(input.role)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Dados de cadastro inválidos." });
        }
        const existing = await getUserByEmail(email);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Já existe uma conta com este email." });
        }
        const name = safeDisplayName(input.name, email);
        await createLocalUser({
          openId: createLocalOpenId(),
          name,
          email,
          passwordHash: hashPassword(input.password),
          role: input.role,
        });
        return { success: true, message: "Cadastro concluído. Agora entre com seu email e senha." } as const;
      }),
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(1).max(128) }))
      .mutation(async ({ ctx, input }) => {
        const email = normalizeEmail(input.email);
        const user = await getUserByEmail(email);
        if (!user || !verifyPassword(input.password, user.passwordHash)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou senha inválidos." });
        }
        const signedInAt = new Date(Math.floor(Date.now() / 1000) * 1000);
        await upsertUser({ openId: user.openId, lastSignedIn: signedInAt });
        const token = await sdk.signSession({
          openId: user.openId,
          appId: "local-password",
          name: safeDisplayName(user.name ?? "", user.email ?? email),
        });
        ctx.res.cookie(COOKIE_NAME, token, getSessionCookieOptions(ctx.req));
        return { success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } } as const;
      }),
    changePassword: protectedProcedure
      .input(z.object({ currentPassword: z.string().min(1).max(128), newPassword: z.string().min(8).max(128) }))
      .mutation(async ({ ctx, input }) => {
        if (!verifyPassword(input.currentPassword, ctx.user.passwordHash)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "A senha atual está incorreta." });
        }
        validatePassword(input.newPassword);
        await updateLocalPassword(ctx.user.id, hashPassword(input.newPassword));
        return { success: true } as const;
      }),
    updateContact: protectedProcedure
      .input(z.object({ phone: z.string().min(10).max(32) }))
      .mutation(async ({ ctx, input }) => {
        const phone = normalizeBrazilianPhone(input.phone);
        if (!phone) throw new TRPCError({ code: "BAD_REQUEST", message: "Informe um WhatsApp válido com DDD." });
        await updateLocalPhone(ctx.user.id, phone);
        return { phone } as const;
      }),
    clientArea: clientProcedure.query(({ ctx }) => getClientArea(ctx.user.id)),
    favoriteSave: clientProcedure
      .input(z.object({ vehicleKey: z.string().min(1).max(160) }))
      .mutation(({ ctx, input }) => saveFavorite({ userId: ctx.user.id, vehicleKey: input.vehicleKey })),
    favoriteRemove: clientProcedure
      .input(z.object({ vehicleKey: z.string().min(1).max(160) }))
      .mutation(({ ctx, input }) => removeFavorite(ctx.user.id, input.vehicleKey)),
    interestCreate: clientProcedure
      .input(z.object({ vehicleKey: z.string().min(1).max(160), vehicleLabel: z.string().min(2).max(220), message: z.string().max(2000).optional() }))
      .mutation(({ ctx, input }) => createClientInterest({ userId: ctx.user.id, ...input })),
    setSignupRole: protectedProcedure
      .input(z.object({ role: z.enum(["cliente", "locador"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role === "admin") return { role: "admin" as const };
        await upsertUser({ openId: ctx.user.openId, role: input.role });
        return { role: input.role };
      }),
    logout: publicProcedure.mutation(async ({ ctx }) => {
      if (ctx.user?.loginMethod === "password") {
        await invalidateLocalSessions(ctx.user.openId);
      }
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, cookieOptions);
      return { success: true } as const;
    }),
  }),
  marketplace: router({
    vehicles: publicProcedure
      .input(z.object({ city: z.string().optional(), category: z.string().optional(), purpose: z.string().optional(), search: z.string().optional() }).optional())
      .query(({ input }) => listVehicles(input)),
    vehicle: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getVehicleById(input.id)),
    vehicleViewCreate: publicProcedure.input(z.object({ vehicleId: z.number().int().positive(), sessionKey: z.string().max(160).optional(), source: z.string().max(64).optional() })).mutation(({ input }) => recordVehicleView(input.vehicleId, input.sessionKey, input.source)),
    companiesMine: publisherProcedure.query(({ ctx }) => listCompaniesByOwner(ctx.user.id)),
    dashboard: publisherProcedure.query(({ ctx }) => getPublisherDashboard(ctx.user.id)),
    companyCreate: publisherProcedure
      .input(z.object({ name: z.string().min(2).max(160), legalName: z.string().max(200).optional(), document: z.string().max(32).optional(), type: z.enum(["anunciante", "locadora"]), phone: z.string().max(32).optional(), whatsapp: z.string().max(32).optional(), email: z.string().email().optional() }))
      .mutation(({ ctx, input }) => createCompany({
        ...input,
        phone: input.phone ?? ctx.user.phone ?? undefined,
        whatsapp: input.whatsapp ?? ctx.user.phone ?? undefined,
        ownerUserId: ctx.user.id,
      })),
    vehicleCreate: publisherProcedure.input(vehicleInput).mutation(async ({ ctx, input }) => {
      const company = await getCompanyById(input.companyId);
      if (!company || (ctx.user.role !== "admin" && company.ownerUserId !== ctx.user.id)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Você não pode anunciar por esta empresa." });
      }
      return createVehicle(input);
    }),
    vehicleImages: publicProcedure.input(z.object({ vehicleId: z.number().int().positive() })).query(({ input }) => listVehicleImages(input.vehicleId)),
    vehicleImageCreate: publisherProcedure
      .input(z.object({ vehicleId: z.number().int().positive(), url: z.string().url(), storageKey: z.string().max(512).optional(), altText: z.string().max(180).optional(), sortOrder: z.number().int().nonnegative().optional(), isCover: z.boolean().optional() }))
      .mutation(({ input }) => createVehicleImage(input)),
    vehicleImageUpload: publisherProcedure
      .input(z.object({ vehicleId: z.number().int().positive(), fileName: z.string().min(1).max(160), contentType: z.enum(["image/jpeg", "image/png", "image/webp"]), data: z.string().min(32).max(7_000_000), sortOrder: z.number().int().nonnegative().optional() }))
      .mutation(async ({ ctx, input }) => {
        const vehicle = await getVehicleById(input.vehicleId);
        if (!vehicle || (ctx.user.role !== "admin" && vehicle.company?.ownerUserId !== ctx.user.id)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Você não pode alterar este anúncio." });
        }
        const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
        const bytes = Buffer.from(input.data, "base64");
        if (bytes.length > 5 * 1024 * 1024) throw new TRPCError({ code: "BAD_REQUEST", message: "Cada imagem deve ter no máximo 5 MB." });
        const uploaded = await storagePut(`vehicles/${input.vehicleId}/${safeName}`, bytes, input.contentType);
        const imageId = await createVehicleImage({ vehicleId: input.vehicleId, url: uploaded.url, storageKey: uploaded.key, altText: safeName, sortOrder: input.sortOrder ?? 0, isCover: (input.sortOrder ?? 0) === 0 });
        return { imageId, ...uploaded };
      }),
    leadCreate: publicProcedure
      .input(z.object({ vehicleId: z.number().int().positive(), companyId: z.number().int().positive(), requesterUserId: z.number().int().positive().optional(), name: z.string().min(2).max(160), email: z.string().email().optional(), phone: z.string().max(32).optional(), message: z.string().max(2000).optional(), source: z.string().max(64).optional(), utmSource: z.string().max(120).optional(), utmMedium: z.string().max(120).optional(), utmCampaign: z.string().max(120).optional() }))
      .mutation(({ ctx, input }) => {
        if (input.requesterUserId && ctx.user?.id !== input.requesterUserId) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Você não pode enviar interesse em nome de outra pessoa." });
        }
        const phone = normalizeBrazilianPhone(input.phone ?? ctx.user?.phone ?? "");
        if (!phone) {
          throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Informe um WhatsApp válido antes de enviar seu interesse." });
        }
        return createLead({ ...input, phone, requesterUserId: ctx.user?.id ?? input.requesterUserId });
      }),
    leadDelete: publisherProcedure
      .input(z.object({ leadId: z.number().int().positive() }))
      .mutation(({ ctx, input }) => deleteLeadForOwner(input.leadId, ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
