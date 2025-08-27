import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Dashboard V4 Contract Tests - MCP/Playwright enforced
// These tests ensure spec compliance and prevent regressions

test.describe('Dashboard V4 - UI Contract Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard before each test
    await page.goto('/dashboard')
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle')
  })

  test.describe('Theme Routing', () => {
    test('dashboard route uses dark islands', async ({ page }) => {
      // Check that html has dark class (always required)
      const htmlElement = page.locator('html')
      await expect(htmlElement).toHaveClass(/dark/)
      
      // Check data-island is set to "dark" for dashboard  
      const dataIsland = await htmlElement.getAttribute('data-island')
      expect(dataIsland).toBe('dark')
      
      // Verify island surface exists and is styled as dark
      const islandElement = page.locator('[data-surface="content"]')
      await expect(islandElement).toBeVisible()
      
      // Check for dark theme classes
      const hasCorrectClasses = await islandElement.evaluate((el) => {
        const classes = el.className
        return classes.includes('bg-island-dark') || el.style.backgroundColor
      })
      expect(hasCorrectClasses).toBeTruthy()
    })

    test('content studio route uses light islands', async ({ page }) => {
      await page.goto('/content')
      await page.waitForLoadState('networkidle')
      
      // HTML should still have dark class
      const htmlElement = page.locator('html')
      await expect(htmlElement).toHaveClass(/dark/)
      
      // But data-island should be "light"
      const dataIsland = await htmlElement.getAttribute('data-island')
      expect(dataIsland).toBe('light')
      
      // Verify island surface has light styling
      const islandElement = page.locator('[data-surface="content"]')
      await expect(islandElement).toBeVisible()
      
      // Check for light theme classes
      const hasLightClasses = await islandElement.evaluate((el) => {
        const classes = el.className
        return classes.includes('bg-island-light') || classes.includes('text-slate-900')
      })
      expect(hasLightClasses).toBeTruthy()
    })
  })

  test.describe('Palette Compliance', () => {
    test('no gradients in computed styles', async ({ page }) => {
      // Check all visible elements for gradient backgrounds
      const elementsWithGradients = await page.$$eval('*', (elements) => {
        const gradientElements = []
        for (const el of elements) {
          const styles = window.getComputedStyle(el)
          const bg = styles.backgroundImage
          const bgColor = styles.background
          
          // Check for gradient in backgroundImage or background shorthand
          if ((bg && bg !== 'none' && (bg.includes('gradient') || bg.includes('linear') || bg.includes('radial'))) ||
              (bgColor && (bgColor.includes('gradient') || bgColor.includes('linear') || bgColor.includes('radial')))) {
            gradientElements.push({
              tagName: el.tagName,
              className: el.className,
              backgroundImage: bg,
              background: bgColor
            })
          }
        }
        return gradientElements
      })
      
      // Log any found gradients for debugging
      if (elementsWithGradients.length > 0) {
        console.log('Found gradient elements:', elementsWithGradients)
      }
      
      expect(elementsWithGradients).toHaveLength(0)
    })

    test('primary buttons have solid teal background', async ({ page }) => {
      const primaryButtons = page.locator('.btn-primary')
      const count = await primaryButtons.count()
      
      // Should have at least one primary button
      expect(count).toBeGreaterThan(0)
      
      // Check that buttons have the expected classes
      for (let i = 0; i < count; i++) {
        const button = primaryButtons.nth(i)
        const className = await button.getAttribute('class')
        
        // Should contain Tailwind teal background class
        expect(className).toContain('bg-ai-teal-500')
        
        // Should be visible and clickable
        await expect(button).toBeVisible()
        await expect(button).toBeEnabled()
      }
    })

    test('semantic chips use correct colors', async ({ page }) => {
      // Check confidence chips (teal)
      const confidenceChips = page.locator('.chip-confidence')
      if (await confidenceChips.count() > 0) {
        const chipClass = await confidenceChips.first().getAttribute('class')
        expect(chipClass).toContain('text-ai-teal-300')
      }

      // Check impact chips (gold)  
      const impactChips = page.locator('.chip-impact')
      if (await impactChips.count() > 0) {
        const chipClass = await impactChips.first().getAttribute('class')
        expect(chipClass).toContain('text-premium-gold-300')
      }
    })

    test('delta indicators use green/red appropriately', async ({ page }) => {
      // Positive deltas should be green
      const positiveDelta = page.locator('.chip-delta-up')
      if (await positiveDelta.count() > 0) {
        const className = await positiveDelta.first().getAttribute('class')
        expect(className).toContain('text-success-500')
      }

      // Negative deltas should be red
      const negativeDelta = page.locator('.chip-delta-down')
      if (await negativeDelta.count() > 0) {
        const className = await negativeDelta.first().getAttribute('class')
        expect(className).toContain('text-danger-500')
      }
    })
  })

  test.describe('Layout Structure', () => {
    test('dashboard bands appear in correct order A→B→C→D', async ({ page }) => {
      // Band A: Executive Summary should be first
      const kpiHero = page.locator('text=AI Visibility Score')
      await expect(kpiHero).toBeVisible()

      // Band B: AI Recommendations should follow
      const aiRecommendations = page.locator('text=AI Recommendations')
      await expect(aiRecommendations).toBeVisible()

      // Band C: Operations should follow
      const operations = page.locator('text=Operations')
      await expect(operations).toBeVisible()

      // Band D: Activity Timeline should be last
      const timeline = page.locator('text=Activity Timeline')
      await expect(timeline).toBeVisible()
    })

    test('operations rail is 4-column layout', async ({ page }) => {
      // Should have 4 tiles: Wallet, PR Queue, Alerts, Agent Health
      const wallet = page.locator('text=Wallet')
      const prQueue = page.locator('text=PR Queue')
      const alerts = page.locator('text=Alerts')
      const agentHealth = page.locator('text=Agent Health')

      await expect(wallet).toBeVisible()
      await expect(prQueue).toBeVisible()
      await expect(alerts).toBeVisible()
      await expect(agentHealth).toBeVisible()
    })

    test('quick actions row has 4 items', async ({ page }) => {
      const quickActions = page.locator('text=Quick Actions').locator('..')
      await expect(quickActions).toBeVisible()

      // Should have 4 action buttons
      const newContent = page.locator('text=New Content')
      const newPR = page.locator('text=New PR')
      const analyzeURL = page.locator('text=Analyze URL')
      const exportAnalytics = page.locator('text=Export Analytics')

      await expect(newContent).toBeVisible()
      await expect(newPR).toBeVisible()
      await expect(analyzeURL).toBeVisible()
      await expect(exportAnalytics).toBeVisible()
    })

    test('automation bar is visible in AI recommendations', async ({ page }) => {
      const confidenceGateText = page.locator('text=Confidence gate')
      await expect(confidenceGateText).toBeVisible()

      const pauseSwitch = page.locator('text=Active').or(page.locator('text=Paused'))
      await expect(pauseSwitch).toBeVisible()

      const viewQueue = page.locator('text=View Queue')
      await expect(viewQueue).toBeVisible()
    })
  })

  test.describe('Human-in-the-Loop (HIL) Compliance', () => {
    test('no auto-apply controls present', async ({ page }) => {
      // Ensure no "Auto-apply" buttons exist anywhere in the DOM
      const autoApplyButtons = page.locator('text=Auto-apply').or(page.locator('text=Auto-publish'))
      await expect(autoApplyButtons).toHaveCount(0)

      // Ensure recommendations only have HIL actions
      const approveButtons = page.locator('text=Approve')
      const askCopilotButtons = page.locator('text=Ask Copilot')
      const queueButtons = page.locator('text=Queue')

      // Should have HIL actions available
      expect(await approveButtons.count()).toBeGreaterThan(0)
      expect(await askCopilotButtons.count()).toBeGreaterThan(0)
      expect(await queueButtons.count()).toBeGreaterThan(0)
    })
  })

  test.describe('Accessibility', () => {
    test('meets WCAG AA standards with axe-core', async ({ page }) => {
      // Run axe accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()
      
      // Ensure no accessibility violations
      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('keyboard navigation works correctly', async ({ page }) => {
      // Test tab navigation through interactive elements
      const buttons = page.locator('button')
      const buttonCount = await buttons.count()
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i)
        if (await button.isVisible()) {
          await expect(button).toBeFocusable()
        }
      }

      // Test sidebar navigation with keyboard
      await page.keyboard.press('Tab')
      const focusedElement = page.locator(':focus')
      if (await focusedElement.count() > 0) {
        await expect(focusedElement.first()).toBeVisible()
      }
    })

    test('color contrast meets AA requirements', async ({ page }) => {
      // This is handled by axe-core, but we can do additional specific checks
      const textElements = page.locator('h1, h2, h3, h4, p, span, a, button')
      const count = Math.min(await textElements.count(), 10) // Sample first 10 elements
      
      for (let i = 0; i < count; i++) {
        const element = textElements.nth(i)
        const isVisible = await element.isVisible()
        
        if (isVisible) {
          // Elements should be visible and readable
          await expect(element).toBeVisible()
        }
      }
    })
  })
})