"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import Image from "next/image";
import { isUnoptimizedImageSrc } from "@/lib/media-url";

type TestimonialItem = {
  id: string | number;
  name: string;
  title: string;
  avatar: string;
  quote: string;
  rating: number;
};

export default function Testimonials({ testimonials }: { testimonials: TestimonialItem[] }) {
  const [rawIndex, setCurrentIndex] = useState(0);
  const currentIndex = testimonials.length ? rawIndex % testimonials.length : 0;
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (isAutoPlaying && testimonials.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((p) => (p + 1) % testimonials.length);
      }, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, testimonials.length]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (!testimonials.length) return null;

  const current = testimonials[currentIndex];

  return (
    <section
      className="py-24 sm:py-32 bg-slate-50 dark:bg-[#05060A] relative overflow-hidden"
      id="testimonials"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-3 sm:mb-4">
            What Our Clients Say
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-2">
            Don&apos;t just take our word for it. Here&apos;s what the leaders we&apos;ve partnered with have to say about our work.
          </p>
        </div>

        <div
          className="max-w-4xl mx-auto relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative min-h-[380px] sm:min-h-[360px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col items-center justify-center text-center p-6 sm:p-10 md:p-14 bg-white dark:bg-[#0A0D14] border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl dark:shadow-2xl min-h-[380px] sm:min-h-[360px]"
              >
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-violet-500/25 dark:text-white/10 mb-6" />

                <p className="text-base sm:text-lg md:text-2xl text-slate-700 dark:text-gray-200 font-light leading-relaxed mb-8">
                  &ldquo;{current.quote}&rdquo;
                </p>

                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5">
                    <Image
                      src={current.avatar}
                      alt={current.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized={isUnoptimizedImageSrc(current.avatar)}
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-slate-900 dark:text-white font-semibold text-lg">
                      {current.name}
                    </h4>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">{current.title}</p>
                  </div>
                  <div className="flex gap-1 md:ml-4 text-amber-500">
                    {[...Array(Math.max(1, Math.min(5, current.rating || 5)))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2.5">
              {testimonials.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-9 bg-cyan-500 dark:bg-cyan-400"
                      : "w-2.5 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
