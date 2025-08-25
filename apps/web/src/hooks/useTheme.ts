import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage or default to dark for dashboard
    const stored = localStorage.getItem('pravado-theme')
    return (stored as Theme) || 'dark'
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    
    localStorage.setItem('pravado-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const setLightMode = () => setTheme('light')
  const setDarkMode = () => setTheme('dark')

  return {
    theme,
    setTheme,
    toggleTheme,
    setLightMode,
    setDarkMode,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }
}