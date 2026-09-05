import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("auth.me public contract", () => {
  it("returns only public account fields for an authenticated user", async () => {
    const ctx = {
      user: {
        id: 77,
        openId: "local_sensitive_test",
        name: "Conta de teste",
        email: "conta@example.com",
        phone: "41999999999",
        role: "cliente",
        loginMethod: "password",
        passwordHash: "scrypt$never-expose",
        passwordResetTokenHash: "reset-token-never-expose",
        passwordResetExpiresAt: new Date(),
        emailVerifiedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: { protocol: "https", headers: {} },
      res: {},
    } as unknown as TrpcContext;

    const result = await appRouter.createCaller(ctx).auth.me();

    expect(result).toEqual({
      id: 77,
      name: "Conta de teste",
      email: "conta@example.com",
      phone: "41999999999",
      role: "cliente",
    });
    expect(JSON.stringify(result)).not.toContain("passwordHash");
    expect(JSON.stringify(result)).not.toContain("passwordResetTokenHash");
    expect(JSON.stringify(result)).not.toContain("loginMethod");
  });
});
