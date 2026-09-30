"use client";

import { motion } from "framer-motion";
import { Award, Star, Trophy, Globe, Code2, Layers } from "lucide-react";

const recognitions = [
  {
    icon: Trophy,
    label: "Top Web Dev Agency",
    source: "Clutch.co 2024",
  },
  {
    icon: Star,
    label: "4.9 / 5 Rating",
    source: "120+ verified reviews",
  },
  {
    icon: Award,
    label: "Best UX Design",
    source: "Awwwards Honoree",
  },
  {
    icon: Globe,
    label: "Global Clients",
    source: "30+ countries served",
  },
  {
    icon: Code2,
    label: "Open Source",
    source: "Active contributor",
  },
  {
    icon: Layers,
    label: "YC-Backed Clients",
    source: "Multiple portfolio companies",
  },
];

export default function Recognition() {
  return (
    <section className="py-20 bg-[#05060A] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {recognitions.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-violet-500/20 hover:bg-white/[0.04] transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:from-violet-500/30 group-hover:to-cyan-500/30 transition-all">
                <item.icon className="w-5 h-5 text-violet-400" />
              </div>
              <div className="text-sm font-bold text-white mb-1 font-display leading-tight">{item.label}</div>
              <div className="text-xs text-gray-600">{item.source}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
