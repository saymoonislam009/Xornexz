export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) notFound();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition">
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>
      
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
            {user.image ? (
              <img src={user.image} alt="" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              user.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.name || "Unnamed User"}</h1>
            <p className="text-muted-foreground mt-1">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground capitalize">
              {user.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
              <div className="p-3 bg-muted/50 rounded-md border border-border">{user.name || "—"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
              <div className="p-3 bg-muted/50 rounded-md border border-border">{user.email || "—"}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
              <div className="p-3 bg-muted/50 rounded-md border border-border capitalize">{user.role}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Joined Date</label>
              <div className="p-3 bg-muted/50 rounded-md border border-border">
                {new Date(user.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
