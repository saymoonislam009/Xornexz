import "./globals.css"
import type { Metadata } from "next"
import { Space_Grotesk, Inter } from "next/font/google"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { LenisProvider } from "@/components/providers/LenisProvider"
import { CustomCursor } from "@/components/ui/CustomCursor"
import { CommandPalette } from "@/components/ui/CommandPalette"
import { CookieConsent } from "@/components/ui/CookieConsent"
import { Toaster } from "sonner"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    template: "%s | Xornexz",
    default: "Xornexz — We build what's next.",
  },
  description:
    "Xornexz is a technology studio that designs and builds websites, web apps, mobile apps, SaaS platforms, and AI-powered systems.",
  keywords: ["web development", "mobile apps", "SaaS", "software agency", "UI/UX design", "AI integration"],
  authors: [{ name: "Xornexz" }],
  creator: "Xornexz",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://xornexz.com",
    siteName: "Xornexz",
    title: "Xornexz — We build what's next.",
    description: "A premium software studio building futuristic digital experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xornexz — We build what's next.",
    description: "A premium software studio building futuristic digital experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-sans bg-[#05060A] text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Skip to content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:rounded-lg focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-white focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LenisProvider>
            {/* Custom cursor — desktop only, hidden on touch */}
            <CustomCursor />
            {/* Cmd+K command palette */}
            <CommandPalette />

            {/* Global navigation */}
            <Navbar />

            {/* Page content */}
            <div id="main-content">
              {children}
            </div>

            {/* Global footer */}
            <Footer />

            {/* Utilities */}
            <CookieConsent />
            <Toaster position="bottom-right" theme="dark" richColors />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
