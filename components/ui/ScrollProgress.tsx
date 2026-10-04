"use client"

import { useEffect, useRef } from "react"

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false

    // Update via a ref + transform inside rAF — no React re-render per scroll event.
    const update = () => {
      ticking = false
      const bar = barRef.current
      if (!bar) return
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0
      bar.style.transform = `scaleX(${pct})`
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed top-0 left-0 right-0 z-[100] h-[2px] bg-transparent">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-violet-600 via-purple-500 to-cyan-500 will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  )
}
