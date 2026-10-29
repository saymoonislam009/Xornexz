"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export interface AvailabilitySlot {
  month: string;
  spots: number;
  taken: number;
}

export interface AvailabilityBannerProps {
  slots?: AvailabilitySlot[];
  statusText?: string;
  heading?: string;
  subtext?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const DEFAULT_SLOTS: AvailabilitySlot[] = [
  { month: "Q4 2026", spots: 2, taken: 1 },
  { month: "Q1 2027", spots: 3, taken: 1 },
  { month: "Q2 2027", spots: 3, taken: 0 },
];

export default function AvailabilityBanner({
  slots = DEFAULT_SLOTS,
  statusText = "Currently Open",
  heading = "Limited Project Slots",
  subtext = "We cap new projects per quarter to guarantee senior engineering attention. Reserve your slot early.",
  ctaLabel = "Book a Discovery Call",
  ctaHref = "/contact",
}: AvailabilityBannerProps) {
  const slotList = slots && slots.length > 0 ? slots : DEFAULT_SLOTS;

  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-[#0B0D14] border-t border-slate-200 dark:border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border border-violet-500/25 bg-white dark:bg-violet-900/[0.08] p-6 sm:p-10 overflow-hidden shadow-sm dark:shadow-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {statusText}
            </span>
          </div>

          <h3 className="text-xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mb-2">
            {heading}
          </h3>
          <p className="text-slate-600 dark:text-gray-400 text-sm mb-8 max-w-lg">{subtext}</p>

          {/* Slot bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {slotList.map((slot, idx) => {
              const total = Math.max(1, Number(slot.spots) || 1);
              const taken = Math.min(total, Math.max(0, Number(slot.taken) || 0));
              const open = Math.max(0, total - taken);
              return (
                <div
                  key={`${slot.month}-${idx}`}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-gray-300 truncate">
                      {slot.month}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-1.5">
                    {Array.from({ length: total }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${
                          i < taken ? "bg-violet-500" : "bg-slate-200 dark:bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-gray-400">
                    {open} {open === 1 ? "slot" : "slots"} open
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <Link
            href={ctaHref}
            className="btn-gradient group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white px-6 py-3 text-sm font-semibold hover:scale-[1.02] hover:shadow-lg transition-all"
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
