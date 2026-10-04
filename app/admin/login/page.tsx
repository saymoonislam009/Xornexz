import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { getAdminSession } from "@/lib/admin-jwt";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    error?: string;
    reset?: string;
    callbackUrl?: string;
  }>;
}

export default async function AdminLoginPage({ searchParams }: Props) {
  // If user already has an active verified session, take them straight to dashboard
  const session = await getAdminSession();
  if (session?.id) {
    redirect("/admin/dashboard");
  }

  const params = await searchParams;
  const urlError = params.error ? decodeURIComponent(params.error) : null;
  const resetSuccess = params.reset === "success";
  const callbackUrl = params.callbackUrl && params.callbackUrl !== "/admin/login" 
    ? params.callbackUrl 
    : "/admin/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05060A] px-4 py-12 text-white">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_30px_rgba(124,58,237,0.4)]">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage your Xornexz platform
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0E1018] p-8 shadow-2xl">
          {resetSuccess && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-950/30 p-4 text-sm text-green-300">
              <ShieldCheck className="h-5 w-5 shrink-0 text-green-400" />
              <span>Password reset successfully. Please sign in.</span>
            </div>
          )}

          {urlError && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <span>{urlError}</span>
            </div>
          )}

          {/*
            Reliable HTML form with type="text" for identifier.
            Accepts email OR username so autofill and manual typing both work.
            Submits natively to /api/admin-auth/login which redirects to dashboard with 303.
          */}
          <form
            id="loginForm"
            method="POST"
            action="/api/admin-auth/login"
            className="space-y-5"
          >
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
              >
                Email Address or Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  id="identifier"
                  type="text"
                  name="identifier"
                  required
                  placeholder="admin@xornexz.com or username"
                  autoComplete="username email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
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
              id="submitBtn"
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-violet-500 hover:to-cyan-400 hover:shadow-[0_0_25px_rgba(124,58,237,0.35)] active:scale-[0.99]"
            >
              <span id="btnText">Sign In</span>
              <ArrowRight id="btnIcon" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Client-side immediate visual feedback so user sees the click registered */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  var form = document.getElementById('loginForm');
                  var btn = document.getElementById('submitBtn');
                  var text = document.getElementById('btnText');
                  var icon = document.getElementById('btnIcon');
                  if (form && btn && text) {
                    form.addEventListener('submit', function() {
                      btn.disabled = true;
                      btn.style.opacity = '0.75';
                      btn.style.cursor = 'wait';
                      text.textContent = 'Signing in...';
                      if (icon) icon.style.display = 'none';
                    });
                  }
                })();
              `,
            }}
          />
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          Xornexz Enterprise Administration &bull; Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
