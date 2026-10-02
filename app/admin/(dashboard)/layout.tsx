import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAdminSession } from "@/lib/admin-jwt";
import AdminShell from "@/components/admin/layout/AdminShell";

export default async function AuthenticatedAdminLayout({ children }: { children: ReactNode }) {
  let user = null;

  // 1. Check custom JWT admin session
  const adminSession = await getAdminSession();
  if (adminSession?.id) {
    user = {
      id: adminSession.id,
      email: adminSession.email,
      name: adminSession.name ?? "Admin",
      role: adminSession.role ?? "ADMIN",
    };
  } else {
    // 2. Fallback to NextAuth session if available
    try {
      const nextSession = await auth();
      if (nextSession?.user) {
        user = nextSession.user;
      }
    } catch {
      // Ignore NextAuth initialization/configuration error
    }
  }

  if (!user) {
    redirect("/admin/login");
  }

  const session = {
    user,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return <AdminShell session={session as any}>{children}</AdminShell>;
}
