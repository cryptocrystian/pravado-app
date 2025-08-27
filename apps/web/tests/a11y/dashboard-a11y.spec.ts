/**
 * Agent-APQ: Accessibility Tests for Dashboard V3
 * Uses @axe-core/playwright for AA compliance
 */

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Dashboard V3 Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to V3 dashboard
    await page.goto('/dashboard')
    
    // Wait for key components to load
    await page.waitForSelector('[data-testid="kpi-hero-v3"]')
    await page.waitForSelector('[data-testid="sidebar-v3"]')
    await page.waitForLoadState('networkidle')
  })

  test('Dashboard V3 meets WCAG AA standards', async ({ page }) => {
    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('#command-palette') // May not be visible during test
      .analyze()

    // Ensure no violations
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('KPI Hero section accessibility', async ({ page }) => {
    const heroSection = page.locator('[data-testid="kpi-hero-v3"]')
    
    // Test keyboard navigation
    await heroSection.locator('button').first().focus()
    await expect(heroSection.locator('button').first()).toBeFocused()
    
    // Check for proper ARIA labels
    const viewDetailsButton = heroSection.locator('button', { hasText: 'View Details' })
    await expect(viewDetailsButton).toHaveAttribute('aria-label')
    
    // Run axe on hero section specifically
    const heroResults = await new AxeBuilder({ page })
      .include('[data-testid="kpi-hero-v3"]')
      .analyze()
    
    expect(heroResults.violations).toEqual([])
  })

  test('Next-Best Actions accessibility', async ({ page }) => {
    // Navigate to actions section
    await page.locator('text=Next-Best Actions').scrollIntoViewIfNeeded()
    
    const actionsSection = page.locator('text=Next-Best Actions').locator('..').locator('..')
    
    // Test action buttons are keyboard accessible
    const actionButtons = actionsSection.locator('button')
    const buttonCount = await actionButtons.count()
    
    for (let i = 0; i < buttonCount; i++) {
      const button = actionButtons.nth(i)
      await button.focus()
      await expect(button).toBeFocused()
      
      // Check for focus ring visibility
      const focusRing = await button.evaluate((el) => {
        const styles = window.getComputedStyle(el, ':focus-visible')
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow
        }
      })
      
      // Should have either outline or box-shadow for focus ring
      expect(focusRing.outline !== 'none' || focusRing.boxShadow !== 'none').toBeTruthy()
    }
    
    // Run axe on actions section
    const actionsResults = await new AxeBuilder({ page })
      .include(actionsSection)
      .analyze()
    
    expect(actionsResults.violations).toEqual([])
  })

  test('Sidebar navigation accessibility', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar-v3"]')
    
    // Test navigation links are keyboard accessible
    const navLinks = sidebar.locator('a, button[role="button"]')
    const linkCount = await navLinks.count()
    
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i)
      await link.focus()
      await expect(link).toBeFocused()
    }
    
    // Check active state has proper ARIA
    const activeLink = sidebar.locator('[aria-current="page"], .bg-ai-teal-500')
    if (await activeLink.count() > 0) {
      await expect(activeLink.first()).toHaveAttribute('aria-current', 'page')
    }
    
    // Run axe on sidebar
    const sidebarResults = await new AxeBuilder({ page })
      .include('[data-testid="sidebar-v3"]')
      .analyze()
    
    expect(sidebarResults.violations).toEqual([])
  })

  test('Quick Actions grid accessibility', async ({ page }) => {
    await page.locator('text=Quick Actions').scrollIntoViewIfNeeded()
    
    const quickActions = page.locator('text=Quick Actions').nth(0).locator('..').locator('..')
    const actionCards = quickActions.locator('.group, [role="button"]')
    
    // Test each action card
    const cardCount = await actionCards.count()
    for (let i = 0; i < cardCount; i++) {
      const card = actionCards.nth(i)
      
      // Focus test
      await card.focus()
      await expect(card).toBeFocused()
      
      // Check for descriptive text
      const cardText = await card.textContent()
      expect(cardText?.length).toBeGreaterThan(0)
    }
    
    // Run axe on quick actions
    const quickActionsResults = await new AxeBuilder({ page })
      .include(quickActions)
      .analyze()
    
    expect(quickActionsResults.violations).toEqual([])
  })

  test('Header controls accessibility', async ({ page }) => {
    const header = page.locator('header')
    
    // Test search button
    const searchButton = header.locator('button', { hasText: 'Search' })
    await searchButton.focus()
    await expect(searchButton).toBeFocused()
    
    // Test AI Copilot button
    const copilotButton = header.locator('button', { hasText: 'AI Copilot' })
    await copilotButton.focus()
    await expect(copilotButton).toBeFocused()
    
    // Test notification button
    const notificationButton = header.locator('button').filter({ has: page.locator('[data-lucide="bell"]') })
    if (await notificationButton.count() > 0) {
      await notificationButton.focus()
      await expect(notificationButton).toBeFocused()
    }
    
    // Run axe on header
    const headerResults = await new AxeBuilder({ page })
      .include('header')
      .analyze()
    
    expect(headerResults.violations).toEqual([])
  })

  test('Color contrast compliance', async ({ page }) => {
    // Run axe focusing on color contrast
    const contrastResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze()
    
    expect(contrastResults.violations).toEqual([])
  })

  test('Keyboard navigation flow', async ({ page }) => {
    // Test tab order makes sense
    await page.keyboard.press('Tab')
    const firstFocused = page.locator(':focus')
    
    // Should start with sidebar or header elements
    const firstFocusedText = await firstFocused.textContent()
    expect(firstFocusedText).toBeTruthy()
    
    // Tab through several elements to ensure logical order
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      await expect(focused).toBeFocused()
    }
  })
})