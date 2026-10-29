import { ReactNode } from "react";

// Force all admin routes to be server-rendered at request time.
// Without this, Next.js attempts static pre-rendering which has no request
// context — cookies() throws, session is null, and every page redirects to login.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div data-admin-root="true" className="dark min-h-screen bg-[#05060A] text-white">
      {children}
    </div>
  );
}
