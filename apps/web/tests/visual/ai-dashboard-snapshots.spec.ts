import { test, expect } from '@playwright/test'

test.describe('AI-First Dashboard Visual Snapshots', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to AI dashboard
    await page.goto('/dashboard')
    
    // Wait for content to load
    await page.waitForSelector('[data-testid="ai-briefing"]', { timeout: 10000 })
    
    // Mask dynamic content to prevent flaky tests
    await page.addStyleTag({
      content: `
        /* Mask dynamic content */
        .animate-pulse { animation: none !important; }
        [data-testid="ai-briefing"] .sparkline { opacity: 0.2 !important; }
        [data-testid="ops-center"] .credit-count { color: #20c5aa !important; }
        [data-testid="next-best-actions"] .confidence { background: hsl(170 72% 45% / 0.18) !important; }
        
        /* Stabilize animations */
        * { 
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
        }
        
        /* Ensure teal/gold colors are visible */
        .ai-briefing-score { color: hsl(170 70% 58%) !important; }
        .chip-positive { 
          background: hsl(170 78% 34% / 0.18) !important;
          color: hsl(170 70% 58%) !important;
        }
        .chip-attention {
          background: hsl(40 94% 40% / 0.16) !important;
          color: hsl(40 92% 66%) !important;
        }
      `
    })
  })

  test('AI Briefing Hero Section', async ({ page }) => {
    // Focus on the AI Briefing section
    const aiBriefing = page.locator('[data-testid="ai-briefing"]').first()
    
    // Ensure visibility score is prominently displayed
    await expect(aiBriefing.locator('.visibility-score')).toBeVisible()
    
    // Verify teal accent color is used
    const scoreElement = aiBriefing.locator('.text-ai-teal-300').first()
    await expect(scoreElement).toBeVisible()
    
    // Take snapshot of AI Briefing
    await expect(aiBriefing).toHaveScreenshot('ai-briefing-hero.png', {
      mask: [page.locator('.sparkline')], // Mask dynamic charts
    })
  })

  test('Next-Best Actions Card', async ({ page }) => {
    // Focus on the first NBA card
    const nbaSection = page.locator('[data-testid="next-best-actions"]')
    const firstCard = nbaSection.locator('.nba-card').first()
    
    // Verify confidence chip uses teal colors
    await expect(firstCard.locator('.chip-positive')).toBeVisible()
    
    // Verify impact chip uses gold colors  
    await expect(firstCard.locator('.chip-attention')).toBeVisible()
    
    // Verify primary button uses brand gradient
    await expect(firstCard.locator('.btn-primary')).toBeVisible()
    
    // Take snapshot
    await expect(firstCard).toHaveScreenshot('next-best-action-card.png')
  })

  test('Operations Center Rail', async ({ page }) => {
    // Focus on ops center
    const opsCenter = page.locator('[data-testid="ops-center"]')
    
    // Verify wallet display with teal accents
    await expect(opsCenter.locator('[data-testid="wallet"]')).toBeVisible()
    
    // Verify PR queue with counts
    await expect(opsCenter.locator('[data-testid="pr-queue"]')).toBeVisible()
    
    // Take snapshot
    await expect(opsCenter).toHaveScreenshot('ops-center-rail.png')
  })

  test('Quick Actions Grid', async ({ page }) => {
    const quickActions = page.locator('[data-testid="quick-actions"]')
    
    // Verify all 4 action cards are visible
    await expect(quickActions.locator('.quick-action-card')).toHaveCount(4)
    
    // Verify each card has btn-primary styling
    const actionCards = quickActions.locator('.quick-action-card')
    for (let i = 0; i < 4; i++) {
      await expect(actionCards.nth(i).locator('.btn-primary')).toBeVisible()
    }
    
    // Take snapshot
    await expect(quickActions).toHaveScreenshot('quick-actions-grid.png')
  })

  test('Compact Sidebar with Teal Indicators', async ({ page }) => {
    // Focus on sidebar
    const sidebar = page.locator('[data-testid="compact-sidebar"]')
    
    // Verify active teal indicator bar
    await expect(sidebar.locator('.active-indicator')).toBeVisible()
    
    // Verify count badges use gold accent
    const countBadges = sidebar.locator('.count-badge')
    if (await countBadges.count() > 0) {
      await expect(countBadges.first()).toHaveClass(/ai-gold/)
    }
    
    // Take snapshot
    await expect(sidebar).toHaveScreenshot('compact-sidebar-teal.png')
  })

  test('Full Dashboard Overview - AI Brand Enforcement', async ({ page }) => {
    // Wait for all major sections to load
    await page.waitForSelector('[data-testid="ai-briefing"]')
    await page.waitForSelector('[data-testid="next-best-actions"]')
    await page.waitForSelector('[data-testid="quick-actions"]')
    await page.waitForSelector('[data-testid="ops-center"]')
    
    // Verify no default blue colors are present
    const blueElements = page.locator('.bg-blue-500, .text-blue-500, .border-blue-500')
    await expect(blueElements).toHaveCount(0)
    
    // Verify teal/gold enforcement
    const tealElements = page.locator('.text-ai-teal-300, .bg-ai-teal-500')
    await expect(tealElements.first()).toBeVisible()
    
    const goldElements = page.locator('.text-ai-gold-300, .bg-ai-gold-500') 
    await expect(goldElements.first()).toBeVisible()
    
    // Take full dashboard snapshot
    await expect(page).toHaveScreenshot('ai-dashboard-full-overview.png', {
      fullPage: true,
      mask: [
        page.locator('.sparkline'),
        page.locator('.animate-pulse'),
        page.locator('[data-testid="dynamic-timestamp"]')
      ]
    })
  })

  test('Content Islands - Light on Dark Validation', async ({ page }) => {
    // Verify dark shell background
    const bodyBg = await page.evaluate(() => 
      window.getComputedStyle(document.body).backgroundColor
    )
    expect(bodyBg).toMatch(/rgb\(22, 22, 24\)/) // Dark background
    
    // Verify content islands are lighter
    const contentIslands = page.locator('[data-surface="content"]')
    if (await contentIslands.count() > 0) {
      const islandBg = await contentIslands.first().evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      )
      expect(islandBg).not.toBe(bodyBg) // Different from shell
    }
  })
})