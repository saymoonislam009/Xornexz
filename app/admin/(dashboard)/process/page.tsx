"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Loader2, X, HelpCircle } from "lucide-react";

interface ProcessStep {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export default function AdminProcessPage() {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProcessStep | null>(null);
  const [formData, setFormData] = useState({
    icon: "Code2",
    title: "",
    description: "",
    order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSteps = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/process");
      if (!res.ok) throw new Error("Failed to load process steps");
      const data = await res.json();
      setSteps(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      icon: "Code2",
      title: "",
      description: "",
      order: steps.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: ProcessStep) => {
    setEditingItem(item);
    setFormData({
      icon: item.icon,
      title: item.title,
      description: item.description,
      order: item.order,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingItem ? `/api/admin/process/${editingItem.id}` : "/api/admin/process";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save process step");
      setIsModalOpen(false);
      await fetchSteps();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this process step?")) return;
    try {
      const res = await fetch(`/api/admin/process/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete process step");
      await fetchSteps();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Process Steps</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage process steps displayed on the Process page
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
        >
          <Plus className="h-4 w-4" /> Add Step
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
      ) : steps.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/5">
          <HelpCircle className="mx-auto h-8 w-8 text-gray-500 mb-3" />
          <p className="text-gray-400 text-sm">No process steps found.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white text-sm hover:bg-white/10 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add First Step
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="p-5 rounded-2xl bg-[#0E1018] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-semibold uppercase tracking-wider">
                    Order: {step.order}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 text-[10px] font-semibold">
                    Icon: {step.icon}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                  {step.description}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 self-end md:self-start">
                <button
                  onClick={() => openEditModal(step)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(step.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#0E1018] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editingItem ? "Edit Process Step" : "Add New Process Step"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Discovery & Strategy"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide a description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Icon (Lucide name)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Search, PenTool, Code2"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
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
                  {editingItem ? "Update Step" : "Add Step"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
