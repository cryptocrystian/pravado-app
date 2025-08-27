import { test, expect } from '@playwright/test'

test.describe('Dashboard V3 Visual Snapshots', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to V3 dashboard
    await page.goto('/dashboard')
    
    // Wait for the main components to load
    await page.waitForSelector('[data-testid="kpi-hero-v3"]')
    await page.waitForSelector('[data-testid="sidebar-v3"]')
    
    // Mask dynamic content for stable snapshots
    await page.addStyleTag({
      content: `
        /* Mask dynamic timestamps and values */
        [data-testid="sparkline"] { opacity: 0.5 !important; }
        .animate-pulse { animation: none !important; }
        
        /* Hide potentially flaky loading states */
        .transition-all { transition: none !important; }
        .transition-colors { transition: none !important; }
        
        /* Ensure consistent spacing */
        * { scroll-behavior: auto !important; }
      `
    })
  })

  test('AI Briefing Hero Section', async ({ page }) => {
    // Focus on the hero section
    const heroSection = page.locator('[data-testid="kpi-hero-v3"]')
    
    // Ensure it's fully loaded
    await expect(heroSection).toBeVisible()
    await expect(heroSection.locator('.text-\\[64px\\]')).toBeVisible() // Big score
    
    // Take snapshot
    await expect(heroSection).toHaveScreenshot('ai-briefing-hero-v3.png', {
      mask: [page.locator('.animate-pulse')],
      animations: 'disabled'
    })
  })

  test('Next-Best Actions Section', async ({ page }) => {
    // Scroll to next-best actions
    await page.locator('text=Next-Best Actions').scrollIntoViewIfNeeded()
    
    // Get the first action row
    const actionsSection = page.locator('text=Next-Best Actions').locator('..').locator('..')
    const firstAction = actionsSection.locator('.group').first()
    
    await expect(firstAction).toBeVisible()
    await expect(firstAction.locator('.chip-positive')).toBeVisible() // Confidence chip
    
    // Take snapshot
    await expect(firstAction).toHaveScreenshot('first-next-best-action-v3.png', {
      animations: 'disabled'
    })
  })

  test('Operations Right Rail', async ({ page }) => {
    // Focus on the operations section
    const opsSection = page.locator('text=Operations').locator('..').locator('..')
    
    // Ensure all tiles are visible
    await expect(opsSection.locator('text=Wallet')).toBeVisible()
    await expect(opsSection.locator('text=PR Queue')).toBeVisible()
    await expect(opsSection.locator('text=Alerts')).toBeVisible()
    await expect(opsSection.locator('text=Agent Health')).toBeVisible()
    
    // Take snapshot
    await expect(opsSection).toHaveScreenshot('operations-rail-v3.png', {
      animations: 'disabled'
    })
  })

  test('Quick Actions Grid', async ({ page }) => {
    // Scroll to quick actions
    await page.locator('text=Quick Actions').nth(0).scrollIntoViewIfNeeded()
    
    const quickActions = page.locator('text=Quick Actions').nth(0).locator('..').locator('..')
    const actionGrid = quickActions.locator('.grid').first()
    
    // Ensure all cards are loaded
    await expect(actionGrid.locator('text=New Content')).toBeVisible()
    await expect(actionGrid.locator('text=New PR')).toBeVisible()
    await expect(actionGrid.locator('text=Analyze URL')).toBeVisible()
    await expect(actionGrid.locator('text=Export Analytics')).toBeVisible()
    
    // Take snapshot
    await expect(actionGrid).toHaveScreenshot('quick-actions-grid-v3.png', {
      animations: 'disabled'
    })
  })

  test('V3 Sidebar', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar-v3"]')
    
    // Ensure sidebar is fully loaded
    await expect(sidebar.locator('text=PRAVADO')).toBeVisible()
    await expect(sidebar.locator('text=Dashboard')).toBeVisible()
    await expect(sidebar.locator('text=AI Systems Active')).toBeVisible()
    
    // Check for active indicator (should be on Dashboard)
    await expect(sidebar.locator('.bg-ai-teal-500').first()).toBeVisible()
    
    // Take snapshot
    await expect(sidebar).toHaveScreenshot('v3-sidebar.png', {
      mask: [page.locator('.animate-pulse')],
      animations: 'disabled'
    })
  })

  test('Full Dashboard V3 Layout', async ({ page }) => {
    // Wait for full page load
    await page.waitForLoadState('networkidle')
    
    // Ensure key elements are visible
    await expect(page.locator('text=AI Marketing Command Center')).toBeVisible()
    await expect(page.locator('[data-surface="content"]')).toBeVisible()
    
    // Hide potentially variable elements
    await page.addStyleTag({
      content: `
        .animate-pulse { display: none !important; }
        [data-testid="sparkline"] { visibility: hidden; }
      `
    })
    
    // Take full page snapshot
    await expect(page).toHaveScreenshot('dashboard-v3-full.png', {
      fullPage: true,
      animations: 'disabled',
      mask: [
        page.locator('.animate-pulse'),
        page.locator('[data-testid="sparkline"]')
      ]
    })
  })

  test('Brand Compliance Visual Check', async ({ page }) => {
    // Verify V3 brand compliance visually
    
    // Check for teal active indicators
    const activeIndicator = page.locator('.bg-ai-teal-500').first()
    await expect(activeIndicator).toBeVisible()
    
    // Check for gold badges
    const goldBadge = page.locator('.text-ai-gold-300').first()
    await expect(goldBadge).toBeVisible()
    
    // Check for glass cards (should have backdrop blur)
    const glassCard = page.locator('.glass-card').first()
    await expect(glassCard).toBeVisible()
    
    // Verify no forbidden patterns
    const whiteElements = page.locator('.bg-white')
    await expect(whiteElements).toHaveCount(0)
    
    // Check gradient buttons
    const primaryButton = page.locator('.btn-primary').first()
    await expect(primaryButton).toBeVisible()
    
    // Take snapshot focused on brand elements
    const brandElements = page.locator('[data-testid="sidebar-v3"], .btn-primary, .chip-positive, .chip-attention').first()
    await expect(brandElements).toHaveScreenshot('v3-brand-elements.png', {
      animations: 'disabled'
    })
  })
})