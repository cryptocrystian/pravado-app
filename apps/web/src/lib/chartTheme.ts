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
      const aiTeal300 = `hsl(${css.getPropertyValue('--ai-teal-300').trim()})`;
      const aiGold500 = `hsl(${css.getPropertyValue('--ai-gold-500').trim()})`;
      
      // Configure global Chart.js defaults
      Chart.defaults.color = foreground;
      Chart.defaults.borderColor = border;
      Chart.defaults.plugins.tooltip.backgroundColor = 'hsl(var(--glass-fill))';
      Chart.defaults.plugins.tooltip.borderColor = 'hsl(var(--glass-stroke))';
      Chart.defaults.plugins.tooltip.borderWidth = 1;
      Chart.defaults.plugins.tooltip.titleColor = foreground;
      Chart.defaults.plugins.tooltip.bodyColor = foreground;
      Chart.defaults.plugins.tooltip.padding = 12;
      Chart.defaults.plugins.tooltip.cornerRadius = 8;
      Chart.defaults.plugins.tooltip.displayColors = false;
      
      // Set brand color palette
      const palette = [aiTeal300, aiGold500, '#6b7280', '#94a3b8', '#475569'];
      Chart.defaults.datasets.line.borderColor = palette;
      Chart.defaults.datasets.line.backgroundColor = palette.map(c => c + '20');
      Chart.defaults.datasets.bar.backgroundColor = palette;
      Chart.defaults.datasets.pie.backgroundColor = palette;
      Chart.defaults.datasets.doughnut.backgroundColor = palette;
      
      console.log('Chart.js theme applied successfully');
    }
  } catch (error) {
    console.warn('Chart.js theme application failed:', error);
  }
}

// P4 Brand color palette for charts
export const chartColors = {
  primary: 'hsl(var(--ai-teal-300))',
  secondary: 'hsl(var(--ai-gold-500))',
  neutral: '#6b7280',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  danger: 'hsl(var(--danger))',
  muted: 'hsl(var(--fg) / 0.6)',
  
  // Brand colors
  aiTeal300: 'hsl(var(--ai-teal-300))',
  aiTeal500: 'hsl(var(--ai-teal-500))',
  aiTeal600: 'hsl(var(--ai-teal-600))',
  aiGold300: 'hsl(var(--ai-gold-300))',
  aiGold500: 'hsl(var(--ai-gold-500))',
  aiGold600: 'hsl(var(--ai-gold-600))',
  
  // Alpha variants for areas/backgrounds
  primaryAlpha: 'hsl(var(--ai-teal-500) / 0.1)',
  secondaryAlpha: 'hsl(var(--ai-gold-500) / 0.1)',
  successAlpha: 'hsl(var(--success) / 0.1)',
  warningAlpha: 'hsl(var(--warning) / 0.1)',
  dangerAlpha: 'hsl(var(--danger) / 0.1)',
}

// Brand palette array for series
export const brandPalette = [
  chartColors.aiTeal300,
  chartColors.aiGold500,
  '#6b7280',
  '#94a3b8',
  '#475569'
]

// Common chart configurations with brand styling
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
      labels: {
        padding: 16,
        usePointStyle: true,
        pointStyle: 'circle',
        font: {
          size: 12,
          weight: '500' as const,
        }
      }
    },
    tooltip: {
      backgroundColor: 'hsl(var(--glass-fill))',
      borderColor: 'hsl(var(--glass-stroke))',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        labelTextColor: () => 'hsl(var(--fg))',
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
        color: 'hsl(var(--border) / 0.5)',
      },
      ticks: {
        font: {
          size: 11,
        }
      }
    },
  },
}