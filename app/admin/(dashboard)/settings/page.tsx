"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Loader2, Check } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        reset(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [reset]);

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update settings";
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500 text-sm">
        <Loader2 className="w-6 h-6 animate-spin mr-2 text-violet-400" />
        Loading settings...
      </div>
    );
  }

  const TABS = [
    { id: "general", label: "General" },
    { id: "seo", label: "SEO & Meta" },
    { id: "social", label: "Social Links" },
    { id: "analytics", label: "Analytics" },
    { id: "features", label: "Features & Status" },
    { id: "contact", label: "Contact Info" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Global Configuration</h1>
          <p className="text-gray-400 text-sm mt-1">
            Site-wide metadata, brand copy, tracking pixels, and emergency switches.
          </p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-500/20 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4 text-emerald-300" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : saved ? "Changes Saved" : "Save Changes"}
        </button>
      </div>

      <Tabs.Root
        defaultValue="general"
        className="bg-[#0B0D14] border border-white/10 rounded-xl flex flex-col md:flex-row min-h-[560px] overflow-hidden"
      >
        <Tabs.List className="flex flex-col border-b md:border-b-0 md:border-r border-white/10 w-full md:w-56 p-3 gap-1 bg-white/[0.01]">
          {TABS.map((tab) => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className="px-3.5 py-2.5 text-left rounded-lg text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-white data-[state=active]:bg-violet-600/15 data-[state=active]:text-violet-300 data-[state=active]:border-l-2 data-[state=active]:border-violet-500 transition-all"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 p-6 lg:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs.Content value="general" className="space-y-5 focus:outline-none">
              <div>
                <h2 className="text-base font-semibold text-white mb-4">General Configuration</h2>
                <div className="grid gap-4 max-w-2xl">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Site Name</label>
                    <input
                      {...register("siteName")}
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Site Tagline</label>
                    <input
                      {...register("siteTagline")}
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Hero Headline</label>
                    <input
                      {...register("heroHeadline")}
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Hero Subheadline</label>
                    <textarea
                      {...register("heroSubheadline")}
                      rows={3}
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="seo" className="space-y-5 focus:outline-none">
              <div>
                <h2 className="text-base font-semibold text-white mb-4">SEO & Search Metadata</h2>
                <div className="grid gap-4 max-w-2xl">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Default Meta Title</label>
                    <input
                      {...register("defaultMetaTitle")}
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Default Meta Description</label>
                    <textarea
                      {...register("defaultMetaDescription")}
                      rows={3}
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Default OG Image CDN URL</label>
                    <input
                      {...register("defaultOgImage")}
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="social" className="space-y-5 focus:outline-none">
              <div>
                <h2 className="text-base font-semibold text-white mb-4">Social Network Profiles</h2>
                <div className="grid gap-4 max-w-2xl">
                  {["twitterUrl", "linkedinUrl", "githubUrl", "instagramUrl", "youtubeUrl"].map((field) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5 capitalize">
                        {field.replace("Url", "")}
                      </label>
                      <input
                        {...register(field)}
                        className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                        placeholder="https://"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="analytics" className="space-y-5 focus:outline-none">
              <div>
                <h2 className="text-base font-semibold text-white mb-4">Analytics & Telemetry</h2>
                <div className="grid gap-4 max-w-2xl">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Google Analytics Tag ID</label>
                    <input
                      {...register("googleAnalyticsId")}
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Plausible Analytics Domain</label>
                    <input
                      {...register("plausibleDomain")}
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="features" className="space-y-5 focus:outline-none">
              <div>
                <h2 className="text-base font-semibold text-white mb-4">Emergency & Feature Toggles</h2>
                <div className="grid gap-4 max-w-2xl">
                  <div className="flex items-center gap-3 p-4 border border-white/10 bg-[#0E1018] rounded-xl">
                    <input
                      type="checkbox"
                      {...register("maintenanceMode")}
                      id="maintenanceMode"
                      className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
                    />
                    <div>
                      <label htmlFor="maintenanceMode" className="text-sm font-medium text-white block">
                        Maintenance Mode
                      </label>
                      <p className="text-xs text-gray-400">Temporarily display maintenance screen to all visitors.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Maintenance Message</label>
                    <textarea
                      {...register("maintenanceMessage")}
                      rows={2}
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-4 border border-white/10 bg-[#0E1018] rounded-xl">
                    <input
                      type="checkbox"
                      {...register("cookieConsentEnabled")}
                      id="cookieConsentEnabled"
                      className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
                    />
                    <div>
                      <label htmlFor="cookieConsentEnabled" className="text-sm font-medium text-white block">
                        Cookie Consent Banner
                      </label>
                      <p className="text-xs text-gray-400">Show GDPR / CCPA cookie consent prompt to European visitors.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="contact" className="space-y-5 focus:outline-none">
              <div>
                <h2 className="text-base font-semibold text-white mb-4">Corporate Contact Information</h2>
                <div className="grid gap-4 max-w-2xl">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Primary Contact Email</label>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Telephone / Direct Line</label>
                    <input
                      {...register("phone")}
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Headquarters Address</label>
                    <textarea
                      {...register("address")}
                      rows={3}
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>
            </Tabs.Content>
          </form>
        </div>
      </Tabs.Root>
    </div>
  );
}
