import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Light theme (Beige-first)
        'bg-app-light': 'hsl(43, 33%, 97%)',      // #F8F6F2 Soft beige content background
        'surface-light': 'hsl(207, 20%, 92%)',   // #E7ECEF Elevated cards
        'island-light': 'hsl(43, 33%, 97%)',     // Light islands for content/editor
        
        // Dark theme
        'bg-app-dark': 'hsl(225, 39%, 22%)',     // #1E2A4A Deep Slate
        'surface-dark': 'hsl(225, 39%, 30%)',   // #2B3A67 Dark card
        'island-dark': 'hsl(225, 39%, 22%)',    // Dark islands for dashboard
        
        // CSS Variable based colors
        background: 'hsl(var(--background))',
        surface: 'hsl(var(--surface))',
        island: 'hsl(var(--island))',
        
        // Text
        'text-primary': 'hsl(var(--text-primary))',
        'text-secondary': 'hsl(var(--text-secondary))',
        
        // Semantic colors
        primary: 'hsl(225, 39%, 30%)',          // #2B3A67 Slate Blue
        'ai-teal': 'hsl(var(--ai-teal))',       // #00A8A8 AI Teal
        'premium-gold': 'hsl(var(--premium-gold))',    // #D4A017 Gold
        success: 'hsl(var(--success))',          // #22C55E Green
        warning: 'hsl(var(--warning))',           // #F59E0B Amber
        danger: 'hsl(var(--danger))',             // #DC2626 Red
        
        // Component colors
        border: 'hsl(var(--border))',
        input: 'hsl(214.3, 31.8%, 91.4%)',
        ring: 'hsl(180, 100%, 33%)', // AI Teal for focus rings
        
        // Muted variants
        muted: {
          DEFAULT: 'hsl(210, 40%, 96%)',
          foreground: 'hsl(215.4, 16.3%, 46.9%)',
        },
        
        // Card variants
        card: {
          DEFAULT: 'hsl(0, 0%, 100%)',
          foreground: 'hsl(0, 0%, 10%)',
        }
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
        xl: '16px',
        '2xl': '20px',
      },
      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.06)',
        md: '0 4px 12px rgba(0,0,0,0.10)',
        lg: '0 10px 20px rgba(0,0,0,0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['2rem', { lineHeight: '2.5rem' }],     // 32px/40px
        'h1': ['1.75rem', { lineHeight: '2rem' }],         // 28px
        'h2': ['1.375rem', { lineHeight: '1.75rem' }],     // 22px
        'body': ['1rem', { lineHeight: '1.5rem' }],        // 16px
        'meta': ['0.75rem', { lineHeight: '0.875rem' }],   // 12px/14px
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config