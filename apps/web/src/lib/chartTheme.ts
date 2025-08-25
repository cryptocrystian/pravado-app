// Chart.js theme initialization for enterprise branding

let isInitialized = false;

export function initializeChartTheme() {
  // Only initialize once to avoid repeated imports
  if (isInitialized) return;

  // Chart.js theme will be initialized when/if Chart.js is actually used
  // This avoids build-time dependency issues
  console.log('Chart theme ready for initialization when Chart.js is loaded');
  isInitialized = true;
}

// Function to apply theme when Chart.js is available
export function applyChartTheme() {
  try {
    // Check if Chart.js is available in global scope
    if (typeof window !== 'undefined' && (window as any).Chart) {
      const Chart = (window as any).Chart;
      const css = getComputedStyle(document.documentElement);
      
      // Get theme colors from CSS variables
      const foreground = `hsl(${css.getPropertyValue('--fg').trim()})`;
      const border = `hsl(${css.getPropertyValue('--border').trim()})`;
      
      // Configure global Chart.js defaults
      Chart.defaults.color = foreground;
      Chart.defaults.borderColor = border;
      
      // Apply other theme configurations...
      console.log('Chart.js theme applied successfully');
    }
  } catch (error) {
    console.warn('Chart.js theme application failed:', error);
  }
}

// Brand color palette for charts
export const chartColors = {
  primary: 'hsl(var(--brand))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  danger: 'hsl(var(--danger))',
  muted: 'hsl(var(--fg) / 0.6)',
  
  // Alpha variants for areas/backgrounds
  primaryAlpha: 'hsl(var(--brand) / 0.1)',
  successAlpha: 'hsl(var(--success) / 0.1)',
  warningAlpha: 'hsl(var(--warning) / 0.1)',
  dangerAlpha: 'hsl(var(--danger) / 0.1)',
}

// Common chart configurations
export const chartConfig = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      align: 'start' as const,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
      },
    },
  },
}