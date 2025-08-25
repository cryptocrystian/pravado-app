import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Test Suite for Pravado UI Overhaul
 * Tests WCAG 2.1 AA compliance on main pages with glassmorphism effects
 */

test.describe('Accessibility Audits', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport for accessibility testing
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('Dashboard - WCAG AA Compliance', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="dashboard"]', { timeout: 10000 });
    
    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('[data-testid="loading"]') // Exclude loading states
      .analyze();
    
    // Expect no violations
    expect(accessibilityScanResults.violations).toEqual([]);
    
    // Verify specific brand requirements
    await test.step('Verify focus ring visibility', async () => {
      // Find focusable elements and test focus visibility
      const focusableElements = await page.locator('button:visible, a:visible, input:visible, [tabindex]:visible').all();
      
      for (const element of focusableElements.slice(0, 5)) { // Test first 5 elements
        await element.focus();
        const focusStyles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            outline: computed.outline,
            outlineColor: computed.outlineColor,
            boxShadow: computed.boxShadow
          };
        });
        
        // Check for ai-teal-500 focus ring or visible outline
        const hasFocusRing = focusStyles.outline !== 'none' || 
                           focusStyles.boxShadow.includes('172') || // ai-teal-500 hsl values
                           focusStyles.outlineColor.includes('teal');
        
        expect(hasFocusRing).toBeTruthy();
      }
    });
    
    await test.step('Verify contrast ratios', async () => {
      // Test specific glassmorphism elements for contrast
      const glassCards = await page.locator('.backdrop-blur, [class*="glass"]').all();
      
      for (const card of glassCards.slice(0, 3)) {
        const contrastResults = await new AxeBuilder({ page })
          .include(card)
          .withRules(['color-contrast'])
          .analyze();
        
        expect(contrastResults.violations).toEqual([]);
      }
    });
  });

  test('Content Studio - WCAG AA Compliance', async ({ page }) => {
    await page.goto('/content-studio');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('main', { timeout: 10000 });
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
    
    // Test form accessibility if present
    await test.step('Verify form accessibility', async () => {
      const forms = await page.locator('form').all();
      
      for (const form of forms) {
        const formResults = await new AxeBuilder({ page })
          .include(form)
          .withRules(['label', 'form-field-multiple-labels'])
          .analyze();
        
        expect(formResults.violations).toEqual([]);
      }
    });
  });

  test('Analytics - WCAG AA Compliance', async ({ page }) => {
    await page.goto('/analytics');
    
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('main', { timeout: 10000 });
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
    
    // Test data table accessibility
    await test.step('Verify data table accessibility', async () => {
      const tables = await page.locator('table').all();
      
      for (const table of tables) {
        const tableResults = await new AxeBuilder({ page })
          .include(table)
          .withRules(['table-fake-caption', 'td-headers-attr', 'th-has-data-cells'])
          .analyze();
        
        expect(tableResults.violations).toEqual([]);
      }
    });
  });

  test('Keyboard Navigation - Full Site', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await test.step('Tab through navigation', async () => {
      // Test tab order through main navigation
      await page.keyboard.press('Tab');
      let focused = await page.locator(':focus').textContent();
      expect(focused).toBeTruthy();
      
      // Test that focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Continue tabbing to verify logical tab order
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const newFocused = page.locator(':focus');
        await expect(newFocused).toBeVisible();
      }
    });
    
    await test.step('Test Command Palette keyboard activation', async () => {
      // Test ⌘K activation
      await page.keyboard.press('Meta+KeyK');
      const commandPalette = page.locator('[data-testid="command-palette"], [role="dialog"]');
      await expect(commandPalette).toBeVisible({ timeout: 5000 });
      
      // Test escape to close
      await page.keyboard.press('Escape');
      await expect(commandPalette).not.toBeVisible();
    });
  });

  test('Screen Reader Compatibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await test.step('Verify ARIA labels and semantic HTML', async () => {
      const ariaResults = await new AxeBuilder({ page })
        .withRules([
          'aria-allowed-attr',
          'aria-hidden-body',
          'aria-hidden-focus',
          'aria-input-field-name',
          'aria-required-attr',
          'aria-valid-attr-value',
          'landmark-one-main',
          'page-has-heading-one',
          'region'
        ])
        .analyze();
      
      expect(ariaResults.violations).toEqual([]);
    });
    
    await test.step('Check heading hierarchy', async () => {
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      const headingLevels = [];
      
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const level = parseInt(tagName.charAt(1));
        headingLevels.push(level);
      }
      
      // Verify logical heading hierarchy (should start with h1)
      expect(headingLevels[0]).toBe(1);
      
      // Check for proper nesting (no skipped levels)
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i];
        const prevLevel = headingLevels[i - 1];
        const levelDiff = currentLevel - prevLevel;
        
        // Level can increase by 1, stay same, or decrease by any amount
        expect(levelDiff).toBeLessThanOrEqual(1);
      }
    });
  });
});
