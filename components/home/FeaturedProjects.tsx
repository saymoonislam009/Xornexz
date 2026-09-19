"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "NexScale CRM",
    client: "NexScale",
    category: "SaaS Platform",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070",
    slug: "nexscale-crm"
  },
  {
    id: 2,
    title: "FinFlow Mobile",
    client: "FinFlow Inc",
    category: "Mobile App",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1470",
    slug: "finflow-mobile"
  },
  {
    id: 3,
    title: "Aura E-Commerce",
    client: "Aura Beauty",
    category: "Web App",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015",
    slug: "aura-ecommerce"
  },
  {
    id: 4,
    title: "Nova AI Analytics",
    client: "Nova Corp",
    category: "AI & Automation",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2070",
    slug: "nova-ai"
  }
];

export default function FeaturedProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    
    if (!isDesktop || !containerRef.current || !sliderRef.current) return;

    const sections = gsap.utils.toArray(".project-panel");
    
    const ctx = gsap.context(() => {
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => "+=" + sliderRef.current!.offsetWidth
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-[#0B0D14] md:h-screen md:overflow-hidden overflow-visible" id="work">
      <div className="md:absolute top-0 left-0 w-full h-full flex flex-col justify-center py-20 md:py-0">
        <div className="container mx-auto px-4 md:px-6 mb-8 md:mb-12">
          <h2 className="text-4xl md:text-6xl font-bold font-display text-white">
            Selected Work
          </h2>
        </div>

        <div 
          ref={sliderRef}
          className="flex flex-col md:flex-row md:w-[400vw] gap-8 md:gap-0 px-4 md:px-0"
        >
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="project-panel md:w-screen h-[50vh] md:h-[60vh] flex flex-col justify-center md:px-6 lg:px-12 xl:px-24"
            >
              <Link href={`/work/${project.slug}`} className="group relative block w-full h-full rounded-3xl overflow-hidden cursor-pointer shadow-2xl">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-white bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                      {project.category}
                    </span>
                    <span className="text-gray-300 text-sm">{project.client}</span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <h3 className="text-3xl md:text-5xl font-bold text-white font-display">
                      {project.title}
                    </h3>
                    <div className="hidden md:flex w-14 h-14 rounded-full bg-white text-black items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
