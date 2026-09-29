"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Loader2, X, Briefcase, MapPin, Users } from "lucide-react";

interface Job {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  description: string;
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  status: "OPEN" | "CLOSED" | "DRAFT";
  featured: boolean;
  order: number;
  _count?: {
    applications: number;
  };
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "USD",
    description: "",
    requirementsInput: "",
    niceToHaveInput: "",
    benefitsInput: "",
    status: "OPEN" as "OPEN" | "CLOSED" | "DRAFT",
    featured: false,
    order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/jobs");
      if (!res.ok) throw new Error("Failed to load jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      slug: "",
      title: "",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salaryMin: "",
      salaryMax: "",
      salaryCurrency: "USD",
      description: "",
      requirementsInput: "",
      niceToHaveInput: "",
      benefitsInput: "",
      status: "OPEN",
      featured: false,
      order: jobs.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Job) => {
    setEditingItem(item);
    setFormData({
      slug: item.slug,
      title: item.title,
      department: item.department,
      location: item.location,
      type: item.type,
      salaryMin: item.salaryMin ? item.salaryMin.toString() : "",
      salaryMax: item.salaryMax ? item.salaryMax.toString() : "",
      salaryCurrency: item.salaryCurrency || "USD",
      description: item.description,
      requirementsInput: Array.isArray(item.requirements) ? item.requirements.join("\n") : "",
      niceToHaveInput: Array.isArray(item.niceToHave) ? item.niceToHave.join("\n") : "",
      benefitsInput: Array.isArray(item.benefits) ? item.benefits.join("\n") : "",
      status: item.status,
      featured: item.featured,
      order: item.order,
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingItem ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const requirements = formData.requirementsInput
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean);
      const niceToHave = formData.niceToHaveInput
        .split("\n")
        .map((n) => n.trim())
        .filter(Boolean);
      const benefits = formData.benefitsInput
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean);

      const payload = {
        slug: formData.slug,
        title: formData.title,
        department: formData.department,
        location: formData.location,
        type: formData.type,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        salaryCurrency: formData.salaryCurrency,
        description: formData.description,
        requirements,
        niceToHave,
        benefits,
        status: formData.status,
        featured: formData.featured,
        order: formData.order,
      };

      const url = editingItem ? `/api/admin/jobs/${editingItem.id}` : "/api/admin/jobs";
      const method = editingItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save job position");
      setIsModalOpen(false);
      await fetchJobs();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job position?")) return;
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete job");
      await fetchJobs();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Careers & Job Openings</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage open positions displayed on the Careers page and view candidates
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
        >
          <Plus className="h-4 w-4" /> Add Opening
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
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/5">
          <Briefcase className="mx-auto h-8 w-8 text-gray-500 mb-3" />
          <p className="text-gray-400 text-sm">No career openings registered yet.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white text-sm hover:bg-white/10 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add First Opening
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-2xl bg-[#0E1018] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-white">{job.title}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      job.status === "OPEN"
                        ? "bg-green-500/20 text-green-300"
                        : job.status === "DRAFT"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {job.status}
                  </span>
                  {job.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-medium">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span className="text-violet-400 font-medium">{job.department}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </span>
                  <span>&bull;</span>
                  <span>{job.type}</span>
                  {(job.salaryMin || job.salaryMax) && (
                    <>
                      <span>&bull;</span>
                      <span className="text-gray-300 font-medium">
                        {job.salaryCurrency} {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-gray-400 line-clamp-1 max-w-2xl">{job.description}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <Users className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{job._count?.applications ?? 0} applicants</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(job)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
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
          <div className="w-full max-w-2xl rounded-2xl bg-[#0E1018] border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editingItem ? "Edit Job Position" : "Create Job Position"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="senior-frontend-engineer"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Engineering, Design, Product"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Remote, New York, etc."
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0E1018] px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Salary Min
                  </label>
                  <input
                    type="number"
                    placeholder="120000"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Salary Max
                  </label>
                  <input
                    type="number"
                    placeholder="160000"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={formData.salaryCurrency}
                    onChange={(e) => setFormData({ ...formData, salaryCurrency: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Job Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Overview of the position, mission, and day-to-day responsibilities..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Requirements (One per line)
                  </label>
                  <textarea
                    rows={4}
                    placeholder={"5+ years React / Next.js\nStrong TypeScript skills\nDistributed systems experience"}
                    value={formData.requirementsInput}
                    onChange={(e) => setFormData({ ...formData, requirementsInput: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 resize-none font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Nice to Have (One per line)
                  </label>
                  <textarea
                    rows={4}
                    placeholder={"GraphQL / Apollo\nAWS CDK / Terraform\nOpen-source contributions"}
                    value={formData.niceToHaveInput}
                    onChange={(e) => setFormData({ ...formData, niceToHaveInput: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 resize-none font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "OPEN" | "CLOSED" | "DRAFT" })}
                    className="w-full rounded-xl border border-white/10 bg-[#0E1018] px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="OPEN">OPEN (Published)</option>
                    <option value="DRAFT">DRAFT (Internal)</option>
                    <option value="CLOSED">CLOSED (Archived)</option>
                  </select>
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

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500"
                  />
                  Featured Job Opening
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
                  {editingItem ? "Update Job" : "Publish Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
