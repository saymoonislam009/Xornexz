"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

type ComparisonValue = boolean | "partial";
type RowData = { feature: string; us: ComparisonValue; agency: ComparisonValue; freelancer: ComparisonValue };

const rows: RowData[] = [
  { feature: "Fixed-scope pricing", us: true, agency: false, freelancer: "partial" },
  { feature: "Full IP ownership", us: true, agency: true, freelancer: true },
  { feature: "Dedicated team", us: true, agency: true, freelancer: false },
  { feature: "Post-launch SLA", us: true, agency: false, freelancer: false },
  { feature: "Weekly demos", us: true, agency: "partial", freelancer: false },
  { feature: "Security audit", us: true, agency: false, freelancer: false },
  { feature: "Scalable infra", us: true, agency: "partial", freelancer: false },
  { feature: "Design system", us: true, agency: "partial", freelancer: false },
];

function Cell({ value }: { value: ComparisonValue }) {
  if (value === true) return <Check className="w-4 h-4 text-emerald-400 mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-gray-700 mx-auto" />;
  return <span className="text-[10px] text-amber-500 font-medium">Sometimes</span>;
}

export default function ComparisonTable() {
  return (
    <section className="py-20 sm:py-32 bg-[#05060A] relative overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase mb-3"
          >
            The Honest Comparison
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-4"
          >
            Xornexz vs. The Alternatives
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-gray-500 text-sm max-w-md mx-auto"
          >
            Radical transparency on how we stack up.
          </motion.p>
        </div>

        {/* Scroll hint on mobile */}
        <p className="text-center text-[10px] text-gray-700 uppercase tracking-widest mb-4 sm:hidden">
          Scroll to compare
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="overflow-x-auto w-full">
            <div className="min-w-[520px]">
              {/* Header */}
              <div className="grid grid-cols-4 mb-3">
                <div />
                <div className="text-center px-2 py-3">
                  <div className="inline-flex items-center gap-1.5 bg-violet-600/15 border border-violet-500/25 rounded-lg px-3 py-1.5">
                    <span className="text-xs font-bold text-white">Xornexz</span>
                    <span className="text-[9px] bg-violet-600 text-white px-1.5 py-0.5 rounded-full">Us</span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">Agency</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">Freelancer</span>
                </div>
              </div>

              {/* Rows */}
              <div className="rounded-xl border border-white/5 overflow-hidden bg-white/[0.015]">
                {rows.map((row, i) => (
                  <div
                    key={row.feature}
                    className={`grid grid-cols-4 items-center py-3 px-3 text-sm ${
                      i !== rows.length - 1 ? "border-b border-white/5" : ""
                    }`}
                  >
                    <div className="text-xs text-gray-400 font-medium pr-2">{row.feature}</div>
                    <div className="text-center bg-violet-600/[0.04] py-1.5 rounded-md">
                      <Cell value={row.us} />
                    </div>
                    <div className="text-center"><Cell value={row.agency} /></div>
                    <div className="text-center"><Cell value={row.freelancer} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
