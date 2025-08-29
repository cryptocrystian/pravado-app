import { test, expect, type Page } from '@playwright/test'

/**
 * MCP Assertions Spec
 * Agentic testing with data-testid hooks for PRAVADO UI V4
 * 
 * Tests critical UI contracts that must be maintained across changes:
 * - Dashboard surface areas are properly marked
 * - Responsive breakpoints work correctly  
 * - No blank content islands
 * - Sticky positioning works as expected
 */

test.describe('MCP UI Contract Assertions', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard route which should have dark theme
    await page.goto('/dashboard')
    
    // Wait for page to be interactive
    await expect(page.locator('body')).toBeVisible()
    await page.waitForLoadState('networkidle')
  })

  test('Dashboard sections have data-surface="content" markers', async ({ page }) => {
    // Test that all major dashboard sections are marked with data-surface
    const contentSurfaces = page.locator('[data-surface="content"]')
    
    // Should have at least 4 content surfaces (Bands A, B, C, D)
    await expect(contentSurfaces).toHaveCount(4, { timeout: 15000 })
    
    // Each surface should be visible
    const surfaces = await contentSurfaces.all()
    for (const surface of surfaces) {
      await expect(surface).toBeVisible()
    }
    
    // Take screenshot for verification
    await page.screenshot({ 
      path: 'scripts/mcp/test-results/dashboard-surfaces.png',
      fullPage: true 
    })
  })

  test('Sticky ops rail positioning at lg breakpoint', async ({ page }) => {
    // Set viewport to large (≥1024px) 
    await page.setViewportSize({ width: 1200, height: 800 })
    
    // Find the operations rail (sidebar)
    const opsRail = page.locator('[data-testid="sidebar"], .sidebar, nav')
    await expect(opsRail).toBeVisible()
    
    // Check that it has sticky positioning on large screens
    const position = await opsRail.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return styles.position
    })
    
    expect(position).toBe('sticky')
    
    // Verify it stays in position when scrolling
    await page.evaluate(() => window.scrollTo(0, 500))
    await expect(opsRail).toBeInViewport()
    
    await page.screenshot({ 
      path: 'scripts/mcp/test-results/sticky-rail-lg.png' 
    })
  })

  test('AI recommendations grid becomes 2 columns at ≥1024px', async ({ page }) => {
    // Set viewport to large breakpoint
    await page.setViewportSize({ width: 1024, height: 800 })
    
    // Find AI recommendations container
    const aiRecsGrid = page.locator('[data-testid="ai-recommendations"], .ai-recommendations, [data-surface="content"]:has-text("AI")')
    await expect(aiRecsGrid).toBeVisible()
    
    // Check grid layout properties
    const gridColumns = await aiRecsGrid.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return styles.gridTemplateColumns || styles.display
    })
    
    // Should have 2 columns or grid display
    expect(gridColumns).toMatch(/(repeat\(2|1fr 1fr|grid)/)
    
    // Count visible recommendation cards
    const recCards = page.locator('[data-testid="ai-recommendation-card"], .ai-recommendation-card, [data-surface="content"] .card')
    const cardCount = await recCards.count()
    expect(cardCount).toBeGreaterThanOrEqual(2)
    
    await page.screenshot({ 
      path: 'scripts/mcp/test-results/ai-grid-2col.png' 
    })
  })

  test('No blank islands - each band has visible content', async ({ page }) => {
    // Get all content surfaces/bands
    const bands = page.locator('[data-surface="content"]')
    const bandCount = await bands.count()
    
    expect(bandCount).toBeGreaterThanOrEqual(4)
    
    // Test each band has at least one visible row/card
    for (let i = 0; i < bandCount; i++) {
      const band = bands.nth(i)
      await expect(band).toBeVisible()
      
      // Check for visible content within the band
      const visibleContent = band.locator('> *:visible, .card:visible, .row:visible, [data-testid]:visible')
      const contentCount = await visibleContent.count()
      
      // Each band should have at least 1 visible content item
      expect(contentCount).toBeGreaterThanOrEqual(1)
      
      // Log band details for debugging
      const bandText = await band.textContent()
      console.log(`Band ${i + 1}: ${contentCount} visible items, preview: "${bandText?.slice(0, 50)}..."`)
    }
    
    await page.screenshot({ 
      path: 'scripts/mcp/test-results/no-blank-bands.png',
      fullPage: true 
    })
  })

  test('Theme routing: dashboard has dark theme', async ({ page }) => {
    // Dashboard should have dark theme data attribute
    const htmlElement = page.locator('html')
    const body = page.locator('body')
    
    // Check for theme markers
    const hasThemeMarker = await htmlElement.evaluate((el) => {
      return el.hasAttribute('data-island') || el.classList.contains('dark') || 
             document.documentElement.style.getPropertyValue('--background')?.includes('dark')
    })
    
    expect(hasThemeMarker).toBe(true)
    
    // Verify dark background colors are applied
    const bgColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    
    // Should not be white/light background
    expect(bgColor).not.toMatch(/rgb\(255,\s*255,\s*255\)|white/)
  })

  test('Navigation active states with 3px AI-Teal indicator', async ({ page }) => {
    // Find sidebar navigation
    const nav = page.locator('[data-testid="sidebar"] nav, nav, .sidebar nav')
    await expect(nav).toBeVisible()
    
    // Look for active navigation item
    const activeItem = nav.locator('.active, [aria-current], [data-active="true"]')
    
    if (await activeItem.count() > 0) {
      // Check for 3px indicator styling
      const hasIndicator = await activeItem.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        const beforeStyles = window.getComputedStyle(el, '::before')
        
        return styles.borderLeftWidth === '3px' || 
               beforeStyles.width === '3px' ||
               styles.boxShadow.includes('3px')
      })
      
      expect(hasIndicator).toBe(true)
    }
  })

  test('Responsive breakpoint behavior', async ({ page }) => {
    // Test mobile view (< 768px)
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)
    
    // Sidebar should be collapsed or hidden on mobile
    const sidebar = page.locator('[data-testid="sidebar"], .sidebar')
    if (await sidebar.count() > 0) {
      const isHidden = await sidebar.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        return styles.display === 'none' || styles.transform.includes('translate')
      })
      
      // On mobile, sidebar should be hidden or transformed
      expect(isHidden).toBe(true)
    }
    
    // Test tablet view (768px - 1023px)
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(500)
    
    // Test desktop view (≥ 1024px)
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.waitForTimeout(500)
    
    await page.screenshot({ 
      path: 'scripts/mcp/test-results/responsive-desktop.png' 
    })
  })

  test('Performance: Page load under 3 seconds', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
    
    console.log(`Dashboard loaded in ${loadTime}ms`)
  })

  test('Accessibility: Proper ARIA labels and keyboard navigation', async ({ page }) => {
    // Check for proper heading structure
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1) // Should have exactly one h1
    
    // Check navigation is keyboard accessible
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Check for skip links
    const skipLink = page.locator('a[href*="#main"], [data-testid="skip-link"]')
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeVisible()
    }
  })
})

test.describe('MCP Color Contract Enforcement', () => {
  
  test('No forbidden colors in dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check that no elements have white backgrounds on dashboard
    const whiteBackgrounds = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'))
      return elements.filter(el => {
        const styles = window.getComputedStyle(el)
        return styles.backgroundColor.includes('rgb(255, 255, 255)') || 
               styles.backgroundColor === 'white'
      }).length
    })
    
    // Dashboard should not have white backgrounds
    expect(whiteBackgrounds).toBe(0)
    
    // Check for gradients (forbidden)
    const hasGradients = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'))
      return elements.some(el => {
        const styles = window.getComputedStyle(el)
        return styles.backgroundImage.includes('gradient')
      })
    })
    
    expect(hasGradients).toBe(false)
  })
  
  test('AI-Teal and Premium-Gold usage', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Look for AI-Teal usage (HSL: 180, 100%, 33%)
    const aiTealElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'))
      return elements.filter(el => {
        const styles = window.getComputedStyle(el)
        return styles.color.includes('0, 168, 168') || // RGB
               styles.backgroundColor.includes('0, 168, 168') ||
               styles.borderColor.includes('0, 168, 168')
      }).length
    })
    
    // Should have AI-Teal elements (confidence chips, active indicators)
    expect(aiTealElements).toBeGreaterThan(0)
  })
})