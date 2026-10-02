import { NextRequest, NextResponse } from 'next/server'

const ADMIN_GATE_COOKIE = 'admin_gate'
const ADMIN_GATE_TOKEN = 'FaltuXornexz'

// Session cookies recognized across the app
const SESSION_COOKIES = [
  'admin_session',
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

    // Gate passed.
    // Auth routes (login, custom admin-auth) can proceed without session
    const isAuthRoute =
      pathname.startsWith('/admin/login') ||
      pathname.startsWith('/api/admin-auth')

    if (!isAuthRoute && !hasSessionCookie(req)) {
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
    '/api/admin-auth/:path*',
    '/api/admin-gate',
    '/api/admin-gate/:path*',
  ],
}
