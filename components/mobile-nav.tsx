"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type NavSection = {
  href: string
  label: string
  icon: React.ElementType
  children: { href: string; label: string }[]
}

type MobileNavProps = {
  visibleSections: NavSection[]
  user: { name?: string | null; email: string }
  onSignOut: () => Promise<void>
}

export function MobileNav({ visibleSections, user, onSignOut }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  function toggleSection(href: string) {
    setExpanded((prev) => ({ ...prev, [href]: !prev[href] }))
  }

  function close() {
    setOpen(false)
  }

  const initials = `${(user.name ?? user.email).charAt(0).toUpperCase()}`

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="sm:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle asChild>
            <Link href="/" onClick={close} className="font-semibold">
              Mi App
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable nav sections */}
        <nav className="flex-1 overflow-y-auto py-2">
          {visibleSections.map((section) => {
            const Icon = section.icon
            const isOpen = expanded[section.href] ?? false

            return (
              <div key={section.href}>
                <button
                  onClick={() => toggleSection(section.href)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1 text-left">{section.label}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 opacity-60 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="pb-1">
                    {section.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={close}
                        className="flex items-center py-2 pl-11 pr-4 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-muted-foreground">Tema</span>
            <ThemeToggle />
          </div>

          <Separator />

          <div className="px-4 py-3">
            <div className="mb-3 flex items-center gap-3">
              <Avatar size="sm">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-sm font-medium">
                  {user.name ?? "Usuario"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>

            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={async () => {
                close()
                await onSignOut()
              }}
            >
              <LogOut className="size-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
