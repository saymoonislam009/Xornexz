"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Loader2, X, Check, CreditCard, Sparkles } from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string | null;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlighted: boolean;
  order: number;
}

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PricingPlan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    price: "",
    period: "per project",
    featuresInput: "",
    ctaLabel: "Get Started",
    ctaHref: "/contact",
    highlighted: false,
    order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/pricing");
      if (!res.ok) throw new Error("Failed to load pricing plans");
      const data = await res.json();
      setPlans(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      tagline: "",
      price: "",
      period: "per project",
      featuresInput: "",
      ctaLabel: "Get Started",
      ctaHref: "/contact",
      highlighted: false,
      order: plans.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: PricingPlan) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      tagline: item.tagline,
      price: item.price,
      period: item.period || "",
      featuresInput: Array.isArray(item.features) ? item.features.join("\n") : "",
      ctaLabel: item.ctaLabel,
      ctaHref: item.ctaHref,
      highlighted: item.highlighted,
      order: item.order,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const features = formData.featuresInput
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        tagline: formData.tagline,
        price: formData.price,
        period: formData.period || null,
        features,
        ctaLabel: formData.ctaLabel,
        ctaHref: formData.ctaHref,
        highlighted: formData.highlighted,
        order: formData.order,
      };

      const url = editingItem ? `/api/admin/pricing/${editingItem.id}` : "/api/admin/pricing";
      const method = editingItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save pricing plan");
      setIsModalOpen(false);
      await fetchPlans();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pricing plan?")) return;
    try {
      const res = await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete pricing plan");
      await fetchPlans();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Pricing Plans</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your service packages, retainers, and enterprise pricing options
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
        >
          <Plus className="h-4 w-4" /> Add Plan
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      ) : plans.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/5">
          <CreditCard className="mx-auto h-8 w-8 text-gray-500 mb-3" />
          <p className="text-gray-400 text-sm">No pricing plans configured yet.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white text-sm hover:bg-white/10 transition-colors"
          >
            <Plus className="h-4 w-4" /> Create First Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col justify-between p-6 rounded-2xl bg-[#0E1018] border transition-all ${
                p.highlighted
                  ? "border-violet-500/50 shadow-[0_0_30px_rgba(124,58,237,0.15)] ring-1 ring-violet-500/30"
                  : "border-white/5 hover:border-white/10"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">{p.name}</h3>
                  {p.highlighted && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-600/30 border border-violet-500/40 text-violet-300 text-[10px] font-semibold uppercase tracking-wider">
                      <Sparkles className="h-3 w-3" /> Popular
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-400 mb-6">{p.tagline}</p>

                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-white/5">
                  <span className="text-3xl font-extrabold text-white">{p.price}</span>
                  {p.period && <span className="text-xs text-gray-400">/ {p.period}</span>}
                </div>

                {Array.isArray(p.features) && p.features.length > 0 && (
                  <ul className="space-y-2.5 mb-6">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <Check className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-gray-500">Order: {p.order}</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#0E1018] border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editingItem ? "Edit Pricing Plan" : "Create Pricing Plan"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Growth, Enterprise"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Price *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $8,500 or Custom"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Billing Period
                  </label>
                  <input
                    type="text"
                    placeholder="per project, monthly, etc."
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Tagline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ideal for funded startups building their core MVP"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Features List (One per line)
                </label>
                <textarea
                  rows={5}
                  placeholder={"Full Next.js App Architecture\nStripe / LemonSqueezy Integration\nHigh-Performance Database Setup\n30-Day Post-Launch Support"}
                  value={formData.featuresInput}
                  onChange={(e) => setFormData({ ...formData, featuresInput: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 resize-none font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.ctaLabel}
                    onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Button Target Link
                  </label>
                  <input
                    type="text"
                    value={formData.ctaHref}
                    onChange={(e) => setFormData({ ...formData, ctaHref: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.highlighted}
                    onChange={(e) => setFormData({ ...formData, highlighted: e.target.checked })}
                    className="rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500"
                  />
                  Highlight as "Popular / Recommended"
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingItem ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
