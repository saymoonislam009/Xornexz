"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sun, Moon, ChevronDown, Monitor, Code, Smartphone, Database, Cloud, Shield, Cpu } from "lucide-react"

const services = [
  { name: "Web Development", slug: "web-development", icon: Monitor, tag: "Scalable Apps" },
  { name: "Mobile Apps", slug: "mobile-apps", icon: Smartphone, tag: "iOS & Android" },
  { name: "UI/UX Design", slug: "ui-ux-design", icon: Code, tag: "Digital Experiences" },
  { name: "Cloud Architecture", slug: "cloud-architecture", icon: Cloud, tag: "AWS / Azure / GCP" },
  { name: "Data Engineering", slug: "data-engineering", icon: Database, tag: "Pipelines & AI" },
  { name: "Cybersecurity", slug: "cybersecurity", icon: Shield, tag: "Enterprise Grade" },
  { name: "IoT Solutions", slug: "iot-solutions", icon: Cpu, tag: "Connected Systems" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  // Don't render the public navbar on admin pages
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu AND mega menu on path change to prevent
  // AnimatePresence exit animations firing on already-removed DOM nodes
  useEffect(() => {
    setMobileMenuOpen(false)
    setMegaMenuOpen(false)
  }, [pathname])

  // Lock page scroll while the mobile menu is open; close on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileMenuOpen(false)
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [mobileMenuOpen])

  if (pathname?.startsWith("/admin")) return null

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,padding] duration-300 ${
        mobileMenuOpen
          ? "bg-white/95 dark:bg-[#05060A]/95 border-b border-slate-200 dark:border-white/5 py-4"
          : isScrolled
          ? "bg-white/85 dark:bg-[#05060A]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-white/5 py-4 shadow-sm dark:shadow-none"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-black text-sm font-display tracking-wider">X</span>
            </div>
            <span className="font-display text-2xl font-black tracking-tight text-slate-950 dark:text-white transition-colors">
              X<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">ornexz</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className={`text-sm font-medium transition-colors hover:text-cyan-500 dark:hover:text-cyan-400 ${pathname === "/" ? "text-cyan-500 dark:text-cyan-400 font-semibold" : "text-slate-700 dark:text-gray-300"}`}>
              Home
            </Link>
            
            {/* Mega Menu Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-cyan-500 dark:hover:text-cyan-400 ${pathname.startsWith("/services") ? "text-cyan-500 dark:text-cyan-400 font-semibold" : "text-slate-700 dark:text-gray-300"}`}>
                Services <ChevronDown className="h-4 w-4" />
              </button>
              
              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 top-full mt-4 w-[600px] -translate-x-1/2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0B0D14] p-6 shadow-2xl backdrop-blur-md"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {services.map((s) => (
                        <Link 
                          key={s.name} 
                          href={`/services/${s.slug}`}
                          className="group flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500 dark:text-violet-400 transition-colors group-hover:bg-cyan-500/10 group-hover:text-cyan-500 dark:group-hover:text-cyan-400">
                            <s.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-300">{s.name}</h4>
                            <p className="text-xs text-slate-500 dark:text-gray-400">{s.tag}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/portfolio" className={`text-sm font-medium transition-colors hover:text-cyan-500 dark:hover:text-cyan-400 ${pathname === "/portfolio" ? "text-cyan-500 dark:text-cyan-400 font-semibold" : "text-slate-700 dark:text-gray-300"}`}>Portfolio</Link>
            <Link href="/about" className={`text-sm font-medium transition-colors hover:text-cyan-500 dark:hover:text-cyan-400 ${pathname === "/about" ? "text-cyan-500 dark:text-cyan-400 font-semibold" : "text-slate-700 dark:text-gray-300"}`}>About</Link>
            <Link href="/process" className={`text-sm font-medium transition-colors hover:text-cyan-500 dark:hover:text-cyan-400 ${pathname === "/process" ? "text-cyan-500 dark:text-cyan-400 font-semibold" : "text-slate-700 dark:text-gray-300"}`}>Process</Link>
            <Link href="/pricing" className={`text-sm font-medium transition-colors hover:text-cyan-500 dark:hover:text-cyan-400 ${pathname === "/pricing" ? "text-cyan-500 dark:text-cyan-400 font-semibold" : "text-slate-700 dark:text-gray-300"}`}>Pricing</Link>
            <Link href="/blog" className={`text-sm font-medium transition-colors hover:text-cyan-500 dark:hover:text-cyan-400 ${pathname === "/blog" ? "text-cyan-500 dark:text-cyan-400 font-semibold" : "text-slate-700 dark:text-gray-300"}`}>Blog</Link>
          </nav>

          {/* Desktop Right */}
          <div className="hidden items-center gap-4 md:flex">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-slate-700 dark:text-gray-300 transition-colors hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-950 dark:hover:text-white"
              aria-label="Toggle theme"
              type="button"
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-500 dark:text-amber-300 transition-transform duration-200 hover:rotate-45" />
                ) : (
                  <Moon className="h-5 w-5 text-cyan-600 dark:text-cyan-400 transition-transform duration-200 hover:-rotate-12" />
                )
              ) : (
                <div className="h-5 w-5" />
              )}
            </button>
            <Link
              href="/contact"
              className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:from-violet-500 hover:to-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              Start a Project
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="relative z-50 -mr-2 flex h-11 w-11 items-center justify-center text-slate-900 dark:text-gray-100 md:hidden touch-manipulation hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/98 dark:bg-[#05060A] md:hidden flex flex-col pt-[72px] mobile-menu-overlay"
          >
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <nav className="flex flex-col gap-4 text-lg font-display font-medium">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${pathname === "/" ? "text-cyan-500 dark:text-cyan-400 font-semibold" : "text-slate-900 dark:text-white"}`}
                >
                  Home
                </Link>

                <div className="flex flex-col gap-2 py-1">
                  <span className="text-xs uppercase font-semibold tracking-wider text-slate-500 dark:text-gray-500">
                    Services
                  </span>
                  <div className="grid grid-cols-1 gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
                    {services.map((s) => (
                      <Link
                        key={s.name}
                        href={`/services/${s.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-1.5 text-sm text-slate-700 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                      >
                        <s.icon className="h-4 w-4 text-cyan-500 dark:text-cyan-400 shrink-0" />
                        <span>{s.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/portfolio"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${pathname === "/portfolio" ? "text-cyan-500 dark:text-cyan-400 font-semibold" : "text-slate-900 dark:text-white"}`}
                >
                  Portfolio
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${pathname === "/about" ? "text-cyan-500 dark:text-cyan-400 font-semibold" : "text-slate-900 dark:text-white"}`}
                >
                  About
                </Link>
                <Link
                  href="/process"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${pathname === "/process" ? "text-cyan-500 dark:text-cyan-400 font-semibold" : "text-slate-900 dark:text-white"}`}
                >
                  Process
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${pathname === "/pricing" ? "text-cyan-500 dark:text-cyan-400 font-semibold" : "text-slate-900 dark:text-white"}`}
                >
                  Pricing
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${pathname === "/blog" ? "text-cyan-500 dark:text-cyan-400 font-semibold" : "text-slate-900 dark:text-white"}`}
                >
                  Blog
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${pathname === "/contact" ? "text-cyan-500 dark:text-cyan-400 font-semibold" : "text-slate-900 dark:text-white"}`}
                >
                  Contact
                </Link>
              </nav>

              <div className="pt-4 space-y-4">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25"
                >
                  Start a Project
                </Link>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-gray-400">
                  <span>Theme</span>
                  <button
                    onClick={toggleTheme}
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white transition-colors hover:bg-slate-200 dark:hover:bg-white/10"
                  >
                    {mounted ? (
                      resolvedTheme === "dark" ? (
                        <Sun className="h-4 w-4 text-amber-500 dark:text-amber-300" />
                      ) : (
                        <Moon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      )
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                    <span>{mounted ? (resolvedTheme === "dark" ? "Light Mode" : "Dark Mode") : "Theme"}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
