// src/theme/routeTheme.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LIGHT_ROUTES = [/^\/content/, /^\/editor/, /^\/settings\/brand/]; // editors & brand live light

export function useRouteTheme() {
  const { pathname } = useLocation();
  const isLight = LIGHT_ROUTES.some((re) => re.test(pathname));
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', !isLight);
  }, [isLight]);
}