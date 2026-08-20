export type UserRole = "admin" | "cliente" | "locador" | "user";

export const dashboardRouteRoles: UserRole[] = ["admin", "locador"];
export type AuthGuardDecision = "loading" | "redirect" | "denied" | "allowed";

export function authGuardDecision(role: UserRole | undefined, loading: boolean, allowedRoles?: UserRole[]): AuthGuardDecision {
  if (loading) return "loading";
  if (!role) return "redirect";
  return canAccess(role, allowedRoles) ? "allowed" : "denied";
}

export function normalizeRole(role: UserRole | undefined) {
  return role === "user" ? "cliente" : role;
}

export function canAccess(role: UserRole | undefined, allowedRoles?: UserRole[]) {
  if (!allowedRoles) return true;
  const normalized = normalizeRole(role);
  return Boolean(normalized && allowedRoles.includes(normalized));
}

export function rolePath(role: UserRole | undefined) {
  if (role === "admin") return "/adm";
  if (role === "locador") return "/dashboard";
  if (role === "cliente" || role === "user") return "/cliente";
  return "/buscar";
}
