import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { canAccess } from "@/lib/permissions"
import { Navbar } from "@/components/navbar"
import { Toaster } from "sonner"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })

  if (!session) {
    redirect("/login")
  }

  const pathname = headersList.get("x-pathname") ?? "/"

  if (!canAccess(session.user.role, pathname)) {
    redirect("/no-autorizado")
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
      <Toaster richColors position="top-right" />
    </>
  )
}
