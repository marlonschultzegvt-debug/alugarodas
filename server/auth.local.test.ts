import { describe, expect, it } from "vitest";
import {
  ADMIN_EMAIL,
  hashPassword,
  isAdminEmail,
  isValidCnpj,
  isValidCpf,
  isPublicSignupRole,
  normalizeEmail,
  verifyPassword,
  validatePassword,
} from "./auth-local";

describe("local authentication", () => {
  it("normalizes emails and hashes passwords without storing plaintext", () => {
    const password = "AlugaRodas@2026";
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

  it("enforces upper/lowercase letters, number, symbol, and minimum length for new passwords", () => {
    expect(() => validatePassword("12345678")).toThrow();
    expect(() => validatePassword("abcdefgh")).toThrow();
    expect(() => validatePassword("Aluga2026")).toThrow();
    expect(() => validatePassword("Aluga@2026")).not.toThrow();
  });

  it("validates CPF and CNPJ formats before identity data is persisted", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCnpj("04.252.011/0001-10")).toBe(true);
    expect(isValidCnpj("11.111.111/1111-11")).toBe(false);
  });
});
