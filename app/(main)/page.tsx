import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session!.user

  const isAdmin = user.role === "admin"
  const greeting = user.name ? `¡Hola, ${user.name.split(" ")[0]}!` : "¡Bienvenido!"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{greeting}</h1>
        <Badge variant={isAdmin ? "default" : "secondary"}>
          {isAdmin ? "Administrador" : "Usuario"}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Perfil</CardTitle>
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
            <p>
              <span className="text-muted-foreground">Rol: </span>
              {isAdmin ? "Administrador" : "Usuario"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estado de cuenta</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <p>
              <span className="text-muted-foreground">Correo verificado: </span>
              {user.emailVerified ? "Sí" : "No"}
            </p>
            <p>
              <span className="text-muted-foreground">Miembro desde: </span>
              {new Date(user.createdAt).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
