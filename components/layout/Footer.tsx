"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Github, Twitter, Linkedin, Instagram, ArrowRight, Loader2 } from "lucide-react"

export function Footer() {
  const pathname = usePathname()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  // Don't render the public footer on admin pages
  if (pathname?.startsWith("/admin")) return null

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
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

  return (
    <footer className="relative mt-24 border-t border-white/5 bg-[#05060A] pt-20">
      {/* Animated gradient top border */}
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-violet-500 to-cyan-500 opacity-50"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 xl:gap-12">
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="font-display text-2xl font-bold tracking-tighter text-white">
              Xornexz
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              We build what's next. A premium software agency crafting futuristic, cinematic digital experiences for forward-thinking brands.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="rounded-full bg-white/5 p-2 text-gray-400 transition-colors hover:bg-violet-500/20 hover:text-violet-400">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-full bg-white/5 p-2 text-gray-400 transition-colors hover:bg-violet-500/20 hover:text-violet-400">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-full bg-white/5 p-2 text-gray-400 transition-colors hover:bg-violet-500/20 hover:text-violet-400">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full bg-white/5 p-2 text-gray-400 transition-colors hover:bg-violet-500/20 hover:text-violet-400">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-semibold text-white">Services</h4>
            <nav className="flex flex-col gap-3 text-sm text-gray-400">
              <Link href="/services/web-development" className="transition-colors hover:text-cyan-400">Web Development</Link>
              <Link href="/services/mobile-apps" className="transition-colors hover:text-cyan-400">Mobile Apps</Link>
              <Link href="/services/ui-ux-design" className="transition-colors hover:text-cyan-400">UI/UX Design</Link>
              <Link href="/services/cloud-architecture" className="transition-colors hover:text-cyan-400">Cloud Architecture</Link>
              <Link href="/services/data-engineering" className="transition-colors hover:text-cyan-400">Data Engineering</Link>
              <Link href="/services/cybersecurity" className="transition-colors hover:text-cyan-400">Cybersecurity</Link>
              <Link href="/services/iot-solutions" className="transition-colors hover:text-cyan-400">IoT Solutions</Link>
            </nav>
          </div>

          {/* Links Col 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-semibold text-white">Company</h4>
            <nav className="flex flex-col gap-3 text-sm text-gray-400">
              <Link href="/about" className="transition-colors hover:text-cyan-400">About Us</Link>
              <Link href="/process" className="transition-colors hover:text-cyan-400">Our Process</Link>
              <Link href="/careers" className="transition-colors hover:text-cyan-400">Careers</Link>
              <Link href="/blog" className="transition-colors hover:text-cyan-400">Blog</Link>
              <Link href="/contact" className="transition-colors hover:text-cyan-400">Contact</Link>
            </nav>
          </div>

          {/* Newsletter Col */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-semibold text-white">Stay Updated</h4>
            <p className="text-sm text-gray-400">
              Subscribe to our newsletter for the latest insights on tech and design.
            </p>
            <form onSubmit={handleSubscribe} className="mt-2 flex flex-col gap-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-white/10 bg-[#0B0D14] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md bg-white/10 p-2 text-white transition-colors hover:bg-violet-500"
                >
                  {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
              {status === "success" && <p className="text-xs text-green-400">Thanks for subscribing!</p>}
              {status === "error" && <p className="text-xs text-red-400">Something went wrong. Try again.</p>}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 md:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Xornexz. All rights reserved. Built with precision.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms of Service</Link>
            <Link href="/cookies" className="transition-colors hover:text-white">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
