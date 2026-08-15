import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        crimson: "#800020",
        gold: "#D4AF37",
        charcoal: "#1A181C",
        cream: "#FFF8F0",
        amber: "#FFC107",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;