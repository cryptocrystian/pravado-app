import { useEffect, useState, ReactNode } from 'react'
import { ThemeContext, Theme } from '../lib/theme-context'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    
    // Default to dark theme as per spec
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    
    // Remove opposite class and add current theme class
    root.classList.remove(theme === 'dark' ? 'light' : 'dark')
    root.classList.add(theme)
    
    // Save to localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

