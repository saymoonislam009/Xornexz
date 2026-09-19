/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // ── Color Design Tokens ──────────────────────────────────────────────
      colors: {
        // Background layers
        bg: {
          primary: "#05060A",
          secondary: "#0B0D14",
          card: "#0E1018",
          elevated: "#12151F",
        },
        // Brand / Accent
        accent: {
          violet: "#7C3AED",
          cyan: "#06B6D4",
          purple: "#9333EA",
          blue: "#3B82F6",
        },
        // Text
        text: {
          primary: "#F0F2FF",
          secondary: "#C8CCDE",
          muted: "#6B7280",
          disabled: "#3A3F52",
        },
        // Status
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
        // Borders
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.16)",
          accent: "rgba(124,58,237,0.4)",
        },
        // shadcn/ui required tokens
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },

      // ── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-xl": ["clamp(2.5rem, 6vw, 5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2rem, 4vw, 4rem)", { lineHeight: "1", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.5rem, 3vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-sm": ["clamp(1.25rem, 2vw, 2rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
      },

      // ── Spacing ───────────────────────────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "section": "clamp(5rem, 10vw, 10rem)",
      },

      // ── Border Radius ─────────────────────────────────────────────────────
      borderRadius: {
        "sm": "0.375rem",   // 6px
        "md": "0.75rem",    // 12px
        "lg": "1.25rem",    // 20px
        "xl": "2rem",       // 32px
        "2xl": "3rem",      // 48px
        DEFAULT: "var(--radius)",
      },

      // ── Box Shadows ───────────────────────────────────────────────────────
      boxShadow: {
        "glow-violet": "0 0 30px rgba(124,58,237,0.3), 0 0 80px rgba(124,58,237,0.1)",
        "glow-cyan": "0 0 30px rgba(6,182,212,0.3), 0 0 80px rgba(6,182,212,0.1)",
        "glow-sm": "0 0 10px rgba(124,58,237,0.2)",
        "card": "0 1px 1px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-hover": "0 2px 2px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
      },

      // ── Backgrounds ───────────────────────────────────────────────────────
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
        "gradient-accent-45": "linear-gradient(45deg, #7C3AED 0%, #06B6D4 100%)",
        "gradient-dark": "linear-gradient(180deg, #05060A 0%, #0B0D14 100%)",
        "gradient-card": "linear-gradient(145deg, rgba(14,16,24,0.9) 0%, rgba(11,13,20,0.9) 100%)",
        "noise": "url('/noise.svg')",
        "grid": "url('/grid.svg')",
      },

      // ── Animations ────────────────────────────────────────────────────────
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(32px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(124,58,237,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(6,182,212,0.2)" },
        },
        "border-rotate": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "draw-line": {
          from: { strokeDashoffset: "1000" },
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "marquee": "marquee 30s linear infinite",
        "marquee-fast": "marquee 15s linear infinite",
        "marquee-reverse": "marquee-reverse 30s linear infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "border-rotate": "border-rotate 3s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "draw-line": "draw-line 2s ease-in-out forwards",
      },

      // ── Transition Durations ──────────────────────────────────────────────
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },

      // ── Backdrop Blur ─────────────────────────────────────────────────────
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
