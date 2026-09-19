"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search, PenTool, Code, Rocket, TrendingUp } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Discovery",
    description: "We dive deep into your business goals, target audience, and technical requirements to define a clear roadmap.",
    icon: Search,
  },
  {
    id: 2,
    title: "Design",
    description: "Our design team crafts intuitive, conversion-focused wireframes and stunning high-fidelity prototypes.",
    icon: PenTool,
  },
  {
    id: 3,
    title: "Build",
    description: "We write clean, scalable code using the modern tech stack, ensuring high performance and security.",
    icon: Code,
  },
  {
    id: 4,
    title: "Launch",
    description: "Rigorous QA testing, deployment to production, and seamless handover to ensure a flawless launch.",
    icon: Rocket,
  },
  {
    id: 5,
    title: "Scale",
    description: "Continuous monitoring, feature updates, and performance optimization to help you grow.",
    icon: TrendingUp,
  }
];

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-32 bg-[#05060A] relative" id="process">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-4xl md:text-5xl font-bold font-display text-white">
            How We Work
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            A proven, transparent process designed to deliver exceptional results on time and on budget.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto" ref={containerRef}>
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="w-full h-full bg-white/10" />
            <motion.div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-violet-600 to-cyan-500 origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-16 md:space-y-24 pt-8 pb-8">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={step.id} 
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? 'md:pr-20 md:text-right' : 'md:pl-20 text-left'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/[0.04] transition-colors"
                    >
                      <div className={`mb-4 text-violet-400 flex ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                        <step.icon className="w-8 h-8" />
                      </div>
                      <div className="text-sm font-bold text-gray-500 mb-2 font-display">STEP 0{step.id}</div>
                      <h3 className="text-2xl font-bold text-white mb-4 font-display">{step.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{step.description}</p>
                    </motion.div>
                  </div>

                  <div className="absolute left-8 md:left-1/2 top-8 md:top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#05060A] border-2 border-white/20 flex items-center justify-center z-10">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500" />
                  </div>
                  
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
