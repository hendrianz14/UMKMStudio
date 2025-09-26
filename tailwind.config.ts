import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        display: ["var(--font-playfair)", ...fontFamily.serif]
      },
      colors: {
        brand: {
          50: "#f0f6ff",
          100: "#dce9ff",
          200: "#bad1ff",
          300: "#95b8ff",
          400: "#6f9eff",
          500: "#4a84ff",
          600: "#3167db",
          700: "#234da8",
          800: "#163275",
          900: "#0b1c45"
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
