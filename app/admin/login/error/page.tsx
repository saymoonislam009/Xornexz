"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const errorMessages: Record<string, string> = {
  Configuration:
    "There is a problem with the server configuration. Please contact the administrator.",
  AccessDenied: "You do not have permission to access this resource.",
  Verification: "The sign-in link has expired or already been used.",
  CredentialsSignin: "Invalid email or password.",
  Default: "An unexpected authentication error occurred.",
};

function AuthErrorContent() {
  const params = useSearchParams();
  const error = params.get("error") ?? "Default";
  const message = errorMessages[error] ?? errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05060A] px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
          <ShieldAlert className="h-7 w-7 text-red-400" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-3">
          Authentication Error
        </h1>
        <p className="text-gray-400 text-sm mb-2">{message}</p>
        <p className="text-gray-700 text-xs mb-8 font-mono">
          code: {error}
        </p>
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#05060A]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
