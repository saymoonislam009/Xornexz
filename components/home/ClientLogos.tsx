"use client";

const clients = [
  { name: "Stripe", width: 70 },
  { name: "Notion", width: 70 },
  { name: "Linear", width: 70 },
  { name: "Vercel", width: 70 },
  { name: "Figma", width: 55 },
  { name: "Shopify", width: 80 },
  { name: "Twilio", width: 70 },
  { name: "GitHub", width: 70 },
];

// Render as text wordmarks since we don't have actual logo files
const repeated = [...clients, ...clients, ...clients, ...clients];

export default function ClientLogos() {
  return (
    <section className="py-16 bg-[#05060A] border-t border-b border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-10 text-center">
        <p className="text-sm font-medium tracking-[0.2em] uppercase text-gray-500">
          Trusted by teams at world-class companies
        </p>
      </div>

      <div className="relative flex overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#05060A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#05060A] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee">
          {repeated.map((client, idx) => (
            <div
              key={idx}
              className="mx-8 flex items-center justify-center px-6 py-2 rounded-lg border border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 whitespace-nowrap"
            >
              <span className="text-lg font-bold text-gray-500 hover:text-gray-300 transition-colors tracking-tight">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
