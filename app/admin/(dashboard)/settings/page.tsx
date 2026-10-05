"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Loader2, Check, Sparkles, Image as ImageIcon } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import MediaPicker from "@/components/admin/MediaPicker";

interface SettingsFormValues {
  siteName: string;
  siteTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCta1Label: string;
  heroCta1Href: string;
  heroCta2Label: string;
  heroCta2Href: string;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  defaultOgImageUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  analyticsId: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  cookieConsentEnabled: boolean;
  email: string;
  phone: string;
  address: string;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm<SettingsFormValues>({
    defaultValues: {
      siteName: "Xornexz",
      siteTagline: "We build what's next.",
      heroHeadline: "We Build What's Next.",
      heroSubheadline: "Xornexz designs and builds websites, web apps, SaaS platforms, and AI-powered systems.",
      heroCta1Label: "Start a Project",
      heroCta1Href: "/contact",
      heroCta2Label: "See Our Work",
      heroCta2Href: "/portfolio",
      logoUrl: "",
      logoDarkUrl: "",
      faviconUrl: "",
      defaultOgImageUrl: "",
      twitterUrl: "",
      linkedinUrl: "",
      githubUrl: "",
      instagramUrl: "",
      youtubeUrl: "",
      analyticsId: "",
      maintenanceMode: false,
      maintenanceMessage: "We'll be back shortly.",
      cookieConsentEnabled: true,
      email: "hello@xornexz.com",
      phone: "+1 (555) 000-0000",
      address: "",
    },
  });

  const logoUrl = watch("logoUrl");
  const logoDarkUrl = watch("logoDarkUrl");
  const faviconUrl = watch("faviconUrl");
  const defaultOgImageUrl = watch("defaultOgImageUrl");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === "object") {
          const socials = data.socialsJson || {};
          reset({
            siteName: data.siteName || "Xornexz",
            siteTagline: data.siteTagline || "",
            heroHeadline: data.heroHeadline || "We Build What's Next.",
            heroSubheadline: data.heroSubheadline || "",
            heroCta1Label: data.heroCta1Label || "Start a Project",
            heroCta1Href: data.heroCta1Href || "/contact",
            heroCta2Label: data.heroCta2Label || "See Our Work",
            heroCta2Href: data.heroCta2Href || "/portfolio",
            logoUrl: data.logoUrl || "",
            logoDarkUrl: data.logoDarkUrl || "",
            faviconUrl: data.faviconUrl || "",
            defaultOgImageUrl: data.defaultOgImageUrl || data.defaultOgImage || "",
            twitterUrl: socials.twitter || "",
            linkedinUrl: socials.linkedin || "",
            githubUrl: socials.github || "",
            instagramUrl: socials.instagram || "",
            youtubeUrl: socials.youtube || "",
            analyticsId: data.analyticsId || "",
            maintenanceMode: Boolean(data.maintenanceMode),
            maintenanceMessage: data.maintenanceMessage || "We'll be back shortly.",
            cookieConsentEnabled: data.cookieConsentEnabled !== false,
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [reset]);

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSaving(true);
    setSaved(false);
    try {
      const payload = {
        ...data,
        socialsJson: {
          twitter: data.twitterUrl || "",
          linkedin: data.linkedinUrl || "",
          github: data.githubUrl || "",
          instagram: data.instagramUrl || "",
          youtube: data.youtubeUrl || "",
        },
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save settings");
      }

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
    { id: "general", label: "General & Hero" },
    { id: "branding", label: "Logos & Brand" },
    { id: "seo", label: "SEO & Social Sharing" },
    { id: "social", label: "Social Media" },
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
            Site-wide metadata, brand logos, copy, tracking tags, and emergency switches.
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
        className="bg-[#0B0D14] border border-white/10 rounded-xl flex flex-col md:flex-row min-h-[580px] overflow-hidden"
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
            {/* General Tab */}
            <Tabs.Content value="general" className="space-y-5 focus:outline-none">
              <h2 className="text-base font-semibold text-white mb-4">Site Identity & Hero</h2>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Primary CTA Button</label>
                    <input
                      {...register("heroCta1Label")}
                      placeholder="Start a Project"
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Primary CTA Link</label>
                    <input
                      {...register("heroCta1Href")}
                      placeholder="/contact"
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Secondary CTA Button</label>
                    <input
                      {...register("heroCta2Label")}
                      placeholder="See Our Work"
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Secondary CTA Link</label>
                    <input
                      {...register("heroCta2Href")}
                      placeholder="/portfolio"
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>
            </Tabs.Content>

            {/* Branding Tab */}
            <Tabs.Content value="branding" className="space-y-6 focus:outline-none">
              <div>
                <h2 className="text-base font-semibold text-white mb-2">Logos & Favicon</h2>
                <p className="text-xs text-gray-400 mb-6">
                  Upload brand assets or paste image URLs. These assets adapt seamlessly across light and dark modes.
                </p>
                <div className="grid gap-6 max-w-2xl">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Primary Logo (Light Theme / Header)
                    </label>
                    <MediaPicker
                      value={logoUrl}
                      onChange={(url) => setValue("logoUrl", url)}
                      onRemove={() => setValue("logoUrl", "")}
                      folder="logos"
                      label="Upload Light Logo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Dark Mode Logo (Optional variant)
                    </label>
                    <MediaPicker
                      value={logoDarkUrl}
                      onChange={(url) => setValue("logoDarkUrl", url)}
                      onRemove={() => setValue("logoDarkUrl", "")}
                      folder="logos"
                      label="Upload Dark Mode Logo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Browser Favicon / App Icon
                    </label>
                    <MediaPicker
                      value={faviconUrl}
                      onChange={(url) => setValue("faviconUrl", url)}
                      onRemove={() => setValue("faviconUrl", "")}
                      folder="logos"
                      label="Upload Favicon"
                    />
                  </div>
                </div>
              </div>
            </Tabs.Content>

            {/* SEO & Meta Tab */}
            <Tabs.Content value="seo" className="space-y-6 focus:outline-none">
              <div>
                <h2 className="text-base font-semibold text-white mb-2">SEO & Social Graph Meta</h2>
                <p className="text-xs text-gray-400 mb-6">
                  Control how the site previews on search engines, X (Twitter), LinkedIn, and messaging apps.
                </p>
                <div className="grid gap-6 max-w-2xl">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Default OpenGraph & Twitter Social Image (1200x630px recommended)
                    </label>
                    <MediaPicker
                      value={defaultOgImageUrl}
                      onChange={(url) => setValue("defaultOgImageUrl", url)}
                      onRemove={() => setValue("defaultOgImageUrl", "")}
                      folder="uploads"
                      label="Upload Social Preview Image"
                    />
                  </div>
                </div>
              </div>
            </Tabs.Content>

            {/* Social Media Tab */}
            <Tabs.Content value="social" className="space-y-5 focus:outline-none">
              <h2 className="text-base font-semibold text-white mb-4">Official Social Profiles</h2>
              <div className="grid gap-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Twitter / X</label>
                  <input
                    {...register("twitterUrl")}
                    placeholder="https://x.com/xornexz"
                    className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">LinkedIn</label>
                  <input
                    {...register("linkedinUrl")}
                    placeholder="https://linkedin.com/company/xornexz"
                    className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">GitHub</label>
                  <input
                    {...register("githubUrl")}
                    placeholder="https://github.com/xornexz"
                    className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Instagram</label>
                  <input
                    {...register("instagramUrl")}
                    placeholder="https://instagram.com/xornexz"
                    className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">YouTube</label>
                  <input
                    {...register("youtubeUrl")}
                    placeholder="https://youtube.com/@xornexz"
                    className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </Tabs.Content>

            {/* Analytics Tab */}
            <Tabs.Content value="analytics" className="space-y-5 focus:outline-none">
              <h2 className="text-base font-semibold text-white mb-4">Analytics & Telemetry</h2>
              <div className="grid gap-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Google Analytics ID / Tag Manager ID
                  </label>
                  <input
                    {...register("analyticsId")}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </Tabs.Content>

            {/* Features Tab */}
            <Tabs.Content value="features" className="space-y-5 focus:outline-none">
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
                    <p className="text-xs text-gray-400">Show GDPR / CCPA cookie consent prompt to visitors.</p>
                  </div>
                </div>
              </div>
            </Tabs.Content>

            {/* Contact Tab */}
            <Tabs.Content value="contact" className="space-y-5 focus:outline-none">
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
            </Tabs.Content>
          </form>
        </div>
      </Tabs.Root>
    </div>
  );
}
