import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from './useTheme'

const DARK_ROUTES = ['/', '/dashboard', '/analytics', '/seo', '/copilot', '/security', '/campaigns']
const LIGHT_ROUTES = ['/content', '/editor', '/brand']

export function useThemeRouting() {
  const location = useLocation()
  const { setTheme } = useTheme()

  useEffect(() => {
    const currentPath = location.pathname
    
    // Determine theme based on route
    const isDarkRoute = DARK_ROUTES.some(route => currentPath === route || currentPath.startsWith(route + '/'))
    const isLightRoute = LIGHT_ROUTES.some(route => currentPath === route || currentPath.startsWith(route + '/'))
    
    if (isDarkRoute) {
      document.documentElement.setAttribute('data-island', 'dark')
      setTheme('dark')
    } else if (isLightRoute) {
      document.documentElement.setAttribute('data-island', 'light')
      setTheme('light')
    } else {
      // Default to dark for unspecified routes
      document.documentElement.setAttribute('data-island', 'dark')
      setTheme('dark')
    }
  }, [location.pathname, setTheme])

  // Return current theme for components that need to know
  const currentPath = location.pathname
  const isDark = DARK_ROUTES.some(route => currentPath === route || currentPath.startsWith(route + '/')) || 
                 !LIGHT_ROUTES.some(route => currentPath === route || currentPath.startsWith(route + '/'))
  
  return { isDark }
}