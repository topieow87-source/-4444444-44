import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        canvas: "#F6F7FB",
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        accent: {
          400: "#9F91FF",
          500: "#7C6CFF",
          600: "#6952F0",
        },
      },
      boxShadow: {
        xs: "0 1px 2px rgba(15, 23, 42, 0.04)",
        soft: "0 2px 10px rgba(15, 23, 42, 0.05)",
        card: "0 8px 24px -4px rgba(15, 23, 42, 0.08)",
        lifted: "0 20px 45px -12px rgba(15, 23, 42, 0.16)",
        glow: "0 10px 30px -6px rgba(79, 70, 229, 0.35)",
        "glow-lg": "0 24px 60px -8px rgba(79, 70, 229, 0.32)",
      },
      borderRadius: {
        xl2: "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(15,23,42,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.045) 1px, transparent 1px)",
        "brand-gradient": "linear-gradient(135deg, #4F46E5 0%, #7C6CFF 100%)",
        "brand-radial": "radial-gradient(60% 60% at 50% 40%, rgba(124,108,255,0.20), transparent 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(24px, -18px) scale(1.06)" },
          "66%": { transform: "translate(-16px, 14px) scale(0.96)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 1.6s infinite linear",
        float: "float 6s ease-in-out infinite",
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
        blob: "blob 12s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
