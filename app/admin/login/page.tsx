"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { adminLoginAction } from "./actions";

function LoginForm() {
  const [state, formAction, isPending] = useActionState(adminLoginAction, null);
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";

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
        <div className="rounded-2xl border border-white/10 bg-[#0E1018] p-8 shadow-2xl backdrop-blur-xl">
          {resetSuccess && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-950/30 p-4 text-sm text-green-300">
              <ShieldCheck className="h-5 w-5 shrink-0 text-green-400" />
              <span>Password reset successfully. Please log in with your new password.</span>
            </div>
          )}

          {state?.error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-300">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@xornexz.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <Link
                  href="/admin/login/forgot-password"
                  className="text-xs text-violet-400 hover:text-cyan-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
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
              disabled={isPending}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-violet-500 hover:to-cyan-400 hover:shadow-[0_0_25px_rgba(124,58,237,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
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
