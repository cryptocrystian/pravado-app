/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // PRAVADO Design System - CSS Variables (Legacy)
        bg: "var(--bg)",
        surface: "var(--surface)",
        text: "var(--text)",
        primary: "var(--primary)",
        ai: "var(--ai)",
        premium: "var(--premium)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        
        // Theme Tokens v2 - Dark Foundation + Light Content Islands
        background: 'hsl(var(--bg))',
        foreground: 'hsl(var(--fg))',
        border: 'hsl(var(--border))',
        panel: { DEFAULT: 'hsl(var(--panel))', elevated: 'hsl(var(--panel-2))' },
        brand: { DEFAULT: 'hsl(var(--brand))', foreground: 'hsl(var(--brand-foreground))' },
        ai: { 
          teal: {
            300: 'hsl(var(--ai-teal-300))',
            500: 'hsl(var(--ai-teal-500))',
            700: 'hsl(var(--ai-teal-700))',
            DEFAULT: 'hsl(var(--ai-teal-500))'
          },
          gold: {
            300: 'hsl(var(--ai-gold-300))',
            500: 'hsl(var(--ai-gold-500))',
            700: 'hsl(var(--ai-gold-700))',
            DEFAULT: 'hsl(var(--ai-gold-500))'
          }
        },
        // V3 island colors
        island: { 
          DEFAULT: 'hsl(var(--island))', 
          border: 'hsl(var(--island-border))' 
        },
        glass: {
          bg: 'hsla(var(--glass-bg))',
          border: 'hsla(var(--glass-border))'
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display': ['2rem', { lineHeight: '2.5rem' }],   // 32px
        'h1': ['1.75rem', { lineHeight: '2rem' }],      // 28px
        'h2': ['1.375rem', { lineHeight: '1.75rem' }],  // 22px
        'body': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'meta': ['0.75rem', { lineHeight: '0.875rem' }], // 12px
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,.06)",
        md: "0 4px 12px rgba(0,0,0,.10)",
        lg: "0 10px 20px rgba(0,0,0,.12)",
        card: '0 8px 24px rgba(0,0,0,0.22)',
        pop: '0 12px 32px rgba(0,0,0,0.28)',
        glass: '0 10px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06)',
      },
      borderRadius: {
        xl: "12px",
        '2xl': "16px"
      },
      spacing: {
        13: "3.25rem",
        15: "3.75rem"
      },
      fontWeight: { 
        metric: 700 
      },
    },
  },
  plugins: [],
}