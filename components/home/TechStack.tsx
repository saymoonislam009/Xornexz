"use client";

export default function TechStack() {
  const row1 = ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "Redis", "AWS"];
  const row2 = ["AWS", "Vercel", "Figma", "TailwindCSS", "GraphQL", "Docker", "Kubernetes", "React"];

  const repeatedRow1 = [...row1, ...row1, ...row1, ...row1];
  const repeatedRow2 = [...row2, ...row2, ...row2, ...row2];

  return (
    <section className="py-24 bg-[#05060A] overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6 mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-white">
          Built With Industry-Leading Tech
        </h2>
      </div>

      <div className="relative flex flex-col gap-6 md:gap-8 max-w-[100vw] overflow-hidden">
        <div className="absolute top-0 bottom-0 left-0 w-20 md:w-32 bg-gradient-to-r from-[#05060A] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-20 md:w-32 bg-gradient-to-l from-[#05060A] to-transparent z-10 pointer-events-none" />

        <div className="flex group w-fit">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
            {repeatedRow1.map((tech, idx) => (
              <div key={idx} className="mx-3 md:mx-6 flex items-center justify-center px-6 py-3 md:px-8 md:py-4 rounded-xl bg-white/5 border border-white/10 whitespace-nowrap text-lg md:text-xl font-medium text-gray-300 hover:text-white hover:bg-white/10 hover:border-violet-500/50 transition-colors">
                {tech}
              </div>
            ))}
          </div>
        </div>

        <div className="flex group w-fit">
          <div className="flex animate-marquee-reverse group-hover:[animation-play-state:paused]">
            {repeatedRow2.map((tech, idx) => (
              <div key={idx} className="mx-3 md:mx-6 flex items-center justify-center px-6 py-3 md:px-8 md:py-4 rounded-xl bg-white/5 border border-white/10 whitespace-nowrap text-lg md:text-xl font-medium text-gray-300 hover:text-white hover:bg-white/10 hover:border-cyan-500/50 transition-colors">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
