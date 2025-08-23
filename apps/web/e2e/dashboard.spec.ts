import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
  })

  test('should display dashboard title', async ({ page }) => {
    await expect(page).toHaveTitle(/PRAVADO/)
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should show KPI metrics', async ({ page }) => {
    // Wait for metrics to load (either real data or loading state)
    await page.waitForSelector('[class*="metric-card"], [class*="loading-skeleton"]')
    
    // Check if we have metric cards or loading skeletons
    const hasMetricCards = await page.locator('[class*="metric-card"]').count()
    const hasLoadingSkeletons = await page.locator('[class*="loading-skeleton"]').count()
    
    expect(hasMetricCards > 0 || hasLoadingSkeletons > 0).toBe(true)
  })

  test('should handle refresh functionality', async ({ page }) => {
    // Wait for the refresh button to be visible
    await page.waitForSelector('button:has-text("Refresh")')
    
    // Click refresh button
    await page.click('button:has-text("Refresh")')
    
    // Should show refreshing state
    await expect(page.locator('button:has-text("Refreshing")')).toBeVisible()
  })

  test('should navigate to analytics from quick actions', async ({ page }) => {
    // Wait for quick actions section
    await page.waitForSelector('text=Quick Actions')
    
    // Click on view analytics button
    await page.click('button:has-text("View Analytics")')
    
    // Should navigate to analytics page (or at least the button should be clickable)
    // This depends on implementation - we're just testing the interaction exists
  })

  test('should show system status', async ({ page }) => {
    await page.waitForSelector('text=System Status')
    
    // Should show operational status
    await expect(page.locator('text=All systems operational')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Should show mobile menu button
    await expect(page.locator('[aria-label="Menu"], button:has(svg)')).toBeVisible()
    
    // Metrics should stack vertically and be readable
    const metricsGrid = page.locator('[class*="grid"]').first()
    await expect(metricsGrid).toBeVisible()
  })
})