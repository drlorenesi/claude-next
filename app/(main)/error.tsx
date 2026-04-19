"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <AlertCircle className="text-destructive size-10" />
      <h2 className="text-xl font-semibold">Ocurrió un error inesperado</h2>
      <p className="text-muted-foreground text-sm">
        {error.digest ? `Código: ${error.digest}` : "Por favor intenta de nuevo."}
      </p>
      <Button variant="outline" onClick={() => reset()}>
        Reintentar
      </Button>
    </div>
  )
}
