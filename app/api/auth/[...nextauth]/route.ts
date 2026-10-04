// The legacy NextAuth credentials endpoint is DISABLED. Admin sign-in goes through
// /api/admin-auth/login, which sits behind the admin gate and is rate-limited.
// Leaving this route live would expose a second, ungated password-guessing endpoint.
const notFound = () => new Response(null, { status: 404 })

export const GET = notFound
export const POST = notFound
