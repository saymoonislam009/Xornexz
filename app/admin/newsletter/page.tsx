"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Download, Users } from "lucide-react";
import StatusBadge from "@/components/admin/ui/StatusBadge";

interface Subscriber {
  id: string;
  email: string;
  name?: string | null;
  isActive: boolean;
  source?: string | null;
  subscribedAt: string;
}

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/newsletter");
      const data = await res.json();
      if (Array.isArray(data)) setSubscribers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const deleteSub = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      await fetch(`/api/admin/newsletter?id=${id}`, { method: "DELETE" });
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    const headers = "Email,Name,Active,SubscribedAt\n";
    const rows = subscribers
      .map((s) => `"${s.email}","${s.name || ""}","${s.isActive}","${s.subscribedAt}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Newsletter Subscribers</h1>
          <p className="text-gray-400 text-sm mt-1">
            Audience subscribed to technical insights and company announcements.
          </p>
        </div>
        <button
          onClick={exportCSV}
          disabled={subscribers.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-40"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="bg-[#0B0D14] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-gray-400 font-medium border-b border-white/10">
              <tr>
                <th className="px-6 py-3.5">Subscriber</th>
                <th className="px-6 py-3.5">Source</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Subscribed Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/90">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-white">{sub.email}</div>
                    {sub.name && <div className="text-xs text-gray-500">{sub.name}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-xs">
                    {sub.source || "Website Footer"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      status={sub.isActive ? "Subscribed" : "Unsubscribed"}
                      type={sub.isActive ? "success" : "default"}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                    {new Date(sub.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => deleteSub(sub.id)}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Users size={24} className="text-gray-600 mb-2" />
                      <p>No newsletter subscribers yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
