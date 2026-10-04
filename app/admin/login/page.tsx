"use client";

import { Suspense, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  const resetSuccess = searchParams.get("reset") === "success";
  const [isLoading, setIsLoading] = useState(false);

  // Show loading state on submit, but let the native form POST handle everything.
  // This avoids ALL client-side navigation, cookie timing, and autofill issues.
  const handleSubmit = () => {
    setIsLoading(true);
    // Do NOT call e.preventDefault() — let the browser POST natively to
    // /api/admin-auth/login, which responds with 303 + Set-Cookie.
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05060A] px-4 py-12 text-white">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_30px_rgba(124,58,237,0.4)]">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage your Xornexz platform</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0E1018] p-8 shadow-2xl">
          {resetSuccess && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-950/30 p-4 text-sm text-green-300">
              <ShieldCheck className="h-5 w-5 shrink-0 text-green-400" />
              <span>Password reset successfully. Please sign in with your new password.</span>
            </div>
          )}

          {urlError && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <span>{decodeURIComponent(urlError)}</span>
            </div>
          )}

          {/*
            Native HTML form POST — no JavaScript fetch, no client-side navigation.
            The server responds with Set-Cookie + 303 redirect to dashboard.
            This works in every browser including Safari, with any autofill manager.
          */}
          <form
            method="POST"
            action="/api/admin-auth/login"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Pass callbackUrl and gate key so they survive the redirect */}
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="admin@xornexz.com"
                  autoComplete="username email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <Link
                  href="/admin/login/forgot-password"
                  className="text-xs text-violet-400 hover:text-cyan-400 transition-colors"
                  tabIndex={-1}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-violet-500 hover:to-cyan-400 hover:shadow-[0_0_25px_rgba(124,58,237,0.35)] disabled:opacity-70 disabled:cursor-wait"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          Xornexz Enterprise Administration &bull; Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#05060A]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
