"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Smartphone,
  Cloud,
  Webhook,
  PenTool,
  Bot,
  ChevronRight,
  Globe,
  Layers,
  Plug,
  Palette,
  Shield,
  Cpu,
  Database,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Code: Code2,
  Globe,
  Smartphone,
  Cloud,
  Layers,
  Webhook,
  Plug,
  PenTool,
  Palette,
  Bot,
  Shield,
  Cpu,
  Database,
  Sparkles,
};

const ACCENTS = [
  "from-violet-500 to-violet-700",
  "from-cyan-500 to-blue-600",
  "from-purple-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-orange-500",
  "from-amber-500 to-yellow-600",
];

export interface PublicServiceItem {
  id?: string;
  slug: string;
  title: string;
  description: string;
  icon?: string;
  features?: string[];
}

const DEFAULT_SERVICES: PublicServiceItem[] = [
  {
    id: "01",
    title: "Web Development",
    icon: "Globe",
    slug: "web-development",
    description:
      "High-performance web applications built with Next.js, React, and TypeScript. From marketing sites that convert to complex platforms that scale to millions.",
    features: ["Next.js App Router", "Server Components", "Edge Runtime", "Core Web Vitals optimized"],
  },
  {
    id: "02",
    title: "Mobile Apps",
    icon: "Smartphone",
    slug: "mobile-apps",
    description:
      "Native and cross-platform mobile experiences built with React Native and Expo. iOS, Android, and web from one codebase.",
    features: ["React Native + Expo", "App Store submission", "Push notifications", "Offline-first architecture"],
  },
  {
    id: "03",
    title: "SaaS & Custom Software",
    icon: "Layers",
    slug: "saas-platforms",
    description:
      "End-to-end bespoke software for your exact business logic. Multi-tenant architecture, role-based access, billing integration.",
    features: ["Multi-tenant SaaS", "Stripe billing", "RBAC permissions", "White-label ready"],
  },
  {
    id: "04",
    title: "API & Integrations",
    icon: "Plug",
    slug: "api-integration",
    description:
      "Seamless REST and GraphQL APIs, third-party integrations, and workflow automation that connects your entire tool stack.",
    features: ["REST & GraphQL APIs", "Webhook architecture", "Third-party integrations", "API documentation"],
  },
  {
    id: "05",
    title: "UI/UX Design",
    icon: "Palette",
    slug: "ui-ux-design",
    description:
      "Research-driven design that converts and delights. From user flows to complete design systems and high-fidelity prototypes.",
    features: ["User research", "Design systems", "Interactive prototypes", "Figma handoff"],
  },
  {
    id: "06",
    title: "AI & Automation",
    icon: "Bot",
    slug: "ai-automation",
    description:
      "LLM integration, RAG pipelines, AI-powered features, and workflow automation that makes your product genuinely smarter.",
    features: ["OpenAI & Gemini integration", "RAG pipelines", "Autonomous agents", "AI workflow automation"],
  },
];

interface NormalizedService {
  num: string;
  title: string;
  Icon: LucideIcon;
  slug: string;
  description: string;
  bullets: string[];
  accent: string;
}

function ServiceDetail({ service }: { service: NormalizedService }) {
  return (
    <div className="h-full flex flex-col">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.accent} p-[1px] mb-8 shadow-md`}>
        <div className="w-full h-full rounded-2xl bg-white dark:bg-[#0B0D14] flex items-center justify-center">
          <service.Icon className="w-6 h-6 text-slate-900 dark:text-white" />
        </div>
      </div>
      <div className="text-7xl font-black font-display text-slate-900/[0.05] dark:text-white/[0.04] mb-2 leading-none select-none">
        {service.num}
      </div>
      <h3 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-4">
        {service.title}
      </h3>
      <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-8">{service.description}</p>
      {service.bullets.length > 0 && (
        <ul className="space-y-2.5 mb-10">
          {service.bullets.map((b) => (
            <li key={b} className="flex items-center gap-3 text-sm text-slate-700 dark:text-gray-300">
              <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.accent} shrink-0`} />
              {b}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto">
        <Link
          href={`/services/${service.slug}`}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          Explore this service{" "}
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}

export default function ServicesSection({ services }: { services?: PublicServiceItem[] }) {
  const [active, setActive] = useState(0);
  const rawList = services && services.length > 0 ? services.slice(0, 8) : DEFAULT_SERVICES;

  const normalized: NormalizedService[] = rawList.map((s, idx) => ({
    num: idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`,
    title: s.title,
    Icon: (s.icon && ICON_MAP[s.icon]) || Code2,
    slug: s.slug,
    description: s.description,
    bullets: Array.isArray(s.features) ? s.features.slice(0, 4) : [],
    accent: ACCENTS[idx % ACCENTS.length],
  }));

  const safeActive = active < normalized.length ? active : 0;

  return (
    <section className="py-24 sm:py-32 bg-slate-50 dark:bg-[#05060A] relative overflow-hidden" id="services">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-14 sm:mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-600 dark:text-violet-400 uppercase mb-4">
            What We Do
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white max-w-2xl">
              Every Discipline You Need,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-400">
                {" "}
                Under One Roof
              </span>
            </h2>
            <Link
              href="/services"
              className="shrink-0 inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              All services <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Desktop split layout */}
        <div className="hidden md:grid md:grid-cols-[300px_1fr] lg:grid-cols-[360px_1fr] gap-0 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden min-h-[520px] shadow-sm dark:shadow-none">
          <div className="bg-white dark:bg-[#0B0D14] border-r border-slate-200 dark:border-white/5">
            {normalized.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => setActive(i)}
                className={`w-full flex items-center gap-4 px-6 py-5 text-left border-b border-slate-100 dark:border-white/5 transition-all duration-200 group ${
                  safeActive === i
                    ? "bg-violet-500/[0.06] dark:bg-white/[0.05]"
                    : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.accent} p-[1px] shrink-0 transition-all ${
                    safeActive === i ? "scale-110" : "opacity-50 group-hover:opacity-80"
                  }`}
                >
                  <div className="w-full h-full rounded-lg bg-white dark:bg-[#0B0D14] flex items-center justify-center">
                    <s.Icon className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                  </div>
                </div>
                <span
                  className={`flex-1 text-sm font-semibold truncate transition-colors ${
                    safeActive === i
                      ? "text-slate-950 dark:text-white"
                      : "text-slate-500 dark:text-gray-500 group-hover:text-slate-800 dark:group-hover:text-gray-300"
                  }`}
                >
                  {s.title}
                </span>
                {safeActive === i && (
                  <ChevronRight className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
          <div className="bg-slate-50/70 dark:bg-[#05060A] p-10 lg:p-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={safeActive}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ServiceDetail service={normalized[safeActive]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile card grid */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {normalized.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0B0D14] hover:border-violet-500/30 dark:hover:border-white/10 transition-all shadow-sm dark:shadow-none"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.accent} p-[1px]`}>
                  <div className="w-full h-full rounded-xl bg-white dark:bg-[#0B0D14] flex items-center justify-center">
                    <s.Icon className="w-5 h-5 text-slate-900 dark:text-white" />
                  </div>
                </div>
                <div className="text-4xl font-black font-display text-slate-900/10 dark:text-white/5">
                  {s.num}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-display">
                {s.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2">{s.description}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Learn more <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
