import {
  boolean,
  decimal,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "cliente", "locador"]).default("cliente").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const companies = mysqlTable(
  "companies",
  {
    id: int("id").autoincrement().primaryKey(),
    ownerUserId: int("ownerUserId").notNull().references(() => users.id),
    name: varchar("name", { length: 160 }).notNull(),
    legalName: varchar("legalName", { length: 200 }),
    document: varchar("document", { length: 32 }),
    type: mysqlEnum("type", ["anunciante", "locadora"]).notNull().default("anunciante"),
    phone: varchar("phone", { length: 32 }),
    whatsapp: varchar("whatsapp", { length: 32 }),
    email: varchar("email", { length: 320 }),
    verified: boolean("verified").notNull().default(false),
    status: mysqlEnum("status", ["active", "paused"]).notNull().default("active"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("companies_owner_idx").on(table.ownerUserId)],
);

export const vehicles = mysqlTable(
  "vehicles",
  {
    id: int("id").autoincrement().primaryKey(),
    companyId: int("companyId").notNull().references(() => companies.id),
    brand: varchar("brand", { length: 80 }).notNull(),
    model: varchar("model", { length: 120 }).notNull(),
    version: varchar("version", { length: 120 }),
    year: int("year").notNull(),
    category: mysqlEnum("category", ["carro", "moto", "eletrico", "hibrido", "utilitario", "van", "caminhonete"]).notNull(),
    fuel: mysqlEnum("fuel", ["flex", "gasolina", "diesel", "eletrico", "hibrido", "plug_in"]).notNull(),
    transmission: mysqlEnum("transmission", ["manual", "automatico", "automatizado"]).notNull(),
    state: varchar("state", { length: 2 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    weeklyPrice: decimal("weeklyPrice", { precision: 10, scale: 2 }),
    monthlyPrice: decimal("monthlyPrice", { precision: 10, scale: 2 }),
    deposit: decimal("deposit", { precision: 10, scale: 2 }),
    kmLimitMonthly: int("kmLimitMonthly"),
    insuranceIncluded: boolean("insuranceIncluded").notNull().default(false),
    acceptsApp: boolean("acceptsApp").notNull().default(false),
    acceptsUberX: boolean("acceptsUberX").notNull().default(false),
    acceptsUberComfort: boolean("acceptsUberComfort").notNull().default(false),
    acceptsUberBlack: boolean("acceptsUberBlack").notNull().default(false),
    accepts99: boolean("accepts99").notNull().default(false),
    description: text("description"),
    rentalRequirements: text("rentalRequirements"),
    status: mysqlEnum("status", ["draft", "active", "paused", "rented"]).notNull().default("draft"),
    isFeatured: boolean("isFeatured").notNull().default(false),
    featuredOrder: int("featuredOrder").notNull().default(0),
    featuredAt: timestamp("featuredAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("vehicles_company_idx").on(table.companyId),
    index("vehicles_location_idx").on(table.state, table.city),
    index("vehicles_category_status_idx").on(table.category, table.status),
  ],
);

export const vehicleImages = mysqlTable(
  "vehicle_images",
  {
    id: int("id").autoincrement().primaryKey(),
    vehicleId: int("vehicleId").notNull().references(() => vehicles.id),
    url: text("url").notNull(),
    storageKey: varchar("storageKey", { length: 512 }),
    altText: varchar("altText", { length: 180 }),
    sortOrder: int("sortOrder").notNull().default(0),
    isCover: boolean("isCover").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("vehicle_images_vehicle_idx").on(table.vehicleId)],
);

export const leads = mysqlTable(
  "leads",
  {
    id: int("id").autoincrement().primaryKey(),
    vehicleId: int("vehicleId").notNull().references(() => vehicles.id),
    companyId: int("companyId").notNull().references(() => companies.id),
    requesterUserId: int("requesterUserId").references(() => users.id),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 320 }),
    phone: varchar("phone", { length: 32 }),
    message: text("message"),
    source: varchar("source", { length: 64 }),
    utmSource: varchar("utmSource", { length: 120 }),
    utmMedium: varchar("utmMedium", { length: 120 }),
    utmCampaign: varchar("utmCampaign", { length: 120 }),
    status: mysqlEnum("status", ["new", "contacted", "qualified", "closed"]).notNull().default("new"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("leads_vehicle_idx").on(table.vehicleId),
    index("leads_company_status_idx").on(table.companyId, table.status),
    index("leads_created_idx").on(table.createdAt),
  ],
);

export const vehicleViews = mysqlTable(
  "vehicle_views",
  {
    id: int("id").autoincrement().primaryKey(),
    vehicleId: int("vehicleId").notNull().references(() => vehicles.id),
    sessionKey: varchar("sessionKey", { length: 160 }),
    source: varchar("source", { length: 64 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("vehicle_views_vehicle_idx").on(table.vehicleId), index("vehicle_views_created_idx").on(table.createdAt)],
);

export const usersRelations = relations(users, ({ many }) => ({
  companies: many(companies),
  leads: many(leads),
  favorites: many(favorites),
  clientInterests: many(clientInterests),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  owner: one(users, { fields: [companies.ownerUserId], references: [users.id] }),
  vehicles: many(vehicles),
  leads: many(leads),
}));

export const vehicleViewsRelations = relations(vehicleViews, ({ one }) => ({
  vehicle: one(vehicles, { fields: [vehicleViews.vehicleId], references: [vehicles.id] }),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  company: one(companies, { fields: [vehicles.companyId], references: [companies.id] }),
  images: many(vehicleImages),
  leads: many(leads),
  favorites: many(favorites),
  views: many(vehicleViews),
}));

export const vehicleImagesRelations = relations(vehicleImages, ({ one }) => ({
  vehicle: one(vehicles, { fields: [vehicleImages.vehicleId], references: [vehicles.id] }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  vehicle: one(vehicles, { fields: [leads.vehicleId], references: [vehicles.id] }),
  company: one(companies, { fields: [leads.companyId], references: [companies.id] }),
  requester: one(users, { fields: [leads.requesterUserId], references: [users.id] }),
}));

export const favorites = mysqlTable(
  "favorites",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id),
    vehicleId: int("vehicleId"),
    vehicleKey: varchar("vehicleKey", { length: 160 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("favorites_user_vehicle_key_unique").on(table.userId, table.vehicleKey),
    index("favorites_user_idx").on(table.userId),
    index("favorites_vehicle_idx").on(table.vehicleId),
  ],
);

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
}));

export const clientInterests = mysqlTable(
  "client_interests",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id),
    vehicleKey: varchar("vehicleKey", { length: 160 }).notNull(),
    vehicleLabel: varchar("vehicleLabel", { length: 220 }).notNull(),
    message: text("message"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("client_interests_user_idx").on(table.userId),
    index("client_interests_created_idx").on(table.createdAt),
  ],
);

export const clientInterestsRelations = relations(clientInterests, ({ one }) => ({
  user: one(users, { fields: [clientInterests.userId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;
export type VehicleImage = typeof vehicleImages.$inferSelect;
export type InsertVehicleImage = typeof vehicleImages.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
export type VehicleView = typeof vehicleViews.$inferSelect;
export type InsertVehicleView = typeof vehicleViews.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;
export type ClientInterest = typeof clientInterests.$inferSelect;
export type InsertClientInterest = typeof clientInterests.$inferInsert;
