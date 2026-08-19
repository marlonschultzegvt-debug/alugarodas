import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function contextFor(role: "admin" | "cliente" | "locador"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: `marketplace-${role}`,
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

describe("marketplace publisher RBAC", () => {
  it("rejects vehicle creation for cliente before accessing the database", async () => {
    await expect(
      appRouter.createCaller(contextFor("cliente")).marketplace.vehicleCreate({
        companyId: 1,
        brand: "Renault",
        model: "Kwid",
        year: 2024,
        category: "carro",
        fuel: "flex",
        transmission: "manual",
        state: "PR",
        city: "Curitiba",
        description: "Veículo de teste para validação de permissão.",
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
