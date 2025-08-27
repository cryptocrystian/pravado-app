// Chart.js theme initialization for enterprise branding

let isInitialized = false;

export function initializeChartTheme() {
  // Only initialize once to avoid repeated imports
  if (isInitialized) return;

  // Chart.js theme will be initialized when/if Chart.js is actually used
  // This avoids build-time dependency issues
  // Removed console.log to prevent potential re-render issues
  isInitialized = true;
}

// Function to apply theme when Chart.js is available
export function applyChartTheme() {
  try {
    // Check if Chart.js is available in global scope
    if (typeof window !== 'undefined' && (window as any).Chart) {
      const Chart = (window as any).Chart;
      const css = getComputedStyle(document.documentElement);
      
      // Get theme colors from CSS variables with fallbacks
      const foreground = `hsl(${css.getPropertyValue('--fg').trim() || '210 11% 85%'})`;
      const border = `hsl(${css.getPropertyValue('--border').trim() || '215 16% 47%'})`;
      const aiTeal300 = `hsl(${css.getPropertyValue('--ai-teal-300').trim() || '170 70% 58%'})`;
      const aiTeal500 = `hsl(${css.getPropertyValue('--ai-teal-500').trim() || '170 72% 45%'})`;
      const aiGold300 = `hsl(${css.getPropertyValue('--ai-gold-300').trim() || '40 92% 66%'})`;
      const aiGold500 = `hsl(${css.getPropertyValue('--ai-gold-500').trim() || '40 92% 52%'})`;
      const glassFill = `hsl(${css.getPropertyValue('--panel').trim() || '220 13% 18%'})`;
      const glassStroke = `hsl(${css.getPropertyValue('--border').trim() || '215 16% 47%'})`;
      
      // Configure global Chart.js defaults for dark shell theme
      Chart.defaults.color = foreground;
      Chart.defaults.borderColor = border;
      Chart.defaults.backgroundColor = 'transparent';
      
      // Enhanced tooltip styling for glass morphism
      Chart.defaults.plugins.tooltip.backgroundColor = glassFill + 'e6'; // 90% opacity
      Chart.defaults.plugins.tooltip.borderColor = glassStroke;
      Chart.defaults.plugins.tooltip.borderWidth = 1;
      Chart.defaults.plugins.tooltip.titleColor = foreground;
      Chart.defaults.plugins.tooltip.bodyColor = foreground;
      Chart.defaults.plugins.tooltip.padding = 16;
      Chart.defaults.plugins.tooltip.cornerRadius = 12;
      Chart.defaults.plugins.tooltip.displayColors = true;
      Chart.defaults.plugins.tooltip.usePointStyle = true;
      Chart.defaults.plugins.tooltip.boxPadding = 8;
      
      // Legend styling for dark theme
      Chart.defaults.plugins.legend.labels.color = foreground;
      Chart.defaults.plugins.legend.labels.usePointStyle = true;
      Chart.defaults.plugins.legend.labels.padding = 20;
      Chart.defaults.plugins.legend.labels.boxWidth = 12;
      Chart.defaults.plugins.legend.labels.boxHeight = 12;
      
      // Enhanced brand color palette with proper contrast for dark shell
      const brandPalette = [
        aiTeal500,   // Primary AI brand color
        aiGold500,   // Secondary AI brand color  
        aiTeal300,   // Lighter teal variant
        aiGold300,   // Lighter gold variant
        '#64748b',   // Slate 500 - good contrast on dark
        '#94a3b8',   // Slate 400 - medium contrast
        '#cbd5e1',   // Slate 300 - lighter contrast
      ];
      
      // Apply brand colors to different chart types
      Chart.defaults.datasets.line.borderColor = brandPalette;
      Chart.defaults.datasets.line.backgroundColor = brandPalette.map(c => c + '20'); // 12% opacity
      Chart.defaults.datasets.line.borderWidth = 3;
      Chart.defaults.datasets.line.pointBackgroundColor = brandPalette;
      Chart.defaults.datasets.line.pointBorderColor = brandPalette;
      Chart.defaults.datasets.line.pointBorderWidth = 2;
      Chart.defaults.datasets.line.pointRadius = 4;
      Chart.defaults.datasets.line.pointHoverRadius = 6;
      Chart.defaults.datasets.line.fill = false;
      
      Chart.defaults.datasets.bar.backgroundColor = brandPalette.map(c => c + 'cc'); // 80% opacity
      Chart.defaults.datasets.bar.borderColor = brandPalette;
      Chart.defaults.datasets.bar.borderWidth = 1;
      Chart.defaults.datasets.bar.borderRadius = 4;
      
      Chart.defaults.datasets.pie.backgroundColor = brandPalette;
      Chart.defaults.datasets.pie.borderColor = glassFill;
      Chart.defaults.datasets.pie.borderWidth = 2;
      
      Chart.defaults.datasets.doughnut.backgroundColor = brandPalette;
      Chart.defaults.datasets.doughnut.borderColor = glassFill;
      Chart.defaults.datasets.doughnut.borderWidth = 3;
      
      // Enhanced grid and axis styling for dark shell
      Chart.defaults.scales.linear.grid.color = border + '40'; // 25% opacity
      Chart.defaults.scales.linear.grid.lineWidth = 1;
      Chart.defaults.scales.linear.ticks.color = foreground + 'cc'; // 80% opacity
      Chart.defaults.scales.linear.ticks.font = { size: 12, family: 'Inter', weight: '500' };
      
      Chart.defaults.scales.category.grid.display = false;
      Chart.defaults.scales.category.ticks.color = foreground + 'cc';
      Chart.defaults.scales.category.ticks.font = { size: 12, family: 'Inter', weight: '500' };
      
      console.log('Enhanced Chart.js theme applied successfully with brand colors');
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