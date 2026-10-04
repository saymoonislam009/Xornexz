"use client";

import { useState, useEffect, useCallback } from "react";
import { Calculator, Trash2, CheckCircle2, Clock, DollarSign, Tag } from "lucide-react";

interface Estimate {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  projectType: string;
  features: string[];
  timeline: string;
  budget: string;
  description?: string | null;
  estimateMin?: number | null;
  estimateMax?: number | null;
  convertedToLead: boolean;
  createdAt: string;
}

function fmt(n?: number | null) {
  if (n == null) return "—";
  return "$" + n.toLocaleString();
}

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Estimate | null>(null);

  const fetchEstimates = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/estimates");
      const data = await res.json();
      if (Array.isArray(data)) setEstimates(data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchEstimates(); }, [fetchEstimates]);

  const toggleConverted = async (e: Estimate) => {
    try {
      await fetch("/api/admin/estimates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: e.id, convertedToLead: !e.convertedToLead }),
      });
      setEstimates((prev) =>
        prev.map((x) => x.id === e.id ? { ...x, convertedToLead: !x.convertedToLead } : x)
      );
      if (selected?.id === e.id) setSelected({ ...selected, convertedToLead: !selected.convertedToLead });
    } catch {}
  };

  const deleteEstimate = async (id: string) => {
    if (!confirm("Delete this estimate request?")) return;
    try {
      await fetch(`/api/admin/estimates?id=${id}`, { method: "DELETE" });
      setEstimates((prev) => prev.filter((x) => x.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Project Estimates</h1>
        <p className="text-gray-400 text-sm mt-1">
          Estimate requests submitted via the public estimator tool. Each row is a potential lead.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* List */}
        <div className="flex-1 w-full bg-[#0B0D14] border border-white/10 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading estimates...</div>
          ) : estimates.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Calculator className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p>No estimate requests yet.</p>
              <p className="text-xs mt-1">Requests from the public estimator page appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {estimates.map((e) => (
                <div
                  key={e.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-white/5 ${selected?.id === e.id ? "bg-violet-900/20 border-l-2 border-violet-500" : ""}`}
                  onClick={() => setSelected(e)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{e.name}</p>
                      <p className="text-xs text-slate-400 truncate">{e.email}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-900/40 px-2 py-0.5 text-xs text-violet-300">
                          <Tag className="h-3 w-3" />{e.projectType}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                          <DollarSign className="h-3 w-3" />{e.budget}
                        </span>
                        {e.convertedToLead && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-900/40 px-2 py-0.5 text-xs text-green-400">
                            <CheckCircle2 className="h-3 w-3" />Converted
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-500">
                        {fmt(e.estimateMin)} – {fmt(e.estimateMax)}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-full lg:w-80 bg-[#0B0D14] border border-white/10 rounded-xl p-5 space-y-4 sticky top-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">{selected.name}</h2>
                <a href={`mailto:${selected.email}`} className="text-xs text-violet-400 hover:underline">{selected.email}</a>
              </div>
              <button
                onClick={() => deleteEstimate(selected.id)}
                className="text-slate-500 hover:text-red-400 transition-colors p-1"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              {selected.company && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Company</span>
                  <span className="text-white">{selected.company}</span>
                </div>
              )}
              {selected.phone && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone</span>
                  <span className="text-white">{selected.phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Project Type</span>
                <span className="text-white capitalize">{selected.projectType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Budget</span>
                <span className="text-white">{selected.budget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timeline</span>
                <span className="text-white">{selected.timeline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimate</span>
                <span className="text-cyan-400 font-semibold">
                  {fmt(selected.estimateMin)} – {fmt(selected.estimateMax)}
                </span>
              </div>
            </div>

            {selected.features.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Features Requested</p>
                <div className="flex flex-wrap gap-1">
                  {selected.features.map((f) => (
                    <span key={f} className="text-xs bg-white/5 border border-white/10 rounded px-2 py-0.5 text-slate-300">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {selected.description && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{selected.description}</p>
              </div>
            )}

            <button
              onClick={() => toggleConverted(selected)}
              className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                selected.convertedToLead
                  ? "bg-green-900/40 text-green-400 border border-green-500/30 hover:bg-green-900/60"
                  : "bg-violet-900/40 text-violet-300 border border-violet-500/30 hover:bg-violet-900/60"
              }`}
            >
              {selected.convertedToLead ? "Mark as Not Converted" : "Mark as Converted to Lead"}
            </button>

            <p className="text-xs text-slate-600 text-center">
              Received {new Date(selected.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
