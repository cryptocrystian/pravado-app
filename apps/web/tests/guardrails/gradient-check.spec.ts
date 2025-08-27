import { test, expect } from '@playwright/test';

test.describe('V4 Gradient Guardrails', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard to test
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should not have any elements with gradient backgrounds', async ({ page }) => {
    // Check for CSS gradient backgrounds in computed styles
    const elementsWithGradients = await page.evaluate(() => {
      const elements: { selector: string; background: string }[] = [];
      const allElements = document.querySelectorAll('*');
      
      allElements.forEach((element, index) => {
        const computedStyle = window.getComputedStyle(element);
        const background = computedStyle.backgroundImage;
        
        // Check for gradient patterns
        if (background && background.includes('gradient')) {
          // Create a unique selector for the element
          const tagName = element.tagName.toLowerCase();
          const className = element.className ? `.${Array.from(element.classList).join('.')}` : '';
          const id = element.id ? `#${element.id}` : '';
          const selector = `${tagName}${id}${className}`;
          
          elements.push({
            selector: `${selector} (index: ${index})`,
            background
          });
        }
      });
      
      return elements;
    });

    // Log any found gradients for debugging
    if (elementsWithGradients.length > 0) {
      console.log('Found elements with gradients:', elementsWithGradients);
    }

    // Assert no gradients found
    expect(elementsWithGradients).toEqual([]);
  });

  test('should use only solid V4 semantic colors', async ({ page }) => {
    // Test that AI-Teal and Premium-Gold accents are used
    const aiTealElements = await page.locator('[class*="bg-ai"], [class*="text-ai"], [class*="border-ai"]').count();
    const premiumElements = await page.locator('[class*="bg-premium"], [class*="text-premium"], [class*="border-premium"]').count();
    
    // Should have at least some elements with semantic colors
    expect(aiTealElements).toBeGreaterThan(0);
    expect(premiumElements).toBeGreaterThan(0);
  });

  test('should have dark shell with light content islands', async ({ page }) => {
    // Check main layout has dark background
    const rootElement = await page.locator('html');
    await expect(rootElement).toHaveClass(/dark/);
    
    // Check content islands have data-surface attribute
    const contentIslands = await page.locator('[data-surface="content"]').count();
    expect(contentIslands).toBeGreaterThan(0);
    
    // Check computed background color of shell vs islands
    const shellBackground = await page.evaluate(() => {
      const shell = document.querySelector('.dark') as HTMLElement;
      return shell ? window.getComputedStyle(shell).backgroundColor : null;
    });
    
    const islandBackground = await page.evaluate(() => {
      const island = document.querySelector('[data-surface="content"]') as HTMLElement;
      return island ? window.getComputedStyle(island).backgroundColor : null;
    });
    
    // Shell should be dark, islands should be light
    expect(shellBackground).not.toBe(islandBackground);
  });

  test('should have proper confidence and impact chip colors', async ({ page }) => {
    // Check confidence chips use teal (high confidence) or premium (medium confidence)
    const confidenceChips = await page.locator('text=/\\d+% confident/').all();
    
    for (const chip of confidenceChips) {
      const classList = await chip.getAttribute('class') || '';
      const hasValidColor = classList.includes('bg-ai') || 
                          classList.includes('bg-premium') || 
                          classList.includes('bg-foreground');
      
      expect(hasValidColor).toBe(true);
    }
  });

  test('should have semantic colors for alerts and statuses', async ({ page }) => {
    // Check for alert/danger elements using red
    const alertElements = await page.locator('[class*="alert"], [class*="danger"]').all();
    
    for (const element of alertElements) {
      const classList = await element.getAttribute('class') || '';
      const hasRedColor = classList.includes('bg-danger') || 
                         classList.includes('text-danger') || 
                         classList.includes('border-danger');
      
      // Should use danger color for alerts
      if (classList.includes('alert') || classList.includes('danger')) {
        expect(hasRedColor).toBe(true);
      }
    }
  });
});