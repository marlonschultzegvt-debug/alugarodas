import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const ADMIN_EMAIL = "suporte@alugarodas.com.br";
export const LOCAL_LOGIN_METHOD = "password";
export const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function validatePassword(password: string): void {
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new Error("A senha deve ter pelo menos 8 caracteres e conter letras e números.");
  }
}

export function hashPassword(password: string): string {
  validatePassword(password);
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 64, { N: 16_384, r: 8, p: 1 });
  return `scrypt$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export function verifyPassword(password: string, encoded: string | null): boolean {
  if (!encoded) return false;
  const [algorithm, saltValue, keyValue] = encoded.split("$");
  if (algorithm !== "scrypt" || !saltValue || !keyValue) return false;
  try {
    const salt = Buffer.from(saltValue, "base64url");
    const expected = Buffer.from(keyValue, "base64url");
    const actual = scryptSync(password, salt, expected.length, { N: 16_384, r: 8, p: 1 });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function createLocalOpenId(): string {
  return `local_${randomBytes(18).toString("hex")}`;
}

export function isAdminEmail(email: string): boolean {
  return normalizeEmail(email) === ADMIN_EMAIL;
}

export function isPublicSignupRole(role: string): role is "cliente" | "locador" {
  return role === "cliente" || role === "locador";
}

export function safeDisplayName(name: string, email: string): string {
  return sanitizeName(name) || normalizeEmail(email).split("@")[0] || "Usuário";
}

export function sessionOpenIdForUser(id: number): string {
  return `local_user_${id}`;
}

export function sessionNameForUser(user: { name: string | null; email: string | null }): string {
  return safeDisplayName(user.name ?? "", user.email ?? "");
}

export function sessionCookieOptions(protocol?: string) {
  return {
    httpOnly: true,
    secure: protocol === "https",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  };
}

export function clearSessionCookieOptions(protocol?: string) {
  return { ...sessionCookieOptions(protocol), maxAge: 0 };
}

export function createResetToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashResetToken(token: string): string {
  return scryptSync(token, "aluga-rodas-reset", 32).toString("hex");
}

export function resetExpiry(): Date {
  return new Date(Date.now() + PASSWORD_RESET_TTL_MS);
}
