"use client";

const words = ["DESIGN", "DEVELOP", "DEPLOY", "SCALE", "ITERATE", "INNOVATE", "BUILD", "LAUNCH"];
const repeated = [...words, ...words, ...words, ...words];

export default function KineticMarquee() {
  return (
    <div className="py-6 sm:py-10 overflow-hidden bg-[#05060A] border-y border-white/5">
      <div className="flex items-center w-fit animate-marquee-fast">
        {repeated.map((word, i) => (
          <span
            key={i}
            className={`text-3xl sm:text-6xl md:text-8xl font-black font-display mx-4 sm:mx-8 select-none whitespace-nowrap ${
              i % 2 === 0
                ? "text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-500"
                : "text-white/[0.04]"
            }`}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
