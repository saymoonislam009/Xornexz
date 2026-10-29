"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Smartphone, Zap, Layers, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { SiteConfig } from "@/lib/site-config";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const DEFAULT_ROTATING = [
  "Web Applications",
  "SaaS Platforms",
  "Mobile Apps",
  "AI Systems",
  "Design Systems",
];

const DEFAULT_STATS = [
  { value: "120+", label: "Projects" },
  { value: "7 yrs", label: "Experience" },
  { value: "98%", label: "Satisfied" },
  { value: "24h", label: "Response" },
];

const PILL_ICONS = [Code2, Smartphone, Zap, Layers, Sparkles];

export default function Hero({ hero }: { hero?: SiteConfig["hero"] }) {
  const rotatingWords =
    hero?.rotatingWords && hero.rotatingWords.length > 0
      ? hero.rotatingWords
      : DEFAULT_ROTATING;
  const stats = hero?.stats && hero.stats.length > 0 ? hero.stats : DEFAULT_STATS;
  const techPills =
    hero?.techPills && hero.techPills.length > 0
      ? hero.techPills
      : ["Next.js", "React Native", "AI / LLMs"];

  const badgeText = hero?.badgeText || "Accepting new projects — Limited slots open";
  const rawHeadline = (hero?.headline || "We Build What's Next.").trim();
  const subheadline =
    hero?.subheadline ||
    "A technology studio that partners with ambitious founders and enterprises to engineer world-class digital products — from MVPs to enterprise platforms.";
  const cta1Label = hero?.cta1Label || "Start a Project";
  const cta1Href = hero?.cta1Href || "/contact";
  const cta2Label = hero?.cta2Label || "See Our Work";
  const cta2Href = hero?.cta2Href || "/portfolio";

  // Split headline gracefully into plain prefix + gradient accent
  const words = rawHeadline.split(/\s+/);
  const splitIdx = words.length > 2 ? Math.ceil(words.length / 2) : 1;
  const headlinePrefix = words.length > 1 ? words.slice(0, splitIdx).join(" ") : "";
  const headlineHighlight = words.length > 1 ? words.slice(splitIdx).join(" ") : rawHeadline;

  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || rotatingWords.length === 0) return;
    const current = rotatingWords[wordIndex % rotatingWords.length];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 75);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2100);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex, mounted, rotatingWords]);

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#05060A] pt-24 pb-16 transition-colors duration-300">
      {/* 3-D interactive canvas with mobile touch and ambient motion */}
      <HeroScene />

      {/* Dot grid */}
      <div className="hero-grid-bg absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      {/* Radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.16),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(6,182,212,0.1),transparent)] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5 sm:px-6 flex flex-col items-center text-center max-w-5xl">
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/85 dark:bg-white/5 backdrop-blur-md px-4 py-1.5 text-[11px] font-medium text-slate-700 dark:text-gray-300 shadow-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          {badgeText}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[2.6rem] leading-[1.06] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight font-display text-slate-950 dark:text-white mb-4"
        >
          {headlinePrefix ? <>{headlinePrefix} </> : null}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 dark:from-violet-400 dark:via-purple-400 dark:to-cyan-400">
            {headlineHighlight}
          </span>
        </motion.h1>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.14, duration: 0.4 }}
          className="mb-4 flex items-center justify-center h-8"
        >
          <span className="text-sm sm:text-lg text-slate-600 dark:text-gray-400 font-light">
            We engineer{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-400 font-semibold">
              {mounted ? displayed : rotatingWords[0]}
            </span>
            <span className="inline-block w-0.5 h-4 sm:h-5 bg-cyan-500 dark:bg-cyan-400 ml-0.5 animate-pulse align-middle" />
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.45 }}
          className="max-w-sm sm:max-w-2xl text-sm sm:text-base text-slate-600 dark:text-gray-400 mb-8 leading-relaxed font-normal"
        >
          {subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.45 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:justify-center mb-10"
        >
          <Link
            href={cta1Href}
            className="btn-gradient group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-[0_0_28px_rgba(124,58,237,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            {cta1Label}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={cta2Href}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-white/15 bg-white/85 dark:bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-slate-800 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/[0.1] active:scale-[0.98] shadow-sm transition-all duration-200"
          >
            {cta2Label}
          </Link>
        </motion.div>

        {/* Tech pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.45 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {techPills.map((label, idx) => {
            const Icon = PILL_ICONS[idx % PILL_ICONS.length];
            return (
              <span
                key={`${label}-${idx}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white/85 dark:bg-white/5 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-slate-700 dark:text-gray-300 shadow-sm"
              >
                <Icon className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                {label}
              </span>
            );
          })}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xs sm:max-w-md border border-slate-200 dark:border-white/[0.08] rounded-2xl bg-white/85 dark:bg-white/[0.03] backdrop-blur-md px-4 py-4 shadow-sm"
        >
          {stats.slice(0, 4).map(({ value, label }, idx) => (
            <div key={`${label}-${idx}`} className="flex flex-col items-center">
              <span className="text-sm sm:text-base font-bold text-slate-950 dark:text-white font-display">
                {value}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 dark:text-gray-500 mt-0.5">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint — lg+ only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 text-slate-400 dark:text-gray-600 pointer-events-none"
      >
        <span className="text-[9px] uppercase tracking-[0.2em]">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
