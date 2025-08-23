import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    // Start at root, should redirect to dashboard
    await page.goto('/')
    await expect(page).toHaveURL(/.*\/dashboard/)
    
    // Navigate to Analytics
    await page.click('a[href="/analytics"]')
    await expect(page).toHaveURL(/.*\/analytics/)
    await expect(page.locator('h1')).toContainText('Analytics')
    
    // Navigate back to Dashboard
    await page.click('a[href="/dashboard"]')
    await expect(page).toHaveURL(/.*\/dashboard/)
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should show active navigation state', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Dashboard nav should be active
    await expect(page.locator('a[href="/dashboard"][class*="bg-primary"], a[href="/dashboard"][class*="text-primary"]')).toBeVisible()
    
    // Navigate to analytics
    await page.click('a[href="/analytics"]')
    
    // Analytics nav should be active
    await expect(page.locator('a[href="/analytics"][class*="bg-primary"], a[href="/analytics"][class*="text-primary"]')).toBeVisible()
  })

  test('should show sidebar on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.goto('/dashboard')
    
    // Sidebar should be visible
    await expect(page.locator('text=PRAVADO')).toBeVisible()
    await expect(page.locator('a[href="/dashboard"]')).toBeVisible()
    await expect(page.locator('a[href="/analytics"]')).toBeVisible()
  })

  test('should handle mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    
    // Mobile menu button should be visible
    const menuButton = page.locator('button[aria-label="Menu"], button:has(svg):has-text(""), button:has([data-lucide="menu"])')
    await expect(menuButton.first()).toBeVisible()
    
    // Click menu button to open sidebar
    await menuButton.first().click()
    
    // Sidebar should become visible
    await expect(page.locator('text=PRAVADO')).toBeVisible()
  })

  test('should show header with user info', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Header should be visible
    await expect(page.locator('header')).toBeVisible()
    
    // Should show user section
    await expect(page.locator('text=Admin User')).toBeVisible()
    
    // Should show notification bell
    await expect(page.locator('[data-lucide="bell"], svg').first()).toBeVisible()
  })

  test('should show search functionality', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.goto('/dashboard')
    
    // Search input should be visible on desktop
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible()
  })

  test('should handle 404 routes', async ({ page }) => {
    await page.goto('/nonexistent-page')
    
    // Should redirect to dashboard for non-existent routes
    await expect(page).toHaveURL(/.*\/dashboard/)
  })
})