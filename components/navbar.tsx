"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  LogOut,
  LayoutDashboard,
  Home,
  ShoppingCart,
  TrendingUp,
  BarChart2,
  ChevronDown,
} from "lucide-react"
import { useSession, signOut } from "@/lib/auth-client"
import { canAccess, ROLE_LABELS, type Role } from "@/lib/permissions"
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

const navSections = [
  {
    href: "/compras",
    label: "Compras",
    icon: ShoppingCart,
    children: [
      { href: "/compras/proveedores", label: "Proveedores" },
      { href: "/compras/ordenes", label: "Órdenes de Compra" },
    ],
  },
  {
    href: "/ventas",
    label: "Ventas",
    icon: TrendingUp,
    children: [
      { href: "/ventas/categoria", label: "Categorías" },
      { href: "/ventas/producto", label: "Productos" },
    ],
  },
  {
    href: "/reportes",
    label: "Reportes",
    icon: BarChart2,
    children: [{ href: "/reportes", label: "Ver reportes" }],
  },
  {
    href: "/admin",
    label: "Administración",
    icon: LayoutDashboard,
    children: [
      { href: "/admin", label: "Panel" },
      { href: "/admin/usuarios", label: "Usuarios" },
    ],
  },
]

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()

  const user = session?.user
  const userRole = (user?.role ?? "user") as Role

  const initials = user
    ? `${(user.name ?? user.email).charAt(0).toUpperCase()}`
    : "U"

  const visibleSections = navSections.filter((s) =>
    canAccess(userRole, s.href)
  )

  async function handleSignOut() {
    await signOut({ fetchOptions: { onSuccess: () => router.push("/login") } })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
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

          {visibleSections.map((section) => {
            const Icon = section.icon
            return (
              <DropdownMenu key={section.href}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Icon className="size-4" />
                    <span className="hidden sm:inline">{section.label}</span>
                    <ChevronDown className="size-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {section.children.map((child) => (
                    <DropdownMenuItem key={child.href} asChild>
                      <Link href={child.href}>{child.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side */}
        <ThemeToggle />

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar size="sm">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden max-w-35 truncate text-sm sm:block">
                  {user.name ?? user.email}
                </span>
                {userRole !== "user" && (
                  <Badge variant="secondary" className="hidden sm:inline-flex">
                    {ROLE_LABELS[userRole]}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm leading-none font-medium">
                    {user.name ?? "Usuario"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
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
