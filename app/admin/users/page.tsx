export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/db";
import Image from "next/image";
import { User, ShieldCheck } from "lucide-react";
import StatusBadge from "@/components/admin/ui/StatusBadge";

export const metadata = { title: "Users | Admin" };

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Users & Roles</h1>
          <p className="text-gray-400 text-sm mt-1">
            Authorized administrative accounts with role-based access control.
          </p>
        </div>
      </div>

      <div className="bg-[#0B0D14] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400 font-medium border-b border-white/10">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Last Active</th>
                <th className="px-6 py-3.5">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/90">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-violet-600/15 border border-violet-500/20 flex items-center justify-center text-violet-400">
                        {user.image ? (
                          <Image src={user.image} alt={user.name || ""} fill className="object-cover" />
                        ) : (
                          <User size={15} />
                        )}
                      </div>
                      <span className="font-medium text-white">{user.name || "Administrator"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-xs">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-600/15 text-violet-300 border border-violet-500/20">
                      <ShieldCheck size={12} /> {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      status={user.isActive ? "Active" : "Disabled"}
                      type={user.isActive ? "success" : "error"}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
