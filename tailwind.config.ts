import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          dark: "#0a0a0f",
          navy: "#0d1117",
          charcoal: "#1a1a2e",
          gold: "#c9a84c",
          amber: "#e8b84b",
          cream: "#f5f0e8",
          light: "#fafaf8",
          muted: "#6b7280",
          subtle: "#9ca3af",
        },
        primary: "#c9a84c",
        secondary: "#0d1117",
      },
      spacing: {
        "micro": "8px",
        "sm": "16px",
        "md": "24px",
        "lg": "32px",
        "section": "64px",
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1.1", fontWeight: "700" }],
        "display-lg": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.15", fontWeight: "700" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.2", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        "body-md": ["1rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        "label": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.1em" }],
      },
      boxShadow: {
        "nav": "0 1px 0 0 rgba(255,255,255,0.06)",
        "card": "0 2px 20px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.12)",
        "dropdown": "0 8px 24px rgba(0,0,0,0.08)",
        "cta": "0 4px 24px rgba(201,168,76,0.3)",
      },
      borderRadius: {
        "btn": "6px",
        "card": "10px",
        "dropdown": "8px",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0a0a0f 0%, #0d1117 40%, #1a1a2e 100%)",
        "gold-gradient": "linear-gradient(135deg, #c9a84c, #e8b84b)",
        "section-gradient": "linear-gradient(180deg, #fafaf8 0%, #f0ede6 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      screens: {
        "mobile": { max: "767px" },
        "tablet": { min: "768px", max: "1279px" },
        "desktop": "1280px",
      },
    },
  },
  plugins: [],
};
export default config;
