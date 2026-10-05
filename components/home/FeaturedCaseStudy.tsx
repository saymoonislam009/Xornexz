"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, Users, TrendingUp, Code2 } from "lucide-react";

const metrics = [
  { icon: TrendingUp, label: "Revenue increase", value: "+340%" },
  { icon: Users, label: "Monthly active users", value: "2.4M" },
  { icon: Clock, label: "Time to market", value: "11 weeks" },
  { icon: Code2, label: "Lines of code", value: "180K" },
];

export default function FeaturedCaseStudy() {
  return (
    <section className="py-32 bg-[#05060A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(124,58,237,0.05),transparent)] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-[0.2em] text-violet-400 uppercase mb-4"
          >
            Deep Dive
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white"
          >
            A Case Study in Scale
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-white/10"
        >
          <div className="relative h-[220px] sm:h-[340px] lg:h-auto lg:min-h-[400px]">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1470"
              alt="VaultAI Dashboard"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0B0D14] hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05060A] via-transparent to-transparent lg:hidden" />
            <div className="absolute top-6 left-6">
              <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-violet-600 text-white rounded-full">
                Featured Project
              </span>
            </div>
          </div>

          <div className="bg-[#0B0D14] p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-black text-xs">V</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Client</p>
                <p className="text-sm font-semibold text-white">VaultAI — YC W24</p>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white mb-4 leading-tight">
              From MVP to 2.4M Users in 11 Weeks
            </h3>

            <p className="text-gray-400 mb-8 leading-relaxed">
              VaultAI needed a production-grade AI document intelligence platform built fast. We assembled a cross-functional team of 6, designed the architecture from scratch, and shipped a platform that scaled from zero to enterprise contracts under budget and ahead of schedule.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {metrics.map((m) => (
                <div key={m.label} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <m.icon className="w-4 h-4 text-violet-400 mb-2" />
                  <div className="text-2xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                    {m.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>

            <Link
              href="/portfolio/vaultai"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-cyan-400 transition-colors"
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
