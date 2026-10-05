"use client";

import { useEffect, useRef } from "react";

function shouldSkip(): boolean {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return true;
  return false;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
}

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || shouldSkip()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stopped = false;
    let animId = 0;
    let W = 0, H = 0;
    let mx = 0.5, my = 0.5;
    let curOx = 0, curOy = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    const isMobile = W < 768;
    // Sleek lightweight particle count: 36 on desktop, 18 on mobile (prevents CPU thread choking)
    const count = isMobile ? 18 : 36;
    const DIST = isMobile ? Math.min(W, H) * 0.28 : Math.min(W, H) * 0.22;
    const DIST_SQ = DIST * DIST;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: (isMobile ? 1.0 : 0.8) + Math.random() * 1.8,
      hue: Math.random() > 0.5 ? 265 : 190,
    }));

    const onMove = (e: MouseEvent) => {
      mx = e.clientX / Math.max(W, 1);
      my = e.clientY / Math.max(H, 1);
    };

    const onTouch = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mx = (t.clientX - rect.left) / Math.max(W, 1);
        my = (t.clientY - rect.top) / Math.max(H, 1);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("resize", resize, { passive: true });

    let active = true;
    const io = new IntersectionObserver(([e]) => { active = e.isIntersecting; }, { threshold: 0.05 });
    io.observe(canvas);
    const onVis = () => { active = document.visibilityState === "visible"; };
    document.addEventListener("visibilitychange", onVis);

    let t = 0;
    let frameCount = 0;
    let isLight = false;

    const draw = () => {
      if (stopped) return;
      animId = requestAnimationFrame(draw);
      if (!active) return;
      t += 0.006;
      frameCount++;

      // Check theme only every 60 frames (not every single frame)
      if (frameCount % 60 === 1) {
        isLight = document.documentElement.classList.contains("light");
      }

      ctx.clearRect(0, 0, W, H);

      // Smooth subtle organic sway
      const ambientX = Math.sin(t * 0.8) * (isMobile ? 12 : 18);
      const ambientY = Math.cos(t * 0.6) * (isMobile ? 10 : 14);
      const targetOx = (mx - 0.5) * (isMobile ? 35 : 55) + ambientX;
      const targetOy = (my - 0.5) * (isMobile ? 35 : 55) + ambientY;
      curOx += (targetOx - curOx) * 0.04;
      curOy += (targetOy - curOy) * 0.04;

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(t + p.z * 10) * 0.12;
        p.y += p.vy + Math.cos(t + p.z * 8) * 0.1;
        if (p.x < -30) p.x = W + 30;
        if (p.x > W + 30) p.x = -30;
        if (p.y < -30) p.y = H + 30;
        if (p.y > H + 30) p.y = -30;
      }

      // Batch all line drawing into a single draw call (eliminates 80+ separate GPU draw calls)
      ctx.beginPath();
      ctx.lineWidth = isMobile ? 0.75 : 0.65;
      ctx.strokeStyle = isLight ? "rgba(124, 58, 237, 0.22)" : "rgba(139, 92, 246, 0.18)";

      for (let i = 0; i < count; i++) {
        const a = particles[i];
        const ax = a.x + curOx * a.z;
        const ay = a.y + curOy * a.z;
        for (let j = i + 1; j < count; j++) {
          const b = particles[j];
          const bx = b.x + curOx * b.z;
          const by = b.y + curOy * b.z;
          const dx = ax - bx;
          const dy = ay - by;
          // Squared distance comparison avoids Math.sqrt on every pair!
          if (dx * dx + dy * dy < DIST_SQ) {
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
          }
        }
      }
      ctx.stroke();

      // Render particle points with zero allocations (no dynamic radial gradients per frame)
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        const px = p.x + curOx * p.z;
        const py = p.y + curOy * p.z;
        const r = p.size * (0.6 + p.z * 0.6);

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        if (isLight) {
          ctx.fillStyle = p.hue === 265 ? "rgba(124, 58, 237, 0.75)" : "rgba(8, 145, 178, 0.75)";
        } else {
          ctx.fillStyle = p.hue === 265 ? "rgba(167, 139, 250, 0.75)" : "rgba(34, 211, 238, 0.75)";
        }
        ctx.fill();
      }
    };
    animId = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vw] max-w-4xl rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(124,58,237,0.18) 0%, rgba(6,182,212,0.1) 45%, transparent 75%)",
          }}
        />
      </div>
    </>
  );
}
