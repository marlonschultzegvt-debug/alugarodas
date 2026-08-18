import { describe, expect, it } from "vitest";
import { canAccess, normalizeRole, rolePath } from "../client/src/lib/access";

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

  it("allows only admin into the admin area", () => {
    expect(canAccess("admin", ["admin"])).toBe(true);
    expect(canAccess("locador", ["admin"])).toBe(false);
    expect(canAccess("cliente", ["admin"])).toBe(false);
  });
});
