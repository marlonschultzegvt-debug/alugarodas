import { and, asc, desc, eq, inArray, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  clientInterests,
  companies,
  favorites,
  InsertCompany,
  InsertClientInterest,
  InsertFavorite,
  InsertLead,
  InsertUser,
  InsertVehicle,
  InsertVehicleImage,
  leads,
  users,
  vehicleImages,
  vehicles,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listVehicles(filters?: { city?: string; category?: string; purpose?: string; search?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(vehicles.status, "active")];
  if (filters?.city) conditions.push(eq(vehicles.city, filters.city));
  if (filters?.category) conditions.push(eq(vehicles.category, filters.category as typeof vehicles.category.enumValues[number]));
  if (filters?.search) {
    const term = `%${filters.search}%`;
    conditions.push(or(like(vehicles.brand, term), like(vehicles.model, term))!);
  }
  if (filters?.purpose === "APP") conditions.push(eq(vehicles.acceptsApp, true));
  if (filters?.purpose === "UberX") conditions.push(eq(vehicles.acceptsUberX, true));
  if (filters?.purpose === "Uber Comfort") conditions.push(eq(vehicles.acceptsUberComfort, true));
  if (filters?.purpose === "Uber Black") conditions.push(eq(vehicles.acceptsUberBlack, true));
  if (filters?.purpose === "99") conditions.push(eq(vehicles.accepts99, true));
  return db.select().from(vehicles).where(and(...conditions)).orderBy(desc(vehicles.createdAt));
}

export async function getVehicleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
  if (!result[0]) return undefined;
  const images = await db.select().from(vehicleImages).where(eq(vehicleImages.vehicleId, id)).orderBy(asc(vehicleImages.sortOrder));
  const company = await db.select().from(companies).where(eq(companies.id, result[0].companyId)).limit(1);
  return { ...result[0], images, company: company[0] };
}

export async function listCompaniesByOwner(ownerUserId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(companies).where(eq(companies.ownerUserId, ownerUserId)).orderBy(desc(companies.createdAt));
}

export async function getPublisherDashboard(ownerUserId: number) {
  const db = await getDb();
  if (!db) return { companies: [], vehicles: [], leads: [], metrics: { views: 0, whatsappClicks: 0, leads: 0, activeVehicles: 0 } };
  const ownedCompanies = await listCompaniesByOwner(ownerUserId);
  const companyIds = ownedCompanies.map((company) => company.id);
  if (companyIds.length === 0) return { companies: [], vehicles: [], leads: [], metrics: { views: 0, whatsappClicks: 0, leads: 0, activeVehicles: 0 } };
  const ownedVehicles = await db.select().from(vehicles).where(inArray(vehicles.companyId, companyIds)).orderBy(desc(vehicles.createdAt));
  const ownedLeads = await db.select().from(leads).where(inArray(leads.companyId, companyIds)).orderBy(desc(leads.createdAt));
  return {
    companies: ownedCompanies,
    vehicles: ownedVehicles,
    leads: ownedLeads,
    metrics: {
      views: 0,
      whatsappClicks: 0,
      leads: ownedLeads.length,
      activeVehicles: ownedVehicles.filter((vehicle) => vehicle.status === "active").length,
    },
  };
}

export async function createCompany(input: InsertCompany) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(companies).values(input);
  return Number(result[0].insertId);
}

export async function createVehicle(input: InsertVehicle) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(vehicles).values(input);
  return Number(result[0].insertId);
}

export async function listAdminVehicles() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ vehicle: vehicles, company: companies }).from(vehicles).leftJoin(companies, eq(vehicles.companyId, companies.id)).orderBy(desc(vehicles.createdAt));
}

export async function updateVehicleStatus(vehicleId: number, status: "draft" | "active" | "paused" | "rented") {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(vehicles).set({ status }).where(eq(vehicles.id, vehicleId));
  return { vehicleId, status };
}

export async function deleteAdminVehicle(vehicleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const existing = await db.select({ id: vehicles.id }).from(vehicles).where(eq(vehicles.id, vehicleId)).limit(1);
  if (!existing[0]) return { vehicleId, deleted: false };
  await db.transaction(async (tx) => {
    await tx.delete(leads).where(eq(leads.vehicleId, vehicleId));
    await tx.delete(vehicleImages).where(eq(vehicleImages.vehicleId, vehicleId));
    await tx.delete(favorites).where(eq(favorites.vehicleKey, String(vehicleId)));
    await tx.delete(vehicles).where(eq(vehicles.id, vehicleId));
  });
  return { vehicleId, deleted: true };
}

export async function listVehicleImages(vehicleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vehicleImages).where(eq(vehicleImages.vehicleId, vehicleId)).orderBy(asc(vehicleImages.sortOrder));
}

export async function createVehicleImage(input: InsertVehicleImage) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(vehicleImages).values(input);
  return Number(result[0].insertId);
}

export async function createLead(input: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(leads).values(input);
  return Number(result[0].insertId);
}

export async function saveFavorite(input: InsertFavorite) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(favorites).values(input).onDuplicateKeyUpdate({ set: { vehicleKey: input.vehicleKey } });
  return { vehicleKey: input.vehicleKey, saved: true };
}

export async function removeFavorite(userId: number, vehicleKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.vehicleKey, vehicleKey)));
  return { vehicleKey, saved: false };
}

export async function getClientArea(userId: number) {
  const db = await getDb();
  if (!db) return { favorites: [], interests: [] };
  const savedFavorites = await db.select().from(favorites).where(eq(favorites.userId, userId)).orderBy(desc(favorites.createdAt));
  const interests = await db.select().from(clientInterests).where(eq(clientInterests.userId, userId)).orderBy(desc(clientInterests.createdAt));
  return { favorites: savedFavorites, interests };
}

export async function createClientInterest(input: InsertClientInterest) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(clientInterests).values(input);
  return Number(result[0].insertId);
}
