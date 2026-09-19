"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Loader2, Sparkles, Calendar, Clock, Tag } from "lucide-react";
import TiptapEditor from "@/components/admin/TiptapEditor";
import MediaPicker from "@/components/admin/MediaPicker";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  featured: z.boolean().default(false),
  readingTime: z.string().optional(),
  scheduledAt: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

interface BlogFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    category: string;
    tags: string[];
    status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
    featured: boolean;
    readingTime?: number | null;
    scheduledAt?: Date | string | null;
  };
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      coverImage: initialData?.coverImage || "",
      category: initialData?.category || "",
      tags: initialData?.tags?.join(", ") || "",
      status: initialData?.status || "DRAFT",
      featured: initialData?.featured || false,
      readingTime: initialData?.readingTime?.toString() || "",
      scheduledAt: initialData?.scheduledAt
        ? new Date(initialData.scheduledAt).toISOString().slice(0, 16)
        : "",
    },
  });

  const onSubmit = async (data: BlogFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        readingTime: data.readingTime ? parseInt(data.readingTime) : null,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString() : null,
      };

      const url = initialData ? `/api/admin/blog/${initialData.id}` : "/api/admin/blog";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save blog post");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save post";
      alert("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!initialData || !confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${initialData.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      router.push("/admin/blog");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete post";
      alert("Error: " + message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl pb-16">
      {/* Top action header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Blog Posts
        </Link>
        <div className="flex items-center gap-3">
          {initialData && (
            <button
              type="button"
              onClick={onDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 size={16} /> Delete
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {initialData ? "Update Post" : "Publish / Save Post"}
          </button>
        </div>
      </div>

      {/* Main post metadata */}
      <div className="bg-[#0B0D14] border border-white/10 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="text-violet-400" size={18} /> Article Metadata
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
            <input
              {...form.register("title")}
              placeholder="e.g. Scaling Next.js to 10M Pageviews"
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm"
            />
            {form.formState.errors.title && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
            <input
              {...form.register("slug")}
              placeholder="scaling-nextjs-10m-pageviews"
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm"
            />
            {form.formState.errors.slug && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
            <input
              {...form.register("category")}
              placeholder="Engineering / Architecture"
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm"
            />
            {form.formState.errors.category && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.category.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt *</label>
            <textarea
              {...form.register("excerpt")}
              rows={3}
              placeholder="A brief summary for previews and social cards..."
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm"
            />
            {form.formState.errors.excerpt && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.excerpt.message}</p>
            )}
          </div>
        </div>

        {/* Cover Image with MediaPicker */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
          <Controller
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <MediaPicker
                value={field.value}
                onChange={field.onChange}
                onRemove={() => field.onChange("")}
                label="Cover Image (Auto-WebP, Direct R2)"
              />
            )}
          />
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="bg-[#0B0D14] border border-white/10 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Post Content (WYSIWYG Tiptap)</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Rich markdown & HTML authoring with live headings, lists, quotes, and direct media integration.
          </p>
        </div>

        <Controller
          control={form.control}
          name="content"
          render={({ field }) => (
            <TiptapEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Write your article..."
            />
          )}
        />
        {form.formState.errors.content && (
          <p className="text-red-400 text-xs mt-1">{form.formState.errors.content.message}</p>
        )}
      </div>

      {/* Publishing and Scheduling Settings */}
      <div className="bg-[#0B0D14] border border-white/10 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Calendar className="text-cyan-400" size={18} /> Publishing & Taxonomy
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              {...form.register("status")}
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 text-sm"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1.5">
              <Clock size={14} className="text-gray-400" /> Scheduled Date
            </label>
            <input
              type="datetime-local"
              {...form.register("scheduledAt")}
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 text-sm"
            />
            <p className="text-[11px] text-gray-500 mt-1">Used if status is set to SCHEDULED</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Reading Time (mins)</label>
            <input
              type="number"
              {...form.register("readingTime")}
              placeholder="e.g. 5"
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1.5">
              <Tag size={14} className="text-gray-400" /> Tags (comma-separated)
            </label>
            <input
              {...form.register("tags")}
              placeholder="Architecture, Next.js, Cloud, Performance"
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="featured"
              {...form.register("featured")}
              className="w-4 h-4 rounded bg-[#0E1018] border-white/10 text-violet-600 focus:ring-violet-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-300 cursor-pointer">
              Featured on Blog Homepage
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
