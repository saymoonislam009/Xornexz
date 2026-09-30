"use client";

import { useEffect, useRef } from "react";

function shouldSkip(): boolean {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return true;
  if ((navigator.hardwareConcurrency ?? 8) < 4) return true;
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

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * Math.min(devicePixelRatio, 1.5);
      canvas.height = H * Math.min(devicePixelRatio, 1.5);
      ctx.scale(Math.min(devicePixelRatio, 1.5), Math.min(devicePixelRatio, 1.5));
    };
    resize();

    const count = Math.min(130, Math.floor((W * H) / 7000));
    const DIST = Math.min(W, H) * 0.18;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: 0.8 + Math.random() * 2,
      hue: Math.random() > 0.5 ? 265 : 190,
    }));

    const onMove = (e: MouseEvent) => { mx = e.clientX / W; my = e.clientY / H; };
    window.addEventListener("mousemove", onMove, { passive: true });
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
      t += 0.005;

      ctx.clearRect(0, 0, W, H);

      const ox = (mx - 0.5) * 60;
      const oy = (my - 0.5) * 60;

      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.z * 10) * 0.15;
        p.y += p.vy + Math.cos(t + p.z * 8) * 0.12;
        if (p.x < -50) p.x = W + 50;
        if (p.x > W + 50) p.x = -50;
        if (p.y < -50) p.y = H + 50;
        if (p.y > H + 50) p.y = -50;
      }

      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const ax = a.x + ox * a.z;
        const ay = a.y + oy * a.z;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const bx = b.x + ox * b.z;
          const by = b.y + oy * b.z;
          const dx = ax - bx, dy = ay - by;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) {
            const alpha = (1 - d / DIST) * 0.35 * Math.min(a.z, b.z + 0.3);
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2},80%,65%,${alpha})`;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const px = p.x + ox * p.z;
        const py = p.y + oy * p.z;
        const r = p.size * (0.4 + p.z);
        const alpha = 0.25 + p.z * 0.75;

        const grd = ctx.createRadialGradient(px, py, 0, px, py, r * 4);
        grd.addColorStop(0, `hsla(${p.hue},80%,65%,${alpha * 0.4})`);
        grd.addColorStop(1, `hsla(${p.hue},80%,65%,0)`);
        ctx.beginPath();
        ctx.arc(px, py, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,72%,${alpha})`;
        ctx.fill();
      }
    };
    animId = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-3xl rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.07) 50%, transparent 80%)",
          }}
        />
      </div>
    </>
  );
}
