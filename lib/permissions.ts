export type Role = "admin" | "compras" | "ventas" | "user"

export const ROLES: Role[] = ["admin", "compras", "ventas", "user"]

export const ROLE_LABELS: Record<Role, string> = {
  admin:   "Administrador",
  compras: "Compras",
  ventas:  "Ventas",
  user:    "Usuario",
}

// Top-level sections → allowed roles.
// Sub-routes inherit by prefix: /ventas/categoria resolves to /ventas.
export const routePermissions: Record<string, Role[]> = {
  "/admin":    ["admin"],
  "/compras":  ["admin", "compras"],
  "/ventas":   ["admin", "ventas"],
  "/reportes": ["admin", "compras", "ventas"],
}

export function canAccess(role: string, path: string): boolean {
  for (const [pattern, roles] of Object.entries(routePermissions)) {
    if (path === pattern || path.startsWith(pattern + "/")) {
      return roles.includes(role as Role)
    }
  }
  return true // no restriction → accessible to all authenticated users
}
