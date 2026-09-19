"use client";

import { useEffect, useRef } from "react";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  IcosahedronGeometry,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  Color,
  MathUtils,
} from "three";

function shouldSkipScene(): boolean {
  if (typeof window === "undefined") return true;
  // Touch/mobile — skip
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return true;
  // Reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  // Save-Data header
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return true;
  // Low-power devices (fewer than 4 cores)
  if (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4) return true;
  return false;
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || shouldSkipScene()) return;

    let stopped = false;
    let rafId: number;
    let cleanup: (() => void) | undefined;

    const init = () => {
      if (stopped) return;

      // Cap DPR at 1.5, disable antialias at high DPR
      const dpr = Math.min(window.devicePixelRatio, 1.5);

      const renderer = new WebGLRenderer({
        alpha: true,
        antialias: dpr <= 1,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const scene = new Scene();
      const camera = new PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 7);

      // Detail 2 instead of 4 — same visual, 60% less geometry
      const geo = new EdgesGeometry(new IcosahedronGeometry(2.5, 2));
      const mat = new LineBasicMaterial({
        color: new Color("#7C3AED"),
        transparent: true,
        opacity: 0.5,
      });
      const mesh = new LineSegments(geo, mat);
      scene.add(mesh);

      let mouseX = 0,
        mouseY = 0,
        targetX = 0,
        targetY = 0;
      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener("mousemove", onMouseMove, { passive: true });

      const onResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener("resize", onResize, { passive: true });

      // Pause when off-screen
      let isVisible = true;
      const observer = new IntersectionObserver(
        ([entry]) => { isVisible = entry.isIntersecting; },
        { threshold: 0.1 }
      );
      observer.observe(container);

      // Pause when tab hidden
      let isTabActive = true;
      const onVisibility = () => { isTabActive = document.visibilityState === "visible"; };
      document.addEventListener("visibilitychange", onVisibility);

      let t = 0;
      const animate = () => {
        rafId = requestAnimationFrame(animate);
        if (!isVisible || !isTabActive) return;

        t += 0.008;
        targetX = MathUtils.lerp(targetX, mouseX * 0.4, 0.05);
        targetY = MathUtils.lerp(targetY, mouseY * 0.4, 0.05);
        mesh.rotation.y = t + targetX;
        mesh.rotation.x = targetY * 0.5;
        mesh.position.y = Math.sin(t * 0.6) * 0.18;

        // Pulse between violet and cyan
        const pulse = (Math.sin(t * 0.8) + 1) / 2;
        mat.color.lerpColors(new Color("#7C3AED"), new Color("#06B6D4"), pulse);
        mat.opacity = 0.35 + pulse * 0.15;

        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(rafId);
        observer.disconnect();
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    };

    // Defer until after first paint
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(init);
      return () => {
        stopped = true;
        cancelIdleCallback(id);
        cleanup?.();
      };
    } else {
      const id = setTimeout(init, 200);
      return () => {
        stopped = true;
        clearTimeout(id);
        cleanup?.();
      };
    }
  }, []);

  return (
    <>
      {/* Canvas mount point */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      />
      {/* CSS fallback — visible on mobile / reduced-motion, covered by canvas otherwise */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(6,182,212,0.08) 60%, transparent 100%)",
          }}
        />
      </div>
    </>
  );
}
