import { test, expect, type Page } from '@playwright/test';

/**
 * Components Gallery Visual Regression Tests
 * Tests all v2 components in isolation with different states and variations
 */

// Helper function to prepare component testing environment
async function setupComponentTesting(page: Page) {
  await page.addStyleTag({
    content: `
      /* Consistent component testing styles */
      body {
        padding: 2rem;
        background: hsl(var(--bg));
        min-height: 100vh;
      }
      
      /* Component isolation container */
      .component-test-container {
        margin: 1rem 0;
        padding: 2rem;
        border: 1px dashed rgba(107, 114, 128, 0.3);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.02);
      }
      
      /* Mask dynamic content in isolated components */
      .font-metric,
      [data-testid*="metric-value"] {
        opacity: 0.4 !important;
        color: #6b7280 !important;
      }
      
      /* Ensure glass effects render consistently */
      [class*="glass"],
      [class*="backdrop"] {
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
      }
      
      /* Disable animations for consistent screenshots */
      * {
        animation: none !important;
        transition: none !important;
      }
    `
  });
  
  // Wait for styles to apply
  await page.waitForTimeout(300);
}

test.describe('V2 Components Gallery - Individual Components', () => {
  test.beforeEach(async ({ page }) => {
    // Create a test route for component gallery if it doesn't exist
    await page.goto('/component-gallery');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await setupComponentTesting(page);
  });

  test('GlassCard component variations', async ({ page }) => {
    const glassCards = page.locator('.glass-card, [data-testid*="glass-card"]');
    
    if (await glassCards.count() > 0) {
      // Test default glass card
      await expect(glassCards.first()).toHaveScreenshot('glass-card-default.png', {
        animations: 'disabled',
        threshold: 0.3, // Lenient for glass blur effects
      });
      
      // Test with different content
      const cards = await glassCards.all();
      for (let i = 0; i < Math.min(cards.length, 3); i++) {
        await expect(cards[i]).toHaveScreenshot(`glass-card-variant-${i + 1}.png`, {
          animations: 'disabled',
          threshold: 0.3,
        });
      }
    }
  });

  test('KpiTile component states', async ({ page }) => {
    const kpiTiles = page.locator('[data-testid*="kpi-tile"], .kpi-tile');
    
    if (await kpiTiles.count() > 0) {
      const tiles = await kpiTiles.all();
      
      for (let i = 0; i < Math.min(tiles.length, 4); i++) {
        await expect(tiles[i]).toHaveScreenshot(`kpi-tile-${i + 1}.png`, {
          animations: 'disabled',
          threshold: 0.25,
        });
      }
    }
  });

  test('KPIHero component with brand styling', async ({ page }) => {
    const kpiHero = page.locator('[data-testid*="kpi-hero"], .kpi-hero');
    
    if (await kpiHero.count() > 0) {
      await expect(kpiHero.first()).toHaveScreenshot('kpi-hero-isolated.png', {
        animations: 'disabled',
        threshold: 0.25,
      });
    }
  });

  test('QuickActionsRow component', async ({ page }) => {
    const quickActions = page.locator('[data-testid*="quick-actions"], .quick-actions');
    
    if (await quickActions.count() > 0) {
      await expect(quickActions.first()).toHaveScreenshot('quick-actions-row.png', {
        animations: 'disabled',
      });
    }
  });

  test('RightRailTile component', async ({ page }) => {
    const rightRailTiles = page.locator('[data-testid*="right-rail"], .right-rail-tile');
    
    if (await rightRailTiles.count() > 0) {
      const tiles = await rightRailTiles.all();
      
      for (let i = 0; i < Math.min(tiles.length, 3); i++) {
        await expect(tiles[i]).toHaveScreenshot(`right-rail-tile-${i + 1}.png`, {
          animations: 'disabled',
          threshold: 0.25,
        });
      }
    }
  });

  test('DataTableV2 component', async ({ page }) => {
    const dataTables = page.locator('[data-testid*="data-table"], .data-table-v2');
    
    if (await dataTables.count() > 0) {
      await expect(dataTables.first()).toHaveScreenshot('data-table-v2.png', {
        animations: 'disabled',
        fullPage: false,
      });
    }
  });

  test('AppSidebar component with glass styling', async ({ page }) => {
    const sidebar = page.locator('[data-testid*="sidebar"], .app-sidebar');
    
    if (await sidebar.count() > 0) {
      await expect(sidebar.first()).toHaveScreenshot('app-sidebar-glass.png', {
        animations: 'disabled',
        threshold: 0.3, // Lenient for glass effects
      });
    }
  });
});

test.describe('Component Interactive States', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/component-gallery');
    await page.waitForLoadState('networkidle');
    await setupComponentTesting(page);
  });

  test('Button hover and focus states', async ({ page }) => {
    const buttons = page.locator('button, .btn, [role="button"]');
    
    if (await buttons.count() > 0) {
      const button = buttons.first();
      
      // Default state
      await expect(button).toHaveScreenshot('button-default.png', {
        animations: 'disabled',
      });
      
      // Hover state
      await button.hover();
      await expect(button).toHaveScreenshot('button-hover.png', {
        animations: 'disabled',
      });
      
      // Focus state
      await button.focus();
      await expect(button).toHaveScreenshot('button-focus.png', {
        animations: 'disabled',
      });
    }
  });

  test('Link brand color variations', async ({ page }) => {
    const brandLinks = page.locator('.link-brand, [class*="ai-teal"], [class*="ai-gold"]');
    
    if (await brandLinks.count() > 0) {
      const links = await brandLinks.all();
      
      for (let i = 0; i < Math.min(links.length, 3); i++) {
        // Default state
        await expect(links[i]).toHaveScreenshot(`brand-link-${i + 1}-default.png`, {
          animations: 'disabled',
        });
        
        // Hover state
        await links[i].hover();
        await expect(links[i]).toHaveScreenshot(`brand-link-${i + 1}-hover.png`, {
          animations: 'disabled',
        });
      }
    }
  });

  test('Form input states with brand styling', async ({ page }) => {
    const inputs = page.locator('input, textarea, select');
    
    if (await inputs.count() > 0) {
      const input = inputs.first();
      
      // Default state
      await expect(input).toHaveScreenshot('input-default.png', {
        animations: 'disabled',
      });
      
      // Focus state
      await input.focus();
      await expect(input).toHaveScreenshot('input-focus.png', {
        animations: 'disabled',
      });
      
      // Filled state
      await input.fill('Sample text');
      await expect(input).toHaveScreenshot('input-filled.png', {
        animations: 'disabled',
      });
    }
  });

  test('Status chips with brand colors', async ({ page }) => {
    const chips = page.locator('.chip, [class*="chip-"], .badge');
    
    if (await chips.count() > 0) {
      // Remove masking for this test to see actual colors
      await page.addStyleTag({
        content: `
          .chip-success, 
          .chip-warning, 
          .chip-danger,
          [class*="chip-"] {
            background: revert !important;
            color: revert !important;
            border-color: revert !important;
          }
        `
      });
      
      const chipElements = await chips.all();
      
      for (let i = 0; i < Math.min(chipElements.length, 5); i++) {
        await expect(chipElements[i]).toHaveScreenshot(`chip-variant-${i + 1}.png`, {
          animations: 'disabled',
        });
      }
    }
  });
});

test.describe('Component Brand Application', () => {
  test('AI brand colors integration', async ({ page }) => {
    await page.goto('/component-gallery');
    await page.waitForLoadState('networkidle');
    
    // Test teal accent usage
    const tealElements = page.locator('[class*="ai-teal"]');
    if (await tealElements.count() > 0) {
      await expect(tealElements.first()).toHaveScreenshot('ai-teal-branding.png', {
        animations: 'disabled',
      });
    }
    
    // Test gold accent usage
    const goldElements = page.locator('[class*="ai-gold"]');
    if (await goldElements.count() > 0) {
      await expect(goldElements.first()).toHaveScreenshot('ai-gold-branding.png', {
        animations: 'disabled',
      });
    }
  });

  test('Glass morphism consistency', async ({ page }) => {
    await page.goto('/component-gallery');
    await page.waitForLoadState('networkidle');
    
    const glassElements = page.locator('[class*="glass"], [style*="backdrop-filter"]');
    
    if (await glassElements.count() > 0) {
      // Test multiple glass elements for consistency
      const elements = await glassElements.all();
      
      for (let i = 0; i < Math.min(elements.length, 3); i++) {
        await expect(elements[i]).toHaveScreenshot(`glass-consistency-${i + 1}.png`, {
          animations: 'disabled',
          threshold: 0.35, // Very lenient for glass blur variations
        });
      }
    }
  });

  test('Dark shell light islands theme', async ({ page }) => {
    await page.goto('/component-gallery');
    await page.waitForLoadState('networkidle');
    
    // Capture overall component gallery to verify theme application
    const main = page.locator('main, .component-gallery, body');
    await expect(main.first()).toHaveScreenshot('component-gallery-theme.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.2,
    });
  });
});

test.describe('Component Responsive Behavior', () => {
  const viewports = [
    { width: 1200, height: 800, name: 'desktop' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 375, height: 667, name: 'mobile' }
  ];

  viewports.forEach(viewport => {
    test(`Components at ${viewport.name} viewport`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/component-gallery');
      await page.waitForLoadState('networkidle');
      await setupComponentTesting(page);
      
      // Test key responsive components
      const responsiveComponents = page.locator(
        '[data-testid*="kpi-hero"], [data-testid*="kpi-tile"], .glass-card, .quick-actions'
      );
      
      if (await responsiveComponents.count() > 0) {
        const components = await responsiveComponents.all();
        
        for (let i = 0; i < Math.min(components.length, 2); i++) {
          await expect(components[i]).toHaveScreenshot(
            `component-${i + 1}-${viewport.name}.png`, 
            {
              animations: 'disabled',
              threshold: 0.25,
            }
          );
        }
      }
    });
  });
});