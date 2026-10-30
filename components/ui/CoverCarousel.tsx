"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { isUnoptimizedImageSrc } from "@/lib/media-url";

const MAX_SLIDES = 6;

/**
 * Cross-fading image rotator for project covers.
 *  - Auto-rotates only while on screen, tab visible and pointer not over it.
 *  - Honours `prefers-reduced-motion` (no auto-rotation; dots still work).
 *  - Renders a single image (no timers, no dots) when there is only one.
 * Dots are <button>s so the carousel can sit inside a <Link> without navigating.
 */
export function CoverCarousel({
  images,
  alt,
  sizes,
  priority = false,
  interval = 4500,
  imageClassName = "object-cover",
}: {
  images: string[];
  alt: string;
  sizes: string;
  priority?: boolean;
  interval?: number;
  imageClassName?: string;
}) {
  const slides = images.slice(0, MAX_SLIDES);
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || count < 2 || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [count]);

  useEffect(() => {
    if (count < 2 || paused || !visible || reduced) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % count);
    }, interval);
    return () => window.clearInterval(id);
  }, [count, paused, visible, reduced, interval]);

  const go = useCallback((e: React.MouseEvent, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex(i);
  }, []);

  if (count === 0) return null;

  return (
    <div
      ref={rootRef}
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === index ? alt : ""}
          aria-hidden={i !== index}
          fill
          sizes={sizes}
          priority={priority && i === 0}
          loading={priority && i === 0 ? undefined : "lazy"}
          unoptimized={isUnoptimizedImageSrc(src)}
          className={`${imageClassName} transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {count > 1 && (
        <div className="absolute right-5 top-5 z-20 flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1.5 backdrop-blur-md">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-current={i === index}
              onClick={(e) => go(e, i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
