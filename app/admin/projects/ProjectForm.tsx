"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Loader2, Sparkles, FolderGit2, Link as LinkIcon, Plus, X } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";

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
  videoUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  techStack: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.boolean().default(false),
  order: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    tagline: string;
    description: string;
    content?: string | null;
    client?: string | null;
    clientLogo?: string | null;
    clientUrl?: string | null;
    coverImage: string;
    gallery?: string[];
    videoUrl?: string | null;
    liveUrl?: string | null;
    category: string;
    tags: string[];
    techStack: string[];
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    featured: boolean;
    order?: number;
  };
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);

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
      videoUrl: initialData?.videoUrl || "",
      liveUrl: initialData?.liveUrl || "",
      category: initialData?.category || "",
      tags: initialData?.tags?.join(", ") || "",
      techStack: initialData?.techStack?.join(", ") || "",
      status: initialData?.status || "DRAFT",
      featured: initialData?.featured || false,
      order: initialData?.order !== undefined ? initialData.order.toString() : "0",
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        gallery,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        techStack: data.techStack
          ? data.techStack
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        order: parseInt(data.order || "0"),
      };

      const url = initialData ? `/api/admin/projects/${initialData.id}` : "/api/admin/projects";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save project");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (error: any) {
      alert("Error: " + (error.message || "Failed to save project"));
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

  const addGalleryImage = (url: string) => {
    if (url && !gallery.includes(url)) {
      setGallery([...gallery, url]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl pb-16">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Projects
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
            {initialData ? "Update Project" : "Create Project"}
          </button>
        </div>
      </div>

      {/* Primary Details */}
      <div className="bg-[#0B0D14] border border-white/10 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FolderGit2 className="text-violet-400" size={18} /> Project Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
            <input
              {...form.register("title")}
              placeholder="e.g. Nexus Commerce"
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
              placeholder="nexus-commerce"
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
              placeholder="E-Commerce / Enterprise"
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm"
            />
            {form.formState.errors.category && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.category.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Tagline *</label>
            <input
              {...form.register("tagline")}
              placeholder="Next-generation headless commerce platform handling 50k RPS"
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea
              {...form.register("description")}
              rows={4}
              placeholder="Full case study summary and engineering challenges solved..."
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image *</label>
          <Controller
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <MediaPicker
                value={field.value}
                onChange={field.onChange}
                onRemove={() => field.onChange("")}
                label="Cover Image (Auto-WebP, Direct R2 CDN)"
              />
            )}
          />
          {form.formState.errors.coverImage && (
            <p className="text-red-400 text-xs mt-1">{form.formState.errors.coverImage.message}</p>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-[#0B0D14] border border-white/10 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Project Showcase Gallery</h2>
        <p className="text-xs text-gray-400">
          Upload screenshots, diagrams, and user interface mocks to feature in the portfolio carousel.
        </p>

        {gallery.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {gallery.map((url, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
                <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <MediaPicker
          onChange={addGalleryImage}
          onRemove={() => {}}
          label="Add Image to Gallery"
        />
      </div>

      {/* Client & Links */}
      <div className="bg-[#0B0D14] border border-white/10 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <LinkIcon className="text-cyan-400" size={18} /> Client & External Links
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
            <input
              {...form.register("client")}
              placeholder="e.g. Apex Global Corp"
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Live URL</label>
            <input
              {...form.register("liveUrl")}
              placeholder="https://nexuscommerce.io"
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Video Demo URL</label>
            <input
              {...form.register("videoUrl")}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tech Stack</label>
            <input
              {...form.register("techStack")}
              placeholder="Next.js, Tailwind, GraphQL, AWS"
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              {...form.register("status")}
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 text-sm"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
            <input
              type="number"
              {...form.register("order")}
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
              Featured on Homepage Showcase
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
