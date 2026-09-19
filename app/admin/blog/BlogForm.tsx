"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function BlogForm({ initialData }: { initialData?: any }) {
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
      scheduledAt: initialData?.scheduledAt ? new Date(initialData.scheduledAt).toISOString().slice(0, 16) : "",
    },
  });

  const onSubmit = async (data: BlogFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(s => s.trim()).filter(Boolean) : [],
        readingTime: data.readingTime ? parseInt(data.readingTime) : null,
      };

      const url = initialData ? `/api/admin/blog/${initialData.id}` : "/api/admin/blog";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      router.push("/admin/blog");
      router.refresh();
    } catch (error: any) {
      alert("Error: " + error.message);
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
    } catch (error: any) {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg shadow max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input {...form.register("title")} className="w-full border rounded p-2" />
          {form.formState.errors.title && <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input {...form.register("slug")} className="w-full border rounded p-2" />
          {form.formState.errors.slug && <p className="text-red-500 text-xs mt-1">{form.formState.errors.slug.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <input {...form.register("category")} className="w-full border rounded p-2" />
          {form.formState.errors.category && <p className="text-red-500 text-xs mt-1">{form.formState.errors.category.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Excerpt *</label>
          <textarea {...form.register("excerpt")} rows={3} className="w-full border rounded p-2" />
          {form.formState.errors.excerpt && <p className="text-red-500 text-xs mt-1">{form.formState.errors.excerpt.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Content (Markdown/HTML) *</label>
          <textarea {...form.register("content")} rows={10} className="w-full border rounded p-2 font-mono" />
          {form.formState.errors.content && <p className="text-red-500 text-xs mt-1">{form.formState.errors.content.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <input {...form.register("coverImage")} className="w-full border rounded p-2" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input {...form.register("tags")} className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select {...form.register("status")} className="w-full border rounded p-2">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="SCHEDULED">Scheduled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Scheduled At</label>
          <input type="datetime-local" {...form.register("scheduledAt")} className="w-full border rounded p-2" />
          <p className="text-xs text-gray-500 mt-1">Only applies if status is SCHEDULED</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Reading Time (mins)</label>
          <input type="number" {...form.register("readingTime")} className="w-full border rounded p-2" />
        </div>

        <div className="flex items-center space-x-2 pt-8">
          <input type="checkbox" id="featured" {...form.register("featured")} />
          <label htmlFor="featured" className="text-sm font-medium">Featured Post</label>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <div className="space-x-4">
          {initialData && (
            <button
              type="button"
              onClick={onDelete}
              disabled={loading}
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
