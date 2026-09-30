"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";

const tabs = [
  {
    label: "Next.js",
    code: `// Server Component — zero JS to client
export default async function ProductPage({ 
  params 
}: { params: { slug: string } }) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: { reviews: true },
  });
  if (!product) notFound();
  return (
    <main>
      <ProductHero product={product} />
      <ReviewList reviews={product.reviews} />
    </main>
  );
}`,
  },
  {
    label: "API Route",
    code: `// Edge-compatible API with Zod validation
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  email: z.string().email(),
  plan: z.enum(["starter", "growth", "enterprise"]),
});

export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.json();
  const data = schema.safeParse(body);
  if (!data.success) {
    return NextResponse.json(
      { error: data.error.flatten() },
      { status: 400 }
    );
  }
  await sendWelcomeEmail(data.data);
  return NextResponse.json({ ok: true });
}`,
  },
  {
    label: "Prisma",
    code: `// Type-safe transactional queries
const dashboard = await prisma.$transaction([
  prisma.user.count(
    { where: { isActive: true } }
  ),
  prisma.order.aggregate({
    _sum: { amount: true },
    where: {
      createdAt: { gte: startOfMonth(new Date()) },
      status: "COMPLETED",
    },
  }),
  prisma.product.findMany({
    where: { stock: { lt: 10 } },
    orderBy: { stock: "asc" },
    take: 5,
  }),
]);

const [users, revenue, lowStock] = dashboard;`,
  },
];

function highlight(code: string): string {
  return code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(\/{2}.*)/g, '<span class="text-gray-500 italic">$1</span>')
    .replace(/("[^"]*"|'[^']*')/g, '<span class="text-emerald-400">$1</span>')
    .replace(/\b(const|let|export|default|async|await|return|import|from|if)\b/g, '<span class="text-violet-400 font-semibold">$1</span>')
    .replace(/\b(NextResponse|prisma|z|db)\b/g, '<span class="text-cyan-400">$1</span>');
}

export default function CodeShowcase() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(tabs[active].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-32 bg-[#05060A] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-semibold tracking-[0.2em] text-violet-400 uppercase mb-4"
            >
              Clean Code, Always
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-6 leading-tight"
            >
              Production-Ready Code.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Every Time.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 leading-relaxed mb-8"
            >
              We do not cut corners. Every line we ship is type-safe, tested, documented, and built to survive your next 10x growth. You inherit a codebase you are proud to maintain.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              {[
                "TypeScript strict mode throughout",
                "Critical path test coverage enforced",
                "ESLint + Prettier via CI/CD",
                "Automated security scans on every PR",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-300 text-sm">
                  <span className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-violet-400" />
                  </span>
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="rounded-2xl border border-white/10 bg-[#0B0D14] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0E1018]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              </div>
              <div className="flex">
                {tabs.map((tab, i) => (
                  <button
                    key={tab.label}
                    onClick={() => setActive(i)}
                    className={`px-4 py-1.5 text-xs font-medium transition-all ${
                      active === i ? "text-white border-b-2 border-violet-500" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="p-5 overflow-x-auto min-h-[320px]">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs sm:text-sm font-mono text-gray-300 leading-relaxed whitespace-pre"
                  dangerouslySetInnerHTML={{ __html: highlight(tabs[active].code) }}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
