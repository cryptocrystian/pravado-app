import { test, expect, type Page } from '@playwright/test';

/**
 * Dashboard Visual Regression Tests
 * Tests the main dashboard layout, KPI hero, and secondary tiles for visual consistency
 */

// Helper function to mask dynamic content consistently
async function maskDynamicContent(page: Page) {
  await page.addStyleTag({
    content: `
      /* Mask dynamic metrics while preserving layout */
      .font-metric, 
      .text-6xl, 
      .text-7xl,
      [data-testid*="metric-value"],
      .sparkline,
      .chart-container canvas {
        opacity: 0.3 !important;
        color: #6b7280 !important;
      }
      
      /* Standardize status chips for consistent colors */
      .chip-success, 
      .chip-warning, 
      .chip-danger,
      [class*="chip-"] {
        background: rgba(107, 114, 128, 0.1) !important;
        color: #6b7280 !important;
        border-color: rgba(107, 114, 128, 0.2) !important;
      }
      
      /* Mask timestamps and dates */
      .font-mono,
      [data-testid*="timestamp"],
      [data-testid*="date"],
      time {
        opacity: 0.5 !important;
        color: #9ca3af !important;
      }
      
      /* Ensure glass effects render consistently */
      [class*="glass"],
      [class*="backdrop"] {
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
      }
      
      /* Hide loading states and skeleton content */
      [data-testid*="loading"],
      [class*="skeleton"],
      [class*="animate-pulse"] {
        display: none !important;
      }
    `
  });
  
  // Wait for any animations to complete
  await page.waitForTimeout(500);
}

test.describe('Dashboard Visual Snapshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    
    // Apply consistent masking
    await maskDynamicContent(page);
  });

  test('Full dashboard layout - Desktop', async ({ page }) => {
    const dashboardContainer = page.locator('main, [data-testid="dashboard"], .dashboard-container').first();
    await expect(dashboardContainer).toBeVisible();
    
    await expect(dashboardContainer).toHaveScreenshot('dashboard-full-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('KPI Hero section with glassmorphism', async ({ page }) => {
    const kpiHero = page.locator('[data-testid="kpi-hero"], .kpi-hero, .hero-section').first();
    await expect(kpiHero).toBeVisible();
    
    // Apply enhanced masking for timestamps and sparklines per Phase 3 requirements
    await page.addStyleTag({
      content: `
        /* Phase 3: Enhanced sparkline masking */
        [data-testid="kpi-hero"] .sparkline,
        [data-testid="kpi-hero"] canvas,
        .kpi-hero .sparkline,
        .kpi-hero canvas,
        .hero-section .sparkline,
        .hero-section canvas {
          opacity: 0.2 !important;
          filter: grayscale(50%) !important;
          background: rgba(170, 170, 170, 0.1) !important;
        }
        
        /* Phase 3: Enhanced timestamp masking */
        [data-testid="kpi-hero"] [data-testid*="timestamp"],
        [data-testid="kpi-hero"] time,
        [data-testid="kpi-hero"] .font-mono,
        .kpi-hero [data-testid*="timestamp"],
        .kpi-hero time,
        .kpi-hero .font-mono {
          opacity: 0.3 !important;
          color: #94a3b8 !important;
        }
        
        /* Preserve glass effects and brand colors */
        [data-testid="kpi-hero"],
        .kpi-hero,
        .hero-section {
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
        }
        
        /* Ensure brand gradient visibility */
        [data-testid="kpi-hero"] [class*="ai-teal"],
        [data-testid="kpi-hero"] [class*="ai-gold"],
        .kpi-hero [class*="ai-teal"],
        .kpi-hero [class*="ai-gold"] {
          color: revert !important;
          background: revert !important;
        }
      `
    });
    
    // Ensure glass effects are visible
    await expect(kpiHero).toHaveScreenshot('kpi-hero-glass.png', {
      animations: 'disabled',
      threshold: 0.25, // More lenient for glass effects
    });
  });

  test('KPI tiles grid layout', async ({ page }) => {
    const kpiGrid = page.locator('[data-testid="kpi-grid"], .kpi-grid, .tiles-grid').first();
    await expect(kpiGrid).toBeVisible();
    
    await expect(kpiGrid).toHaveScreenshot('kpi-tiles-grid.png', {
      animations: 'disabled',
    });
  });

  test('Secondary metrics tiles', async ({ page }) => {
    const secondaryTiles = page.locator('[data-testid="secondary-tiles"], .secondary-metrics, .right-rail').first();
    
    if (await secondaryTiles.count() > 0) {
      await expect(secondaryTiles).toBeVisible();
      await expect(secondaryTiles).toHaveScreenshot('secondary-tiles.png', {
        animations: 'disabled',
      });
    }
  });

  test('Dashboard header with branding', async ({ page }) => {
    const header = page.locator('header, [data-testid="header"], .app-header').first();
    await expect(header).toBeVisible();
    
    await expect(header).toHaveScreenshot('dashboard-header.png', {
      animations: 'disabled',
    });
  });

  test('Sidebar navigation with glass styling', async ({ page }) => {
    const sidebar = page.locator('aside, [data-testid="sidebar"], .app-sidebar, nav').first();
    await expect(sidebar).toBeVisible();
    
    await expect(sidebar).toHaveScreenshot('dashboard-sidebar.png', {
      animations: 'disabled',
      threshold: 0.25, // Lenient for glass blur effects
    });
  });
});

test.describe('Dashboard Responsive Snapshots', () => {
  test('Dashboard on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await maskDynamicContent(page);
    
    const dashboard = page.locator('main, [data-testid="dashboard"]').first();
    await expect(dashboard).toBeVisible();
    
    await expect(dashboard).toHaveScreenshot('dashboard-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Dashboard on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await maskDynamicContent(page);
    
    const dashboard = page.locator('main, [data-testid="dashboard"]').first();
    await expect(dashboard).toBeVisible();
    
    await expect(dashboard).toHaveScreenshot('dashboard-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('KPI Hero responsive behavior', async ({ page }) => {
    const viewports = [
      { width: 1200, height: 800, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await maskDynamicContent(page);
      
      const kpiHero = page.locator('[data-testid="kpi-hero"], .kpi-hero').first();
      if (await kpiHero.count() > 0) {
        await expect(kpiHero).toBeVisible();
        await expect(kpiHero).toHaveScreenshot(`kpi-hero-${viewport.name}.png`, {
          animations: 'disabled',
          threshold: 0.25,
        });
      }
    }
  });
});

test.describe('Phase 3: Visual QA Snapshots', () => {
  test('KPI Hero with masked sparklines and timestamps', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    
    const kpiHero = page.locator('[data-testid="kpi-hero"]').first();
    await expect(kpiHero).toBeVisible();
    
    // Phase 3 specific masking - more aggressive for dynamic content
    await page.addStyleTag({
      content: `
        /* Mask sparklines completely for stable snapshots */
        [data-testid="kpi-hero"] canvas,
        [data-testid="kpi-hero"] .sparkline {
          opacity: 0.15 !important;
          background: linear-gradient(90deg, #e2e8f0, #cbd5e1) !important;
          border-radius: 4px !important;
        }
        
        /* Mask timestamps with consistent placeholder styling */
        [data-testid="kpi-hero"] time,
        [data-testid="kpi-hero"] [data-testid*="timestamp"],
        [data-testid="kpi-hero"] .font-mono {
          opacity: 0.25 !important;
          color: #94a3b8 !important;
        }
        
        /* Preserve main score visibility */
        [data-testid="kpi-hero"] .text-7xl {
          color: revert !important;
          opacity: 1 !important;
        }
      `
    });
    
    await expect(kpiHero).toHaveScreenshot('phase3-kpi-hero-masked.png', {
      animations: 'disabled',
      threshold: 0.2,
    });
  });
});

test.describe('Dashboard Brand Application', () => {
  test('AI teal accent colors in KPI components', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Look for brand color applications
    const brandElements = page.locator('[class*="ai-teal"], [class*="ai-gold"], [style*="--ai-teal"], [style*="--ai-gold"]');
    
    if (await brandElements.count() > 0) {
      await expect(brandElements.first()).toHaveScreenshot('brand-colors-application.png', {
        animations: 'disabled',
      });
    }
  });

  test('Glass morphism effects on cards', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const glassCards = page.locator('[class*="glass"], .glass-card, [style*="backdrop-filter"]');
    
    if (await glassCards.count() > 0) {
      await expect(glassCards.first()).toHaveScreenshot('glass-morphism-cards.png', {
        animations: 'disabled',
        threshold: 0.3, // Very lenient for blur effects
      });
    }
  });

  test('Dark shell with light content islands', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Capture the overall theme application
    const body = page.locator('body');
    await expect(body).toHaveScreenshot('dark-shell-light-islands.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.2,
    });
  });
});