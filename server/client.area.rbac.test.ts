import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function contextFor(role: "admin" | "cliente" | "locador"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: `client-area-${role}`,
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

describe("client area RBAC", () => {
  it.each(["admin", "locador"] as const)("rejects favorite save for %s", async (role) => {
    await expect(appRouter.createCaller(contextFor(role)).auth.favoriteSave({ vehicleKey: "geely-ex2" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it.each(["admin", "locador"] as const)("rejects interest creation for %s", async (role) => {
    await expect(
      appRouter.createCaller(contextFor(role)).auth.interestCreate({ vehicleKey: "geely-ex2", vehicleLabel: "Geely EX2" }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
