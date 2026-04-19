import { NextRequest, NextResponse } from "next/server"

// Auth pages that should be inaccessible when logged in
const AUTH_PATHS = [
  "/login",
  "/registro",
  "/verificar-email",
  "/recuperar-contrasena",
  "/restablecer-contrasena",
]


export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow all API routes through
  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value

  const hasSession = Boolean(sessionToken)

  const isAuthPath = AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  )

  // Redirect unauthenticated users to login
  if (!isAuthPath && !hasSession) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPath && hasSession) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Forward pathname so server layouts can perform RBAC checks
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw\\.js|workbox-.*\\.js|.*\\.(?:png|ico|svg|jpg|jpeg|gif|webp|json|txt|xml|woff|woff2)$).*)",
  ],
}
