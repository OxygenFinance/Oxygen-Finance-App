import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/auth/signin" ||
    path === "/gallery" ||
    path === "/creators" ||
    path.startsWith("/api/auth")

  // Check if the user is authenticated via NextAuth
  const isNextAuthAuthenticated =
    request.cookies.has("next-auth.session-token") || request.cookies.has("__Secure-next-auth.session-token")

  // Check if user has a wallet connected (stored in localStorage)
  // Note: We can't directly access localStorage from middleware, but we can check for a custom cookie
  const hasWalletConnected = request.cookies.has("wallet-connected")

  // Consider user authenticated if either NextAuth session exists or wallet is connected
  const isAuthenticated = isNextAuthAuthenticated || hasWalletConnected

  // Redirect logic
  if (!isAuthenticated && !isPublicPath) {
    // Instead of redirecting to signin, redirect to home page
    // This allows the client-side code to handle authentication
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/profile/:path*", "/admin/:path*", "/create/:path*", "/settings/:path*", "/wallet/:path*", "/mint/:path*"],
}
