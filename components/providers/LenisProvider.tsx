"use client"

import { useEffect } from "react"
import Lenis from "lenis"

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Fine-pointer desktop only — use native scroll on touch
    if (!window.matchMedia("(pointer: fine)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let rafId: number
    const animate = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
