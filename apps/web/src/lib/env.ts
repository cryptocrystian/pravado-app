/**
 * Environment configuration and validation
 * Handles preview environment setup and provides fallbacks
 */

export interface EnvConfig {
  API_BASE: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  IS_PREVIEW: boolean;
  IS_DEV: boolean;
}

// Environment variable validation with fallbacks
function getEnvVar(key: string, fallback?: string, required: boolean = false): string {
  const value = import.meta.env[key] || fallback || '';
  
  if (required && !value) {
    console.warn(`Missing required environment variable: ${key}`);
    
    // In preview environments, show user-friendly warnings
    if (import.meta.env.DEV || window.location.hostname.includes('preview')) {
      window.dispatchEvent(new CustomEvent('env-warning', {
        detail: { missing: key }
      }));
    }
  }
  
  return value;
}

// Preview environment detection
function isPreviewEnvironment(): boolean {
  return (
    import.meta.env.DEV ||
    import.meta.env.MODE === 'preview' ||
    window.location.hostname.includes('preview') ||
    window.location.hostname.includes('cloudflare') ||
    window.location.hostname.includes('pages.dev') ||
    window.location.hostname.includes('netlify') ||
    window.location.hostname.includes('vercel')
  );
}

// Initialize environment configuration
export const env: EnvConfig = {
  API_BASE: getEnvVar('VITE_API_BASE', '/api', true),
  SUPABASE_URL: getEnvVar('VITE_SUPABASE_URL', '', true),
  SUPABASE_ANON_KEY: getEnvVar('VITE_SUPABASE_ANON_KEY', '', true),
  IS_PREVIEW: isPreviewEnvironment(),
  IS_DEV: import.meta.env.DEV
};

// Log environment status (only in preview/dev)
if (env.IS_PREVIEW || env.IS_DEV) {
  console.log('🔧 Environment Configuration:', {
    mode: import.meta.env.MODE,
    baseUrl: import.meta.env.BASE_URL,
    isPreview: env.IS_PREVIEW,
    isDev: env.IS_DEV,
    hasApiBase: !!env.API_BASE,
    hasSupabaseUrl: !!env.SUPABASE_URL,
    hasSupabaseKey: !!env.SUPABASE_ANON_KEY
  });
}

// Validate required environment variables
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!env.API_BASE) {
    errors.push('VITE_API_BASE is required');
  }
  
  if (!env.SUPABASE_URL) {
    errors.push('VITE_SUPABASE_URL is required');
  }
  
  if (!env.SUPABASE_ANON_KEY) {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Helper for API URL construction
export function getApiUrl(endpoint: string): string {
  const base = env.API_BASE.endsWith('/') ? env.API_BASE.slice(0, -1) : env.API_BASE;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

// Export for global type safety
declare global {
  interface Window {
    __ENV_CONFIG__?: EnvConfig;
  }
}

// Make config available globally in preview environments
if (env.IS_PREVIEW || env.IS_DEV) {
  window.__ENV_CONFIG__ = env;
}