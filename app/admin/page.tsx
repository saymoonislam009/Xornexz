import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminRootPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/admin/dashboard");
  } else {
    redirect("/admin/login");
  }
}
