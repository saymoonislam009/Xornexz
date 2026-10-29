"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Monitor,
  Code,
  Smartphone,
  Database,
  Cloud,
  Shield,
  Cpu,
  Globe,
  Layers,
  Plug,
  Palette,
  Bot,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

export interface NavServiceItem {
  title: string
  slug: string
  tagline?: string
  icon?: string
}

const DEFAULT_SERVICES: NavServiceItem[] = [
  { title: "Web Development", slug: "web-development", icon: "Globe", tagline: "Scalable Web Platforms" },
  { title: "Mobile Apps", slug: "mobile-apps", icon: "Smartphone", tagline: "iOS & Android" },
  { title: "SaaS Platforms", slug: "saas-platforms", icon: "Layers", tagline: "Multi-Tenant Products" },
  { title: "UI/UX Design", slug: "ui-ux-design", icon: "Palette", tagline: "Digital Experiences" },
  { title: "AI & Automation", slug: "ai-automation", icon: "Bot", tagline: "LLMs & Workflows" },
  { title: "API Integration", slug: "api-integration", icon: "Plug", tagline: "Connected Systems" },
]

const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Monitor,
  Smartphone,
  Layers,
  Plug,
  Palette,
  Bot,
  Code,
  Database,
  Cloud,
  Shield,
  Cpu,
  Sparkles,
}

function getServiceIcon(name?: string): LucideIcon {
  if (!name) return Monitor
  return ICON_MAP[name] || Monitor
}

interface NavbarProps {
  siteName?: string
  logoUrl?: string
  services?: NavServiceItem[]
}

export function Navbar({ siteName = "Xornexz", logoUrl, services }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()

  const serviceList = services && services.length > 0 ? services.slice(0, 8) : DEFAULT_SERVICES

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu AND mega menu on path change
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

  const scrollToHomeTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false)
    setMegaMenuOpen(false)
    if (pathname === "/") {
      e.preventDefault()
      if (typeof window !== "undefined") {
        if (window.__lenis) {
          window.__lenis.scrollTo(0)
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      }
    }
  }

  const brandFirst = siteName.slice(0, 1) || "X"
  const brandRest = siteName.slice(1) || "ornexz"

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,padding] duration-300 ${
          mobileMenuOpen
            ? "bg-white/95 dark:bg-[#05060A]/95 border-b border-slate-200 dark:border-white/5 py-4"
            : isScrolled
            ? "bg-white/85 dark:bg-[#05060A]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-white/5 py-3.5 shadow-sm dark:shadow-none"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              onClick={scrollToHomeTop}
              aria-label={`${siteName} Home`}
              className="group flex items-center gap-2.5 cursor-pointer select-none"
            >
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform duration-200">
                    <span className="text-white font-black text-sm font-display tracking-wider">
                      {brandFirst}
                    </span>
                  </div>
                  <span className="font-display text-2xl font-black tracking-tight text-slate-950 dark:text-white transition-colors">
                    {brandFirst}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
                      {brandRest}
                    </span>
                  </span>
                </>
              )}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-7 lg:gap-8 md:flex">
              <Link
                href="/"
                onClick={scrollToHomeTop}
                className={`text-sm font-medium transition-colors hover:text-cyan-600 dark:hover:text-cyan-400 ${
                  pathname === "/"
                    ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                    : "text-slate-700 dark:text-gray-300"
                }`}
              >
                Home
              </Link>

              {/* Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <Link
                  href="/services"
                  className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-cyan-600 dark:hover:text-cyan-400 ${
                    pathname.startsWith("/services")
                      ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                      : "text-slate-700 dark:text-gray-300"
                  }`}
                >
                  Services <ChevronDown className="h-4 w-4" />
                </Link>

                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.16 }}
                      className="absolute left-1/2 top-full pt-3 w-[600px] -translate-x-1/2"
                    >
                      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0B0D14]/95 p-5 shadow-2xl backdrop-blur-xl">
                        <div className="grid grid-cols-2 gap-2.5">
                          {serviceList.map((s) => {
                            const Icon = getServiceIcon(s.icon)
                            return (
                              <Link
                                key={s.slug}
                                href={`/services/${s.slug}`}
                                onClick={() => setMegaMenuOpen(false)}
                                className="group flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 transition-colors group-hover:bg-cyan-500/10 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 truncate">
                                    {s.title}
                                  </h4>
                                  <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-1">
                                    {s.tagline || "Enterprise-grade engineering"}
                                  </p>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/portfolio"
                className={`text-sm font-medium transition-colors hover:text-cyan-600 dark:hover:text-cyan-400 ${
                  pathname.startsWith("/portfolio")
                    ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                    : "text-slate-700 dark:text-gray-300"
                }`}
              >
                Portfolio
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-cyan-600 dark:hover:text-cyan-400 ${
                  pathname === "/about"
                    ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                    : "text-slate-700 dark:text-gray-300"
                }`}
              >
                About
              </Link>
              <Link
                href="/process"
                className={`text-sm font-medium transition-colors hover:text-cyan-600 dark:hover:text-cyan-400 ${
                  pathname === "/process"
                    ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                    : "text-slate-700 dark:text-gray-300"
                }`}
              >
                Process
              </Link>
              <Link
                href="/pricing"
                className={`text-sm font-medium transition-colors hover:text-cyan-600 dark:hover:text-cyan-400 ${
                  pathname === "/pricing"
                    ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                    : "text-slate-700 dark:text-gray-300"
                }`}
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                className={`text-sm font-medium transition-colors hover:text-cyan-600 dark:hover:text-cyan-400 ${
                  pathname.startsWith("/blog")
                    ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                    : "text-slate-700 dark:text-gray-300"
                }`}
              >
                Blog
              </Link>
            </nav>

            {/* Desktop Right */}
            <div className="hidden items-center gap-3 md:flex">
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
                className="btn-gradient rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-[0.98]"
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
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-white/98 dark:bg-[#05060A] md:hidden flex flex-col pt-[72px] mobile-menu-overlay"
          >
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <nav className="flex flex-col gap-3 text-lg font-display font-medium">
                <Link
                  href="/"
                  onClick={scrollToHomeTop}
                  className={`py-2 transition-colors ${
                    pathname === "/"
                      ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  Home
                </Link>

                <div className="flex flex-col gap-2 py-1">
                  <Link
                    href="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs uppercase font-semibold tracking-wider text-slate-500 dark:text-gray-500"
                  >
                    Services
                  </Link>
                  <div className="grid grid-cols-1 gap-1.5 pl-3 border-l border-slate-200 dark:border-white/10">
                    {serviceList.map((s) => {
                      const Icon = getServiceIcon(s.icon)
                      return (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 py-1.5 text-sm text-slate-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                        >
                          <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                          <span>{s.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <Link
                  href="/portfolio"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${
                    pathname.startsWith("/portfolio")
                      ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  Portfolio
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${
                    pathname === "/about"
                      ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  About
                </Link>
                <Link
                  href="/process"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${
                    pathname === "/process"
                      ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  Process
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${
                    pathname === "/pricing"
                      ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  Pricing
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${
                    pathname.startsWith("/blog")
                      ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  Blog
                </Link>
                <Link
                  href="/estimator"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${
                    pathname === "/estimator"
                      ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  Project Estimator
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${
                    pathname === "/contact"
                      ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  Contact
                </Link>
              </nav>

              <div className="pt-4 space-y-4">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-gradient block w-full text-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25"
                >
                  Start a Project
                </Link>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-gray-400">
                  <span>Appearance</span>
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
                    <span>
                      {mounted ? (resolvedTheme === "dark" ? "Light Mode" : "Dark Mode") : "Theme"}
                    </span>
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
