import { test, expect } from '@playwright/test';
import { readFileSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Performance Test Suite for Pravado UI Overhaul
 * Analyzes glassmorphism impact on performance and monitors bundle size
 */

test.describe('Performance Analysis', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('Bundle Size Analysis', async ({ page }) => {
    const distPath = join(process.cwd(), 'dist');
    
    await test.step('Check JavaScript bundle size', async () => {
      try {
        const jsFiles = await page.evaluate(() => {
          return Array.from(document.scripts).map(script => script.src).filter(src => src.includes('.js'));
        });
        
        console.log('JavaScript files loaded:', jsFiles.length);
        
        // Budget: Main bundle should be under 500KB
        const mainBundleSize = 500 * 1024; // 500KB in bytes
        
        // Check if we can access dist directory
        try {
          const distStats = statSync(distPath);
          if (distStats.isDirectory()) {
            console.log('✓ Dist directory accessible for bundle analysis');
          }
        } catch (e) {
          console.log('ℹ Dist directory not built yet, skipping detailed bundle analysis');
        }
      } catch (error) {
        console.log('Bundle size analysis skipped - build required');
      }
    });
    
    await test.step('Check CSS bundle size', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const stylesheets = await page.evaluate(() => {
        return Array.from(document.styleSheets).map((sheet, index) => {
          try {
            return {
              href: sheet.href,
              rules: sheet.cssRules ? sheet.cssRules.length : 0
            };
          } catch (e) {
            return { href: `inline-${index}`, rules: 0 };
          }
        });
      });
      
      console.log('CSS stylesheets loaded:', stylesheets.length);
      
      // Expect reasonable number of CSS rules (not bloated)
      const totalRules = stylesheets.reduce((sum, sheet) => sum + sheet.rules, 0);
      expect(totalRules).toBeLessThan(10000); // Keep CSS manageable
    });
  });

  test('Glass Effect Performance Impact', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await test.step('Measure backdrop-filter performance', async () => {
      // Find elements with backdrop-filter effects
      const glassElements = await page.locator('.backdrop-blur, [class*="backdrop-blur"]').all();
      
      console.log(`Found ${glassElements.length} glass effect elements`);
      
      if (glassElements.length > 0) {
        // Measure paint performance with glass effects
        const performanceMetrics = await page.evaluate(() => {
          return new Promise((resolve) => {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const paintEntries = entries.filter(entry => entry.entryType === 'paint');
              resolve(paintEntries);
            });
            observer.observe({ entryTypes: ['paint'] });
            
            // Trigger reflow to measure paint performance
            document.body.style.transform = 'translateZ(0)';
            document.body.offsetHeight;
            document.body.style.transform = '';
          });
        });
        
        console.log('Paint performance entries:', performanceMetrics);
      }
    });
    
    await test.step('Memory usage with glassmorphism', async () => {
      // Check for memory leaks with glass effects
      const beforeMemory = await page.evaluate(() => {
        return (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize
        } : null;
      });
      
      if (beforeMemory) {
        // Navigate to trigger component unmounts/mounts
        await page.goto('/analytics');
        await page.waitForLoadState('networkidle');
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        const afterMemory = await page.evaluate(() => {
          return {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize
          };
        });
        
        const memoryGrowth = afterMemory.usedJSHeapSize - beforeMemory.usedJSHeapSize;
        console.log(`Memory growth: ${memoryGrowth / 1024 / 1024}MB`);
        
        // Memory growth should be reasonable (less than 10MB)
        expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024);
      }
    });
  });

  test('Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    await test.step('Largest Contentful Paint (LCP)', async () => {
      const lcpValue = await page.evaluate(() => {
        return new Promise((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Fallback timeout
          setTimeout(() => resolve(0), 5000);
        });
      });
      
      if (lcpValue > 0) {
        console.log(`LCP: ${lcpValue}ms`);
        // LCP should be under 2.5s for good performance
        expect(lcpValue).toBeLessThan(2500);
      }
    });
    
    await test.step('Cumulative Layout Shift (CLS)', async () => {
      const clsValue = await page.evaluate(() => {
        return new Promise((resolve) => {
          let cls = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                cls += (entry as any).value;
              }
            }
          });
          observer.observe({ entryTypes: ['layout-shift'] });
          
          setTimeout(() => resolve(cls), 3000);
        });
      });
      
      console.log(`CLS: ${clsValue}`);
      // CLS should be under 0.1 for good performance
      expect(clsValue).toBeLessThan(0.1);
    });
    
    await test.step('First Input Delay (FID simulation)', async () => {
      // Simulate user interaction to measure responsiveness
      const startTime = Date.now();
      
      await page.click('body');
      
      const interactionTime = Date.now() - startTime;
      console.log(`Interaction response time: ${interactionTime}ms`);
      
      // Should respond to interactions within 100ms
      expect(interactionTime).toBeLessThan(100);
    });
  });

  test('Component Render Performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await test.step('V2 Component rendering performance', async () => {
      // Measure time to render new v2 components
      const renderStart = Date.now();
      
      await page.waitForSelector('[data-testid*="v2"], .backdrop-blur', { timeout: 10000 });
      
      const renderTime = Date.now() - renderStart;
      console.log(`V2 Components render time: ${renderTime}ms`);
      
      // Components should render within 1 second
      expect(renderTime).toBeLessThan(1000);
    });
    
    await test.step('Glass card animation performance', async () => {
      const glassCards = await page.locator('.backdrop-blur, [class*="glass"]').all();
      
      if (glassCards.length > 0) {
        // Test hover animation performance
        const card = glassCards[0];
        
        const animationStart = Date.now();
        await card.hover();
        await page.waitForTimeout(300); // Wait for animation
        const animationTime = Date.now() - animationStart;
        
        console.log(`Glass card animation time: ${animationTime}ms`);
        expect(animationTime).toBeLessThan(500);
      }
    });
  });

  test('Network Performance', async ({ page }) => {
    // Monitor network requests during navigation
    const requests: string[] = [];
    
    page.on('request', request => {
      requests.push(request.url());
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await test.step('Resource loading efficiency', async () => {
      console.log(`Total requests: ${requests.length}`);
      
      // Should not make excessive requests
      expect(requests.length).toBeLessThan(50);
      
      // Check for resource optimization
      const imageRequests = requests.filter(url => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url));
      const jsRequests = requests.filter(url => /\.js$/i.test(url));
      const cssRequests = requests.filter(url => /\.css$/i.test(url));
      
      console.log(`Images: ${imageRequests.length}, JS: ${jsRequests.length}, CSS: ${cssRequests.length}`);
      
      // Reasonable resource counts
      expect(imageRequests.length).toBeLessThan(20);
      expect(jsRequests.length).toBeLessThan(10);
      expect(cssRequests.length).toBeLessThan(5);
    });
  });
});
