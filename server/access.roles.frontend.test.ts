import { describe, expect, it } from "vitest";
import { authGuardDecision, canAccess, dashboardRouteRoles, normalizeRole, rolePath } from "../client/src/lib/access";

describe("role access", () => {
  it("normalizes the legacy user role to cliente", () => {
    expect(normalizeRole("user")).toBe("cliente");
    expect(rolePath("user")).toBe("/cliente");
  });

  it("allows cliente, locador and admin into advertiser areas", () => {
    expect(canAccess("locador", dashboardRouteRoles)).toBe(true);
    expect(canAccess("admin", dashboardRouteRoles)).toBe(true);
    expect(canAccess("cliente", dashboardRouteRoles)).toBe(true);
    expect(canAccess("user", dashboardRouteRoles)).toBe(true);
  });

  it("allows cliente into the advertiser dashboard", () => {
    expect(canAccess("cliente", dashboardRouteRoles)).toBe(true);
    expect(canAccess("locador", dashboardRouteRoles)).toBe(true);
    expect(canAccess("admin", dashboardRouteRoles)).toBe(true);
  });

  it("allows an authenticated cliente to open the advertiser dashboard", () => {
    expect(authGuardDecision("cliente", false, dashboardRouteRoles)).toBe("allowed");
    expect(authGuardDecision("locador", false, dashboardRouteRoles)).toBe("allowed");
    expect(authGuardDecision("admin", false, dashboardRouteRoles)).toBe("allowed");
    expect(authGuardDecision(undefined, false, dashboardRouteRoles)).toBe("redirect");
  });

  it("routes admin to /adm and keeps advertiser/client destinations separate", () => {
    expect(rolePath("admin")).toBe("/adm");
    expect(rolePath("locador")).toBe("/dashboard");
    expect(rolePath("cliente")).toBe("/cliente");
  });

  it("protects the client area for cliente only", () => {
    expect(canAccess("cliente", ["cliente", "user"])).toBe(true);
    expect(canAccess("user", ["cliente", "user"])).toBe(true);
    expect(canAccess("locador", ["cliente", "user"])).toBe(false);
    expect(canAccess("admin", ["cliente", "user"])).toBe(false);
  });

  it("allows only admin into the admin area", () => {
    expect(canAccess("admin", ["admin"])).toBe(true);
    expect(canAccess("locador", ["admin"])).toBe(false);
    expect(canAccess("cliente", ["admin"])).toBe(false);
  });
});
