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
        // SOLAKI Brand Tokens (Palette: #013e37, #dec83a, #212121, #ffffff)
        solaki: {
          bg:       "#212121",
          surface:  "#262626",
          elevated: "#2D2D2D",
          border:   "#333333",
          "border-l": "#444444",
          text:     "#FFFFFF",
          muted:    "#A3A3A3",
          subtle:   "#737373",
          teal:     "#013e37",
          "teal-l": "#025048",
          glow:     "#dec83a",
          coral:    "#dec83a",
          indigo:   "#013e37",
          black:    "#212121",
          dark:     "#212121",
          card:     "#212121",
          "green":  "#013e37",
          "green-light": "#025048",
          "green-glow":  "#dec83a",
          "coral-light": "#dec83a",
          gold:     "#dec83a",
          white:    "#FFFFFF",
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
