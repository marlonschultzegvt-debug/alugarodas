import { describe, expect, it, vi } from "vitest";

const { createVehicle } = vi.hoisted(() => ({ createVehicle: vi.fn() }));

vi.mock("./db", () => ({
  createVehicle,
  getCompanyById: vi.fn().mockResolvedValue({ id: 99, ownerUserId: 2 }),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const caller = appRouter.createCaller({
  user: {
    id: 1,
    openId: "locador-1",
    email: "locador@example.com",
    name: "Locador",
    loginMethod: "password",
    role: "locador",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: { protocol: "https", headers: {} },
  res: {},
} as TrpcContext);

describe("vehicle company ownership", () => {
  it("rejects a locador attempting to create a vehicle for another company", async () => {
    await expect(caller.marketplace.vehicleCreate({
      companyId: 99,
      brand: "Renault",
      model: "Kwid",
      year: 2024,
      category: "carro",
      fuel: "flex",
      transmission: "manual",
      state: "PR",
      city: "Curitiba",
      description: "Veículo disponível para trabalho e uso pessoal.",
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(createVehicle).not.toHaveBeenCalled();
  });
});
