"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

const slots = [
  { month: "Nov 2025", spots: 2, taken: 1 },
  { month: "Dec 2025", spots: 2, taken: 0 },
  { month: "Jan 2026", spots: 3, taken: 0 },
];

export default function AvailabilityBanner() {
  return (
    <section className="py-16 sm:py-20 bg-[#0B0D14] border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border border-violet-500/20 bg-violet-900/[0.08] p-6 sm:p-10 overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Currently Open</span>
          </div>

          <h3 className="text-xl sm:text-3xl font-bold font-display text-white mb-2">
            Limited Project Slots
          </h3>
          <p className="text-gray-500 text-sm mb-8 max-w-md">
            We cap new projects per quarter to guarantee full attention. Book before spots fill.
          </p>

          {/* Slot bars */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {slots.map((slot) => (
              <div key={slot.month} className="p-3 rounded-xl border border-white/5 bg-white/[0.03]">
                <div className="flex items-center gap-1 mb-2">
                  <Calendar className="w-3 h-3 text-violet-400 shrink-0" />
                  <span className="text-[10px] font-medium text-gray-500 truncate">{slot.month}</span>
                </div>
                <div className="flex gap-1 mb-1.5">
                  {Array.from({ length: slot.spots }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i < slot.taken ? "bg-violet-500" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-gray-700">{slot.spots - slot.taken} open</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-bold hover:scale-105 transition-all"
          >
            Book a Discovery Call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
