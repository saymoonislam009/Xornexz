"use client";

import { motion } from "framer-motion";

const categories = [
  {
    label: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Python", "Go", "GraphQL", "REST APIs", "WebSockets"],
  },
  {
    label: "Data",
    items: ["PostgreSQL", "Redis", "MongoDB", "Prisma", "Elasticsearch", "ClickHouse"],
  },
  {
    label: "Infrastructure",
    items: ["AWS", "Vercel", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
  },
];

const row1 = ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "Redis", "AWS", "Docker", "GraphQL", "Figma", "Go"];
const row2 = ["Kubernetes", "Vercel", "TailwindCSS", "Three.js", "Prisma", "MongoDB", "Terraform", "WebSockets", "Elasticsearch", "GitHub Actions", "OpenAI", "Stripe"];
const repeatedRow1 = [...row1, ...row1, ...row1];
const repeatedRow2 = [...row2, ...row2, ...row2];

export default function TechStack() {
  return (
    <section className="py-32 bg-[#05060A] overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6 mb-16 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-[0.2em] text-violet-400 uppercase mb-4"
        >
          Technology
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-6"
        >
          Built With Industry-Leading Tech
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-xl mx-auto"
        >
          We choose tools for their merit, not their hype. Every technology in our stack is production-proven and battle-tested.
        </motion.p>
      </div>

      {/* Category Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="container mx-auto px-4 md:px-6 mb-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat.label} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
              <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-3">{cat.label}</p>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span key={item} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/5 text-gray-400">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Marquee rows */}
      <div className="relative flex flex-col gap-6 max-w-[100vw] overflow-hidden">
        <div className="absolute top-0 bottom-0 left-0 w-20 md:w-32 bg-gradient-to-r from-[#05060A] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-20 md:w-32 bg-gradient-to-l from-[#05060A] to-transparent z-10 pointer-events-none" />

        <div className="flex group w-fit">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
            {repeatedRow1.map((tech, idx) => (
              <div key={idx} className="mx-3 md:mx-4 flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 whitespace-nowrap text-sm font-medium text-gray-500 hover:text-gray-300 hover:border-violet-500/20 transition-colors">
                {tech}
              </div>
            ))}
          </div>
        </div>

        <div className="flex group w-fit">
          <div className="flex animate-marquee-reverse group-hover:[animation-play-state:paused]">
            {repeatedRow2.map((tech, idx) => (
              <div key={idx} className="mx-3 md:mx-4 flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 whitespace-nowrap text-sm font-medium text-gray-500 hover:text-gray-300 hover:border-cyan-500/20 transition-colors">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
