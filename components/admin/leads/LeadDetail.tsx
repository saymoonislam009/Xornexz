"use client";

import { useEffect, useState } from "react";
import { X, Building, Mail, Phone, Clock, FileText, Loader2, DollarSign } from "lucide-react";
import StatusBadge from "@/components/admin/ui/StatusBadge";

interface LeadDetailProps {
  leadId: string | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function LeadDetail({ leadId, onClose, onUpdate }: LeadDetailProps) {
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (leadId) {
      setLoading(true);
      fetch(`/api/admin/leads/${leadId}`)
        .then((res) => res.json())
        .then((data) => {
          setLead(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [leadId]);

  const updateStatus = async (status: string) => {
    if (!lead) return;
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLead({ ...lead, status });
    onUpdate();
  };

  if (!leadId) return null;

  const statuses = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#0B0D14] border-l border-white/10 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Lead Investigation</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading || !lead ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading profile...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Current Status
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => updateStatus(st)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                      lead.status === st
                        ? "bg-violet-600/20 border-violet-500 text-violet-300"
                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#0E1018] rounded-xl border border-white/5 space-y-3">
              <div>
                <h3 className="text-base font-semibold text-white">{lead.name}</h3>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-xs text-violet-400 hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  <Mail size={12} /> {lead.email}
                </a>
              </div>

              {lead.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Phone size={13} className="text-gray-500" />
                  <span>{lead.phone}</span>
                </div>
              )}

              {lead.company && (
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Building size={13} className="text-gray-500" />
                  <span>{lead.company}</span>
                </div>
              )}

              {lead.estimatedValue && (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <DollarSign size={13} />
                  <span>Est. Value: ${lead.estimatedValue.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                <Clock size={12} />
                <span>Captured {new Date(lead.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {lead.message && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Inquiry Message
                </span>
                <div className="p-4 bg-[#0E1018] rounded-xl border border-white/5 text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {lead.message}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10">
              <a
                href={`mailto:${lead.email}?subject=Follow up regarding your inquiry`}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-xs font-medium text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/20"
              >
                <Mail size={14} /> Send Email
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
