import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({ upsertUser: vi.fn().mockResolvedValue(undefined) }));

import { appRouter } from "./routers";
import { upsertUser } from "./db";
import type { TrpcContext } from "./_core/context";

function createContext(role: "admin" | "cliente" | "locador" | "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: `test-${role}`,
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

describe("auth.setSignupRole", () => {
  it("persists only the selected public role", async () => {
    const result = await appRouter.createCaller(createContext("cliente")).auth.setSignupRole({ role: "locador" });
    expect(result).toEqual({ role: "locador" });
    expect(upsertUser).toHaveBeenCalledWith({ openId: "test-cliente", role: "locador" });
  });

  it("keeps admin as admin and does not write a public role", async () => {
    vi.mocked(upsertUser).mockClear();
    const result = await appRouter.createCaller(createContext("admin")).auth.setSignupRole({ role: "locador" });
    expect(result).toEqual({ role: "admin" });
    expect(upsertUser).not.toHaveBeenCalled();
  });
});

describe("admin.health", () => {
  it("allows admin users", async () => {
    const result = await appRouter.createCaller(createContext("admin")).admin.health();
    expect(result).toEqual({ ok: true, role: "admin" });
  });

  it("rejects non-admin users", async () => {
    await expect(appRouter.createCaller(createContext("locador")).admin.health()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(appRouter.createCaller(createContext("cliente")).admin.health()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("admin.dashboard", () => {
  it("confirms administrative authorization for admins", async () => {
    const result = await appRouter.createCaller(createContext("admin")).admin.dashboard();
    expect(result).toEqual({ ok: true, role: "admin", canManage: true });
  });

  it("does not expose administrative data to client or locador", async () => {
    await expect(appRouter.createCaller(createContext("cliente")).admin.dashboard()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(appRouter.createCaller(createContext("locador")).admin.dashboard()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
