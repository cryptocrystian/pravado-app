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
    
    console.log('Route theme:', { 
      pathname, 
      isLightIsland, 
      shellTheme: 'dark', 
      islandTheme: isLightIsland ? 'light' : 'dark' 
    });
  }, [pathname, isLightIsland]);
}