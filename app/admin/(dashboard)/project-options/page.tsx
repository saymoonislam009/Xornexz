"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Loader2,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sliders,
  Calculator,
  Sparkles,
  Calendar,
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import type { SiteConfig } from "@/lib/site-config";
import { DEFAULT_SITE_CONFIG } from "@/lib/site-config";

function StringListEditor({
  title,
  subtitle,
  items,
  placeholder,
  onChange,
}: {
  title: string;
  subtitle: string;
  items: string[];
  placeholder: string;
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft("");
  };

  const updateItem = (idx: number, val: string) => {
    const next = [...items];
    next[idx] = val;
    onChange(next);
  };

  const removeItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const tmp = next[idx];
    next[idx] = next[target];
    next[target] = tmp;
    onChange(next);
  };

  return (
    <div className="p-5 rounded-xl bg-[#0E1018] border border-white/10 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(idx, e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-white/10 bg-[#05060A] text-white text-sm focus:outline-none focus:border-violet-500"
            />
            <button
              type="button"
              onClick={() => moveItem(idx, -1)}
              disabled={idx === 0}
              className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white disabled:opacity-30"
              title="Move up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => moveItem(idx, 1)}
              disabled={idx === items.length - 1}
              className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white disabled:opacity-30"
              title="Move down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-gray-500 italic py-2">No options configured yet. Add one below.</p>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-lg border border-white/10 bg-[#05060A] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-violet-600 text-white text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
    </div>
  );
}

export default function ProjectOptionsAdminPage() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/project-options")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.projectForm) {
          setConfig(data);
        }
      })
      .catch((err) => console.error("Failed to load project options:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/project-options", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectForm: config.projectForm,
          estimator: config.estimator,
          hero: config.hero,
          mainStats: config.mainStats,
          availability: config.availability,
          cta: config.cta,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save changes");
      }
      const updated = await res.json();
      if (updated?.projectForm) setConfig(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-400 text-sm">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-violet-400" />
        Loading customizable options & site copy...
      </div>
    );
  }

  const pf = config.projectForm;
  const est = config.estimator;

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Start a Project, Price Ranges & Site Copy
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Add, edit, reorder, or delete project services, optional requirements, budget price ranges, estimator formulas, and landing page copy.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all disabled:opacity-50 shrink-0"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4 text-emerald-200" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Publishing..." : saved ? "Published Live!" : "Save All Changes"}
        </button>
      </div>

      <Tabs.Root defaultValue="project-form" className="space-y-6">
        <Tabs.List className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-[#0B0D14] border border-white/10">
          <Tabs.Trigger
            value="project-form"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all"
          >
            <Sliders className="w-3.5 h-3.5" /> Start a Project Form & Price Ranges
          </Tabs.Trigger>
          <Tabs.Trigger
            value="estimator"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all"
          >
            <Calculator className="w-3.5 h-3.5" /> Interactive Estimator & Pricing
          </Tabs.Trigger>
          <Tabs.Trigger
            value="hero-stats"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Hero Text & Key Stats
          </Tabs.Trigger>
          <Tabs.Trigger
            value="availability-cta"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all"
          >
            <Calendar className="w-3.5 h-3.5" /> Availability Slots & Bottom CTA
          </Tabs.Trigger>
        </Tabs.List>

        {/* ── TAB 1: START A PROJECT FORM ─────────────────────────────────── */}
        <Tabs.Content value="project-form" className="space-y-6 focus:outline-none">
          <div className="p-5 rounded-xl bg-[#0B0D14] border border-white/10 space-y-4">
            <h2 className="text-base font-semibold text-white">Page Header & Prompts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Status Badge</label>
                <input
                  type="text"
                  value={pf.badgeText}
                  onChange={(e) =>
                    setConfig({ ...config, projectForm: { ...pf, badgeText: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Response Time Promise
                </label>
                <input
                  type="text"
                  value={pf.responseTime}
                  onChange={(e) =>
                    setConfig({ ...config, projectForm: { ...pf, responseTime: e.target.value } })
                  }
                  placeholder="24 hours"
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Main Heading</label>
              <input
                type="text"
                value={pf.heading}
                onChange={(e) =>
                  setConfig({ ...config, projectForm: { ...pf, heading: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Subheading</label>
              <textarea
                rows={2}
                value={pf.subheading}
                onChange={(e) =>
                  setConfig({ ...config, projectForm: { ...pf, subheading: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Project Brief Placeholder Text
              </label>
              <textarea
                rows={2}
                value={pf.messagePlaceholder}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    projectForm: { ...pf, messagePlaceholder: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StringListEditor
              title="Services / What Client Wants to Build"
              subtitle="Selectable project types shown when a client clicks Start a Project."
              items={pf.services}
              placeholder="e.g. AI Agent & Workflow Automation"
              onChange={(services) =>
                setConfig({ ...config, projectForm: { ...pf, services } })
              }
            />

            <StringListEditor
              title="Budget / Price Ranges"
              subtitle="Price brackets clients can choose from on the Start a Project form."
              items={pf.budgets}
              placeholder="e.g. $25k – $50k"
              onChange={(budgets) =>
                setConfig({ ...config, projectForm: { ...pf, budgets } })
              }
            />

            <StringListEditor
              title="Target Timelines"
              subtitle="Delivery speed options shown in Step 2."
              items={pf.timelines}
              placeholder="e.g. 2 – 4 months"
              onChange={(timelines) =>
                setConfig({ ...config, projectForm: { ...pf, timelines } })
              }
            />

            <StringListEditor
              title="Optional Project Requirements / Add-ons"
              subtitle="Optional checklist tags clients can toggle (NDA, UI/UX, CMS, AI, etc.)."
              items={pf.requirements}
              placeholder="e.g. Dedicated DevOps & SLA"
              onChange={(requirements) =>
                setConfig({ ...config, projectForm: { ...pf, requirements } })
              }
            />
          </div>
        </Tabs.Content>

        {/* ── TAB 2: ESTIMATOR OPTIONS & PRICING ──────────────────────────── */}
        <Tabs.Content value="estimator" className="space-y-6 focus:outline-none">
          <div className="p-5 rounded-xl bg-[#0B0D14] border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Estimator Heading</label>
              <input
                type="text"
                value={est.heading}
                onChange={(e) =>
                  setConfig({ ...config, estimator: { ...est, heading: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Estimator Subheading
              </label>
              <input
                type="text"
                value={est.subheading}
                onChange={(e) =>
                  setConfig({ ...config, estimator: { ...est, subheading: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
              />
            </div>
          </div>

          {/* Project Types + Base Prices */}
          <div className="p-5 rounded-xl bg-[#0B0D14] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Project Types & Base Prices ($)</h3>
                <p className="text-xs text-gray-400">
                  Step 1 cards and their starting base calculation price.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    estimator: {
                      ...est,
                      projectTypes: [
                        ...est.projectTypes,
                        {
                          id: `type-${Date.now()}`,
                          title: "New Project Type",
                          icon: "🚀",
                          desc: "Short description",
                          basePrice: 5000,
                        },
                      ],
                    },
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-violet-600 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Type
              </button>
            </div>
            <div className="space-y-3">
              {est.projectTypes.map((t, idx) => (
                <div
                  key={t.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 rounded-lg bg-[#0E1018] border border-white/5 items-center"
                >
                  <input
                    type="text"
                    value={t.icon}
                    onChange={(e) => {
                      const next = [...est.projectTypes];
                      next[idx] = { ...t, icon: e.target.value };
                      setConfig({ ...config, estimator: { ...est, projectTypes: next } });
                    }}
                    className="sm:col-span-1 px-2 py-1.5 rounded border border-white/10 bg-[#05060A] text-center text-white text-sm"
                    title="Emoji / Icon"
                  />
                  <input
                    type="text"
                    value={t.title}
                    onChange={(e) => {
                      const next = [...est.projectTypes];
                      next[idx] = { ...t, title: e.target.value };
                      setConfig({ ...config, estimator: { ...est, projectTypes: next } });
                    }}
                    placeholder="Title"
                    className="sm:col-span-3 px-3 py-1.5 rounded border border-white/10 bg-[#05060A] text-white text-sm"
                  />
                  <input
                    type="text"
                    value={t.desc}
                    onChange={(e) => {
                      const next = [...est.projectTypes];
                      next[idx] = { ...t, desc: e.target.value };
                      setConfig({ ...config, estimator: { ...est, projectTypes: next } });
                    }}
                    placeholder="Description"
                    className="sm:col-span-5 px-3 py-1.5 rounded border border-white/10 bg-[#05060A] text-white text-sm"
                  />
                  <div className="sm:col-span-2 flex items-center gap-1">
                    <span className="text-xs text-gray-400">$</span>
                    <input
                      type="number"
                      value={t.basePrice}
                      onChange={(e) => {
                        const next = [...est.projectTypes];
                        next[idx] = { ...t, basePrice: Number(e.target.value) || 0 };
                        setConfig({ ...config, estimator: { ...est, projectTypes: next } });
                      }}
                      className="w-full px-2 py-1.5 rounded border border-white/10 bg-[#05060A] text-white text-sm"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setConfig({
                          ...config,
                          estimator: {
                            ...est,
                            projectTypes: est.projectTypes.filter((_, i) => i !== idx),
                          },
                        })
                      }
                      className="p-1.5 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features + Add-on Prices */}
          <div className="p-5 rounded-xl bg-[#0B0D14] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Selectable Features & Add-On Prices ($)</h3>
                <p className="text-xs text-gray-400">
                  Step 2 feature modules and how much each adds to the calculated estimate.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    estimator: {
                      ...est,
                      features: [
                        ...est.features,
                        {
                          id: `feat-${Date.now()}`,
                          title: "New Feature",
                          desc: "Feature details",
                          price: 1000,
                        },
                      ],
                    },
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-violet-600 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Feature
              </button>
            </div>
            <div className="space-y-3">
              {est.features.map((f, idx) => (
                <div
                  key={f.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 rounded-lg bg-[#0E1018] border border-white/5 items-center"
                >
                  <input
                    type="text"
                    value={f.title}
                    onChange={(e) => {
                      const next = [...est.features];
                      next[idx] = { ...f, title: e.target.value };
                      setConfig({ ...config, estimator: { ...est, features: next } });
                    }}
                    placeholder="Feature name"
                    className="sm:col-span-4 px-3 py-1.5 rounded border border-white/10 bg-[#05060A] text-white text-sm"
                  />
                  <input
                    type="text"
                    value={f.desc}
                    onChange={(e) => {
                      const next = [...est.features];
                      next[idx] = { ...f, desc: e.target.value };
                      setConfig({ ...config, estimator: { ...est, features: next } });
                    }}
                    placeholder="Description"
                    className="sm:col-span-5 px-3 py-1.5 rounded border border-white/10 bg-[#05060A] text-white text-sm"
                  />
                  <div className="sm:col-span-2 flex items-center gap-1">
                    <span className="text-xs text-gray-400">+$</span>
                    <input
                      type="number"
                      value={f.price}
                      onChange={(e) => {
                        const next = [...est.features];
                        next[idx] = { ...f, price: Number(e.target.value) || 0 };
                        setConfig({ ...config, estimator: { ...est, features: next } });
                      }}
                      className="w-full px-2 py-1.5 rounded border border-white/10 bg-[#05060A] text-white text-sm"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setConfig({
                          ...config,
                          estimator: {
                            ...est,
                            features: est.features.filter((_, i) => i !== idx),
                          },
                        })
                      }
                      className="p-1.5 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timelines + Budget Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#0B0D14] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Timelines & Price Multipliers</h3>
                  <p className="text-xs text-gray-400">1.0 = normal, 1.35 = rush, 0.9 = flexible</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setConfig({
                      ...config,
                      estimator: {
                        ...est,
                        timelines: [
                          ...est.timelines,
                          { id: `time-${Date.now()}`, title: "Custom", desc: "2-4 months", multiplier: 1.0 },
                        ],
                      },
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-violet-600 text-white text-xs"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {est.timelines.map((t, idx) => (
                  <div key={t.id} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      value={t.title}
                      onChange={(e) => {
                        const next = [...est.timelines];
                        next[idx] = { ...t, title: e.target.value };
                        setConfig({ ...config, estimator: { ...est, timelines: next } });
                      }}
                      className="col-span-4 px-2.5 py-1.5 rounded border border-white/10 bg-[#0E1018] text-white text-xs"
                    />
                    <input
                      type="text"
                      value={t.desc}
                      onChange={(e) => {
                        const next = [...est.timelines];
                        next[idx] = { ...t, desc: e.target.value };
                        setConfig({ ...config, estimator: { ...est, timelines: next } });
                      }}
                      className="col-span-4 px-2.5 py-1.5 rounded border border-white/10 bg-[#0E1018] text-white text-xs"
                    />
                    <input
                      type="number"
                      step="0.05"
                      value={t.multiplier}
                      onChange={(e) => {
                        const next = [...est.timelines];
                        next[idx] = { ...t, multiplier: parseFloat(e.target.value) || 1 };
                        setConfig({ ...config, estimator: { ...est, timelines: next } });
                      }}
                      className="col-span-3 px-2 py-1.5 rounded border border-white/10 bg-[#0E1018] text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setConfig({
                          ...config,
                          estimator: {
                            ...est,
                            timelines: est.timelines.filter((_, i) => i !== idx),
                          },
                        })
                      }
                      className="col-span-1 text-gray-400 hover:text-red-400 flex justify-end"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0B0D14] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Estimator Budget Brackets</h3>
                  <p className="text-xs text-gray-400">Step 4 budget range cards</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setConfig({
                      ...config,
                      estimator: {
                        ...est,
                        budgets: [
                          ...est.budgets,
                          { id: `b-${Date.now()}`, title: "$20k – $40k", desc: "Growth tier" },
                        ],
                      },
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-violet-600 text-white text-xs"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {est.budgets.map((b, idx) => (
                  <div key={b.id} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      value={b.title}
                      onChange={(e) => {
                        const next = [...est.budgets];
                        next[idx] = { ...b, id: e.target.value, title: e.target.value };
                        setConfig({ ...config, estimator: { ...est, budgets: next } });
                      }}
                      className="col-span-5 px-2.5 py-1.5 rounded border border-white/10 bg-[#0E1018] text-white text-xs"
                    />
                    <input
                      type="text"
                      value={b.desc}
                      onChange={(e) => {
                        const next = [...est.budgets];
                        next[idx] = { ...b, desc: e.target.value };
                        setConfig({ ...config, estimator: { ...est, budgets: next } });
                      }}
                      className="col-span-6 px-2.5 py-1.5 rounded border border-white/10 bg-[#0E1018] text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setConfig({
                          ...config,
                          estimator: {
                            ...est,
                            budgets: est.budgets.filter((_, i) => i !== idx),
                          },
                        })
                      }
                      className="col-span-1 text-gray-400 hover:text-red-400 flex justify-end"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* ── TAB 3: HERO & STATS ─────────────────────────────────────────── */}
        <Tabs.Content value="hero-stats" className="space-y-6 focus:outline-none">
          <div className="p-5 rounded-xl bg-[#0B0D14] border border-white/10 space-y-4">
            <h2 className="text-base font-semibold text-white">Hero Section Copy</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Top Status Badge</label>
                <input
                  type="text"
                  value={config.hero.badgeText}
                  onChange={(e) =>
                    setConfig({ ...config, hero: { ...config.hero, badgeText: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Main Headline</label>
                <input
                  type="text"
                  value={config.hero.headline}
                  onChange={(e) =>
                    setConfig({ ...config, hero: { ...config.hero, headline: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Hero Subheadline</label>
              <textarea
                rows={2}
                value={config.hero.subheadline}
                onChange={(e) =>
                  setConfig({ ...config, hero: { ...config.hero, subheadline: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">CTA 1 Label</label>
                <input
                  type="text"
                  value={config.hero.cta1Label}
                  onChange={(e) =>
                    setConfig({ ...config, hero: { ...config.hero, cta1Label: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">CTA 1 Link</label>
                <input
                  type="text"
                  value={config.hero.cta1Href}
                  onChange={(e) =>
                    setConfig({ ...config, hero: { ...config.hero, cta1Href: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">CTA 2 Label</label>
                <input
                  type="text"
                  value={config.hero.cta2Label}
                  onChange={(e) =>
                    setConfig({ ...config, hero: { ...config.hero, cta2Label: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">CTA 2 Link</label>
                <input
                  type="text"
                  value={config.hero.cta2Href}
                  onChange={(e) =>
                    setConfig({ ...config, hero: { ...config.hero, cta2Href: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StringListEditor
              title="Hero Typewriter Rotating Words"
              subtitle="Animated phrases rotating under the main headline."
              items={config.hero.rotatingWords}
              placeholder="e.g. Enterprise Cloud Systems"
              onChange={(rotatingWords) =>
                setConfig({ ...config, hero: { ...config.hero, rotatingWords } })
              }
            />
            <StringListEditor
              title="Hero Tech Stack Pills"
              subtitle="Highlight badges displayed below the hero buttons."
              items={config.hero.techPills}
              placeholder="e.g. TypeScript / Go"
              onChange={(techPills) =>
                setConfig({ ...config, hero: { ...config.hero, techPills } })
              }
            />
          </div>

          <div className="p-5 rounded-xl bg-[#0B0D14] border border-white/10 space-y-4">
            <h3 className="text-sm font-semibold text-white">Homepage Animated Counter Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {config.mainStats.map((st, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#0E1018] border border-white/5 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={st.end}
                      onChange={(e) => {
                        const next = [...config.mainStats];
                        next[idx] = { ...st, end: Number(e.target.value) || 0 };
                        setConfig({ ...config, mainStats: next });
                      }}
                      className="w-2/3 px-2.5 py-1.5 rounded border border-white/10 bg-[#05060A] text-white text-sm"
                      placeholder="120"
                    />
                    <input
                      type="text"
                      value={st.suffix}
                      onChange={(e) => {
                        const next = [...config.mainStats];
                        next[idx] = { ...st, suffix: e.target.value };
                        setConfig({ ...config, mainStats: next });
                      }}
                      className="w-1/3 px-2.5 py-1.5 rounded border border-white/10 bg-[#05060A] text-white text-sm text-center"
                      placeholder="+"
                    />
                  </div>
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => {
                      const next = [...config.mainStats];
                      next[idx] = { ...st, label: e.target.value };
                      setConfig({ ...config, mainStats: next });
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-white/10 bg-[#05060A] text-white text-xs"
                    placeholder="Label"
                  />
                </div>
              ))}
            </div>
          </div>
        </Tabs.Content>

        {/* ── TAB 4: AVAILABILITY & BOTTOM CTA ────────────────────────────── */}
        <Tabs.Content value="availability-cta" className="space-y-6 focus:outline-none">
          <div className="p-5 rounded-xl bg-[#0B0D14] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Availability Banner & Slots</h2>
                <p className="text-xs text-gray-400">
                  Manage quarterly/monthly project slot capacity shown on the homepage.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    availability: {
                      ...config.availability,
                      slots: [
                        ...config.availability.slots,
                        { month: "Q3 2027", spots: 3, taken: 0 },
                      ],
                    },
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-violet-600 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Slot
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Status Pill</label>
                <input
                  type="text"
                  value={config.availability.statusText}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      availability: { ...config.availability, statusText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Banner Heading</label>
                <input
                  type="text"
                  value={config.availability.heading}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      availability: { ...config.availability, heading: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Banner Description</label>
              <input
                type="text"
                value={config.availability.subtext}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    availability: { ...config.availability, subtext: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
              />
            </div>

            <div className="space-y-2 pt-2">
              {config.availability.slots.map((slot, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-lg bg-[#0E1018] border border-white/5"
                >
                  <div className="col-span-5">
                    <label className="text-[10px] text-gray-500 uppercase block">Period</label>
                    <input
                      type="text"
                      value={slot.month}
                      onChange={(e) => {
                        const next = [...config.availability.slots];
                        next[idx] = { ...slot, month: e.target.value };
                        setConfig({
                          ...config,
                          availability: { ...config.availability, slots: next },
                        });
                      }}
                      className="w-full px-2.5 py-1 rounded border border-white/10 bg-[#05060A] text-white text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] text-gray-500 uppercase block">Total Spots</label>
                    <input
                      type="number"
                      min={1}
                      value={slot.spots}
                      onChange={(e) => {
                        const next = [...config.availability.slots];
                        next[idx] = { ...slot, spots: Number(e.target.value) || 1 };
                        setConfig({
                          ...config,
                          availability: { ...config.availability, slots: next },
                        });
                      }}
                      className="w-full px-2.5 py-1 rounded border border-white/10 bg-[#05060A] text-white text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] text-gray-500 uppercase block">Booked</label>
                    <input
                      type="number"
                      min={0}
                      value={slot.taken}
                      onChange={(e) => {
                        const next = [...config.availability.slots];
                        next[idx] = { ...slot, taken: Number(e.target.value) || 0 };
                        setConfig({
                          ...config,
                          availability: { ...config.availability, slots: next },
                        });
                      }}
                      className="w-full px-2.5 py-1 rounded border border-white/10 bg-[#05060A] text-white text-sm"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        setConfig({
                          ...config,
                          availability: {
                            ...config.availability,
                            slots: config.availability.slots.filter((_, i) => i !== idx),
                          },
                        })
                      }
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="p-5 rounded-xl bg-[#0B0D14] border border-white/10 space-y-4">
            <h2 className="text-base font-semibold text-white">Bottom Conversion CTA Section</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Badge Text</label>
                <input
                  type="text"
                  value={config.cta.badgeText}
                  onChange={(e) =>
                    setConfig({ ...config, cta: { ...config.cta, badgeText: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Heading</label>
                <input
                  type="text"
                  value={config.cta.heading}
                  onChange={(e) =>
                    setConfig({ ...config, cta: { ...config.cta, heading: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Subtext</label>
              <textarea
                rows={2}
                value={config.cta.subtext}
                onChange={(e) =>
                  setConfig({ ...config, cta: { ...config.cta, subtext: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Primary Label</label>
                <input
                  type="text"
                  value={config.cta.cta1Label}
                  onChange={(e) =>
                    setConfig({ ...config, cta: { ...config.cta, cta1Label: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Primary Link</label>
                <input
                  type="text"
                  value={config.cta.cta1Href}
                  onChange={(e) =>
                    setConfig({ ...config, cta: { ...config.cta, cta1Href: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Secondary Label</label>
                <input
                  type="text"
                  value={config.cta.cta2Label}
                  onChange={(e) =>
                    setConfig({ ...config, cta: { ...config.cta, cta2Label: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Secondary Link</label>
                <input
                  type="text"
                  value={config.cta.cta2Href}
                  onChange={(e) =>
                    setConfig({ ...config, cta: { ...config.cta, cta2Href: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#0E1018] text-white text-sm"
                />
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
