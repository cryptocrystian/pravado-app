import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Dark routes (dashboards, analytics)
const DARK_ROUTES = [
  '/dashboard',
  '/analytics', 
  '/seo',
  '/campaigns',
  '/ai',
  '/security'
]

// Light routes (editors, content creation)
const LIGHT_ROUTES = [
  '/content',
  '/editor',
  '/settings/brand'
]

export function useRouteTheme() {
  const location = useLocation()
  
  useEffect(() => {
    // Always ensure html has dark class (spec requirement)
    document.documentElement.classList.add('dark')
    
    // Determine if current route should have light islands
    const isLightRoute = LIGHT_ROUTES.some(route => 
      location.pathname.startsWith(route)
    )
    
    // Set the data-island attribute
    document.documentElement.setAttribute(
      'data-island', 
      isLightRoute ? 'light' : 'dark'
    )
    
    return () => {
      // Cleanup not needed as we'll be setting on each route change
    }
  }, [location.pathname])
  
  return {
    isDarkRoute: DARK_ROUTES.some(route => location.pathname.startsWith(route)),
    isLightRoute: LIGHT_ROUTES.some(route => location.pathname.startsWith(route))
  }
}