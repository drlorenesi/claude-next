import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { canAccess } from "@/lib/permissions"
import { Navbar } from "@/components/navbar"
import { IdleTimeoutProvider } from "@/components/idle-timeout-provider"
import { Toaster } from "sonner"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const headersList = await headers()
  const pathname = headersList.get("x-pathname") ?? "/"

  if (!canAccess(session.user.role, pathname)) {
    redirect("/no-autorizado")
  }

  return (
    <>
      <Navbar />
      <IdleTimeoutProvider />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
      <Toaster richColors position="top-right" />
    </>
  )
}
