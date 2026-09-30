"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function AnimatedCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);

  return (
    <motion.div
      onViewportEnter={() => {
        if (started.current) return;
        started.current = true;
        let startTime: number | null = null;
        const step = (ts: number) => {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setVal(Math.floor(ease * target));
          if (progress < 1) requestAnimationFrame(step);
          else setVal(target);
        };
        requestAnimationFrame(step);
      }}
      viewport={{ once: true }}
    >
      {val.toLocaleString()}{suffix}
    </motion.div>
  );
}

const items = [
  { label: "Commits pushed", target: 48200, suffix: "+", description: "Across all client repos" },
  { label: "API calls served", target: 98, suffix: "M+", description: "Peak load handled" },
  { label: "Avg. Lighthouse score", target: 97, suffix: "", description: "Performance benchmark" },
  { label: "Coffee consumed", target: 14200, suffix: "+", description: "In development hours" },
];

export default function LiveMetrics() {
  return (
    <section className="py-24 bg-[#0B0D14] relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-[0.2em] text-violet-400 uppercase mb-4"
          >
            By the Numbers
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white"
          >
            The Work Speaks
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 sm:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-violet-500/20 hover:bg-white/[0.04] transition-all duration-500 text-center"
            >
              <div className="text-4xl sm:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-2">
                <AnimatedCounter target={item.target} suffix={item.suffix} />
              </div>
              <div className="text-sm font-semibold text-white mb-1">{item.label}</div>
              <div className="text-xs text-gray-600">{item.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
