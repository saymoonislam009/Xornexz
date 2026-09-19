"use client";

import { ArrowRight, Code2, Smartphone, Cloud, Webhook, PenTool, Bot, Wrench } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

const services = [
  {
    title: "Web Development",
    description: "High-performance, accessible, and scalable web applications built with modern frameworks.",
    icon: Code2,
    slug: "web-development",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Mobile Apps",
    description: "Native and cross-platform mobile experiences for iOS and Android.",
    icon: Smartphone,
    slug: "mobile-apps",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "SaaS & Custom Software",
    description: "End-to-end bespoke software solutions tailored to your business needs.",
    icon: Cloud,
    slug: "saas",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "API & Integrations",
    description: "Seamless connections between your favorite tools and platforms.",
    icon: Webhook,
    slug: "api-integrations",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "UI/UX Design",
    description: "User-centric design that converts and delights.",
    icon: PenTool,
    slug: "ui-ux-design",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "AI & Automation",
    description: "Smart systems and workflows to accelerate your growth.",
    icon: Bot,
    slug: "ai-automation",
    className: "md:col-span-2 md:row-span-1",
  },
  {
    title: "Maintenance & Support",
    description: "Ongoing technical support to keep your products running smoothly.",
    icon: Wrench,
    slug: "maintenance",
    className: "md:col-span-2 md:row-span-1",
  },
];

function ServiceCard({ service }: { service: typeof services[0] }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <Link
      href={`/services/${service.slug}`}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0D14] p-6 md:p-8 transition-all hover:border-white/20 ${service.className}`}
      ref={divRef as any /* eslint-disable-line @typescript-eslint/no-explicit-any */}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(124,58,237,.15), transparent 40%)`,
        }}
      />
      
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4 md:mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-cyan-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-300 transition-colors">
          <service.icon className="h-6 w-6" />
        </div>
        
        <h3 className="mb-2 md:mb-3 text-xl md:text-2xl font-semibold text-white font-display">
          {service.title}
        </h3>
        
        <p className="mb-6 md:mb-8 flex-1 text-sm md:text-base text-gray-400">
          {service.description}
        </p>
        
        <div className="mt-auto flex items-center text-sm font-semibold text-violet-400 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          Explore {service.title}
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

export default function ServicesSection() {
  return (
    <section className="py-32 bg-[#05060A] relative" id="services">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl md:text-5xl font-bold font-display text-white">
            What We Build
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            End-to-end digital product creation, from strategic discovery to flawless execution and continuous scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-min md:auto-rows-[250px]">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
