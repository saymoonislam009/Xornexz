"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, Users, TrendingUp, Code2 } from "lucide-react";
import { isUnoptimizedImageSrc } from "@/lib/media-url";

const DEFAULT_METRICS = [
  { icon: TrendingUp, label: "Revenue increase", value: "+340%" },
  { icon: Users, label: "Monthly active users", value: "2.4M" },
  { icon: Clock, label: "Time to market", value: "11 weeks" },
  { icon: Code2, label: "Uptime SLA", value: "99.9%" },
];

const METRIC_ICONS = [TrendingUp, Users, Clock, Code2];

interface FeaturedCaseStudyProps {
  project?: {
    id: string;
    title: string;
    tagline?: string;
    description: string;
    client: string;
    coverImage: string;
    slug: string;
    metrics?: Record<string, any> | null;
  } | null;
}

export default function FeaturedCaseStudy({ project }: FeaturedCaseStudyProps) {
  const title = project?.title || "From MVP to 2.4M Users in 11 Weeks";
  const client = project?.client || "VaultAI — YC W24";
  const description =
    project?.description ||
    "VaultAI needed a production-grade AI document intelligence platform built fast. We assembled a cross-functional team of 6, designed the architecture from scratch, and shipped a platform that scaled from zero to enterprise contracts under budget and ahead of schedule.";
  const coverImage =
    project?.coverImage ||
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1470";
  const slug = project?.slug || "vaultai";
  const letter = (project?.client || project?.title || "V").charAt(0).toUpperCase();

  const customMetricEntries =
    project?.metrics && typeof project.metrics === "object"
      ? Object.entries(project.metrics).slice(0, 4)
      : [];

  const displayMetrics =
    customMetricEntries.length > 0
      ? customMetricEntries.map(([label, raw], idx) => {
          const val =
            typeof raw === "string"
              ? raw
              : raw?.value || raw?.improvement || raw?.after || "100%";
          return {
            icon: METRIC_ICONS[idx % METRIC_ICONS.length],
            label,
            value: String(val),
          };
        })
      : DEFAULT_METRICS;

  return (
    <section className="py-24 sm:py-32 bg-slate-50 dark:bg-[#05060A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(124,58,237,0.05),transparent)] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-600 dark:text-violet-400 uppercase mb-4">
            Deep Dive
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white">
            A Case Study in Scale
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-none"
        >
          <div className="relative h-[260px] sm:h-[360px] lg:h-auto lg:min-h-[440px] bg-slate-900 overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized={isUnoptimizedImageSrc(coverImage)}
            />
            <div className="absolute top-6 left-6 z-10">
              <span className="btn-gradient px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-full shadow-lg">
                Featured Case Study
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0B0D14] p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-xs">{letter}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider">
                  Client
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{client}</p>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-slate-900 dark:text-white mb-4 leading-tight">
              {title}
            </h3>

            <p className="text-slate-600 dark:text-gray-400 mb-8 leading-relaxed line-clamp-4">
              {description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {displayMetrics.map((m) => (
                <div
                  key={m.label}
                  className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]"
                >
                  <m.icon className="w-4 h-4 text-violet-600 dark:text-violet-400 mb-2" />
                  <div className="text-2xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-400">
                    {m.value}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-gray-500 mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>

            <Link
              href={`/portfolio/${slug}`}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Read the full case study
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
