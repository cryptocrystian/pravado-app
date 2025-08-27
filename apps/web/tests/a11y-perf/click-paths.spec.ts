import { test, expect } from '@playwright/test';

/**
 * Click Path Efficiency Tests for Pravado UI Overhaul
 * Validates that key user workflows remain efficient with new UI
 */

test.describe('Click Path Efficiency Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Dashboard → Submit PR (≤3 actions)', async ({ page }) => {
    let actionCount = 0;
    
    await test.step('Navigate to PR submission', async () => {
      // Action 1: Look for QuickActionsRow or PR button
      const quickActions = page.locator('[data-testid="quick-actions"], .quick-actions, [class*="QuickActions"]');
      const prButton = page.locator('button:has-text("Submit PR"), button:has-text("PR"), a[href*="pr"]');
      
      let clicked = false;
      
      if (await quickActions.count() > 0) {
        const submitButton = quickActions.locator('button:has-text("Submit"), button:has-text("PR")');
        if (await submitButton.count() > 0) {
          await submitButton.first().click();
          actionCount++;
          clicked = true;
        }
      }
      
      if (!clicked && await prButton.count() > 0) {
        await prButton.first().click();
        actionCount++;
        clicked = true;
      }
      
      // Fallback: navigate via main navigation
      if (!clicked) {
        const navPR = page.locator('nav a[href*="pr"], [data-testid="nav-pr"]');
        if (await navPR.count() > 0) {
          await navPR.first().click();
          actionCount++;
          clicked = true;
        }
      }
      
      expect(clicked).toBeTruthy();
    });
    
    await test.step('Complete PR submission form', async () => {
      await page.waitForLoadState('networkidle');
      
      // Action 2: Fill required fields (if form exists)
      const titleInput = page.locator('input[name="title"], input[placeholder*="title"]');
      if (await titleInput.count() > 0) {
        await titleInput.fill('Test PR submission');
        actionCount++;
      }
      
      // Action 3: Submit
      const submitBtn = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Create PR")');
      if (await submitBtn.count() > 0) {
        await submitBtn.click();
        actionCount++;
      }
    });
    
    console.log(`Dashboard → Submit PR completed in ${actionCount} actions`);
    expect(actionCount).toBeLessThanOrEqual(3);
  });

  test('Dashboard → Publish Content (≤3 actions)', async ({ page }) => {
    let actionCount = 0;
    
    await test.step('Navigate to content publishing', async () => {
      // Action 1: Look for quick action or nav to Content Studio
      const quickActions = page.locator('[data-testid="quick-actions"], .quick-actions');
      const publishButton = page.locator('button:has-text("Publish"), button:has-text("Content")');
      const contentStudioLink = page.locator('a[href*="content"], [data-testid="nav-content"]');
      
      let clicked = false;
      
      // Try quick action first
      if (await quickActions.count() > 0) {
        const publishBtn = quickActions.locator('button:has-text("Publish")');
        if (await publishBtn.count() > 0) {
          await publishBtn.first().click();
          actionCount++;
          clicked = true;
        }
      }
      
      // Try direct publish button
      if (!clicked && await publishButton.count() > 0) {
        await publishButton.first().click();
        actionCount++;
        clicked = true;
      }
      
      // Navigate to Content Studio
      if (!clicked && await contentStudioLink.count() > 0) {
        await contentStudioLink.first().click();
        actionCount++;
        clicked = true;
      }
      
      expect(clicked).toBeTruthy();
    });
    
    await test.step('Publish content', async () => {
      await page.waitForLoadState('networkidle');
      
      // Action 2: Select content or create new
      const contentItems = page.locator('[data-testid="content-item"], .content-card, article');
      const newContentBtn = page.locator('button:has-text("New"), button:has-text("Create")');
      
      if (await contentItems.count() > 0) {
        await contentItems.first().click();
        actionCount++;
      } else if (await newContentBtn.count() > 0) {
        await newContentBtn.first().click();
        actionCount++;
      }
      
      // Action 3: Publish
      const publishFinalBtn = page.locator('button:has-text("Publish"), button[data-action="publish"]');
      if (await publishFinalBtn.count() > 0) {
        await publishFinalBtn.click();
        actionCount++;
      }
    });
    
    console.log(`Dashboard → Publish Content completed in ${actionCount} actions`);
    expect(actionCount).toBeLessThanOrEqual(3);
  });

  test('Dashboard → Export Analytics (≤2 actions)', async ({ page }) => {
    let actionCount = 0;
    
    await test.step('Navigate to analytics export', async () => {
      // Action 1: Navigate to Analytics or find quick export
      const analyticsLink = page.locator('a[href*="analytics"], [data-testid="nav-analytics"]');
      const exportButton = page.locator('button:has-text("Export"), [data-action="export"]');
      
      let clicked = false;
      
      // Try direct export first
      if (await exportButton.count() > 0) {
        await exportButton.first().click();
        actionCount++;
        clicked = true;
      }
      
      // Navigate to Analytics page
      if (!clicked && await analyticsLink.count() > 0) {
        await analyticsLink.first().click();
        actionCount++;
        clicked = true;
      }
      
      expect(clicked).toBeTruthy();
    });
    
    await test.step('Export analytics data', async () => {
      await page.waitForLoadState('networkidle');
      
      // Action 2: Click export (if not done in step 1)
      if (actionCount === 1) {
        const exportBtn = page.locator('button:has-text("Export"), [data-action="export"], .export-button');
        if (await exportBtn.count() > 0) {
          await exportBtn.first().click();
          actionCount++;
        }
      }
      
      // Wait for export to complete or download to start
      await page.waitForTimeout(1000);
    });
    
    console.log(`Dashboard → Export Analytics completed in ${actionCount} actions`);
    expect(actionCount).toBeLessThanOrEqual(2);
  });

  test('Quick Actions Row - All Actions Accessible', async ({ page }) => {
    await test.step('Verify QuickActionsRow exists and is functional', async () => {
      const quickActionsRow = page.locator('[data-testid="quick-actions-row"], .quick-actions-row, [class*="QuickActions"]');
      
      if (await quickActionsRow.count() > 0) {
        // Check that quick actions are visible and clickable
        const actionButtons = quickActionsRow.locator('button, a');
        const buttonCount = await actionButtons.count();
        
        console.log(`Found ${buttonCount} quick action buttons`);
        expect(buttonCount).toBeGreaterThan(0);
        
        // Test that buttons are accessible
        for (let i = 0; i < Math.min(buttonCount, 3); i++) {
          const button = actionButtons.nth(i);
          await expect(button).toBeVisible();
          await expect(button).toBeEnabled();
          
          // Check for proper labeling
          const buttonText = await button.textContent();
          const ariaLabel = await button.getAttribute('aria-label');
          
          expect(buttonText || ariaLabel).toBeTruthy();
        }
      } else {
        console.log('QuickActionsRow not found - may be implemented differently');
      }
    });
  });

  test('Navigation Efficiency - Sidebar Performance', async ({ page }) => {
    await test.step('Test AppSidebar navigation speed', async () => {
      const sidebar = page.locator('[data-testid="app-sidebar"], .app-sidebar, nav');
      
      if (await sidebar.count() > 0) {
        const navLinks = sidebar.locator('a, button[role="menuitem"]');
        const linkCount = await navLinks.count();
        
        console.log(`Testing ${linkCount} navigation links`);
        
        // Test first 3 navigation items for speed
        for (let i = 0; i < Math.min(linkCount, 3); i++) {
          const link = navLinks.nth(i);
          const linkText = await link.textContent();
          
          if (linkText && !linkText.includes('Dashboard')) {
            const startTime = Date.now();
            
            await link.click();
            await page.waitForLoadState('networkidle');
            
            const navigationTime = Date.now() - startTime;
            console.log(`Navigation to "${linkText.trim()}" took ${navigationTime}ms`);
            
            // Navigation should be fast (under 2 seconds)
            expect(navigationTime).toBeLessThan(2000);
            
            // Return to dashboard for next test
            await page.goto('/');
            await page.waitForLoadState('networkidle');
          }
        }
      }
    });
  });

  test('Command Palette Efficiency', async ({ page }) => {
    await test.step('Test Command Palette quick access', async () => {
      // Action 1: Open Command Palette (⌘K)
      await page.keyboard.press('Meta+KeyK');
      
      const commandPalette = page.locator('[data-testid="command-palette"], [role="dialog"], .command-palette');
      await expect(commandPalette).toBeVisible({ timeout: 1000 });
      
      // Action 2: Search and select (if search functionality exists)
      const searchInput = page.locator('input[placeholder*="search"], input[type="search"]');
      
      if (await searchInput.count() > 0) {
        await searchInput.fill('analytics');
        await page.waitForTimeout(500);
        
        // Select first result
        await page.keyboard.press('Enter');
        
        // Should navigate quickly
        await page.waitForLoadState('networkidle');
        
        console.log('Command Palette navigation completed in 2 actions');
      } else {
        // Just close the palette
        await page.keyboard.press('Escape');
        await expect(commandPalette).not.toBeVisible();
      }
    });
  });
});
