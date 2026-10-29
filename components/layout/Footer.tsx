"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Github, Twitter, Linkedin, Instagram, Youtube, ArrowRight, Loader2, Mail } from "lucide-react"

interface FooterServiceItem {
  title: string
  slug: string
}

interface FooterProps {
  siteName?: string
  siteTagline?: string
  contactEmail?: string
  socials?: {
    twitter?: string
    linkedin?: string
    github?: string
    instagram?: string
    youtube?: string
  }
  services?: FooterServiceItem[]
}

const DEFAULT_FOOTER_SERVICES: FooterServiceItem[] = [
  { title: "Web Development", slug: "web-development" },
  { title: "Mobile Apps", slug: "mobile-apps" },
  { title: "SaaS Platforms", slug: "saas-platforms" },
  { title: "UI/UX Design", slug: "ui-ux-design" },
  { title: "AI & Automation", slug: "ai-automation" },
  { title: "API Integration", slug: "api-integration" },
]

export function Footer({
  siteName = "Xornexz",
  siteTagline = "We build what's next. A premium technology studio crafting scalable software, mobile apps, and AI-powered digital products for ambitious brands.",
  contactEmail = "hello@xornexz.com",
  socials,
  services,
}: FooterProps) {
  const pathname = usePathname()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  // Don't render the public footer on admin pages
  if (pathname?.startsWith("/admin")) return null

  const serviceLinks =
    services && services.length > 0 ? services.slice(0, 7) : DEFAULT_FOOTER_SERVICES

  const scrollToHomeTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus("loading")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (res.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  const brandFirst = siteName.slice(0, 1) || "X"
  const brandRest = siteName.slice(1) || "ornexz"

  const socialItems = [
    { href: socials?.twitter || "https://twitter.com", icon: Twitter, label: "Twitter / X" },
    { href: socials?.linkedin || "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
    { href: socials?.github || "https://github.com", icon: Github, label: "GitHub" },
    { href: socials?.instagram || "https://instagram.com", icon: Instagram, label: "Instagram" },
    ...(socials?.youtube ? [{ href: socials.youtube, icon: Youtube, label: "YouTube" }] : []),
  ]

  return (
    <footer className="relative mt-24 border-t border-slate-200 dark:border-white/5 bg-slate-100/80 dark:bg-[#05060A] pt-20">
      {/* Animated gradient top border */}
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-violet-500 to-cyan-500 opacity-50" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 xl:gap-12">
          {/* Brand Col */}
          <div className="flex flex-col gap-5">
            <Link
              href="/"
              onClick={scrollToHomeTop}
              className="group inline-flex items-center gap-2.5 w-fit cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-sm font-display tracking-wider">
                  {brandFirst}
                </span>
              </div>
              <span className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {brandFirst}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">
                  {brandRest}
                </span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-400">
              {siteTagline.length > 35
                ? siteTagline
                : `${siteTagline} A premium software studio crafting scalable web platforms, mobile apps, and AI systems for forward-thinking brands.`}
            </p>
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors w-fit"
              >
                <Mail className="h-3.5 w-3.5 text-cyan-500" />
                {contactEmail}
              </a>
            )}
            <div className="flex items-center gap-3">
              {socialItems.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="rounded-full bg-slate-200/70 dark:bg-white/5 p-2 text-slate-600 dark:text-gray-400 transition-colors hover:bg-violet-500/15 hover:text-violet-600 dark:hover:bg-violet-500/20 dark:hover:text-violet-400"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-semibold text-slate-900 dark:text-white">Services</h4>
            <nav className="flex flex-col gap-3 text-sm text-slate-600 dark:text-gray-400">
              {serviceLinks.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400"
                >
                  {s.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Links Col 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-semibold text-slate-900 dark:text-white">Company</h4>
            <nav className="flex flex-col gap-3 text-sm text-slate-600 dark:text-gray-400">
              <Link href="/portfolio" className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400">
                Portfolio
              </Link>
              <Link href="/about" className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400">
                About Us
              </Link>
              <Link href="/process" className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400">
                Our Process
              </Link>
              <Link href="/pricing" className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400">
                Pricing
              </Link>
              <Link href="/estimator" className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400">
                Project Estimator
              </Link>
              <Link href="/careers" className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400">
                Careers
              </Link>
              <Link href="/blog" className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400">
                Blog
              </Link>
              <Link href="/contact" className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400">
                Start a Project
              </Link>
            </nav>
          </div>

          {/* Newsletter Col */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-semibold text-slate-900 dark:text-white">Stay Updated</h4>
            <p className="text-sm text-slate-600 dark:text-gray-400">
              Subscribe to our newsletter for engineering insights, product launches, and AI architecture notes.
            </p>
            <form onSubmit={handleSubscribe} className="mt-1 flex flex-col gap-2.5">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0B0D14] pl-4 pr-12 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-label="Subscribe to newsletter"
                  className="btn-gradient absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 p-2 text-white transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              </div>
              {status === "success" && (
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Subscribed! Welcome aboard.
                </p>
              )}
              {status === "error" && (
                <p className="text-xs font-medium text-red-500 dark:text-red-400">
                  Unable to subscribe right now. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-white/10 py-8 md:flex-row">
          <p className="text-xs text-slate-500 dark:text-gray-500">
            © {new Date().getFullYear()} {siteName}. All rights reserved. Built with precision.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-gray-500">
            <Link href="/legal/privacy" className="transition-colors hover:text-slate-900 dark:hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="transition-colors hover:text-slate-900 dark:hover:text-white">
              Terms of Service
            </Link>
            <Link href="/legal/cookies" className="transition-colors hover:text-slate-900 dark:hover:text-white">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
