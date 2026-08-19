import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  createCompany,
  createLead,
  createVehicle,
  getPublisherDashboard,
  getVehicleById,
  listCompaniesByOwner,
  listVehicleImages,
  listVehicles,
  createVehicleImage,
  upsertUser,
} from "./db";

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

export const appRouter = router({
  system: systemRouter,
  admin: router({
    health: adminProcedure.query(({ ctx }) => ({ ok: true, role: ctx.user.role })),
    dashboard: adminProcedure.query(({ ctx }) => ({ ok: true, role: ctx.user.role, canManage: true })),
  }),
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    setSignupRole: protectedProcedure
      .input(z.object({ role: z.enum(["cliente", "locador"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role === "admin") return { role: "admin" as const };
        await upsertUser({ openId: ctx.user.openId, role: input.role });
        return { role: input.role };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  marketplace: router({
    vehicles: publicProcedure
      .input(z.object({ city: z.string().optional(), category: z.string().optional(), purpose: z.string().optional(), search: z.string().optional() }).optional())
      .query(({ input }) => listVehicles(input)),
    vehicle: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getVehicleById(input.id)),
    companiesMine: publisherProcedure.query(({ ctx }) => listCompaniesByOwner(ctx.user.id)),
    dashboard: publisherProcedure.query(({ ctx }) => getPublisherDashboard(ctx.user.id)),
    companyCreate: publisherProcedure
      .input(z.object({ name: z.string().min(2).max(160), legalName: z.string().max(200).optional(), document: z.string().max(32).optional(), type: z.enum(["anunciante", "locadora"]), phone: z.string().max(32).optional(), whatsapp: z.string().max(32).optional(), email: z.string().email().optional() }))
      .mutation(({ ctx, input }) => createCompany({ ...input, ownerUserId: ctx.user.id })),
    vehicleCreate: publisherProcedure.input(vehicleInput).mutation(({ input }) => createVehicle(input)),
    vehicleImages: publicProcedure.input(z.object({ vehicleId: z.number().int().positive() })).query(({ input }) => listVehicleImages(input.vehicleId)),
    vehicleImageCreate: publisherProcedure
      .input(z.object({ vehicleId: z.number().int().positive(), url: z.string().url(), storageKey: z.string().max(512).optional(), altText: z.string().max(180).optional(), sortOrder: z.number().int().nonnegative().optional(), isCover: z.boolean().optional() }))
      .mutation(({ input }) => createVehicleImage(input)),
    leadCreate: publicProcedure
      .input(z.object({ vehicleId: z.number().int().positive(), companyId: z.number().int().positive(), requesterUserId: z.number().int().positive().optional(), name: z.string().min(2).max(160), email: z.string().email().optional(), phone: z.string().max(32).optional(), message: z.string().max(2000).optional(), source: z.string().max(64).optional(), utmSource: z.string().max(120).optional(), utmMedium: z.string().max(120).optional(), utmCampaign: z.string().max(120).optional() }))
      .mutation(({ input }) => createLead(input)),
  }),
});

export type AppRouter = typeof appRouter;
