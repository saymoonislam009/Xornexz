import { NextRequest, NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

const ADMIN_GATE_COOKIE = 'admin_gate'
const ADMIN_GATE_TOKEN = 'FaltuXornexz'

const { auth } = NextAuth(authConfig)

export default auth(function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // The unlock API is always reachable (it validates the key itself)
  if (pathname.startsWith('/api/admin-gate')) {
    return NextResponse.next()
  }

  // For ALL /admin routes: check gate cookie — return 404 if missing
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const gateCookie = req.cookies.get(ADMIN_GATE_COOKIE)?.value
    if (gateCookie !== ADMIN_GATE_TOKEN) {
      // Rewrite to /admin-blocked which calls notFound()
      // This returns a genuine 404 with the site's not-found page
      return NextResponse.rewrite(new URL('/admin-blocked', req.url))
    }
  }

  // Gate passed — NextAuth's authorized() callback handles login redirect
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/admin-gate/:path*',
  ],
}
