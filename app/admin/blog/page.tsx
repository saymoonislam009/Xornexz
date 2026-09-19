export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, ExternalLink, Calendar } from "lucide-react";
import StatusBadge from "@/components/admin/ui/StatusBadge";

export default async function BlogAdminPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Blog Posts</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage articles, editorial scheduling, and technical publications.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-500/20 transition-all"
        >
          <Plus size={16} /> New Article
        </Link>
      </div>

      <div className="bg-[#0B0D14] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-gray-400 font-medium border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/90">
              {posts.map((post) => {
                const statusType =
                  post.status === "PUBLISHED"
                    ? "success"
                    : post.status === "SCHEDULED"
                    ? "info"
                    : "default";

                return (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.coverImage ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 bg-[#0E1018]">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 flex-shrink-0">
                            <Calendar size={18} />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white max-w-sm truncate">{post.title}</div>
                          <div className="text-xs text-gray-500">/blog/{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-xs text-gray-300">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={post.status} type={statusType} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-xs">
                      {post.author?.name || "Team"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-xs">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-gray-500 hover:text-white transition-colors"
                          title="View on public site"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/30 text-xs font-medium text-gray-300 hover:text-violet-300 transition-all"
                        >
                          <Edit size={13} /> Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No articles found. Click "New Article" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
