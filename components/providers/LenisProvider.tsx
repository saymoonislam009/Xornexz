"use client"

import { useEffect } from "react"
import Lenis from "lenis"

function isSafari() {
  if (typeof window === "undefined") return false
  const ua = navigator.userAgent
  return /Safari/.test(ua) && !/Chrome/.test(ua) && !/Chromium/.test(ua)
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Skip on Safari (conflicts with native momentum scroll) and touch/reduced-motion
    if (isSafari()) return
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
