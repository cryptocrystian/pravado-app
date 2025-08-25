import { test, expect, type Page } from '@playwright/test';

/**
 * Tables Visual Regression Tests
 * Tests SEO table header, sample rows, sorting states, and table variations
 */

// Helper function to mask dynamic table content
async function maskTableDynamicContent(page: Page) {
  await page.addStyleTag({
    content: `
      /* Mask dynamic metrics and timestamps in tables */
      .table-enterprise td .font-mono,
      .table-enterprise td [data-testid*="timestamp"],
      .table-enterprise td time,
      .table-enterprise td .metric-value {
        opacity: 0.5 !important;
        color: #9ca3af !important;
      }
      
      /* Standardize status chips in tables */
      .table-enterprise .chip-success, 
      .table-enterprise .chip-warning, 
      .table-enterprise .chip-danger,
      .table-enterprise [class*="chip-"] {
        background: rgba(107, 114, 128, 0.1) !important;
        color: #6b7280 !important;
        border-color: rgba(107, 114, 128, 0.2) !important;
      }
      
      /* Ensure consistent row heights */
      .table-enterprise tbody tr {
        height: auto !important;
        min-height: 48px;
      }
      
      /* Mask sparklines and mini-charts */
      .sparkline,
      .mini-chart,
      .table-chart {
        opacity: 0.3 !important;
        background: #f3f4f6 !important;
      }
      
      /* Disable table animations */
      .table-enterprise * {
        animation: none !important;
        transition: none !important;
      }
      
      /* Ensure glass effects render consistently on tables */
      .table-enterprise,
      [class*="glass"] {
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
      }
    `
  });
  
  // Wait for styles to apply
  await page.waitForTimeout(300);
}

// Helper function to wait for table loading
async function waitForTableLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  
  // Wait for table to be visible
  const table = page.locator('.table-enterprise, [data-testid*="table"], table').first();
  await expect(table).toBeVisible();
  
  // Wait for rows to load
  await page.waitForSelector('tbody tr', { timeout: 10000 });
  
  // Wait for fonts and any loading indicators to disappear
  await page.evaluate(() => document.fonts.ready);
  
  // Hide loading states
  await page.addStyleTag({
    content: `
      [data-testid*="loading"],
      [class*="skeleton"],
      [class*="animate-pulse"],
      .loading-spinner {
        display: none !important;
      }
    `
  });
}

test.describe('SEO Table Visual Snapshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/seo');
    await waitForTableLoad(page);
    await maskTableDynamicContent(page);
  });

  test('SEO table header with sorting indicators', async ({ page }) => {
    const tableHeader = page.locator('.table-enterprise thead, table thead').first();
    await expect(tableHeader).toBeVisible();
    
    await expect(tableHeader).toHaveScreenshot('seo-table-header.png', {
      animations: 'disabled',
    });
  });

  test('SEO table first three rows sample', async ({ page }) => {
    const tableBody = page.locator('.table-enterprise tbody, table tbody').first();
    await expect(tableBody).toBeVisible();
    
    // Get first 3 rows
    const firstThreeRows = page.locator('.table-enterprise tbody tr, table tbody tr').first();
    const secondRow = page.locator('.table-enterprise tbody tr, table tbody tr').nth(1);
    const thirdRow = page.locator('.table-enterprise tbody tr, table tbody tr').nth(2);
    
    // Test individual rows
    if (await firstThreeRows.count() > 0) {
      await expect(firstThreeRows).toHaveScreenshot('seo-table-row-1.png', {
        animations: 'disabled',
      });
    }
    
    if (await secondRow.count() > 0) {
      await expect(secondRow).toHaveScreenshot('seo-table-row-2.png', {
        animations: 'disabled',
      });
    }
    
    if (await thirdRow.count() > 0) {
      await expect(thirdRow).toHaveScreenshot('seo-table-row-3.png', {
        animations: 'disabled',
      });
    }
  });

  test('SEO table complete view with header and sample rows', async ({ page }) => {
    const table = page.locator('.table-enterprise, table').first();
    await expect(table).toBeVisible();
    
    // Limit visible rows for consistent snapshot
    await page.addStyleTag({
      content: `
        .table-enterprise tbody tr:nth-child(n+6),
        table tbody tr:nth-child(n+6) {
          display: none !important;
        }
      `
    });
    
    await expect(table).toHaveScreenshot('seo-table-complete.png', {
      animations: 'disabled',
      fullPage: false,
    });
  });

  test('Table sorting states', async ({ page }) => {
    const sortableHeaders = page.locator('.table-enterprise th[role="button"], .table-enterprise th.sortable, table th[role="button"]');
    
    if (await sortableHeaders.count() > 0) {
      const firstSortableHeader = sortableHeaders.first();
      
      // Default state
      await expect(firstSortableHeader).toHaveScreenshot('table-header-sortable-default.png', {
        animations: 'disabled',
      });
      
      // Click to sort ascending
      await firstSortableHeader.click();
      await page.waitForTimeout(500); // Wait for sort to complete
      
      await expect(firstSortableHeader).toHaveScreenshot('table-header-sort-asc.png', {
        animations: 'disabled',
      });
      
      // Click again to sort descending
      await firstSortableHeader.click();
      await page.waitForTimeout(500);
      
      await expect(firstSortableHeader).toHaveScreenshot('table-header-sort-desc.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Table Density and Layout Variations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/seo');
    await waitForTableLoad(page);
    await maskTableDynamicContent(page);
  });

  test('Table density toggle - Comfortable mode', async ({ page }) => {
    const densityToggle = page.locator('[data-testid="density-toggle"], .density-toggle');
    
    if (await densityToggle.count() > 0) {
      // Switch to comfortable mode
      const comfortableButton = page.locator('button:has-text("Comfortable")');
      if (await comfortableButton.count() > 0) {
        await comfortableButton.click();
        await page.waitForTimeout(300);
        
        const table = page.locator('.table-enterprise.table-comfortable, .table-comfortable').first();
        if (await table.count() > 0) {
          await expect(table).toHaveScreenshot('table-density-comfortable.png', {
            animations: 'disabled',
            fullPage: false,
          });
        }
      }
    }
  });

  test('Table density toggle - Compact mode', async ({ page }) => {
    const densityToggle = page.locator('[data-testid="density-toggle"], .density-toggle');
    
    if (await densityToggle.count() > 0) {
      // Switch to compact mode
      const compactButton = page.locator('button:has-text("Compact")');
      if (await compactButton.count() > 0) {
        await compactButton.click();
        await page.waitForTimeout(300);
        
        const table = page.locator('.table-enterprise.table-compact, .table-compact').first();
        if (await table.count() > 0) {
          await expect(table).toHaveScreenshot('table-density-compact.png', {
            animations: 'disabled',
            fullPage: false,
          });
        }
      }
    }
  });

  test('Table with glass morphism styling', async ({ page }) => {
    const glassTable = page.locator('.table-enterprise[class*="glass"], .glass-table, table[class*="glass"]');
    
    if (await glassTable.count() > 0) {
      await expect(glassTable.first()).toHaveScreenshot('table-glass-styling.png', {
        animations: 'disabled',
        threshold: 0.25, // Lenient for glass effects
      });
    }
  });
});

test.describe('Table Brand Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/seo');
    await waitForTableLoad(page);
  });

  test('Status chips with brand colors in table cells', async ({ page }) => {
    // Remove color masking for this test
    await page.addStyleTag({
      content: `
        .table-enterprise .chip-success, 
        .table-enterprise .chip-warning, 
        .table-enterprise .chip-danger,
        .table-enterprise [class*="chip-"] {
          background: revert !important;
          color: revert !important;
          border-color: revert !important;
        }
      `
    });
    
    const statusChips = page.locator('.table-enterprise .chip, .table-enterprise [class*="chip-"]');
    
    if (await statusChips.count() > 0) {
      const chips = await statusChips.all();
      
      for (let i = 0; i < Math.min(chips.length, 4); i++) {
        await expect(chips[i]).toHaveScreenshot(`table-chip-${i + 1}.png`, {
          animations: 'disabled',
        });
      }
    }
  });

  test('Table brand links and interactive elements', async ({ page }) => {
    const brandLinks = page.locator('.table-enterprise .link-brand, .table-enterprise [class*="ai-teal"], .table-enterprise [class*="ai-gold"]');
    
    if (await brandLinks.count() > 0) {
      const links = await brandLinks.all();
      
      for (let i = 0; i < Math.min(links.length, 3); i++) {
        await expect(links[i]).toHaveScreenshot(`table-brand-link-${i + 1}.png`, {
          animations: 'disabled',
        });
      }
    }
  });

  test('Table hover states with brand colors', async ({ page }) => {
    const tableRows = page.locator('.table-enterprise tbody tr, table tbody tr');
    
    if (await tableRows.count() > 0) {
      const firstRow = tableRows.first();
      
      // Default row state
      await expect(firstRow).toHaveScreenshot('table-row-default.png', {
        animations: 'disabled',
      });
      
      // Hover state
      await firstRow.hover();
      await expect(firstRow).toHaveScreenshot('table-row-hover.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Table Responsive Behavior', () => {
  const viewports = [
    { width: 1200, height: 800, name: 'desktop' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 375, height: 667, name: 'mobile' }
  ];

  viewports.forEach(viewport => {
    test(`SEO table at ${viewport.name} viewport`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/seo');
      await waitForTableLoad(page);
      await maskTableDynamicContent(page);
      
      const table = page.locator('.table-enterprise, table').first();
      if (await table.count() > 0) {
        await expect(table).toHaveScreenshot(`seo-table-${viewport.name}.png`, {
          animations: 'disabled',
          fullPage: false,
        });
      }
    });
  });

  test('Table horizontal scroll behavior on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/seo');
    await waitForTableLoad(page);
    await maskTableDynamicContent(page);
    
    const tableContainer = page.locator('.table-container, .overflow-x-auto, .table-wrapper').first();
    
    if (await tableContainer.count() > 0) {
      await expect(tableContainer).toHaveScreenshot('table-mobile-scroll.png', {
        animations: 'disabled',
      });
      
      // Test scrolled state
      await tableContainer.evaluate(el => {
        el.scrollLeft = el.scrollWidth / 2;
      });
      
      await expect(tableContainer).toHaveScreenshot('table-mobile-scrolled.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Alternative Table Views', () => {
  test('Analytics page table comparison', async ({ page }) => {
    await page.goto('/analytics');
    await waitForTableLoad(page);
    await maskTableDynamicContent(page);
    
    const analyticsTable = page.locator('.table-enterprise, table').first();
    if (await analyticsTable.count() > 0) {
      await expect(analyticsTable).toHaveScreenshot('analytics-table.png', {
        animations: 'disabled',
        fullPage: false,
      });
    }
  });

  test('Campaigns page table styling', async ({ page }) => {
    await page.goto('/campaigns');
    await waitForTableLoad(page);
    await maskTableDynamicContent(page);
    
    const campaignsTable = page.locator('.table-enterprise, table').first();
    if (await campaignsTable.count() > 0) {
      await expect(campaignsTable).toHaveScreenshot('campaigns-table.png', {
        animations: 'disabled',
        fullPage: false,
      });
    }
  });
});