"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  // Use refs to avoid stale closures inside rAF loop
  const visibleRef = useRef(false)
  const activeRef = useRef(true)

  useEffect(() => {
    // Fine pointer (desktop) only
    if (!window.matchMedia("(pointer: fine)").matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const mouse = { x: 0, y: 0 }
    const dotPos = { x: 0, y: 0 }
    const ringPos = { x: 0, y: 0 }
    let rafId: number

    const show = () => {
      dot.style.opacity = "1"
      ring.style.opacity = "1"
      visibleRef.current = true
    }
    const hide = () => {
      dot.style.opacity = "0"
      ring.style.opacity = "0"
      visibleRef.current = false
    }

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; show() }
    const onLeave = () => hide()
    const onEnter = () => show()
    // Pause rAF when tab hidden — fixes stale isVisible bug
    const onVisibility = () => { activeRef.current = document.visibilityState === "visible" }

    window.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mouseenter", onEnter)
    document.addEventListener("visibilitychange", onVisibility)

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const hovering = !!(t.closest("a") || t.closest("button") || t.closest("[data-cursor]"))
      ring.style.width = hovering ? "48px" : "32px"
      ring.style.height = hovering ? "48px" : "32px"
      ring.style.backgroundColor = hovering ? "rgba(124,58,237,0.15)" : "transparent"
    }
    document.addEventListener("mouseover", onOver)

    const render = () => {
      rafId = requestAnimationFrame(render)
      if (!activeRef.current || !visibleRef.current) return

      dotPos.x += (mouse.x - dotPos.x) * 0.35
      dotPos.y += (mouse.y - dotPos.y) * 0.35
      ringPos.x += (mouse.x - ringPos.x) * 0.15
      ringPos.y += (mouse.y - ringPos.y) * 0.15

      dot.style.transform = `translate3d(${dotPos.x}px,${dotPos.y}px,0) translate(-50%,-50%)`
      ring.style.transform = `translate3d(${ringPos.x}px,${ringPos.y}px,0) translate(-50%,-50%)`
    }
    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mouseenter", onEnter)
      document.removeEventListener("visibilitychange", onVisibility)
      document.removeEventListener("mouseover", onOver)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{ opacity: 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-cyan-400 will-change-transform transition-opacity duration-150"
      />
      <div
        ref={ringRef}
        style={{ opacity: 0, width: 32, height: 32 }}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-violet-500 will-change-transform transition-all duration-200"
      />
    </>
  )
}
