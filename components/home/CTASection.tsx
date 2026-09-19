"use client";

import { ArrowRight, PhoneCall } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-32 bg-[#05060A] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(124,58,237,0.15),transparent)] pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative floating shapes — subtle, well z-indexed */}
      <div className="absolute top-1/4 left-[8%] w-10 h-10 border border-cyan-500/20 rounded-lg rotate-12 animate-float pointer-events-none hidden md:block" />
      <div className="absolute bottom-1/4 right-[8%] w-14 h-14 border border-violet-500/20 rounded-full animate-float [animation-delay:2s] pointer-events-none hidden md:block" />
      <div className="absolute top-1/2 left-[5%] w-5 h-5 bg-violet-600/30 rounded-full animate-float [animation-delay:1s] pointer-events-none hidden lg:block" />
      <div className="absolute top-1/3 right-[12%] w-3 h-3 bg-cyan-500/40 rounded-full animate-float [animation-delay:3s] pointer-events-none hidden lg:block" />

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Currently accepting new projects
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-6 leading-tight tracking-tight">
            Ready to Build{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400">
              Something Remarkable?
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-400 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            Let&apos;s turn your ambitious vision into an exceptional digital reality.
            Our team is ready when you are.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] w-full sm:w-auto"
            >
              Start a Project
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40 w-full sm:w-auto"
            >
              <PhoneCall className="h-5 w-5 text-cyan-400" />
              Schedule a Call
            </Link>
          </div>

          {/* Social proof strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-gray-500"
          >
            <span className="flex items-center gap-2">
              <span className="text-violet-400 font-semibold">50+</span> Projects shipped
            </span>
            <span className="flex items-center gap-2">
              <span className="text-cyan-400 font-semibold">30+</span> Happy clients
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">4.9★</span> Average rating
            </span>
            <span className="flex items-center gap-2">
              <span className="text-violet-400 font-semibold">24h</span> Response time
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
