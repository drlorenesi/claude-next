import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { canAccess } from "@/lib/permissions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProveedoresPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session!.user

  if (!canAccess(user.role, "/compras/proveedores")) {
    redirect("/")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Proveedores</h1>
        <Badge variant="secondary">Compras</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Catálogo de Proveedores</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Aquí se mostrará el listado de proveedores registrados.
        </CardContent>
      </Card>
    </div>
  )
}
