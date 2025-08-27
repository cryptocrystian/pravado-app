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

test.describe('Phase 3: Component Accessibility Audits', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('KPI Hero - Accessibility Compliance', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="kpi-hero"]', { timeout: 10000 });
    
    const kpiHero = page.locator('[data-testid="kpi-hero"]');
    await expect(kpiHero).toBeVisible();
    
    // Run axe scan specifically on KPI Hero component
    const accessibilityResults = await new AxeBuilder({ page })
      .include('[data-testid="kpi-hero"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityResults.violations).toEqual([]);
    
    await test.step('Verify KPI Hero screen reader support', async () => {
      // Check for proper ARIA labels on the main score
      const mainScore = kpiHero.locator('.text-7xl');
      const ariaLabel = await mainScore.getAttribute('aria-label');
      expect(ariaLabel).toContain('Score');
      
      // Check for proper button accessibility
      const buttons = kpiHero.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const hasAriaLabel = await button.getAttribute('aria-label');
        const hasTextContent = await button.textContent();
        
        // Button should have either aria-label or text content
        expect(hasAriaLabel || hasTextContent).toBeTruthy();
      }
    });
    
    await test.step('Verify focus management in KPI Hero', async () => {
      const buttons = kpiHero.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        await button.focus();
        
        // Check focus ring visibility with brand colors
        const focusStyles = await button.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            outline: computed.outline,
            boxShadow: computed.boxShadow,
            outlineOffset: computed.outlineOffset
          };
        });
        
        const hasBrandFocusRing = 
          focusStyles.outline !== 'none' ||
          focusStyles.boxShadow.includes('ai-teal') ||
          focusStyles.boxShadow.includes('170') || // ai-teal hsl hue
          focusStyles.boxShadow.includes('rgba(56, 178, 172'); // ai-teal RGB equivalent
        
        expect(hasBrandFocusRing).toBeTruthy();
      }
    });
  });
  
  test('Quick Actions Row - Accessibility Compliance', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const quickActions = page.locator('[data-testid="quick-actions"], .quick-actions').first();
    if (await quickActions.count() > 0) {
      // Run axe scan on Quick Actions
      const accessibilityResults = await new AxeBuilder({ page })
        .include(quickActions)
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      
      expect(accessibilityResults.violations).toEqual([]);
      
      await test.step('Verify Quick Actions keyboard navigation', async () => {
        const actionButtons = quickActions.locator('button');
        const buttonCount = await actionButtons.count();
        
        for (let i = 0; i < buttonCount; i++) {
          const button = actionButtons.nth(i);
          await button.focus();
          
          // Verify button is properly focusable and visible
          await expect(button).toBeFocused();
          
          // Verify descriptive text is present
          const textContent = await button.textContent();
          expect(textContent?.length).toBeGreaterThan(5); // Should have meaningful text
        }
      });
    }
  });
  
  test('Glass Cards - Contrast and Accessibility', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const glassCards = page.locator('[class*="glass"], .backdrop-blur-md');
    const cardCount = await glassCards.count();
    
    if (cardCount > 0) {
      await test.step('Verify glass card contrast ratios', async () => {
        // Test contrast on glass cards specifically
        for (let i = 0; i < Math.min(cardCount, 3); i++) {
          const card = glassCards.nth(i);
          
          const contrastResults = await new AxeBuilder({ page })
            .include(card)
            .withRules(['color-contrast', 'color-contrast-enhanced'])
            .analyze();
          
          expect(contrastResults.violations).toEqual([]);
        }
      });
      
      await test.step('Verify glass card content accessibility', async () => {
        // Ensure glass effects don't interfere with content accessibility
        const firstGlassCard = glassCards.first();
        
        const glassCardResults = await new AxeBuilder({ page })
          .include(firstGlassCard)
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze();
        
        expect(glassCardResults.violations).toEqual([]);
      });
    }
  });
  
  test('Brand Colors - High Contrast Accessibility', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    await test.step('Verify ai-teal and ai-gold contrast compliance', async () => {
      const brandElements = page.locator('[class*="ai-teal"], [class*="ai-gold"]');
      const brandCount = await brandElements.count();
      
      if (brandCount > 0) {
        // Test brand color contrast specifically
        for (let i = 0; i < Math.min(brandCount, 5); i++) {
          const element = brandElements.nth(i);
          
          const contrastResults = await new AxeBuilder({ page })
            .include(element)
            .withRules(['color-contrast'])
            .analyze();
          
          expect(contrastResults.violations).toEqual([]);
        }
      }
    });
    
    await test.step('Verify focus indicators use brand colors correctly', async () => {
      // Find focusable elements with brand colors
      const focusableElements = page.locator('button:visible, a:visible');
      const elementCount = await focusableElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 3); i++) {
        const element = focusableElements.nth(i);
        await element.focus();
        
        // Check that focus ring meets contrast requirements
        const focusResults = await new AxeBuilder({ page })
          .include(element)
          .withRules(['focus-outline-visible'])
          .analyze();
        
        expect(focusResults.violations).toEqual([]);
      }
    });
  });
  
  test('Responsive Accessibility - Mobile and Tablet', async ({ page }) => {
    const viewports = [
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      await test.step(`Test ${viewport.name} accessibility`, async () => {
        await page.setViewportSize(viewport);
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        
        const accessibilityResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa'])
          .exclude('[data-testid="loading"]')
          .analyze();
        
        expect(accessibilityResults.violations).toEqual([]);
        
        // Verify touch target sizes on mobile
        if (viewport.name === 'mobile') {
          const touchTargets = page.locator('button:visible, a:visible, [role="button"]:visible');
          const targetCount = await touchTargets.count();
          
          for (let i = 0; i < Math.min(targetCount, 5); i++) {
            const target = touchTargets.nth(i);
            const boundingBox = await target.boundingBox();
            
            if (boundingBox) {
              // WCAG recommends minimum 44x44px touch targets
              expect(boundingBox.width).toBeGreaterThanOrEqual(44);
              expect(boundingBox.height).toBeGreaterThanOrEqual(44);
            }
          }
        }
      });
    }
  });
});
