"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const visible = useRef(false)
  const hovering = useRef(false)
  const mouse = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const raf = useRef(0)

  useEffect(() => {
    if (typeof window === "undefined") return
    // Only on fine-pointer (real mouse) desktops
    if (!window.matchMedia("(pointer: fine)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const show = () => { dot.style.opacity = "1"; ring.style.opacity = "1"; visible.current = true }
    const hide = () => { dot.style.opacity = "0"; ring.style.opacity = "0"; visible.current = false }

    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; show() }
    const onLeave = () => hide()
    const onEnter = () => show()
    const onOver = (e: MouseEvent) => {
      const h = !!(e.target as HTMLElement).closest("a,button,[role=button],[data-cursor]")
      if (h === hovering.current) return
      hovering.current = h
      ring.style.width  = h ? "44px" : "32px"
      ring.style.height = h ? "44px" : "32px"
      ring.style.borderColor = h ? "rgba(6,182,212,0.8)" : "rgba(124,58,237,0.6)"
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mouseenter", onEnter)
    document.addEventListener("mouseover", onOver)

    const render = () => {
      raf.current = requestAnimationFrame(render)
      if (!visible.current) return
      dot.style.transform = `translate3d(${mouse.current.x}px,${mouse.current.y}px,0) translate(-50%,-50%)`
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12
      ring.style.transform = `translate3d(${ringPos.current.x}px,${ringPos.current.y}px,0) translate(-50%,-50%)`
    }
    raf.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mouseenter", onEnter)
      document.removeEventListener("mouseover", onOver)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} aria-hidden style={{ opacity: 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-cyan-400 will-change-transform transition-opacity duration-100" />
      <div ref={ringRef} aria-hidden style={{ opacity: 0, width: 32, height: 32 }}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border-2 border-violet-500/60 will-change-transform transition-[width,height,border-color,opacity] duration-200" />
    </>
  )
}
