"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <SearchX className="size-16 text-muted-foreground" />
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold">404</h1>
        <p className="text-xl font-medium">Página no encontrada</p>
        <p className="text-sm text-muted-foreground">
          La página que buscás no existe o fue movida.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Atrás
        </Button>
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  )
}
