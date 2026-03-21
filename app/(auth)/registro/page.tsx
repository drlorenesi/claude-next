"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { signUp } from "@/lib/auth-client"
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
    firstName: z
      .string()
      .min(1, "El nombre es requerido")
      .max(80, "Máximo 80 caracteres"),
    lastName: z
      .string()
      .min(1, "El apellido es requerido")
      .max(80, "Máximo 80 caracteres"),
    email: z.email("Correo electrónico inválido"),
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

export default function RegistroPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    await signUp.email(
      {
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      {
        onSuccess: () =>
          router.push(`/verificar-email?email=${encodeURIComponent(data.email)}`),
        onError: ({ error }) => {
          if (error.status === 422 || error.message?.includes("email")) {
            toast.error("Este correo ya está registrado.")
          } else {
            toast.error("No se pudo crear la cuenta. Intenta de nuevo.")
          }
          setIsLoading(false)
        },
      }
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Crear cuenta</CardTitle>
        <CardDescription>
          Completa el formulario para registrarte.
        </CardDescription>
      </CardHeader>

      <form className="contents" onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                placeholder="Juan"
                autoComplete="given-name"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-destructive text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                placeholder="Pérez"
                autoComplete="family-name"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-destructive text-xs">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
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
            Crear cuenta
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-foreground underline-offset-4 hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
