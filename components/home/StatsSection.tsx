"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface StatItemProps {
  end: number;
  suffix?: string;
  label: string;
  duration?: number;
}

function StatItem({ end, suffix = "", label, duration = 2000 }: StatItemProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeProgress = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setCount(Math.floor(end * easeProgress));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [inView, end, duration]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 md:p-8 border border-white/5 bg-white/[0.02] rounded-2xl relative overflow-hidden group hover:bg-white/[0.04] transition-colors">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-2">
        {count}{suffix}
      </div>
      <div className="text-xs md:text-sm lg:text-base text-gray-400 font-medium tracking-wider uppercase text-center">
        {label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-24 bg-[#05060A] relative border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatItem end={120} suffix="+" label="Projects Delivered" />
          <StatItem end={98} suffix="%" label="Client Satisfaction" />
          <StatItem end={7} suffix="+" label="Years Building" />
          <StatItem end={40} suffix="+" label="Team Members" />
        </div>
      </div>
    </section>
  );
}
