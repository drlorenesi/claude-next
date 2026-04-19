"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  LogOut,
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Factory,
  ChevronDown,
  UserCircle,
  KeyRound,
} from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "@/lib/auth-client"
import { canAccess, type Role } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
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
import { Logo } from "@/components/logo"

const navSections = [
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
    href: "/compras",
    label: "Compras",
    icon: ShoppingCart,
    children: [
      { href: "/compras/proveedores", label: "Proveedores" },
      { href: "/compras/ordenes", label: "Órdenes de Compra" },
    ],
  },

  {
    href: "/produccion",
    label: "Producción",
    icon: Factory,
    children: [{ href: "/produccion", label: "Ver producción" }],
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
  const pathname = usePathname()

  const user = session?.user
  const userRole = (user?.role ?? "user") as Role

  const initials = user
    ? `${(user.name ?? user.email).charAt(0).toUpperCase()}`
    : "U"

  const visibleSections = navSections.filter((s) => canAccess(userRole, s.href))

  async function handleSignOut() {
    await signOut({ fetchOptions: { onSuccess: () => router.push("/login") } })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/">
          <Logo className="size-6" />
        </Link>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden sm:flex items-center gap-1">
{visibleSections.map((section) => {
            const Icon = section.icon
            return (
              <DropdownMenu key={section.href}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(pathname.startsWith(section.href) && "bg-muted")}
                  >
                    <Icon className="size-4" />
                    <span className="hidden nav:inline">{section.label}</span>
                    <ChevronDown className="size-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="flex flex-col gap-1">
                  {section.children.map((child) => (
                    <DropdownMenuItem
                      key={child.href}
                      asChild
                      className={cn(pathname === child.href && "bg-muted font-medium")}
                    >
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

        {/* Right side — desktop only */}
        <div className="hidden sm:flex items-center gap-2">
          <ThemeToggle />

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar size="sm">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-35 truncate text-sm nav:block">
                    {user.name ?? user.email}
                  </span>
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
                <DropdownMenuItem asChild>
                  <Link href="/perfil">
                    <UserCircle className="size-4" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cambiar-contrasena">
                    <KeyRound className="size-4" />
                    Cambiar Contraseña
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                  <LogOut className="size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Hamburger — mobile only */}
        {user && (
          <MobileNav
            visibleSections={visibleSections}
            user={user}
            onSignOut={handleSignOut}
          />
        )}
      </div>
    </header>
  )
}
