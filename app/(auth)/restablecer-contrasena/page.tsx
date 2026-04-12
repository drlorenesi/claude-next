"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, ArrowLeft } from "lucide-react"
import { resetPassword } from "@/lib/auth-client"
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

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .max(128, "Máximo 128 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof schema>

function RestablecerContrasenaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokenRaw = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  if (!tokenRaw) {
    return (
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Enlace inválido</CardTitle>
          <CardDescription>
            Este enlace no es válido o ya expiró. Solicita uno nuevo desde la
            página de recuperación de contraseña.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/recuperar-contrasena">
              <ArrowLeft className="size-4" />
              Solicitar nuevo enlace
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const token = tokenRaw

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    await resetPassword(
      { newPassword: data.password, token: token! },
      {
        onSuccess: () => {
          toast.success("Contraseña actualizada. Ya puedes iniciar sesión.")
          router.push("/login")
        },
        onError: ({ error }) => {
          if (error.status === 400) {
            toast.error("El enlace expiró o ya fue usado. Solicita uno nuevo.")
          } else {
            toast.error("No se pudo actualizar la contraseña. Intenta de nuevo.")
          }
          setIsLoading(false)
        },
      }
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Nueva contraseña</CardTitle>
        <CardDescription>
          Ingresa y confirma tu nueva contraseña.
        </CardDescription>
      </CardHeader>

      <form className="contents" onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Nueva contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-destructive text-xs">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            Guardar contraseña
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

export default function RestablecerContrasenaPage() {
  return (
    <Suspense fallback={null}>
      <RestablecerContrasenaForm />
    </Suspense>
  )
}
