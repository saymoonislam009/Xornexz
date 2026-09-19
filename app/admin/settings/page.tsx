"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Loader2 } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        reset(data);
        setIsLoading(false);
      });
  }, [reset]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      // Optionally show toast
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground mt-1">Manage global configuration for your website.</p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <Tabs.Root defaultValue="general" className="bg-card border border-border rounded-lg flex flex-col md:flex-row min-h-[600px]">
        <Tabs.List className="flex flex-col border-r border-border w-full md:w-64 p-4 gap-1">
          {[
            { id: "general", label: "General" },
            { id: "seo", label: "SEO & Meta" },
            { id: "social", label: "Social Links" },
            { id: "analytics", label: "Analytics" },
            { id: "features", label: "Features" },
            { id: "contact", label: "Contact Info" },
          ].map(tab => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className="px-4 py-2.5 text-left rounded-md text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 p-6 lg:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Tabs.Content value="general" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">General Configuration</h2>
                <div className="grid gap-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium mb-1">Site Name</label>
                    <input {...register("siteName")} className="w-full p-2 rounded-md border border-input bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Site Tagline</label>
                    <input {...register("siteTagline")} className="w-full p-2 rounded-md border border-input bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hero Headline</label>
                    <input {...register("heroHeadline")} className="w-full p-2 rounded-md border border-input bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hero Subheadline</label>
                    <textarea {...register("heroSubheadline")} rows={3} className="w-full p-2 rounded-md border border-input bg-background" />
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="seo" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">SEO & Metadata</h2>
                <div className="grid gap-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium mb-1">Default Meta Title</label>
                    <input {...register("defaultMetaTitle")} className="w-full p-2 rounded-md border border-input bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Default Meta Description</label>
                    <textarea {...register("defaultMetaDescription")} rows={3} className="w-full p-2 rounded-md border border-input bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Default OG Image URL</label>
                    <input {...register("defaultOgImage")} className="w-full p-2 rounded-md border border-input bg-background" />
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="social" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Social Links</h2>
                <div className="grid gap-6 max-w-2xl">
                  {["twitterUrl", "linkedinUrl", "githubUrl", "instagramUrl", "youtubeUrl"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-1 capitalize">{field.replace("Url", "")}</label>
                      <input {...register(field)} className="w-full p-2 rounded-md border border-input bg-background" placeholder="https://" />
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="analytics" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Analytics & Tracking</h2>
                <div className="grid gap-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium mb-1">Google Analytics ID</label>
                    <input {...register("googleAnalyticsId")} className="w-full p-2 rounded-md border border-input bg-background" placeholder="G-XXXXXXXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Plausible Domain</label>
                    <input {...register("plausibleDomain")} className="w-full p-2 rounded-md border border-input bg-background" />
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="features" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Feature Toggles</h2>
                <div className="grid gap-6 max-w-2xl">
                  <div className="flex items-center gap-3 p-4 border border-border rounded-md">
                    <input type="checkbox" {...register("maintenanceMode")} id="maintenanceMode" className="w-4 h-4" />
                    <div>
                      <label htmlFor="maintenanceMode" className="font-medium block">Maintenance Mode</label>
                      <p className="text-sm text-muted-foreground">Temporarily disable public access to the site.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Maintenance Message</label>
                    <textarea {...register("maintenanceMessage")} rows={2} className="w-full p-2 rounded-md border border-input bg-background" />
                  </div>
                  <div className="flex items-center gap-3 p-4 border border-border rounded-md mt-4">
                    <input type="checkbox" {...register("cookieConsentEnabled")} id="cookieConsentEnabled" className="w-4 h-4" />
                    <div>
                      <label htmlFor="cookieConsentEnabled" className="font-medium block">Cookie Consent</label>
                      <p className="text-sm text-muted-foreground">Show cookie consent banner to visitors.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="contact" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="grid gap-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium mb-1">Support Email</label>
                    <input type="email" {...register("email")} className="w-full p-2 rounded-md border border-input bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input {...register("phone")} className="w-full p-2 rounded-md border border-input bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Physical Address</label>
                    <textarea {...register("address")} rows={3} className="w-full p-2 rounded-md border border-input bg-background" />
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
