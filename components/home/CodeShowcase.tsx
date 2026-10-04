"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";

const tabs = [
  {
    label: "Next.js",
    code: `// Server Component
export default async function Page({
  params,
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
    code: `// Edge API + Zod validation
const schema = z.object({
  email: z.string().email(),
  plan: z.enum(["starter", "growth"]),
});

export const runtime = "edge";

export async function POST(req: Request) {
  const data = schema.safeParse(await req.json());
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
    code: `// Type-safe transaction
const [users, revenue, stock] =
  await prisma.$transaction([
    prisma.user.count(
      { where: { isActive: true } }
    ),
    prisma.order.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED" },
    }),
    prisma.product.findMany({
      where: { stock: { lt: 10 } },
      orderBy: { stock: "asc" },
      take: 5,
    }),
  ]);`,
  },
];

function hl(code: string): string {
  return code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(\/\/.*)/g, '<span class="text-gray-600 italic">$1</span>')
    .replace(/("[^"]*"|'[^']*')/g, '<span class="text-emerald-400">$1</span>')
    .replace(/\b(const|let|export|default|async|await|return|import|from|if)\b/g, '<span class="text-violet-400">$1</span>')
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
    <section className="py-20 sm:py-32 bg-[#05060A] relative overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Copy */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[11px] font-semibold tracking-[0.2em] text-violet-400 uppercase mb-3"
            >
              Clean Code, Always
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-4 leading-tight"
            >
              Production-Ready Code.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                Every Time.
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-gray-500 text-sm leading-relaxed mb-6"
            >
              Every line we ship is type-safe, tested, and built to survive your next 10x. You inherit a codebase you are proud to own.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-2.5"
            >
              {[
                "TypeScript strict mode throughout",
                "Critical path test coverage",
                "ESLint + Prettier via CI/CD",
                "Security scans on every PR",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-gray-400 text-sm">
                  <span className="w-4 h-4 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-violet-400" />
                  </span>
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Code editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="rounded-xl border border-white/10 bg-[#0B0D14] overflow-hidden"
          >
            {/* Chrome bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0E1018]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
              {/* Tabs */}
              <div className="flex gap-1">
                {tabs.map((tab, i) => (
                  <button
                    key={tab.label}
                    onClick={() => setActive(i)}
                    className={`px-2.5 sm:px-4 py-1 text-[10px] sm:text-xs font-medium rounded transition-all ${
                      active === i
                        ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                        : "text-gray-600 hover:text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {/* Copy btn */}
              <button
                onClick={copy}
                className="flex items-center gap-1 text-[10px] text-gray-600 hover:text-gray-300 transition-colors"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Code area — scrollable */}
            <div className="p-4 overflow-x-auto">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={active}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="text-[11px] sm:text-xs font-mono text-gray-400 leading-relaxed whitespace-pre min-h-[200px]"
                  dangerouslySetInnerHTML={{ __html: hl(tabs[active].code) }}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
