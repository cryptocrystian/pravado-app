// PR2 - Chart.js Theme Implementation
export function applyChartTheme() {
  // Apply theme if Chart.js is available globally
  if (typeof window !== 'undefined' && (window as any).Chart) {
    try {
      const Chart = (window as any).Chart;
      const css = getComputedStyle(document.documentElement);
      Chart.defaults.color = css.getPropertyValue('--fg').trim();
      Chart.defaults.borderColor = css.getPropertyValue('--border').trim();
      console.log('Chart theme applied with brand colors');
    } catch (error) {
      console.warn('Error applying chart theme:', error);
    }
  } else {
    console.log('Chart.js not available, theme will be applied when loaded');
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

// Enhanced brand palette array for series with dark shell compatibility
export const brandPalette = [
  chartColors.aiTeal500,   // Primary AI brand color
  chartColors.aiGold500,   // Secondary AI brand color
  chartColors.aiTeal300,   // Lighter teal variant
  chartColors.aiGold300,   // Lighter gold variant
  '#64748b',               // Slate 500 - good contrast on dark
  '#94a3b8',               // Slate 400 - medium contrast
  '#cbd5e1',               // Slate 300 - lighter contrast
]

// Brand palette with alpha variants for backgrounds
export const brandPaletteAlpha = [
  chartColors.aiTeal500 + '20',   // 12% opacity
  chartColors.aiGold500 + '20',
  chartColors.aiTeal300 + '20',
  chartColors.aiGold300 + '20',
  '#64748b20',
  '#94a3b820',
  '#cbd5e120',
]

// Enhanced chart configurations with dark shell theme and brand styling
export const chartConfig = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  elements: {
    line: {
      borderWidth: 3,
      borderCapStyle: 'round',
      borderJoinStyle: 'round',
      fill: false,
    },
    point: {
      radius: 4,
      hoverRadius: 6,
      borderWidth: 2,
      backgroundColor: 'transparent',
    },
    bar: {
      borderRadius: 4,
      borderWidth: 1,
    },
    arc: {
      borderWidth: 2,
    }
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      align: 'start' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 12,
        boxHeight: 12,
        color: 'hsl(var(--fg))',
        font: {
          size: 12,
          weight: '500' as const,
          family: 'Inter',
        }
      }
    },
    tooltip: {
      backgroundColor: 'hsl(var(--panel) / 0.95)',
      borderColor: 'hsl(var(--border))',
      borderWidth: 1,
      padding: 16,
      cornerRadius: 12,
      displayColors: true,
      usePointStyle: true,
      boxPadding: 8,
      titleColor: 'hsl(var(--fg))',
      bodyColor: 'hsl(var(--fg))',
      titleFont: {
        size: 13,
        weight: '600' as const,
        family: 'Inter',
      },
      bodyFont: {
        size: 12,
        weight: '500' as const,
        family: 'Inter',
      },
      callbacks: {
        labelTextColor: () => 'hsl(var(--fg))',
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: 'hsl(var(--fg) / 0.8)',
        font: {
          size: 12,
          weight: '500' as const,
          family: 'Inter',
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
        color: 'hsl(var(--border) / 0.25)',
        lineWidth: 1,
      },
      ticks: {
        color: 'hsl(var(--fg) / 0.8)',
        font: {
          size: 12,
          weight: '500' as const,
          family: 'Inter',
        }
      }
    },
  },
}

// Specific configurations for different chart types with brand theming
export const lineChartConfig = {
  ...chartConfig,
  elements: {
    ...chartConfig.elements,
    line: {
      ...chartConfig.elements.line,
      tension: 0.1, // Slight curve for smoother lines
    }
  }
}

export const barChartConfig = {
  ...chartConfig,
  elements: {
    ...chartConfig.elements,
    bar: {
      ...chartConfig.elements.bar,
      borderSkipped: false,
    }
  }
}

export const pieChartConfig = {
  ...chartConfig,
  plugins: {
    ...chartConfig.plugins,
    legend: {
      ...chartConfig.plugins.legend,
      position: 'right' as const,
    }
  }
}