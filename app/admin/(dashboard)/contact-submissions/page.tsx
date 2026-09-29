"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, Trash2, CheckCircle2, Clock, Building, DollarSign } from "lucide-react";
import StatusBadge from "@/components/admin/ui/StatusBadge";

interface Submission {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  subject: string;
  message: string;
  budget?: string | null;
  read: boolean;
  createdAt: string;
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/contact-submissions");
      const data = await res.json();
      if (Array.isArray(data)) setSubmissions(data);
    } catch (err) {
      console.error("Failed to load contact submissions", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const toggleRead = async (sub: Submission) => {
    try {
      await fetch("/api/admin/contact-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sub.id, read: !sub.read }),
      });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, read: !s.read } : s))
      );
      if (selectedSub?.id === sub.id) {
        setSelectedSub({ ...selectedSub, read: !selectedSub.read });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    try {
      await fetch(`/api/admin/contact-submissions?id=${id}`, { method: "DELETE" });
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (selectedSub?.id === id) setSelectedSub(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Contact Submissions</h1>
        <p className="text-gray-400 text-sm mt-1">
          Inbound messages and consultation requests submitted via public contact forms.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* List Table */}
        <div className="flex-1 w-full bg-[#0B0D14] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-gray-400 font-medium border-b border-white/10">
                <tr>
                  <th className="px-5 py-3.5">Sender</th>
                  <th className="px-5 py-3.5">Subject</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/90">
                {submissions.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedSub(item)}
                    className={`hover:bg-white/5 cursor-pointer transition-colors ${
                      selectedSub?.id === item.id ? "bg-white/5" : ""
                    } ${!item.read ? "font-semibold" : "opacity-80"}`}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-white font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.email}</div>
                    </td>
                    <td className="px-5 py-4 max-w-xs truncate text-gray-300">
                      {item.subject}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge
                        status={item.read ? "Read" : "Unread"}
                        type={item.read ? "default" : "info"}
                      />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSubmission(item.id);
                        }}
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {submissions.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                      No contact submissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Submission Drawer */}
        {selectedSub && (
          <div className="w-full lg:w-96 bg-[#0B0D14] border border-white/10 rounded-xl p-6 space-y-5 flex-shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Message Detail
              </span>
              <button
                onClick={() => toggleRead(selectedSub)}
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                <CheckCircle2 size={13} />
                {selectedSub.read ? "Mark Unread" : "Mark Read"}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-500 block font-semibold text-[10px] uppercase">From</span>
                <p className="text-sm font-medium text-white mt-0.5">{selectedSub.name}</p>
                <a
                  href={`mailto:${selectedSub.email}`}
                  className="text-violet-400 hover:underline text-xs"
                >
                  {selectedSub.email}
                </a>
              </div>

              {selectedSub.company && (
                <div>
                  <span className="text-gray-500 block font-semibold text-[10px] uppercase flex items-center gap-1">
                    <Building size={11} /> Company
                  </span>
                  <p className="text-white font-medium mt-0.5">{selectedSub.company}</p>
                </div>
              )}

              {selectedSub.budget && (
                <div>
                  <span className="text-gray-500 block font-semibold text-[10px] uppercase flex items-center gap-1">
                    <DollarSign size={11} /> Estimated Budget
                  </span>
                  <p className="text-emerald-400 font-medium mt-0.5">{selectedSub.budget}</p>
                </div>
              )}

              <div>
                <span className="text-gray-500 block font-semibold text-[10px] uppercase flex items-center gap-1">
                  <Clock size={11} /> Received
                </span>
                <p className="text-gray-300 mt-0.5">
                  {new Date(selectedSub.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5">
                <span className="text-gray-500 block font-semibold text-[10px] uppercase mb-1">
                  Subject & Message
                </span>
                <p className="text-sm font-semibold text-white mb-2">{selectedSub.subject}</p>
                <div className="p-3 bg-[#0E1018] rounded-lg border border-white/5 text-gray-300 leading-relaxed whitespace-pre-wrap text-xs">
                  {selectedSub.message}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`mailto:${selectedSub.email}?subject=Re: ${encodeURIComponent(selectedSub.subject)}`}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-xs font-medium text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/20"
              >
                <Mail size={14} /> Reply via Email
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
