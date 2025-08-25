import { test, expect } from '@playwright/test';

test.describe('Dashboard Enterprise UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('KPI Hero visual snapshot', async ({ page }) => {
    // Wait for KPI hero to load and mask dynamic content
    const kpiHero = page.locator('[data-testid="kpi-hero"]');
    await expect(kpiHero).toBeVisible();
    
    // Mask dynamic numbers and sparkline
    await page.addStyleTag({
      content: `
        .font-metric, .sparkline { 
          opacity: 0.3 !important; 
        }
        .chip-success, .chip-warning, .chip-danger {
          background: #f0f0f0 !important;
          color: #666 !important;
        }
      `
    });

    await expect(kpiHero).toHaveScreenshot('kpi-hero.png');
  });

  test('SEO Keywords table header and first row', async ({ page }) => {
    await page.goto('/seo');
    
    // Wait for table to load
    const table = page.locator('.table-enterprise').first();
    await expect(table).toBeVisible();
    
    // Focus on header and first row only
    const tableHeader = page.locator('.table-enterprise thead');
    const firstRow = page.locator('.table-enterprise tbody tr').first();
    
    // Mask timestamps and dynamic data
    await page.addStyleTag({
      content: `
        .font-mono { 
          opacity: 0.5 !important; 
        }
        .chip-success, .chip-warning, .chip-danger {
          background: #f0f0f0 !important;
          color: #666 !important;
        }
      `
    });

    await expect(tableHeader).toHaveScreenshot('seo-table-header.png');
    await expect(firstRow).toHaveScreenshot('seo-table-first-row.png');
  });

  test('Dashboard grid layout', async ({ page }) => {
    const gridContainer = page.locator('[data-testid="dashboard-grid"]');
    await expect(gridContainer).toBeVisible();
    
    // Mask dynamic content but keep layout
    await page.addStyleTag({
      content: `
        .font-metric, .text-2xl, .text-6xl, .text-7xl { 
          opacity: 0.3 !important; 
        }
      `
    });

    await expect(gridContainer).toHaveScreenshot('dashboard-grid-layout.png');
  });

  test('Enterprise table density toggle', async ({ page }) => {
    await page.goto('/seo');
    
    const densityToggle = page.locator('[data-testid="density-toggle"]');
    await expect(densityToggle).toBeVisible();
    
    // Test comfortable mode
    await page.locator('button:has-text("Comfortable")').click();
    const comfortableTable = page.locator('.table-enterprise.table-comfortable').first();
    await expect(comfortableTable).toHaveScreenshot('table-comfortable.png');
    
    // Test compact mode
    await page.locator('button:has-text("Compact")').click();
    const compactTable = page.locator('.table-enterprise.table-compact').first();
    await expect(compactTable).toHaveScreenshot('table-compact.png');
  });

  test('Focus states accessibility', async ({ page }) => {
    // Test focus rings on key interactive elements
    const primaryButton = page.locator('.btn-primary').first();
    await primaryButton.focus();
    await expect(primaryButton).toHaveScreenshot('focus-primary-button.png');
    
    const navLink = page.locator('nav a').first();
    await navLink.focus();
    await expect(navLink).toHaveScreenshot('focus-nav-link.png');
    
    const brandLink = page.locator('.link-brand').first();
    if (await brandLink.count() > 0) {
      await brandLink.focus();
      await expect(brandLink).toHaveScreenshot('focus-brand-link.png');
    }
  });
});

test.describe('Brand Application', () => {
  test('Status chips variations', async ({ page }) => {
    await page.goto('/seo');
    
    const successChip = page.locator('.chip-success').first();
    const warningChip = page.locator('.chip-warning').first();
    const dangerChip = page.locator('.chip-danger').first();
    
    await expect(successChip).toHaveScreenshot('chip-success.png');
    await expect(warningChip).toHaveScreenshot('chip-warning.png');  
    await expect(dangerChip).toHaveScreenshot('chip-danger.png');
  });

  test('Button variants', async ({ page }) => {
    await page.goto('/dashboard');
    
    const primaryBtn = page.locator('.btn-primary').first();
    const secondaryBtn = page.locator('.btn-secondary').first();
    const ghostBtn = page.locator('.btn-ghost').first();
    
    await expect(primaryBtn).toHaveScreenshot('button-primary.png');
    await expect(secondaryBtn).toHaveScreenshot('button-secondary.png');
    await expect(ghostBtn).toHaveScreenshot('button-ghost.png');
  });
});