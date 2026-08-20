import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function contextFor(role: "cliente" | "locador" | "admin"): TrpcContext {
  return {
    user: { id: 901, openId: `${role}-qa`, name: "QA", email: "qa@example.com", role, loginMethod: "oauth", createdAt: new Date(), updatedAt: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Admin announcement actions RBAC", () => {
  it.each(["cliente", "locador"] as const)("blocks %s from deleting an announcement", async (role) => {
    await expect(appRouter.createCaller(contextFor(role)).admin.vehicleDelete({ vehicleId: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
