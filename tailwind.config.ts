import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SOLAKI Brand Tokens
        solaki: {
          bg:       "#0A0A0A",
          surface:  "#111111",
          elevated: "#1A1A1A",
          border:   "#2A2A2A",
          "border-l": "#333333",
          text:     "#FFFFFF",
          muted:    "#888888",
          subtle:   "#555555",
          teal:     "#0D5C46",
          "teal-l": "#12795C",
          glow:     "#10B981",
          coral:    "#D95338",
          indigo:   "#4F46E5",
          black:    "#0A0A0A",
          dark:     "#111111",
          card:     "#1A1A1A",
          "green":  "#0D5C46",
          "green-light": "#12795C",
          "green-glow":  "#10B981",
          "coral-light": "#E8634A",
          cream:    "#F5F5F5",
        },
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        inter:   ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "float-slow":   "float 6s ease-in-out infinite",
        "float-medium": "float 4s ease-in-out infinite",
        "pulse-glow":   "pulseGlow 3s ease-in-out infinite",
        marquee:        "marquee 28s linear infinite",
        shimmer:        "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(13,92,70,0.3)" },
          "50%":       { boxShadow: "0 0 40px rgba(13,92,70,0.6)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "teal-glow":  "0 0 30px rgba(13,92,70,0.4), 0 0 60px rgba(13,92,70,0.15)",
        "card-hover": "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
