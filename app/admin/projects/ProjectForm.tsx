"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().optional(),
  client: z.string().optional(),
  clientLogo: z.string().optional(),
  clientUrl: z.string().optional(),
  coverImage: z.string().min(1, "Cover image URL is required"),
  gallery: z.string().optional(), // We'll parse this into an array
  videoUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(), // We'll parse this into an array
  techStack: z.string().optional(), // We'll parse this into an array
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.boolean().default(false),
  order: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function ProjectForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      tagline: initialData?.tagline || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      client: initialData?.client || "",
      clientLogo: initialData?.clientLogo || "",
      clientUrl: initialData?.clientUrl || "",
      coverImage: initialData?.coverImage || "",
      gallery: initialData?.gallery?.join(", ") || "",
      videoUrl: initialData?.videoUrl || "",
      liveUrl: initialData?.liveUrl || "",
      category: initialData?.category || "",
      tags: initialData?.tags?.join(", ") || "",
      techStack: initialData?.techStack?.join(", ") || "",
      status: initialData?.status || "DRAFT",
      featured: initialData?.featured || false,
      order: initialData?.order?.toString() || "0",
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        gallery: data.gallery ? data.gallery.split(",").map(s => s.trim()).filter(Boolean) : [],
        tags: data.tags ? data.tags.split(",").map(s => s.trim()).filter(Boolean) : [],
        techStack: data.techStack ? data.techStack.split(",").map(s => s.trim()).filter(Boolean) : [],
        order: parseInt(data.order || "0"),
      };

      const url = initialData ? `/api/admin/projects/${initialData.id}` : "/api/admin/projects";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      router.push("/admin/projects");
      router.refresh();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!initialData || !confirm("Are you sure you want to delete this project?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/projects/${initialData.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      router.push("/admin/projects");
      router.refresh();
    } catch (error: any) {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg shadow max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input {...form.register("title")} className="w-full border rounded p-2" />
          {form.formState.errors.title && <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input {...form.register("slug")} className="w-full border rounded p-2" />
          {form.formState.errors.slug && <p className="text-red-500 text-xs mt-1">{form.formState.errors.slug.message}</p>}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Tagline *</label>
          <input {...form.register("tagline")} className="w-full border rounded p-2" />
          {form.formState.errors.tagline && <p className="text-red-500 text-xs mt-1">{form.formState.errors.tagline.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea {...form.register("description")} rows={3} className="w-full border rounded p-2" />
          {form.formState.errors.description && <p className="text-red-500 text-xs mt-1">{form.formState.errors.description.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Content (Markdown / HTML)</label>
          <textarea {...form.register("content")} rows={6} className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL *</label>
          <input {...form.register("coverImage")} className="w-full border rounded p-2" />
          {form.formState.errors.coverImage && <p className="text-red-500 text-xs mt-1">{form.formState.errors.coverImage.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gallery URLs (comma separated)</label>
          <input {...form.register("gallery")} className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Client Name</label>
          <input {...form.register("client")} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Client Logo URL</label>
          <input {...form.register("clientLogo")} className="w-full border rounded p-2" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <input {...form.register("category")} className="w-full border rounded p-2" />
          {form.formState.errors.category && <p className="text-red-500 text-xs mt-1">{form.formState.errors.category.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select {...form.register("status")} className="w-full border rounded p-2">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input {...form.register("tags")} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tech Stack (comma separated)</label>
          <input {...form.register("techStack")} className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Video URL</label>
          <input {...form.register("videoUrl")} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Live URL</label>
          <input {...form.register("liveUrl")} className="w-full border rounded p-2" />
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="featured" {...form.register("featured")} />
          <label htmlFor="featured" className="text-sm font-medium">Featured Project</label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Order</label>
          <input type="number" {...form.register("order")} className="w-full border rounded p-2" />
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
            {loading ? "Saving..." : "Save Project"}
          </button>
        </div>
      </div>
    </form>
  );
}
