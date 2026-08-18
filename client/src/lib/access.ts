export type UserRole = "admin" | "cliente" | "locador" | "user";

export function normalizeRole(role: UserRole | undefined) {
  return role === "user" ? "cliente" : role;
}

export function canAccess(role: UserRole | undefined, allowedRoles?: UserRole[]) {
  if (!allowedRoles) return true;
  const normalized = normalizeRole(role);
  return Boolean(normalized && allowedRoles.includes(normalized));
}

export function rolePath(role: UserRole | undefined) {
  if (role === "admin") return "/admin";
  if (role === "locador") return "/dashboard";
  return "/buscar";
}
