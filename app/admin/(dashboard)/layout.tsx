import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-jwt";
import AdminShell from "@/components/admin/layout/AdminShell";

// ── CRITICAL: force dynamic rendering ────────────────────────────────────────
// Without this, Next.js tries to pre-render admin pages as static HTML during
// the build. At build time there's no request context, so cookies() throws.
// Our try/catch catches that, returns null → layout emits redirect("/admin/login").
// That redirect gets baked into the static HTML — so every visit to /admin/*
// ignores the user's actual session cookies and always redirects to login.
// force-dynamic ensures these routes are always server-rendered at request time.
export const dynamic = "force-dynamic";

export default async function AuthenticatedAdminLayout({ children }: { children: ReactNode }) {
  // ── 1. Verify custom JWT session ─────────────────────────────────────────
  let user = null;

  const adminSession = await getAdminSession();
  if (adminSession?.id) {
    user = {
      id: adminSession.id,
      email: adminSession.email,
      name: adminSession.name ?? "Admin",
      role: adminSession.role ?? "ADMIN",
    };
  } else {
    // ── 2. Fallback: try NextAuth ─────────────────────────────────────────
    // Lazy import to avoid module-level NextAuth errors on Edge runtime
    try {
      const { auth } = await import("@/lib/auth");
      const nextSession = await auth();
      if (nextSession?.user) {
        user = nextSession.user;
      }
    } catch {
      // NextAuth v5 beta can throw Configuration errors — that's expected
    }
  }

  if (!user) {
    redirect(
      "/admin/login?error=" +
        encodeURIComponent(
          "Session could not be verified. Please sign in again. " +
            "If this keeps happening, visit /api/admin-gate/setup?key=FaltuXornexz to recreate your account."
        )
    );
  }

  const session = {
    user,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return <AdminShell session={session as any}>{children}</AdminShell>;
}
