import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { canAccess } from "@/lib/permissions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function ComprasPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session!.user

  if (!canAccess(user.role, "/compras")) {
    redirect("/")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Compras</h1>
        <Badge variant="secondary">Módulo de Compras</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-base">
              <Link href="/compras/proveedores">Proveedores →</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Gestiona el catálogo de proveedores registrados.
          </CardContent>
        </Card>

        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-base">
              <Link href="/compras/ordenes">Órdenes de Compra →</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Crea y administra órdenes de compra.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
