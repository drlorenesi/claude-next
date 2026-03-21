import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { canAccess } from "@/lib/permissions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ReportesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session!.user

  if (!canAccess(user.role, "/reportes")) {
    redirect("/")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Reportes</h1>
        <Badge variant="secondary">Compras &amp; Ventas</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reporte de Compras</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Resumen de órdenes de compra y proveedores activos.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reporte de Ventas</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Resumen de ventas, productos y categorías más activas.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
