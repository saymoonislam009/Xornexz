import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "@/components/admin/layout/AdminShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // Protect all admin routes at layout level (belt-and-suspenders with middleware)
  if (!session?.user) {
    redirect("/admin/login");
  }

  return <AdminShell session={session}>{children}</AdminShell>;
}
