import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { Toaster } from "sonner"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/login")
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
      <Toaster richColors position="top-right" />
    </>
  )
}
