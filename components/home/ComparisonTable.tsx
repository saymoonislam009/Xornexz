"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

type ComparisonValue = boolean | "partial";

type RowData = {
  feature: string;
  us: ComparisonValue;
  agency: ComparisonValue;
  freelancer: ComparisonValue;
};

const rows: RowData[] = [
  { feature: "Fixed-scope pricing", us: true, agency: false, freelancer: "partial" },
  { feature: "Full IP ownership on delivery", us: true, agency: true, freelancer: true },
  { feature: "Dedicated engineering team", us: true, agency: true, freelancer: false },
  { feature: "Post-launch support SLA", us: true, agency: false, freelancer: false },
  { feature: "Weekly progress demos", us: true, agency: "partial", freelancer: false },
  { feature: "Security audit included", us: true, agency: false, freelancer: false },
  { feature: "Scalable cloud architecture", us: true, agency: "partial", freelancer: false },
  { feature: "Design system delivered", us: true, agency: "partial", freelancer: false },
];

function Cell({ value }: { value: boolean | "partial" }) {
  if (value === true) return <Check className="w-5 h-5 text-emerald-400 mx-auto" />;
  if (value === false) return <X className="w-5 h-5 text-gray-700 mx-auto" />;
  return <span className="text-xs text-amber-500 font-medium">Sometimes</span>;
}

export default function ComparisonTable() {
  return (
    <section className="py-32 bg-[#05060A] relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-[0.2em] text-violet-400 uppercase mb-4"
          >
            The Honest Comparison
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-6"
          >
            Xornexz vs. The Alternatives
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto"
          >
            We believe in radical transparency. Here is how we stack up against typical alternatives.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto overflow-x-auto"
        >
          <div className="min-w-[640px]">
            {/* Header */}
            <div className="grid grid-cols-4 mb-4">
              <div className="col-span-1" />
              <div className="text-center py-4 px-4">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600/20 to-cyan-500/20 border border-violet-500/30 rounded-xl px-4 py-2">
                  <span className="text-sm font-bold text-white">Xornexz</span>
                  <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full">Us</span>
                </div>
              </div>
              <div className="text-center py-4 px-4">
                <span className="text-sm font-semibold text-gray-400">Large Agency</span>
              </div>
              <div className="text-center py-4 px-4">
                <span className="text-sm font-semibold text-gray-400">Freelancer</span>
              </div>
            </div>

            {/* Rows */}
            <div className="rounded-2xl border border-white/5 overflow-hidden bg-white/[0.02]">
              {rows.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-4 items-center py-4 px-4 ${
                    i !== rows.length - 1 ? "border-b border-white/5" : ""
                  } hover:bg-white/[0.03] transition-colors`}
                >
                  <div className="col-span-1 text-sm text-gray-300 font-medium pr-4">{row.feature}</div>
                  <div className="text-center bg-violet-600/5 py-2 rounded-lg">
                    <Cell value={row.us} />
                  </div>
                  <div className="text-center">
                    <Cell value={row.agency} />
                  </div>
                  <div className="text-center">
                    <Cell value={row.freelancer} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
