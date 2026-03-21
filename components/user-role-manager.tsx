"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { ROLES, ROLE_LABELS, type Role } from "@/lib/permissions"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type User = {
  id: string
  name: string
  email: string
  role?: string | null
  emailVerified: boolean
}

export function UserRoleManager({ users }: { users: User[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleRoleChange(userId: string, role: Role) {
    setLoading(userId)
    const { error } = await authClient.admin.setRole({ userId, role })
    setLoading(null)

    if (error) {
      toast.error("No se pudo cambiar el rol")
      return
    }

    toast.success("Rol actualizado correctamente")
    router.refresh()
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Usuario</th>
            <th className="px-4 py-3 text-left font-medium">Correo</th>
            <th className="px-4 py-3 text-left font-medium">Verificado</th>
            <th className="px-4 py-3 text-left font-medium">Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const currentRole = (user.role ?? "user") as Role
            return (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{user.name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">
                  {user.emailVerified ? (
                    <Badge variant="secondary">Verificado</Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Pendiente
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={currentRole}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as Role)
                    }
                    disabled={loading === user.id}
                    className="h-9 w-40 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
