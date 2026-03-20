"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, ArrowLeft } from "lucide-react"
import { requestPasswordReset } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const schema = z.object({
  email: z.string().email("Correo electrónico inválido"),
})

type FormData = z.infer<typeof schema>

export default function RecuperarContrasenaPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    await requestPasswordReset(
      {
        email: data.email,
        redirectTo: "/restablecer-contrasena",
      },
      {
        onSuccess: () => {
          setSent(true)
          setIsLoading(false)
        },
        onError: () => {
          // Always show success to prevent email enumeration
          setSent(true)
          setIsLoading(false)
        },
      }
    )
  }

  if (sent) {
    return (
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>Revisa tu correo</CardTitle>
          <CardDescription>
            Si existe una cuenta con ese correo, recibirás un enlace para
            restablecer tu contraseña en los próximos minutos.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">
              <ArrowLeft className="size-4" />
              Volver al inicio de sesión
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Recuperar contraseña</CardTitle>
        <CardDescription>
          Ingresa tu correo y te enviaremos un enlace para restablecer tu
          contraseña.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            Enviar enlace
          </Button>

          <Button variant="ghost" className="w-full" asChild>
            <Link href="/login">
              <ArrowLeft className="size-4" />
              Volver al inicio de sesión
            </Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
