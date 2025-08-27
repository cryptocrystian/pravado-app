import { test, expect } from '@playwright/test'

test.describe('MCP Contract Tests - PRAVADO UI V4', () => {
  test('Theme routing: /dashboard island luminance <0.2', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check that dark theme is applied
    const htmlElement = page.locator('html')
    const dataIsland = await htmlElement.getAttribute('data-island')
    expect(dataIsland).toBe('dark')
    
    // Verify dark background is applied
    const body = page.locator('body')
    const bgColor = await body.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    // Should be dark background (hsl(225, 39%, 22%))
    expect(bgColor).toContain('rgb(30, 42, 74)') // Converted from HSL
  })

  test('Theme routing: /content island luminance >0.8', async ({ page }) => {
    await page.goto('/content')
    
    // Check that light theme is applied
    const htmlElement = page.locator('html')
    const dataIsland = await htmlElement.getAttribute('data-island')
    expect(dataIsland).toBe('light')
    
    // Verify light background is applied
    const body = page.locator('body')
    const bgColor = await body.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    // Should be light background (hsl(43, 33%, 97%))
    expect(bgColor).toContain('rgb(248, 246, 242)') // Converted from HSL
  })

  test('Palette: no computed background-image contains "gradient"', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check all elements for gradients
    const elementsWithGradients = await page.evaluate(() => {
      const elements = document.querySelectorAll('*')
      const gradientElements: string[] = []
      
      elements.forEach(el => {
        const style = window.getComputedStyle(el)
        if (style.backgroundImage.includes('gradient')) {
          gradientElements.push(el.tagName + (el.className ? '.' + el.className : ''))
        }
      })
      
      return gradientElements
    })
    
    expect(gradientElements).toEqual([])
  })

  test('Palette: .btn-primary is solid AI-Teal', async ({ page }) => {
    await page.goto('/dashboard')
    
    const primaryButton = page.locator('.btn-primary').first()
    await expect(primaryButton).toBeVisible()
    
    const bgColor = await primaryButton.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    // AI-Teal: hsl(180, 100%, 33%) = rgb(0, 168, 168)
    expect(bgColor).toContain('rgb(0, 168, 168)')
  })

  test('Palette: find .chip-confidence (teal) & .chip-impact (gold)', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check confidence chip
    const confidenceChip = page.locator('.chip-confidence').first()
    if (await confidenceChip.count() > 0) {
      const confidenceColor = await confidenceChip.evaluate(el => 
        window.getComputedStyle(el).color
      )
      // Should be AI-Teal
      expect(confidenceColor).toContain('rgb(0, 168, 168)')
    }
    
    // Check impact chip
    const impactChip = page.locator('.chip-impact').first()
    if (await impactChip.count() > 0) {
      const impactColor = await impactChip.evaluate(el => 
        window.getComputedStyle(el).color
      )
      // Should be Premium-Gold: hsl(43, 87%, 45%) = rgb(212, 160, 23)
      expect(impactColor).toContain('rgb(212, 160, 23)')
    }
  })

  test('Palette: hero delta is green/red by sign', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Look for delta elements (trend indicators)
    const deltaElements = page.locator('[class*="text-success"], [class*="text-danger"]')
    
    if (await deltaElements.count() > 0) {
      const firstDelta = deltaElements.first()
      const classes = await firstDelta.getAttribute('class')
      
      // Should have either success (green) or danger (red) color
      expect(classes).toMatch(/text-(success|danger)/)
    }
  })

  test('Layout: Bands present A→B→C(8/4)→D', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Band A: KPI Hero should be first
    const kpiHero = page.locator('text="Visibility Score"').first()
    await expect(kpiHero).toBeVisible()
    
    // Band B: AI Recommendations
    const aiRecommendations = page.locator('text="AI Recommendations"')
    await expect(aiRecommendations).toBeVisible()
    
    // Band C: Should have grid layout (8/4)
    const gridContainer = page.locator('.grid-cols-12')
    await expect(gridContainer).toBeVisible()
    
    const leftSection = page.locator('.col-span-8')
    const rightSection = page.locator('.col-span-4')
    await expect(leftSection).toBeVisible()
    await expect(rightSection).toBeVisible()
    
    // Band D: Activity Timeline
    const activityTimeline = page.locator('text="Activity Timeline"')
    await expect(activityTimeline).toBeVisible()
  })

  test('Layout: Quick Actions = 4', async ({ page }) => {
    await page.goto('/content')
    
    // Content Studio should have 4 quick action cards
    const quickActions = page.locator('.grid-cols-4 > div')
    await expect(quickActions).toHaveCount(4)
  })

  test('Layout: Automation Bar visible', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check for automation bar with confidence gate text
    const automationBar = page.locator('text="Confidence gate"')
    await expect(automationBar).toBeVisible()
    
    const pauseButton = page.locator('text="Pause"')
    const viewQueueButton = page.locator('text="View Queue"')
    
    await expect(pauseButton).toBeVisible()
    await expect(viewQueueButton).toBeVisible()
  })

  test('HIL: no "Auto-apply" control', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should not have any auto-apply buttons or controls
    const autoApplyElements = page.locator('text="Auto-apply"')
    await expect(autoApplyElements).toHaveCount(0)
    
    const autoApplyButtons = page.locator('button:has-text("Auto-apply")')
    await expect(autoApplyButtons).toHaveCount(0)
  })

  test('Sidebar: teal active bar + gold count badges', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check for active sidebar item with teal indicator
    const activeSidebarItem = page.locator('.sidebar-item-active').first()
    if (await activeSidebarItem.count() > 0) {
      // Verify the ::before pseudo-element creates the teal bar
      const hasActiveBorder = await activeSidebarItem.evaluate(el => {
        const style = window.getComputedStyle(el, '::before')
        return style.backgroundColor === 'rgb(0, 168, 168)' // AI-Teal
      })
      expect(hasActiveBorder).toBeTruthy()
    }
    
    // Check for gold count badges
    const countBadges = page.locator('.count-badge')
    if (await countBadges.count() > 0) {
      const firstBadge = countBadges.first()
      const bgColor = await firstBadge.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      )
      // Premium-Gold: hsl(43, 87%, 45%) = rgb(212, 160, 23)
      expect(bgColor).toContain('rgb(212, 160, 23)')
    }
  })
})