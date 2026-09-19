import { auth } from '@/lib/auth'
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
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userRole = (session.user.role ?? 'VIEWER') as Role
  if (HIERARCHY[userRole] < HIERARCHY[minRole]) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return { userId: session.user.id as string, role: userRole }
}

export function isAuthError(
  result: { userId: string; role: Role } | NextResponse
): result is NextResponse {
  return result instanceof NextResponse
}

