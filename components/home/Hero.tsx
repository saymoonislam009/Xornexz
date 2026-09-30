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

  useEffect(() => {
    setMounted(true);
  }, []);

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
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex, mounted]);

  const headline = "We Build What's Next.";
  const words = headline.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hidden: { opacity: 0, y: 50 },
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#05060A]">
      <HeroScene />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(124,58,237,0.12),transparent)] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Accepting new projects — Q1 2025
        </motion.div>

        {/* Main headline */}
        <motion.div
          className="mb-4 overflow-hidden flex flex-wrap justify-center"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, index) => (
            <motion.span
              variants={child}
              key={index}
              className="mr-2 sm:mr-3 lg:mr-5 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/70 font-display pb-2"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Typewriter subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mb-6 h-10 flex items-center justify-center"
        >
          <span className="text-xl sm:text-2xl md:text-3xl font-light text-gray-400">
            We specialize in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 font-semibold">
              {mounted ? displayed : rotatingWords[0]}
            </span>
            <span className="inline-block w-0.5 h-6 bg-cyan-400 ml-1 animate-pulse" />
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="max-w-2xl text-base sm:text-lg text-gray-500 mb-10 font-light px-2 leading-relaxed"
        >
          Xornexz is a technology studio that partners with ambitious founders and enterprises to design and engineer world-class digital products.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto max-w-xs sm:max-w-none"
        >
          <Link
            href="/contact"
            className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]"
          >
            Start a Project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/portfolio"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            See Our Work
          </Link>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-gray-600 uppercase tracking-widest"
        >
          <span>120+ Projects Shipped</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>7 Years in Market</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>98% Client Satisfaction</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>24h Response SLA</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
