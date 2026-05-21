import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#e8ecf4",
          100: "#c5cfe3",
          200: "#9eafd0",
          300: "#778fbd",
          400: "#5a77af",
          500: "#3d5fa1",
          600: "#375799",
          700: "#2f4d8f",
          800: "#274385",
          900: "#1a3174",
          950: "#0f1e4a",
          DEFAULT: "#0d1b3e",
        },
        brand: {
          navy: "#0d2353",
          dark: "#0a1628",
          light: "#1a3a6e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
        certificate: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0d2353 0%, #1a3a6e 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
