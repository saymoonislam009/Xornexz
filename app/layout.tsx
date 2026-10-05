import "./globals.css"
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, Inter } from "next/font/google"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { LenisProvider } from "@/components/providers/LenisProvider"
import { CommandPalette } from "@/components/ui/CommandPalette"
import { CookieConsent } from "@/components/ui/CookieConsent"
import { Toaster } from "sonner"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ScrollProgress } from "@/components/ui/ScrollProgress"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#05060A",
}

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

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://xornexz.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s | Xornexz',
    default: 'Xornexz — We Build What\'s Next',
  },
  description:
    'Xornexz is a premium technology studio building websites, web apps, mobile apps, SaaS platforms, and AI-powered systems for ambitious founders and enterprises.',
  keywords: [
    'web development agency',
    'software development studio',
    'SaaS development',
    'mobile app development',
    'React Next.js development',
    'UI UX design agency',
    'AI automation development',
    'custom software development',
    'web application development',
    'startup tech studio',
    'enterprise software development',
    'TypeScript React agency',
  ],
  authors: [{ name: 'Xornexz', url: BASE_URL }],
  creator: 'Xornexz',
  publisher: 'Xornexz',
  category: 'Technology',
  classification: 'Business',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Xornexz',
    title: 'Xornexz — We Build What\'s Next',
    description:
      'A premium technology studio building world-class websites, SaaS platforms, mobile apps, and AI systems.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Xornexz — We Build What\'s Next',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@xornexz',
    creator: '@xornexz',
    title: 'Xornexz — We Build What\'s Next',
    description:
      'A premium technology studio building world-class websites, SaaS platforms, mobile apps, and AI systems.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans bg-[#05060A] text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* JSON-LD: Organization + WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              buildOrganizationSchema(),
              buildWebsiteSchema(),
            ]),
          }}
        />
        <ScrollProgress />
        {/* Skip to content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:rounded-lg focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-white focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LenisProvider>
            {/* Cmd+K command palette */}
            <CommandPalette />

            {/* Global navigation */}
            <Navbar />

            {/* Page content */}
            <main id="main-content" className="w-full max-w-full overflow-x-hidden relative">
              {children}
            </main>

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
