"use client";

import { useState } from "react";
import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, FileText, Briefcase, Users, Settings,
  Image, MessageSquare, Star, HelpCircle, CreditCard,
  BarChart3, Mail, Layers, Cpu, Play, ChevronLeft,
  ChevronRight, LogOut, ExternalLink, Menu, X, User,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blog", icon: FileText, label: "Blog" },
      { href: "/admin/projects", icon: Briefcase, label: "Projects" },
      { href: "/admin/services", icon: Layers, label: "Services" },
      { href: "/admin/testimonials", icon: Star, label: "Testimonials" },
      { href: "/admin/team", icon: Users, label: "Team" },
      { href: "/admin/faqs", icon: HelpCircle, label: "FAQs" },
      { href: "/admin/pricing", icon: CreditCard, label: "Pricing" },
      { href: "/admin/jobs", icon: Briefcase, label: "Jobs" },
    ],
  },
  {
    label: "Leads & CRM",
    items: [
      { href: "/admin/leads", icon: BarChart3, label: "Leads" },
      { href: "/admin/contact-submissions", icon: Mail, label: "Contact" },
      { href: "/admin/newsletter", icon: Mail, label: "Newsletter" },
    ],
  },
  {
    label: "Media",
    items: [
      { href: "/admin/media", icon: Image, label: "Media Library" },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/homepage", icon: Play, label: "Homepage Editor" },
      { href: "/admin/settings", icon: Settings, label: "Settings" },
      { href: "/admin/users", icon: Users, label: "Users" },
    ],
  },
];

interface Props {
  children: React.ReactNode;
  session: Session;
}

function SidebarContent({
  collapsed,
  pathname,
  session,
}: {
  collapsed: boolean;
  pathname: string;
  session: Session;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-sm">X</span>
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-white tracking-tight">Xornexz</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-150 group
                        ${active
                          ? "bg-violet-600/15 text-violet-300 border border-violet-500/20"
                          : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                        }
                        ${collapsed ? "justify-center" : ""}
                      `}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-violet-400" : "text-gray-500 group-hover:text-gray-300"}`} />
                      {!collapsed && item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className={`border-t border-white/5 p-3 ${collapsed ? "flex justify-center" : ""}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user.role}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminShell({ children, session }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Derive page title from pathname
  const currentItem = NAV_GROUPS.flatMap((g) => g.items).find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );
  const pageTitle = currentItem?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 bg-[#0B0D14] border-r border-white/5 transition-all duration-200 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <SidebarContent collapsed={collapsed} pathname={pathname} session={session} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B0D14] border-r border-white/5 transform transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent collapsed={false} pathname={pathname} session={session} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-white/5 bg-[#05060A]/80 backdrop-blur-sm flex items-center gap-4 px-4 md:px-6 flex-shrink-0">
          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Collapse toggle — desktop */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/5 transition-all"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {/* Breadcrumb / Page title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-white truncate">{pageTitle}</h1>
          </div>

          {/* View site */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-gray-400 hover:text-white hover:border-white/20 transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View site
          </Link>

          {/* User badge */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {(session.user.name ?? "A").charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
