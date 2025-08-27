// src/theme/routeTheme.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Light islands: content/editor/brand settings only
const LIGHT_ISLAND_ROUTES = [/^\/content/, /^\/editor/, /^\/settings\/brand/];

export function useRouteTheme() {
  const { pathname } = useLocation();
  const isLightIsland = LIGHT_ISLAND_ROUTES.some((re) => re.test(pathname));
  
  useEffect(() => {
    const html = document.documentElement;
    
    // Always dark shell
    html.classList.add('dark');
    
    // Set island theme via data attribute
    html.setAttribute('data-island', isLightIsland ? 'light' : 'dark');
    
    // Force CSS variable updates for debugging
    const root = document.documentElement;
    if (!isLightIsland) {
      // Ensure dark island CSS variables are applied
      root.style.setProperty('--island-bg', '220 20% 16%');
      root.style.setProperty('--island-text', '0 0% 85%');
    }
    
    console.log('🎨 Route theme applied:', { 
      pathname, 
      isLightIsland, 
      shellTheme: 'dark', 
      islandTheme: isLightIsland ? 'light' : 'dark',
      htmlClass: html.className,
      dataIsland: html.getAttribute('data-island')
    });
  }, [pathname, isLightIsland]);
}