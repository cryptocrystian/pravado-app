// src/theme/routeTheme.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LIGHT_ROUTES = [/^\/content/, /^\/editor/, /^\/settings\/brand/]; // editors & brand live light

export function useRouteTheme() {
  const { pathname } = useLocation();
  const isLight = LIGHT_ROUTES.some((re) => re.test(pathname));
  
  useEffect(() => {
    // TEMP: Force dark mode for testing
    const shouldBeDark = true; // !isLight;
    console.log('Route theme:', { pathname, isLight, shouldBeDark });
    
    document.documentElement.classList.toggle('dark', shouldBeDark);
    
    // Also apply to body as fallback
    document.body.classList.toggle('dark', shouldBeDark);
  }, [pathname]);
}