/**
 * Agent-APQ: Bundle Budget & Performance Tests
 * Ensures V3 implementation doesn't exceed performance budgets
 */

import { test, expect } from '@playwright/test'

test.describe('Bundle Budget & Performance', () => {
  test('Dashboard V3 bundle size within budget', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Capture network requests for JS bundles
    const jsRequests: any[] = []
    
    page.on('response', response => {
      const url = response.url()
      if (url.includes('.js') && (url.includes('/static/') || url.includes('/assets/'))) {
        jsRequests.push({
          url,
          size: parseInt(response.headers()['content-length'] || '0', 10)
        })
      }
    })
    
    // Reload to capture all bundle requests
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Calculate total JS bundle size
    const totalBundleSize = jsRequests.reduce((total, req) => total + req.size, 0)
    const totalBundleSizeKB = totalBundleSize / 1024
    
    console.log(`Total JS bundle size: ${totalBundleSizeKB.toFixed(2)} KB`)
    console.log('Bundle breakdown:', jsRequests.map(r => `${r.url.split('/').pop()}: ${(r.size/1024).toFixed(2)}KB`))
    
    // Budget: Main bundle should be under 500KB (conservative estimate)
    expect(totalBundleSizeKB).toBeLessThan(500)
    
    // No single bundle should be over 200KB
    jsRequests.forEach(req => {
      const sizeKB = req.size / 1024
      expect(sizeKB).toBeLessThan(200)
    })
  })

  test('Dashboard V3 Core Web Vitals', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Measure First Contentful Paint and Largest Contentful Paint
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const vitals: any = {}
          
          entries.forEach((entry) => {
            if (entry.entryType === 'paint') {
              vitals[entry.name] = entry.startTime
            }
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime
            }
          })
          
          resolve(vitals)
        })
        
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] })
        
        // Fallback timeout
        setTimeout(() => resolve({}), 5000)
      })
    })
    
    console.log('Core Web Vitals:', vitals)
    
    // FCP should be under 1.8s (Good threshold)
    if (vitals['first-contentful-paint']) {
      expect(vitals['first-contentful-paint']).toBeLessThan(1800)
    }
    
    // LCP should be under 2.5s (Good threshold)  
    if (vitals.lcp) {
      expect(vitals.lcp).toBeLessThan(2500)
    }
  })

  test('Memory usage within bounds', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Force garbage collection if available
    await page.evaluate(() => {
      if (window.gc) {
        window.gc()
      }
    })
    
    // Get memory usage
    const memoryInfo = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null
    })
    
    if (memoryInfo) {
      const usedMB = memoryInfo.usedJSHeapSize / (1024 * 1024)
      const totalMB = memoryInfo.totalJSHeapSize / (1024 * 1024)
      
      console.log(`Memory usage: ${usedMB.toFixed(2)}MB used, ${totalMB.toFixed(2)}MB total`)
      
      // Dashboard should use less than 50MB of JS heap
      expect(usedMB).toBeLessThan(50)
    }
  })

  test('No JavaScript errors on load', async ({ page }) => {
    const errors: any[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    page.on('pageerror', error => {
      errors.push(error.message)
    })
    
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Filter out expected/harmless errors
    const significantErrors = errors.filter(error => 
      !error.includes('favicon') &&
      !error.includes('AdBlock') &&
      !error.includes('Extensions/') &&
      !error.toLowerCase().includes('network error')
    )
    
    console.log('JavaScript errors detected:', significantErrors)
    expect(significantErrors).toHaveLength(0)
  })

  test('Resource loading performance', async ({ page }) => {
    const resourceTimings: any[] = []
    
    page.on('response', response => {
      const timing = response.timing()
      const url = response.url()
      
      if (url.includes('/static/') || url.includes('/assets/') || url.endsWith('.css') || url.endsWith('.js')) {
        resourceTimings.push({
          url: url.split('/').pop(),
          responseTime: timing.responseEnd - timing.responseStart,
          size: parseInt(response.headers()['content-length'] || '0', 10)
        })
      }
    })
    
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Check that no individual resource takes more than 3 seconds
    resourceTimings.forEach(timing => {
      expect(timing.responseTime).toBeLessThan(3000)
    })
    
    console.log('Resource timing summary:', resourceTimings.slice(0, 5))
  })

  test('Critical rendering path optimization', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check that CSS is not render-blocking
    const renderBlockingResources = await page.evaluate(() => {
      const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      return stylesheets.map((link: any) => ({
        href: link.href,
        media: link.media,
        blocking: !link.media || link.media === 'all' || link.media === 'screen'
      }))
    })
    
    console.log('Stylesheet analysis:', renderBlockingResources)
    
    // Ensure we're not loading too many render-blocking CSS files
    const blockingCSS = renderBlockingResources.filter(css => css.blocking)
    expect(blockingCSS.length).toBeLessThan(3)
  })

  test('V3 components lazy loading check', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check if V3 components are properly loaded
    await page.waitForSelector('[data-testid="kpi-hero-v3"]')
    await page.waitForSelector('[data-testid="sidebar-v3"]')
    
    // Verify components loaded without unnecessary delays
    const componentLoadTime = await page.evaluate(() => {
      const heroElement = document.querySelector('[data-testid="kpi-hero-v3"]')
      const sidebarElement = document.querySelector('[data-testid="sidebar-v3"]')
      
      return {
        heroLoaded: !!heroElement,
        sidebarLoaded: !!sidebarElement,
        timestamp: performance.now()
      }
    })
    
    expect(componentLoadTime.heroLoaded).toBeTruthy()
    expect(componentLoadTime.sidebarLoaded).toBeTruthy()
    
    // Should load within reasonable time (5 seconds from navigation start)
    expect(componentLoadTime.timestamp).toBeLessThan(5000)
  })
})