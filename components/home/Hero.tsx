"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Smartphone, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect } from "react";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const rotatingWords = [
  "Web Applications",
  "SaaS Platforms",
  "Mobile Apps",
  "AI Systems",
  "Design Systems",
];

const STATS = [
  { value: "120+", label: "Projects" },
  { value: "7 yrs", label: "Experience" },
  { value: "98%", label: "Satisfied" },
  { value: "24h", label: "Response" },
];

const PILLS = [
  { icon: Code2, label: "Next.js" },
  { icon: Smartphone, label: "React Native" },
  { icon: Zap, label: "AI / LLMs" },
];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const current = rotatingWords[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex, mounted]);

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#05060A] pt-20 pb-16">
      {/* 3-D canvas — skipped on touch/low-power by HeroScene itself */}
      <HeroScene />

      {/* Dot grid */}
      <div className="hero-grid-bg absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      {/* Violet radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.13),transparent)] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5 sm:px-6 flex flex-col items-center text-center max-w-5xl">

        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] text-gray-400"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          Accepting new projects for Q4 2025
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[2.6rem] leading-[1.06] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight font-display text-white mb-4"
        >
          We Build{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400">
            What&rsquo;s Next.
          </span>
        </motion.h1>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mb-4 flex items-center justify-center h-8"
        >
          <span className="text-sm sm:text-lg text-gray-500 font-light">
            We build{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 font-semibold">
              {mounted ? displayed : rotatingWords[0]}
            </span>
            <span className="inline-block w-0.5 h-4 sm:h-5 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="max-w-sm sm:max-w-2xl text-sm sm:text-base text-gray-500 mb-8 leading-relaxed"
        >
          A technology studio that partners with ambitious founders and enterprises to engineer world-class digital products — from MVPs to enterprise platforms.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:justify-center mb-10"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-[0_0_28px_rgba(124,58,237,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Start a Project
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-gray-300 hover:bg-white/[0.1] active:scale-[0.98] transition-all duration-200"
          >
            See Our Work
          </Link>
        </motion.div>

        {/* Tech pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {PILLS.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-gray-400">
              <Icon className="h-3 w-3" />
              {label}
            </span>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.7 }}
          className="grid grid-cols-4 gap-3 w-full max-w-xs sm:max-w-sm border border-white/[0.08] rounded-2xl bg-white/[0.03] px-3 py-4"
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-sm sm:text-base font-bold text-white font-display">{value}</span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-600 mt-0.5">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint — lg+ only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 text-gray-700 pointer-events-none"
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
