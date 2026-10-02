"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#0E1018] border border-white/10 text-center shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-400">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-xl font-bold font-display mb-2">Admin Dashboard Error</h2>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          {error.message || "An unexpected error occurred while loading this administrative view."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all"
          >
            <RefreshCw size={14} /> Retry
          </button>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all"
          >
            <Home size={14} /> Dashboard Home
          </Link>
        </div>
      </div>
    </div>
  );
}
