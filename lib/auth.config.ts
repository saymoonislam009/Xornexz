import type { NextAuthConfig } from 'next-auth'

// Edge-safe: no Prisma, no bcrypt — only JWT reading
export const authConfig: NextAuthConfig = {
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthRoute =
        nextUrl.pathname.startsWith('/admin/login') ||
        nextUrl.pathname.startsWith('/admin/gate') ||
        nextUrl.pathname.startsWith('/api/admin/auth') ||
        nextUrl.pathname.startsWith('/api/admin-gate')
      const isAdminRoute =
        nextUrl.pathname.startsWith('/admin') ||
        nextUrl.pathname.startsWith('/api/admin')

      if (isAdminRoute && !isAuthRoute) {
        return isLoggedIn
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  providers: [], // populated in auth.ts
}
