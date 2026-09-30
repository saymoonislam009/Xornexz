"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
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

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };
  const child = {
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 12, stiffness: 100 } },
    hidden: { opacity: 0, y: 40 },
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#05060A] pt-20">
      <HeroScene />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.1),transparent)] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5 sm:px-6 flex flex-col items-center text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-gray-400"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          Accepting new projects
        </motion.div>

        {/* Headline */}
        <motion.div
          className="mb-4 flex flex-wrap justify-center"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {["We", "Build", "What's", "Next."].map((word, i) => (
            <motion.span
              key={i}
              variants={child}
              className="mr-2 sm:mr-3 text-[2.8rem] sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight font-display text-white pb-1"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Typewriter — sm+ only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mb-5 hidden sm:flex items-center justify-center h-9"
        >
          <span className="text-base sm:text-xl text-gray-500 font-light">
            We build{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 font-medium">
              {mounted ? displayed : rotatingWords[0]}
            </span>
            <span className="inline-block w-0.5 h-5 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="max-w-md sm:max-w-xl text-sm sm:text-base text-gray-500 mb-8 leading-relaxed"
        >
          A technology studio that partners with ambitious founders and enterprises to engineer world-class digital products.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-[280px] sm:max-w-none"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] transition-all"
          >
            Start a Project
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-gray-300 hover:bg-white/[0.08] transition-all"
          >
            See Our Work
          </Link>
        </motion.div>

        {/* Trust strip — 2×2 on mobile, row on sm */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-12 grid grid-cols-2 sm:flex sm:flex-row items-center gap-3 sm:gap-x-7 text-[10px] sm:text-[11px] text-gray-700 uppercase tracking-widest"
        >
          <span>120+ Projects</span>
          <span>7 Years</span>
          <span>98% Satisfaction</span>
          <span>24h Response</span>
        </motion.div>
      </div>

      {/* Scroll indicator — sm+ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5 text-gray-700"
      >
        <span className="text-[9px] uppercase tracking-[0.2em]">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
