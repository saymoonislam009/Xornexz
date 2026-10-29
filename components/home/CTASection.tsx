"use client";

import { ArrowRight, Calculator } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CtaConfig } from "@/lib/site-config";

const DEFAULT_PROOF = [
  { highlight: "120+", label: "Projects shipped" },
  { highlight: "98%", label: "Client satisfaction" },
  { highlight: "4.9★", label: "Average rating" },
  { highlight: "24h", label: "Response time" },
];

const PROOF_COLORS = [
  "text-violet-600 dark:text-violet-400",
  "text-cyan-600 dark:text-cyan-400",
  "text-emerald-600 dark:text-emerald-400",
  "text-violet-600 dark:text-violet-400",
];

export default function CTASection({ cta }: { cta?: CtaConfig }) {
  const badgeText = cta?.badgeText || "Currently accepting new projects";
  const rawHeading = (cta?.heading || "Ready to Build Something Remarkable?").trim();
  const subtext =
    cta?.subtext ||
    "Let's turn your ambitious vision into an exceptional digital reality. Our team is ready when you are.";
  const cta1Label = cta?.cta1Label || "Start a Project";
  const cta1Href = cta?.cta1Href || "/contact";
  const cta2Label = cta?.cta2Label || "Estimate Your Budget";
  const cta2Href = cta?.cta2Href || "/estimator";
  const proofItems = cta?.proofItems && cta.proofItems.length > 0 ? cta.proofItems : DEFAULT_PROOF;

  const words = rawHeading.split(/\s+/);
  const splitIdx = words.length > 2 ? Math.ceil(words.length / 2) : 1;
  const headingTop = words.length > 1 ? words.slice(0, splitIdx).join(" ") : "";
  const headingBottom = words.length > 1 ? words.slice(splitIdx).join(" ") : rawHeading;

  return (
    <section className="py-28 sm:py-32 bg-slate-50 dark:bg-[#05060A] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(124,58,237,0.15),transparent)] pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative floating shapes */}
      <div className="absolute top-1/4 left-[8%] w-10 h-10 border border-cyan-500/20 rounded-lg rotate-12 animate-float pointer-events-none hidden md:block" />
      <div className="absolute bottom-1/4 right-[8%] w-14 h-14 border border-violet-500/20 rounded-full animate-float [animation-delay:2s] pointer-events-none hidden md:block" />

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-1.5 text-sm text-slate-600 dark:text-gray-400 mb-8 shadow-sm dark:shadow-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {badgeText}
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-slate-950 dark:text-white mb-4 sm:mb-6 leading-tight tracking-tight">
            {headingTop ? (
              <>
                {headingTop} <br className="hidden md:block" />
              </>
            ) : null}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 dark:from-violet-400 dark:via-purple-400 dark:to-cyan-400">
              {headingBottom}
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-gray-400 mb-8 sm:mb-12 font-light max-w-2xl mx-auto leading-relaxed px-2">
            {subtext}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={cta1Href}
              className="btn-gradient group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] w-full sm:w-auto"
            >
              {cta1Label}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href={cta2Href}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 px-8 py-4 text-base font-semibold text-slate-800 dark:text-white backdrop-blur-sm transition-all duration-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/40 shadow-sm dark:shadow-none w-full sm:w-auto"
            >
              <Calculator className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              {cta2Label}
            </Link>
          </div>

          {/* Social proof strip */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-slate-500 dark:text-gray-500">
            {proofItems.map((item, idx) => (
              <span key={`${item.label}-${idx}`} className="flex items-center gap-2">
                <span className={`${PROOF_COLORS[idx % PROOF_COLORS.length]} font-semibold`}>
                  {item.highlight}
                </span>{" "}
                {item.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
