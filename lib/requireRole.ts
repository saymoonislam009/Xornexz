import { auth } from '@/lib/auth'
import { getAdminSession } from '@/lib/admin-jwt'
import { NextResponse } from 'next/server'

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER'

const HIERARCHY: Record<Role, number> = {
  VIEWER: 0,
  EDITOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
}

export async function requireRole(
  minRole: Role
): Promise<{ userId: string; role: Role } | NextResponse> {
  let userId: string | undefined
  let userRole: Role = 'VIEWER'

  // 1. Try custom admin session
  const adminSession = await getAdminSession()
  if (adminSession?.id) {
    userId = adminSession.id
    userRole = (adminSession.role ?? 'VIEWER') as Role
  } else {
    // 2. Fallback to NextAuth
    try {
      const session = await auth()
      if (session?.user?.id) {
        userId = session.user.id
        userRole = (session.user.role ?? 'VIEWER') as Role
      }
    } catch {
      // ignore NextAuth errors
    }
  }

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (HIERARCHY[userRole] < HIERARCHY[minRole]) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return { userId, role: userRole }
}

export function isAuthError(
  result: { userId: string; role: Role } | NextResponse
): result is NextResponse {
  return result instanceof NextResponse
}
