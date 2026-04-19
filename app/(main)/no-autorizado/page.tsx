import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NoAutorizadoPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Sin Autorización</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        No tienes permiso para acceder a esta sección. Contacta a un
        administrador si crees que esto es un error.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  )
}
