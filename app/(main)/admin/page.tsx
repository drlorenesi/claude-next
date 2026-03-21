import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session!.user

  // Role check — only admins can access this page
  if (user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Panel de Administración</h1>
        <Badge>Administrador</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tu cuenta</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <p>
              <span className="text-muted-foreground">Nombre: </span>
              {user.name ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Correo: </span>
              {user.email}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acceso de administrador</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Tienes acceso completo al panel de administración. Aquí puedes
            gestionar usuarios, configurar el sistema y revisar los registros de
            actividad.
          </CardContent>
        </Card>

        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-base">
              <Link href="/admin/usuarios">Gestión de Usuarios →</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Asigna y modifica roles de los usuarios registrados en la
            aplicación.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
