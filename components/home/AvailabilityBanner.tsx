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
    <section className="py-20 bg-[#0B0D14] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-900/10 to-[#0B0D14] p-8 sm:p-12 overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Currently Open</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-3">
                Limited Project Slots Available
              </h3>
              <p className="text-gray-400 max-w-lg">
                We take on a maximum of 4 new projects per quarter to guarantee undivided attention. Book your discovery call before spots fill.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 w-full lg:w-auto">
              {slots.map((slot) => (
                <div key={slot.month} className="flex-1 lg:flex-none p-4 rounded-xl border border-white/5 bg-white/[0.03] min-w-[140px]">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs font-medium text-gray-400">{slot.month}</span>
                  </div>
                  <div className="flex gap-1.5 mb-2">
                    {Array.from({ length: slot.spots }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          i < slot.taken ? "bg-violet-600" : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    {slot.spots - slot.taken} of {slot.spots} open
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white text-black px-8 py-4 text-sm font-bold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] whitespace-nowrap"
            >
              Book a Discovery Call
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
