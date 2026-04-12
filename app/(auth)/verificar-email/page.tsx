import { Suspense } from "react"
import { redirect } from "next/navigation"
import { VerificarEmailClient } from "./verificar-email-client"

interface Props {
  searchParams: Promise<{ token?: string; error?: string }>
}

export default async function VerificarEmailPage({ searchParams }: Props) {
  const { token } = await searchParams

  // If a token is present, forward to better-auth's built-in verification endpoint
  // which validates the token against the DB and then redirects to the callbackURL
  if (token) {
    redirect(
      `/api/auth/verify-email?token=${encodeURIComponent(token)}&callbackURL=/login?verificado=true`
    )
  }

  return (
    <Suspense fallback={null}>
      <VerificarEmailClient />
    </Suspense>
  )
}
