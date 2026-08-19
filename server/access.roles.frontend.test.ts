import { describe, expect, it } from "vitest";
import { authGuardDecision, canAccess, dashboardRouteRoles, normalizeRole, rolePath } from "../client/src/lib/access";

describe("role access", () => {
  it("normalizes the legacy user role to cliente", () => {
    expect(normalizeRole("user")).toBe("cliente");
    expect(rolePath("user")).toBe("/buscar");
  });

  it("allows only locador and admin into advertiser areas", () => {
    expect(canAccess("locador", ["locador", "admin"])).toBe(true);
    expect(canAccess("admin", ["locador", "admin"])).toBe(true);
    expect(canAccess("cliente", ["locador", "admin"])).toBe(false);
    expect(canAccess("user", ["locador", "admin"])).toBe(false);
  });

  it("blocks cliente from the advertiser dashboard", () => {
    expect(canAccess("cliente", dashboardRouteRoles)).toBe(false);
    expect(canAccess("locador", dashboardRouteRoles)).toBe(true);
    expect(canAccess("admin", dashboardRouteRoles)).toBe(true);
  });

  it("blocks an authenticated cliente before dashboard children render", () => {
    expect(authGuardDecision("cliente", false, dashboardRouteRoles)).toBe("denied");
    expect(authGuardDecision("locador", false, dashboardRouteRoles)).toBe("allowed");
    expect(authGuardDecision("admin", false, dashboardRouteRoles)).toBe("allowed");
    expect(authGuardDecision(undefined, false, dashboardRouteRoles)).toBe("redirect");
  });

  it("allows only admin into the admin area", () => {
    expect(canAccess("admin", ["admin"])).toBe(true);
    expect(canAccess("locador", ["admin"])).toBe(false);
    expect(canAccess("cliente", ["admin"])).toBe(false);
  });
});
