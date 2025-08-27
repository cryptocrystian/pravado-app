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
        // UI V4 Semantic Colors (HSL values)
        'ai-teal': {
          300: 'hsl(170 70% 58%)',
          500: 'hsl(170 72% 45%)',
          600: 'hsl(170 75% 40%)',
          700: 'hsl(170 78% 34%)'
        },
        'premium-gold': {
          300: 'hsl(42 96% 65%)',
          500: 'hsl(42 96% 54%)',
          700: 'hsl(42 98% 40%)'
        },
        'success': {
          500: 'hsl(158 64% 45%)'
        },
        'warning': {
          500: 'hsl(37 92% 55%)'
        },
        'danger': {
          500: 'hsl(0 73% 52%)'
        },
        // App backgrounds
        'app-dark': 'hsl(222 47% 6%)',
        'island-dark': 'hsl(222 32% 14%)',
        'island-light': 'hsl(42 25% 96%)',
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