"use client";

import { useState } from "react";
import { ChevronRight, Loader2, CheckCircle2 } from "lucide-react";

export function NewsletterCTA({
  heading = "Never Miss an Update",
  subtext = "Join our newsletter to get the latest articles, architecture guides, and industry insights delivered straight to your inbox.",
}: {
  heading?: string;
  subtext?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-gradient-to-r dark:from-violet-900/40 dark:to-cyan-900/40 border border-slate-200 dark:border-white/10 p-8 md:p-12 text-center shadow-lg dark:shadow-none">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-display">
          {heading}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto text-sm sm:text-base">
          {subtext}
        </p>

        {status === "success" ? (
          <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Subscribed! You&apos;re on the list.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={status === "loading"}
              className="flex-grow bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/20 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
              required
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-gradient bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center whitespace-nowrap disabled:opacity-60"
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Subscribe <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-3">
            Could not subscribe right now. Please try again.
          </p>
        )}
        <p className="text-xs text-slate-500 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
