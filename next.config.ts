import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  // TypeScript and ESLint errors MUST fail the build
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion"],
  },

  images: {
    // Vercel Image Optimization not used for R2 (already WebP/sized client-side)
    // Still declare remotePatterns for any next/image usage
    remotePatterns: [
      // Cloudflare R2 via custom media domain
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_MEDIA_HOSTNAME ?? "media.xornexz.com",
      },
      // Allow unsplash for placeholder images during development
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Security headers — defined once here; middleware no longer duplicates them
  async headers() {
    const cspDirectives = [
      "default-src 'self'",
      `img-src 'self' data: blob: https://${process.env.NEXT_PUBLIC_MEDIA_HOSTNAME ?? "media.xornexz.com"} https://images.unsplash.com`,
      `media-src 'self' https://${process.env.NEXT_PUBLIC_MEDIA_HOSTNAME ?? "media.xornexz.com"}`,
      "font-src 'self' https://fonts.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Three.js needs unsafe-eval in dev; in prod use strict-dynamic
      process.env.NODE_ENV === "development"
        ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
        : "script-src 'self' 'unsafe-inline'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Content-Security-Policy", value: cspDirectives },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/(_next/static|fonts|icons)(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
    ];
  },
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(
  nextConfig
);
