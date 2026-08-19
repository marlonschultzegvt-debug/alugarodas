import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  createCompany: vi.fn().mockResolvedValue(11),
  createLead: vi.fn().mockResolvedValue(12),
  createVehicle: vi.fn().mockResolvedValue(13),
  createVehicleImage: vi.fn().mockResolvedValue(14),
  getVehicleById: vi.fn(),
  listCompaniesByOwner: vi.fn().mockResolvedValue([]),
  listVehicleImages: vi.fn().mockResolvedValue([]),
  listVehicles: vi.fn().mockResolvedValue([]),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function contextFor(role: "admin" | "locador"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: `positive-${role}`,
      email: `${role}@example.com`,
      name: role,
      loginMethod: "test",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const vehicle = {
  companyId: 11,
  brand: "Renault",
  model: "Kwid",
  year: 2024,
  category: "carro" as const,
  fuel: "flex" as const,
  transmission: "manual" as const,
  state: "PR",
  city: "Curitiba",
  description: "Veículo disponível para trabalho e uso pessoal.",
};

describe("marketplace positive RBAC", () => {
  it.each(["locador", "admin"] as const)("allows %s to create company, vehicle and image", async (role) => {
    const caller = appRouter.createCaller(contextFor(role));
    await expect(caller.marketplace.companyCreate({ name: "Empresa de teste", type: "anunciante" })).resolves.toBe(11);
    await expect(caller.marketplace.vehicleCreate(vehicle)).resolves.toBe(13);
    await expect(caller.marketplace.vehicleImageCreate({ vehicleId: 13, url: "https://example.com/vehicle.jpg" })).resolves.toBe(14);
  });
});
