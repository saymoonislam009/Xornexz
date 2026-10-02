import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAdminSession } from "@/lib/admin-jwt";

export default async function AdminRootPage() {
  const adminSession = await getAdminSession();
  if (adminSession?.id) {
    redirect("/admin/dashboard");
  }

  try {
    const session = await auth();
    if (session?.user) {
      redirect("/admin/dashboard");
    }
  } catch {
    // NextAuth error
  }

  redirect("/admin/login");
}
