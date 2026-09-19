"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, ArrowUp, ArrowDown, Eye, EyeOff, Sparkles, Check } from "lucide-react";

interface Section {
  id?: string;
  key: string;
  enabled: boolean;
  order: number;
}

const SECTION_LABELS: Record<string, { title: string; description: string }> = {
  hero: { title: "Hero & 3D Interactive Canvas", description: "Main headline, CTA buttons, and interactive 3D hero scene" },
  stats: { title: "Metrics & Key Statistics", description: "Company numbers: 99.99% uptime, 50k+ RPS, enterprise metrics" },
  services: { title: "Engineering Services Grid", description: "Capabilities showcase with icons and feature deliverables" },
  projects: { title: "Featured Portfolio Showcase", description: "Selected client case studies with live demo links" },
  process: { title: "Execution Methodology", description: "Discovery, Architecture, Sprinting, and Deployment stages" },
  techstack: { title: "Enterprise Technology Stack", description: "Cloud, AI, and distributed framework badges" },
  testimonials: { title: "Client Testimonials & Quotes", description: "Endorsements from engineering leaders and founders" },
  pricing: { title: "Transparent Pricing Plans", description: "Growth, Scale, and Enterprise tier comparison" },
  faq: { title: "Frequently Asked Questions", description: "Accordion with common technical and commercial inquiries" },
  cta: { title: "Final Conversion Banner", description: "Bottom CTA directing visitors to estimator and contact form" },
};

export default function HomepageEditorPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/home-sections")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSections(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSections(updated);
  };

  const toggleSection = (index: number) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setSections(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/home-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });

      if (!res.ok) throw new Error("Failed to save homepage layout");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to save homepage layout");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500 text-sm">
        <Loader2 className="animate-spin mr-2" size={18} /> Loading homepage sections...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Homepage Section Control</h1>
          <p className="text-gray-400 text-sm mt-1">
            Reorder sections, toggle visibility, and instantly update the public landing page via ISR.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-500/20 transition-all disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            <Check size={16} className="text-emerald-300" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Publishing..." : saved ? "Published Changes" : "Save Layout"}
        </button>
      </div>

      <div className="bg-[#0B0D14] border border-white/10 rounded-xl divide-y divide-white/5 overflow-hidden">
        {sections.map((section, index) => {
          const meta = SECTION_LABELS[section.key] || {
            title: section.key.toUpperCase(),
            description: "Custom homepage block",
          };

          return (
            <div
              key={section.key}
              className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                section.enabled ? "bg-transparent" : "bg-white/[0.02] opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono text-gray-500 w-6 text-center">
                  #{index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    {meta.title}
                    {section.key === "hero" && (
                      <Sparkles size={13} className="text-violet-400" />
                    )}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">{meta.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Reorder Buttons */}
                <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-white/5">
                  <button
                    type="button"
                    onClick={() => moveSection(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <div className="w-[1px] h-4 bg-white/10" />
                  <button
                    type="button"
                    onClick={() => moveSection(index, "down")}
                    disabled={index === sections.length - 1}
                    className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                {/* Enable/Disable Toggle */}
                <button
                  type="button"
                  onClick={() => toggleSection(index)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                    section.enabled
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {section.enabled ? (
                    <>
                      <Eye size={13} /> Active
                    </>
                  ) : (
                    <>
                      <EyeOff size={13} /> Hidden
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
