import { NextRequest, NextResponse } from 'next/server'

const ADMIN_GATE_COOKIE = 'admin_gate'
const ADMIN_GATE_TOKEN = 'FaltuXornexz'

// NextAuth v5 writes the session under these cookie names depending on env
const SESSION_COOKIES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
]

function hasSessionCookie(req: NextRequest): boolean {
  return SESSION_COOKIES.some((name) => req.cookies.has(name))
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // The unlock API is always reachable — it validates the key itself
  if (pathname.startsWith('/api/admin-gate')) {
    return NextResponse.next()
  }

  // All /admin and /api/admin routes require the gate cookie first
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const gateCookie = req.cookies.get(ADMIN_GATE_COOKIE)?.value

    if (gateCookie !== ADMIN_GATE_TOKEN) {
      // No valid gate cookie → genuine 404, no trace of admin
      return NextResponse.rewrite(new URL('/admin-blocked', req.url))
    }

    // Gate passed. For protected pages (not login), also check session cookie.
    // Real JWT validation happens server-side in app/admin/(dashboard)/layout.tsx.
    // Here we only check for cookie presence to avoid unnecessary server hits.
    const isLoginPage = pathname.startsWith('/admin/login')

    if (!isLoginPage && !hasSessionCookie(req)) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/admin-gate/:path*',
  ],
}
