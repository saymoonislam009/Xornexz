"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Trash2, Loader2, Sparkles, Code, Smartphone, Cloud, Brain, Shield, Cpu, Layers, Palette } from "lucide-react";
import Link from "next/link";

const AVAILABLE_ICONS = [
  { name: "Code", icon: Code, label: "Web / Code" },
  { name: "Smartphone", icon: Smartphone, label: "Mobile Apps" },
  { name: "Cloud", icon: Cloud, label: "Cloud / DevOps" },
  { name: "Brain", icon: Brain, label: "AI / Machine Learning" },
  { name: "Shield", icon: Shield, label: "Cybersecurity" },
  { name: "Cpu", icon: Cpu, label: "Hardware / Systems" },
  { name: "Layers", icon: Layers, label: "Architecture" },
  { name: "Palette", icon: Palette, label: "UI / UX Design" },
];

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  features: z.string().optional(),
  deliverables: z.string().optional(),
  techStack: z.string().optional(),
  order: z.string().optional(),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  initialData?: any;
}

export default function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(initialData?.icon || "Code");

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      tagline: initialData?.tagline || "",
      description: initialData?.description || "",
      icon: initialData?.icon || "Code",
      features: Array.isArray(initialData?.features) ? initialData.features.join("\n") : "",
      deliverables: Array.isArray(initialData?.deliverables) ? initialData.deliverables.join("\n") : "",
      techStack: Array.isArray(initialData?.techStack) ? initialData.techStack.join(", ") : "",
      order: initialData?.order !== undefined ? initialData.order.toString() : "0",
      isActive: initialData?.isActive ?? true,
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
    },
  });

  const onSubmit = async (values: ServiceFormValues) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        slug: values.slug,
        tagline: values.tagline,
        description: values.description,
        icon: selectedIcon,
        features: values.features ? values.features.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        deliverables: values.deliverables ? values.deliverables.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        techStack: values.techStack ? values.techStack.split(",").map((s) => s.trim()).filter(Boolean) : [],
        order: parseInt(values.order || "0"),
        isActive: values.isActive,
        metaTitle: values.metaTitle || null,
        metaDescription: values.metaDescription || null,
      };

      const url = initialData ? `/api/admin/services/${initialData.id}` : "/api/admin/services";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save service");
      }

      router.push("/admin/services");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!initialData || !confirm("Are you sure you want to delete this service?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/services/${initialData.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      router.push("/admin/services");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete service");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl pb-12">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Services
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
            {initialData ? "Update Service" : "Create Service"}
          </button>
        </div>
      </div>

      <div className="bg-[#0B0D14] border border-white/10 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="text-violet-400" size={18} /> General Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Service Title *</label>
            <input
              {...form.register("title")}
              placeholder="e.g. Web Development"
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
              placeholder="e.g. web-development"
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm"
            />
            {form.formState.errors.slug && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.slug.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Tagline *</label>
            <input
              {...form.register("tagline")}
              placeholder="e.g. High-performance, scalable web apps built with modern tech"
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea
              {...form.register("description")}
              rows={4}
              placeholder="Detailed description of the service and our approach..."
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AVAILABLE_ICONS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedIcon === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setSelectedIcon(item.name);
                    form.setValue("icon", item.name);
                  }}
                  className={`p-3 rounded-lg border flex items-center gap-3 transition-all text-left ${
                    isSelected
                      ? "bg-violet-600/15 border-violet-500/50 text-white"
                      : "bg-[#0E1018] border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <Icon size={20} className={isSelected ? "text-violet-400" : "text-gray-500"} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-[#0B0D14] border border-white/10 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white">Features & Deliverables</h2>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Features (one per line)</label>
          <textarea
            {...form.register("features")}
            rows={4}
            placeholder="Custom UI/UX Design&#10;Headless CMS Integration&#10;Full-stack Architecture"
            className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Deliverables (one per line)</label>
          <textarea
            {...form.register("deliverables")}
            rows={4}
            placeholder="Production-ready Source Code&#10;CI/CD Pipeline Setup&#10;Documentation & Training"
            className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tech Stack (comma separated)</label>
          <input
            {...form.register("techStack")}
            placeholder="Next.js, TypeScript, Tailwind CSS, PostgreSQL"
            className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Display Order</label>
            <input
              type="number"
              {...form.register("order")}
              className="w-full bg-[#0E1018] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="isActive"
              {...form.register("isActive")}
              className="w-4 h-4 rounded bg-[#0E1018] border-white/10 text-violet-600 focus:ring-violet-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-300 cursor-pointer">
              Active / Visible on public site
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
