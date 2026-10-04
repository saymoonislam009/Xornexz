import { NextRequest, NextResponse } from 'next/server'

const ADMIN_GATE_COOKIE = 'admin_gate'
const ADMIN_GATE_TOKEN = 'FaltuXornexz'

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

  // ── 1. Always-public admin paths ─────────────────────────────────────────
  // These routes handle their own auth/validation.
  // The login page is intentionally public — credentials are still required.
  // The auth API sets the gate cookie on successful login.
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/admin/login/') ||  // forgot-password, reset-password, error
    pathname.startsWith('/api/admin-auth') || // login, logout
    pathname.startsWith('/api/admin-gate')    // gate unlock, setup
  ) {
    return NextResponse.next()
  }

  // ── 2. All other /admin and /api/admin/* routes require gate + session ────
  // Note: we use '/api/admin/' (with trailing slash) so that
  // '/api/admin-auth' does NOT accidentally match here.
  const isProtectedAdmin =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/admin/')

  if (isProtectedAdmin) {
    const gateCookie = req.cookies.get(ADMIN_GATE_COOKIE)?.value

    if (gateCookie !== ADMIN_GATE_TOKEN) {
      // No valid gate cookie → silent 404, no trace of admin
      return NextResponse.rewrite(new URL('/admin-blocked', req.url))
    }

    if (!hasSessionCookie(req)) {
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
