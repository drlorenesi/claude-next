"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { authClient, useSession } from "@/lib/auth-client"
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
  firstName: z.string().min(1, "El nombre es requerido").max(80, "Máximo 80 caracteres"),
  lastName: z.string().min(1, "El apellido es requerido").max(80, "Máximo 80 caracteres"),
})

type FormData = z.infer<typeof schema>

export default function PerfilPage() {
  const { data: session } = useSession()
  const user = session?.user

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (user) {
      reset({
        firstName: (user as { firstName?: string }).firstName ?? "",
        lastName: (user as { lastName?: string }).lastName ?? "",
      })
    }
  }, [user, reset])

  async function onSubmit(data: FormData) {
    const { error } = await authClient.updateUser({
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
    } as Parameters<typeof authClient.updateUser>[0])

    if (error) {
      toast.error("No se pudo actualizar el perfil. Intenta de nuevo.")
    } else {
      toast.success("Perfil actualizado correctamente.")
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Mi Perfil</CardTitle>
        <CardDescription>Actualiza tu nombre y apellido.</CardDescription>
      </CardHeader>

      <form className="contents" onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Guardar cambios
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
