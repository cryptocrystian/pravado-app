/**
 * V3 Chart.js Theme Configuration
 * Enforces brand-compliant chart styling with teal/gold palette
 */

// V3 Brand Colors
export const V3_COLORS = {
  teal: {
    300: 'hsl(170, 70%, 58%)',
    500: 'hsl(170, 72%, 45%)', 
    700: 'hsl(170, 78%, 34%)'
  },
  gold: {
    300: 'hsl(40, 92%, 66%)',
    500: 'hsl(40, 92%, 52%)',
    700: 'hsl(40, 94%, 40%)'
  },
  neutral: {
    fg: 'hsl(210, 20%, 98%)',
    border: 'hsl(222, 16%, 26%)'
  }
} as const

// V3 Default Chart Palette - Simplified to teal/gold only
export const V3_CHART_PALETTE = [
  V3_COLORS.teal[500],    // Series 0: Primary teal
  V3_COLORS.gold[500],    // Series 1: Primary gold
  V3_COLORS.teal[300],    // Series 2: Light teal
  V3_COLORS.gold[300],    // Series 3: Light gold
  V3_COLORS.teal[700],    // Series 4: Dark teal
  V3_COLORS.gold[700],    // Series 5: Dark gold
]

// Chart.js V3 Default Configuration
export const CHART_V3_DEFAULTS = {
  color: V3_COLORS.neutral.fg,
  font: {
    family: 'Inter, system-ui, sans-serif',
    size: 12,
    weight: 'normal'
  },
  plugins: {
    legend: {
      labels: {
        color: V3_COLORS.neutral.fg,
        usePointStyle: true,
        padding: 16
      }
    },
    tooltip: {
      backgroundColor: 'rgba(34, 34, 34, 0.95)',
      titleColor: V3_COLORS.neutral.fg,
      bodyColor: V3_COLORS.neutral.fg,
      borderColor: V3_COLORS.teal[500],
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: {
        color: V3_COLORS.neutral.border,
        borderColor: V3_COLORS.neutral.border
      },
      ticks: {
        color: V3_COLORS.neutral.fg
      }
    },
    y: {
      grid: {
        color: V3_COLORS.neutral.border,
        borderColor: V3_COLORS.neutral.border
      },
      ticks: {
        color: V3_COLORS.neutral.fg
      }
    }
  }
}

// Initialize Chart.js defaults
export function initializeChartV3Defaults() {
  if (typeof window !== 'undefined' && window.Chart) {
    // Set global defaults
    window.Chart.defaults.color = V3_COLORS.neutral.fg
    window.Chart.defaults.borderColor = V3_COLORS.neutral.border
    window.Chart.defaults.backgroundColor = V3_COLORS.teal[300]
    
    // Plugin defaults
    window.Chart.defaults.plugins.legend.labels.color = V3_COLORS.neutral.fg
    window.Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(34, 34, 34, 0.95)'
    window.Chart.defaults.plugins.tooltip.titleColor = V3_COLORS.neutral.fg
    window.Chart.defaults.plugins.tooltip.bodyColor = V3_COLORS.neutral.fg
    
    // Scale defaults
    if (window.Chart.defaults.scales) {
      window.Chart.defaults.scales.category = {
        grid: { color: V3_COLORS.neutral.border },
        ticks: { color: V3_COLORS.neutral.fg }
      }
      window.Chart.defaults.scales.linear = {
        grid: { color: V3_COLORS.neutral.border },
        ticks: { color: V3_COLORS.neutral.fg }
      }
    }
  }
}

// V3 Chart Config Builder
export function createChartConfigV3(type: 'line' | 'bar' | 'doughnut', data: any) {
  const config = {
    type,
    data: {
      ...data,
      datasets: data.datasets.map((dataset: any, index: number) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || V3_CHART_PALETTE[index % V3_CHART_PALETTE.length],
        borderColor: dataset.borderColor || V3_CHART_PALETTE[index % V3_CHART_PALETTE.length],
        borderWidth: 2,
        tension: 0.4 // Smooth curves for line charts
      }))
    },
    options: {
      ...CHART_V3_DEFAULTS,
      responsive: true,
      maintainAspectRatio: false
    }
  }
  
  return config
}