"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Code2, Smartphone, Cloud, Webhook, PenTool, Bot, ChevronRight } from "lucide-react";

const services = [
  {
    id: "01",
    title: "Web Development",
    icon: Code2,
    slug: "web-development",
    description: "High-performance web applications built with Next.js, React, and TypeScript. From marketing sites that convert to complex platforms that scale to millions.",
    bullets: ["Next.js App Router", "Server Components", "Edge Runtime", "Core Web Vitals optimized"],
    accent: "from-violet-500 to-violet-700",
  },
  {
    id: "02",
    title: "Mobile Apps",
    icon: Smartphone,
    slug: "mobile-apps",
    description: "Native and cross-platform mobile experiences built with React Native and Expo. iOS, Android, and web from one codebase.",
    bullets: ["React Native + Expo", "App Store submission", "Push notifications", "Offline-first architecture"],
    accent: "from-cyan-500 to-blue-600",
  },
  {
    id: "03",
    title: "SaaS & Custom Software",
    icon: Cloud,
    slug: "saas-software",
    description: "End-to-end bespoke software for your exact business logic. Multi-tenant architecture, role-based access, billing integration.",
    bullets: ["Multi-tenant SaaS", "Stripe billing", "RBAC permissions", "White-label ready"],
    accent: "from-purple-500 to-pink-600",
  },
  {
    id: "04",
    title: "API & Integrations",
    icon: Webhook,
    slug: "api-integrations",
    description: "Seamless REST and GraphQL APIs, third-party integrations, and workflow automation that connects your entire tool stack.",
    bullets: ["REST & GraphQL APIs", "Webhook architecture", "Third-party integrations", "API documentation"],
    accent: "from-emerald-500 to-teal-600",
  },
  {
    id: "05",
    title: "UI/UX Design",
    icon: PenTool,
    slug: "ui-ux-design",
    description: "Research-driven design that converts and delights. From user flows to complete design systems and high-fidelity prototypes.",
    bullets: ["User research", "Design systems", "Interactive prototypes", "Figma handoff"],
    accent: "from-rose-500 to-orange-500",
  },
  {
    id: "06",
    title: "AI & Automation",
    icon: Bot,
    slug: "ai-automation",
    description: "LLM integration, RAG pipelines, AI-powered features, and workflow automation that makes your product genuinely smarter.",
    bullets: ["OpenAI integration", "RAG pipelines", "Fine-tuned models", "AI workflow automation"],
    accent: "from-amber-500 to-yellow-600",
  },
];

function ServiceDetail({ service }: { service: typeof services[0] }) {
  return (
    <div className="h-full flex flex-col">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.accent} p-[1px] mb-8`}>
        <div className="w-full h-full rounded-2xl bg-[#0B0D14] flex items-center justify-center">
          <service.icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="text-7xl font-black font-display text-white/[0.04] mb-2 leading-none select-none">{service.id}</div>
      <h3 className="text-3xl font-bold font-display text-white mb-4">{service.title}</h3>
      <p className="text-gray-400 leading-relaxed mb-8">{service.description}</p>
      <ul className="space-y-2 mb-10">
        {service.bullets.map((b) => (
          <li key={b} className="flex items-center gap-3 text-sm text-gray-300">
            <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.accent} shrink-0`} />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <Link
          href={`/services/${service.slug}`}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-cyan-400 transition-colors"
        >
          Explore this service <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-32 bg-[#05060A] relative" id="services">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-400 uppercase mb-4">What We Do</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white max-w-2xl">
              Every Discipline You Need,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400"> Under One Roof</span>
            </h2>
            <Link href="/services" className="shrink-0 inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors">
              All services <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Desktop split layout */}
        <div className="hidden md:grid md:grid-cols-[300px_1fr] lg:grid-cols-[360px_1fr] gap-0 rounded-3xl border border-white/5 overflow-hidden min-h-[520px]">
          <div className="bg-[#0B0D14] border-r border-white/5">
            {services.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className={`w-full flex items-center gap-4 px-6 py-5 text-left border-b border-white/5 transition-all duration-200 group ${
                  active === i ? "bg-white/[0.05]" : "hover:bg-white/[0.02]"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.accent} p-[1px] shrink-0 transition-all ${
                  active === i ? "scale-110" : "opacity-40 group-hover:opacity-70"
                }`}>
                  <div className="w-full h-full rounded-lg bg-[#0B0D14] flex items-center justify-center">
                    <s.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <span className={`flex-1 text-sm font-semibold truncate transition-colors ${
                  active === i ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                }`}>
                  {s.title}
                </span>
                {active === i && <ChevronRight className="w-4 h-4 text-violet-400 shrink-0" />}
              </button>
            ))}
          </div>
          <div className="bg-[#05060A] p-10 lg:p-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <ServiceDetail service={services[active]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile card grid */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/services/${s.slug}`}
              className="group p-6 rounded-2xl border border-white/5 bg-[#0B0D14] hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.accent} p-[1px]`}>
                  <div className="w-full h-full rounded-xl bg-[#0B0D14] flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-black font-display text-white/5">{s.id}</div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">{s.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{s.description}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-violet-400 group-hover:text-cyan-400 transition-colors">
                Learn more <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
