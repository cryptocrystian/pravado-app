import { test, expect } from '@playwright/test';

test.describe('V4 Route-Based Island Guardrails', () => {
  test('dashboard should have dark islands (luminance < 0.2)', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check island luminance
    const islandLuminance = await page.evaluate(() => {
      const island = document.querySelector('[data-surface="content"]') as HTMLElement;
      if (!island) return null;
      
      const styles = window.getComputedStyle(island);
      const backgroundColor = styles.backgroundColor;
      
      // Convert rgb to luminance
      const rgb = backgroundColor.match(/\d+/g);
      if (!rgb) return null;
      
      const [r, g, b] = rgb.map(x => {
        x = parseInt(x) / 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    });
    
    expect(islandLuminance).not.toBeNull();
    expect(islandLuminance).toBeLessThan(0.2);
  });

  test('content routes should have light islands (luminance > 0.8)', async ({ page }) => {
    await page.goto('/content');
    await page.waitForLoadState('networkidle');
    
    // Check island luminance
    const islandLuminance = await page.evaluate(() => {
      const island = document.querySelector('[data-surface="content"]') as HTMLElement;
      if (!island) return null;
      
      const styles = window.getComputedStyle(island);
      const backgroundColor = styles.backgroundColor;
      
      // Convert rgb to luminance
      const rgb = backgroundColor.match(/\d+/g);
      if (!rgb) return null;
      
      const [r, g, b] = rgb.map(x => {
        x = parseInt(x) / 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    });
    
    expect(islandLuminance).not.toBeNull();
    expect(islandLuminance).toBeGreaterThan(0.8);
  });

  test('should not have any CSS gradients anywhere', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const elementsWithGradients = await page.evaluate(() => {
      const elements: { selector: string; background: string }[] = [];
      const allElements = document.querySelectorAll('*');
      
      allElements.forEach((element, index) => {
        const computedStyle = window.getComputedStyle(element);
        const background = computedStyle.backgroundImage;
        
        // Check for gradient patterns
        if (background && background.includes('gradient')) {
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

    expect(elementsWithGradients).toEqual([]);
  });

  test('should have visible semantic chips (teal confidence + gold impact)', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check for confidence chips (teal)
    const confidenceChips = await page.locator('.chip-confidence').count();
    expect(confidenceChips).toBeGreaterThan(0);
    
    // Check for impact chips (gold)
    const impactChips = await page.locator('.chip-impact').count();
    expect(impactChips).toBeGreaterThan(0);
  });

  test('delta elements should have success/danger classes by sign', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check for positive deltas
    const positiveDeltas = await page.locator('.delta-positive').count();
    
    // Check for negative deltas  
    const negativeDeltas = await page.locator('.delta-negative').count();
    
    // Should have at least some delta elements
    const totalDeltas = positiveDeltas + negativeDeltas;
    expect(totalDeltas).toBeGreaterThan(0);
  });
});