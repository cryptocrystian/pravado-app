/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // V4 Master Spec Tokens (pravado_master_spec.md) - Single Source of Truth
        // These map directly to CSS variables defined in globals.css
        bg: "var(--bg)",
        surface: "var(--surface)", 
        text: "var(--text)",
        primary: "var(--primary)",     // #2B3A67 Slate Blue
        ai: "var(--ai)",               // #00A8A8 AI Teal  
        premium: "var(--premium)",     // #D4A017 Gold
        success: "var(--success)",     // #22C55E Green
        warning: "var(--warning)",     // #F59E0B Amber
        danger: "var(--danger)",       // #DC2626 Red
        
        // Dark Shell + Islands
        'bg-app-dark': "var(--bg-app-dark)", // #1E2A4A Main shell
        'bg-panel': "var(--bg-panel)",       // #2B3A67 Dark panels  
        'bg-island': "var(--bg-island)",     // #F8F6F2 Light islands
        'bg-dark': "var(--bg-dark)",         // Legacy support
        'surface-dark': "var(--surface-dark)", // #2B3A67 Dark card
        'text-dark': "var(--text-dark)",     // #FFFFFF Inverted text
        
        // Semantic Accents
        'ai-teal-300': "var(--ai-teal-300)", // Light teal strokes
        'premium-gold': "var(--premium-gold)", // Premium/impact accent
        
        // Nested dark variants (legacy support)
        dark: { 
          bg: "var(--bg-dark)",        
          surface: "var(--surface-dark)", 
          text: "var(--text-dark)"     
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display': ['2rem', { lineHeight: '2.5rem' }],   // display-32/40
        'h1': ['1.75rem', { lineHeight: '2rem' }],       // h1-28  
        'h2': ['1.375rem', { lineHeight: '1.75rem' }],   // h2-22
        'body': ['1rem', { lineHeight: '1.5rem' }],      // body-16
        'meta': ['0.75rem', { lineHeight: '0.875rem' }], // meta-12/14
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
      },
    }
  },
  plugins: [],
}