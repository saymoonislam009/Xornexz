"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sun, Moon, ChevronDown, Monitor, Code, Smartphone, Database, Cloud, Shield, Cpu } from "lucide-react"

const services = [
  { name: "Web Development", icon: Monitor, tag: "Scalable Apps" },
  { name: "Mobile Apps", icon: Smartphone, tag: "iOS & Android" },
  { name: "UI/UX Design", icon: Code, tag: "Digital Experiences" },
  { name: "Cloud Architecture", icon: Cloud, tag: "AWS / Azure / GCP" },
  { name: "Data Engineering", icon: Database, tag: "Pipelines & AI" },
  { name: "Cybersecurity", icon: Shield, tag: "Enterprise Grade" },
  { name: "IoT Solutions", icon: Cpu, tag: "Connected Systems" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  // Don't render the public navbar on admin pages
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false)
    setMegaMenuOpen(false)
  }, [pathname])

  if (pathname?.startsWith("/admin")) return null

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#05060A]/80 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-tighter text-white transition-all group-hover:bg-gradient-to-r group-hover:from-violet-500 group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent">
              Xornexz
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className={`text-sm font-medium transition-colors hover:text-cyan-400 ${pathname === "/" ? "text-cyan-400" : "text-gray-300"}`}>
              Home
            </Link>
            
            {/* Mega Menu Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-cyan-400 ${pathname.startsWith("/services") ? "text-cyan-400" : "text-gray-300"}`}>
                Services <ChevronDown className="h-4 w-4" />
              </button>
              
              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 top-full mt-4 w-[600px] -translate-x-1/2 rounded-xl border border-white/10 bg-[#0B0D14] p-6 shadow-2xl"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {services.map((s) => (
                        <Link 
                          key={s.name} 
                          href={`/services/${s.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="group flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-white/5"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 transition-colors group-hover:bg-cyan-500/10 group-hover:text-cyan-400">
                            <s.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300">{s.name}</h4>
                            <p className="text-xs text-gray-400">{s.tag}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/portfolio" className={`text-sm font-medium transition-colors hover:text-cyan-400 ${pathname === "/portfolio" ? "text-cyan-400" : "text-gray-300"}`}>Portfolio</Link>
            <Link href="/about" className={`text-sm font-medium transition-colors hover:text-cyan-400 ${pathname === "/about" ? "text-cyan-400" : "text-gray-300"}`}>About</Link>
            <Link href="/process" className={`text-sm font-medium transition-colors hover:text-cyan-400 ${pathname === "/process" ? "text-cyan-400" : "text-gray-300"}`}>Process</Link>
            <Link href="/pricing" className={`text-sm font-medium transition-colors hover:text-cyan-400 ${pathname === "/pricing" ? "text-cyan-400" : "text-gray-300"}`}>Pricing</Link>
            <Link href="/blog" className={`text-sm font-medium transition-colors hover:text-cyan-400 ${pathname === "/blog" ? "text-cyan-400" : "text-gray-300"}`}>Blog</Link>
          </nav>

          {/* Desktop Right */}
          <div className="hidden items-center gap-4 md:flex">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
            className="p-2 text-gray-300 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 top-[72px] z-30 bg-[#05060A] md:hidden"
          >
            <div className="flex h-full flex-col overflow-y-auto px-6 pb-24 pt-8">
              <nav className="flex flex-col gap-6 text-xl font-display font-medium">
                <Link href="/">Home</Link>
                <div className="flex flex-col gap-4">
                  <span className="text-gray-400">Services</span>
                  <div className="ml-4 flex flex-col gap-4 text-lg">
                    {services.map((s) => (
                      <Link key={s.name} href={`/services/${s.name.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-3">
                        <s.icon className="h-5 w-5 text-cyan-400" /> {s.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link href="/portfolio">Portfolio</Link>
                <Link href="/about">About</Link>
                <Link href="/process">Process</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/contact">Contact</Link>
              </nav>

              <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />} Toggle Theme
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
