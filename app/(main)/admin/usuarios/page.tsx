import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getSession } from "@/lib/session"
import { Badge } from "@/components/ui/badge"
import { UserRoleManager } from "@/components/user-role-manager"

export default async function UsuariosPage() {
  const [session, headersList] = await Promise.all([getSession(), headers()])
  const user = session!.user

  if (user.role !== "admin") {
    redirect("/")
  }

  const { users } = await auth.api.listUsers({
    query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" },
    headers: headersList,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Gestión de Usuarios</h1>
        <Badge>Administrador</Badge>
      </div>

      <p className="text-muted-foreground text-sm">
        Asigna roles a los usuarios registrados en la aplicación. Los cambios
        tienen efecto en el próximo inicio de sesión del usuario.
      </p>

      <UserRoleManager users={users} />
    </div>
  )
}
