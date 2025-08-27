import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light (Beige-first) - from spec
        bg: "#F8F6F2",
        surface: "#E7ECEF",
        text: "#1A1A1A",
        primary: "#2B3A67",
        ai: "#00A8A8",
        premium: "#D4A017",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#DC2626",
        
        // Dark - from spec
        dark: {
          bg: "#1E2A4A",
          surface: "#2B3A67",
          text: "#FFFFFF"
        }
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,.06)",
        md: "0 4px 12px rgba(0,0,0,.10)",
        lg: "0 10px 20px rgba(0,0,0,.12)"
      },
      borderRadius: {
        xl: "12px",
        '2xl': "16px"
      },
      spacing: {
        13: "3.25rem",
        15: "3.75rem"
      }
    }
  },
  plugins: [],
}

export default config