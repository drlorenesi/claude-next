import type { Metadata } from "next"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  robots: { index: false },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="relative flex min-h-svh flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        {children}
      </div>
      <Toaster richColors position="top-right" />
    </>
  )
}
