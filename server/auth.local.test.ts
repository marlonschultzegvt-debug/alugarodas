import { describe, expect, it } from "vitest";
import {
  ADMIN_EMAIL,
  hashPassword,
  isAdminEmail,
  isPublicSignupRole,
  normalizeEmail,
  verifyPassword,
  validatePassword,
} from "./auth-local";

describe("local authentication", () => {
  it("normalizes emails and hashes passwords without storing plaintext", () => {
    const password = "AlugaRodas2026";
    const hash = hashPassword(password);
    expect(normalizeEmail("  SUPORTE@ALUGARODAS.COM.BR ")).toBe(ADMIN_EMAIL);
    expect(hash).not.toContain(password);
    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword("senha-incorreta", hash)).toBe(false);
  });

  it("allows only Cliente and Locador in public signup", () => {
    expect(isPublicSignupRole("cliente")).toBe(true);
    expect(isPublicSignupRole("locador")).toBe(true);
    expect(isPublicSignupRole("admin")).toBe(false);
  });

  it("recognizes the configured admin address without making it a public role", () => {
    expect(isAdminEmail("suporte@alugarodas.com.br")).toBe(true);
    expect(isPublicSignupRole("admin")).toBe(false);
  });

  it("enforces letters, numbers, and minimum length for new passwords", () => {
    expect(() => validatePassword("12345678")).toThrow();
    expect(() => validatePassword("abcdefgh")).toThrow();
    expect(() => validatePassword("Aluga2026")).not.toThrow();
  });
});
