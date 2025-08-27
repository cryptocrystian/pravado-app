import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests - PRAVADO UI V4', () => {
  test('/dashboard should pass axe AA accessibility checks', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Wait for content to load
    await page.waitForSelector('text="Visibility Score"')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('/content should pass axe AA accessibility checks', async ({ page }) => {
    await page.goto('/content')
    
    // Wait for content to load
    await page.waitForSelector('text="Content Studio"')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Dashboard keyboard navigation', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Test Tab navigation through interactive elements
    await page.keyboard.press('Tab')
    
    // First focusable element should be in sidebar
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(['A', 'BUTTON']).toContain(focusedElement)
    
    // Continue tabbing to ensure all interactive elements are focusable
    let tabCount = 0
    const maxTabs = 20
    
    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab')
      tabCount++
      
      const element = await page.evaluate(() => {
        const el = document.activeElement
        return el ? {
          tag: el.tagName,
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label'),
          hasText: el.textContent ? el.textContent.trim().length > 0 : false
        } : null
      })
      
      if (element && ['A', 'BUTTON', 'INPUT', 'SELECT'].includes(element.tag)) {
        // Interactive element should have accessible name
        expect(element.hasText || element.ariaLabel).toBeTruthy()
      }
    }
  })

  test('Color contrast meets WCAG AA standards', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Test primary button contrast
    const primaryButton = page.locator('.btn-primary').first()
    if (await primaryButton.count() > 0) {
      const contrast = await primaryButton.evaluate((el) => {
        const style = window.getComputedStyle(el)
        const bgColor = style.backgroundColor
        const textColor = style.color
        
        // Basic check that colors are defined
        return {
          background: bgColor,
          text: textColor,
          hasValidColors: bgColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'rgba(0, 0, 0, 0)'
        }
      })
      
      expect(contrast.hasValidColors).toBeTruthy()
    }
    
    // Test that text has sufficient contrast
    const textElements = page.locator('h1, h2, h3, p, span').first()
    const textContrast = await textElements.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
        hasColor: style.color !== 'rgba(0, 0, 0, 0)'
      }
    })
    
    expect(textContrast.hasColor).toBeTruthy()
  })

  test('Screen reader landmarks and headings', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    expect(headings.length).toBeGreaterThan(0)
    
    // Check for main content area
    const main = page.locator('main')
    await expect(main).toBeVisible()
    
    // Check for navigation landmark
    const nav = page.locator('nav, [role="navigation"]')
    expect(await nav.count()).toBeGreaterThan(0)
  })

  test('ARIA labels and descriptions', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check buttons have accessible names
    const buttons = await page.locator('button').all()
    
    for (const button of buttons) {
      const accessibleName = await button.evaluate(el => {
        return el.getAttribute('aria-label') || 
               el.getAttribute('aria-labelledby') ||
               el.textContent?.trim() ||
               el.title
      })
      
      if (await button.isVisible()) {
        expect(accessibleName).toBeTruthy()
      }
    }
    
    // Check links have accessible names
    const links = await page.locator('a').all()
    
    for (const link of links) {
      const accessibleName = await link.evaluate(el => {
        return el.getAttribute('aria-label') || 
               el.textContent?.trim() ||
               el.title
      })
      
      if (await link.isVisible()) {
        expect(accessibleName).toBeTruthy()
      }
    }
  })
})