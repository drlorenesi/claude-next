"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { MailCheck, Loader2 } from "lucide-react"
import { sendVerificationEmail } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function VerificarEmailClient() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const [isResending, setIsResending] = useState(false)
  const [resent, setResent] = useState(false)

  async function handleResend() {
    if (!email) {
      toast.error(
        "No se encontró el correo. Por favor regístrate de nuevo o inicia sesión."
      )
      return
    }
    setIsResending(true)
    await sendVerificationEmail(
      { email, callbackURL: "/login?verificado=true" },
      {
        onSuccess: () => {
          setResent(true)
          toast.success("Correo de verificación reenviado.")
          setIsResending(false)
        },
        onError: () => {
          toast.error("No se pudo reenviar el correo. Intenta más tarde.")
          setIsResending(false)
        },
      }
    )
  }

  return (
    <Card className="w-full max-w-sm text-center">
      <CardHeader>
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <MailCheck className="text-primary size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Revisa tu bandeja de entrada</CardTitle>
        <CardDescription>
          Te enviamos un enlace de verificación a tu correo electrónico. Haz
          clic en el enlace para activar tu cuenta.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm">
          ¿No recibiste el correo? Revisa tu carpeta de spam o solicita uno
          nuevo.
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={isResending || resent}
        >
          {isResending && <Loader2 className="size-4 animate-spin" />}
          {resent ? "Correo reenviado" : "Reenviar correo de verificación"}
        </Button>
      </CardFooter>
    </Card>
  )
}
