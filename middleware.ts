import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { GATE_COOKIE, verifyGateCookie, getServerSecret } from '@/lib/admin-gate'

/**
 * Two locks protect the admin area:
 *
 *  1. GATE  — a signed cookie obtained by visiting /api/admin-gate?key=…
 *             Without it EVERY /admin* and /api/admin* URL (login page included)
 *             returns a plain 404, so the admin area is invisible to the public.
 *  2. LOGIN — a signed admin session JWT (verified here, not just "cookie exists").
 *
 * Route handlers additionally enforce roles via requireRole().
 */

const NEXTAUTH_COOKIES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
]

function notFound(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return new NextResponse(null, { status: 404 })
  }
  return NextResponse.rewrite(new URL('/admin-blocked', req.url), { status: 404 })
}

function harden(res: NextResponse) {
  res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  res.headers.set('Cache-Control', 'no-store, max-age=0')
  return res
}

async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('admin_session')?.value
  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(getServerSecret()))
      return true
    } catch {
      /* invalid / expired → fall through */
    }
  }
  // NextAuth fallback — real verification happens server-side in layouts/requireRole
  return NEXTAUTH_COOKIES.some((n) => req.cookies.has(n))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Unlock endpoint + setup protect themselves (key check / gate-cookie check → 404)
  if (pathname === '/api/admin-gate' || pathname.startsWith('/api/admin-gate/')) {
    return harden(NextResponse.next())
  }

  // ── Lock 1: gate ─────────────────────────────────────────────────────────
  const gateOk = await verifyGateCookie(req.cookies.get(GATE_COOKIE)?.value)
  if (!gateOk) {
    return harden(notFound(req))
  }

  // ── Public-within-gate: login page + login/logout API + password reset ──
  const isLoginArea =
    pathname === '/admin/login' ||
    pathname.startsWith('/admin/login/') ||
    pathname.startsWith('/api/admin-auth') ||
    pathname.startsWith('/api/admin/auth/')
  if (isLoginArea) {
    return harden(NextResponse.next())
  }

  // ── Lock 2: valid signed session ─────────────────────────────────────────
  if (!(await hasValidSession(req))) {
    if (pathname.startsWith('/api/')) {
      return harden(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
    }
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return harden(NextResponse.redirect(loginUrl))
  }

  return harden(NextResponse.next())
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/admin-auth/:path*',
    '/api/admin-gate',
    '/api/admin-gate/:path*',
  ],
}
