"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging (visible in Vercel function logs)
    console.error("[App Error Boundary]", _error);
  }, [_error]);


  return (
    <div className="min-h-screen bg-[#05060A] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <span className="text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            Oops
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Something went wrong
        </h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          A client-side error occurred. This has been logged automatically.
          {_error.digest && (
            <span className="block mt-2 text-xs text-gray-600 font-mono">
              Error ID: {_error.digest}
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3 text-sm font-semibold text-white hover:from-violet-500 hover:to-cyan-400 transition-all"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
