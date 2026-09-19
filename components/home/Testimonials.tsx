"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    title: "CTO, NexScale",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    quote: "Xornexz didn't just build our platform; they completely reimagined how we handle data scaling. The result is 10x faster and absolutely beautiful. Truly an Awwwards-level team.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Founder, FinFlow",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    quote: "Their attention to detail is unmatched. The mobile app they built for us has over 4.9 stars on the App Store, and the seamless UX is a big reason why.",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    title: "Director of Product, Aura",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    quote: "Working with them was the best decision we made this year. They took our complex requirements and delivered a streamlined, intuitive solution ahead of schedule.",
    rating: 5,
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      timerRef.current = setInterval(() => {
        next();
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, currentIndex]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <section className="py-32 bg-[#05060A] relative overflow-hidden" id="testimonials">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what the leaders we've partnered with have to say about our work.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          
          <div className="relative h-[450px] md:h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 md:p-16 bg-[#0A0D14] border border-white/10 rounded-3xl shadow-2xl"
              >
                <Quote className="w-10 h-10 md:w-14 md:h-14 text-white/10 mb-8" />
                
                <p className="text-lg md:text-2xl text-gray-200 font-light leading-relaxed mb-10">
                  "{testimonials[currentIndex].quote}"
                </p>
                
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/10">
                    <Image
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-white font-semibold text-lg">{testimonials[currentIndex].name}</h4>
                    <p className="text-gray-400 text-sm">{testimonials[currentIndex].title}</p>
                  </div>
                  <div className="flex gap-1 md:ml-4 text-yellow-500">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center items-center gap-6 mt-10">
            <button 
              onClick={prev}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-3">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-10 bg-cyan-400" : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={next}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
