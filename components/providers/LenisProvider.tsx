"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"

function isSafari() {
  if (typeof window === "undefined") return false
  const ua = navigator.userAgent
  return /Safari/.test(ua) && !/Chrome/.test(ua) && !/Chromium/.test(ua)
}

declare global {
  interface Window {
    __lenis?: Lenis | null
  }
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  useEffect(() => {
    if (isAdmin) {
      window.__lenis = null
      return
    }
    // Skip on Safari, touch devices (native 120Hz momentum scroll is much smoother), and reduced-motion
    if (isSafari()) return
    if (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) return
    if (!window.matchMedia("(pointer: fine)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    window.__lenis = lenis

    let rafId: number
    const animate = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      if (window.__lenis === lenis) {
        window.__lenis = null
      }
    }
  }, [isAdmin])

  // Ensure route transitions always start cleanly at the top unless navigating to an anchor hash
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.location.hash) return
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true })
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior })
  }, [pathname])

  return <>{children}</>
}
