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
  x: number; y: number; z: number;
  vx: number; vy: number;
  size: number; hue: number;
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
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    const isMobile = W < 768;
    const count = isMobile ? Math.min(42, Math.max(24, Math.floor((W * H) / 10000))) : Math.min(110, Math.floor((W * H) / 7500));
    const DIST = isMobile ? Math.min(W, H) * 0.28 : Math.min(W, H) * 0.18;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: (isMobile ? 1.0 : 0.8) + Math.random() * 2,
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
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("resize", resize, { passive: true });

    let active = true;
    const io = new IntersectionObserver(([e]) => { active = e.isIntersecting; }, { threshold: 0.05 });
    io.observe(canvas);
    const onVis = () => { active = document.visibilityState === "visible"; };
    document.addEventListener("visibilitychange", onVis);

    let t = 0;
    const draw = () => {
      if (stopped) return;
      animId = requestAnimationFrame(draw);
      if (!active) return;
      t += 0.006;

      ctx.clearRect(0, 0, W, H);

      // Determine theme for high-contrast rendering
      const isLight = document.documentElement.classList.contains("light");

      // Smooth ambient organic wave combined with touch/mouse position
      const ambientX = Math.sin(t * 0.8) * (isMobile ? 18 : 22);
      const ambientY = Math.cos(t * 0.6) * (isMobile ? 14 : 18);
      const targetOx = (mx - 0.5) * (isMobile ? 45 : 70) + ambientX;
      const targetOy = (my - 0.5) * (isMobile ? 45 : 70) + ambientY;
      curOx += (targetOx - curOx) * 0.04;
      curOy += (targetOy - curOy) * 0.04;

      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.z * 10) * 0.15;
        p.y += p.vy + Math.cos(t + p.z * 8) * 0.12;
        if (p.x < -40) p.x = W + 40;
        if (p.x > W + 40) p.x = -40;
        if (p.y < -40) p.y = H + 40;
        if (p.y > H + 40) p.y = -40;
      }

      ctx.lineWidth = isMobile ? 0.8 : 0.65;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const ax = a.x + curOx * a.z;
        const ay = a.y + curOy * a.z;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const bx = b.x + curOx * b.z;
          const by = b.y + curOy * b.z;
          const dx = ax - bx, dy = ay - by;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) {
            const baseAlpha = (1 - d / DIST) * 0.42 * Math.min(a.z, b.z + 0.35);
            const lineHue = Math.round((a.hue + b.hue) / 2);
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            if (isLight) {
              ctx.strokeStyle = `hsla(${lineHue}, 85%, 45%, ${baseAlpha * 1.5})`;
            } else {
              ctx.strokeStyle = `hsla(${lineHue}, 80%, 65%, ${baseAlpha})`;
            }
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const px = p.x + curOx * p.z;
        const py = p.y + curOy * p.z;
        const r = p.size * (0.5 + p.z * 0.8);
        const alpha = isLight ? (0.45 + p.z * 0.55) : (0.28 + p.z * 0.72);
        const lightness = isLight ? 42 : 72;

        const grd = ctx.createRadialGradient(px, py, 0, px, py, r * 4.5);
        if (isLight) {
          grd.addColorStop(0, `hsla(${p.hue}, 90%, 45%, ${alpha * 0.5})`);
          grd.addColorStop(1, `hsla(${p.hue}, 90%, 45%, 0)`);
        } else {
          grd.addColorStop(0, `hsla(${p.hue}, 80%, 65%, ${alpha * 0.45})`);
          grd.addColorStop(1, `hsla(${p.hue}, 80%, 65%, 0)`);
        }
        ctx.beginPath();
        ctx.arc(px, py, r * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, ${lightness}%, ${alpha})`;
        ctx.fill();
      }
    };
    animId = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchstart", onTouch);
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
