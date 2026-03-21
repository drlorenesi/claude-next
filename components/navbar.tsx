"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, LayoutDashboard, Home } from "lucide-react"
import { useSession, signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()

  const user = session?.user
  const isAdmin = user?.role === "admin"

  const initials = user
    ? `${(user.name ?? user.email).charAt(0).toUpperCase()}`
    : "U"

  async function handleSignOut() {
    await signOut({ fetchOptions: { onSuccess: () => router.push("/login") } })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="font-semibold">
          Mi App
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" aria-label="Inicio" asChild>
            <Link href="/">
              <Home className="size-4" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
          </Button>

          {isAdmin && (
            <Button variant="ghost" size="sm" aria-label="Administración" asChild>
              <Link href="/admin">
                <LayoutDashboard className="size-4" />
                <span className="hidden sm:inline">Administración</span>
              </Link>
            </Button>
          )}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side */}
        <ThemeToggle />

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2"
              >
                <Avatar size="sm">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[140px] truncate text-sm sm:block">
                  {user.name ?? user.email}
                </span>
                {isAdmin && (
                  <Badge variant="secondary" className="hidden sm:inline-flex">
                    Admin
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name ?? "Usuario"}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={handleSignOut}
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
