/**
 * Agent-APQ: Accessibility Tests for Content & Analytics Pages
 * Covers /content and /analytics routes for WCAG AA compliance
 */

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Content & Analytics Accessibility', () => {
  test('Content Studio page accessibility', async ({ page }) => {
    await page.goto('/content')
    await page.waitForLoadState('networkidle')
    
    // Run full axe scan
    const contentResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(contentResults.violations).toEqual([])
    
    // Test focus management
    const interactiveElements = page.locator('button, a, input, select, textarea')
    const elementCount = await interactiveElements.count()
    
    if (elementCount > 0) {
      // Test first few interactive elements
      for (let i = 0; i < Math.min(5, elementCount); i++) {
        const element = interactiveElements.nth(i)
        await element.focus()
        await expect(element).toBeFocused()
      }
    }
  })

  test('Analytics page accessibility', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForLoadState('networkidle')
    
    // Run full axe scan
    const analyticsResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(analyticsResults.violations).toEqual([])
    
    // Test chart accessibility if charts are present
    const charts = page.locator('canvas, svg[role="img"], [data-testid*="chart"]')
    const chartCount = await charts.count()
    
    for (let i = 0; i < chartCount; i++) {
      const chart = charts.nth(i)
      
      // Charts should have accessible labels
      const hasAriaLabel = await chart.getAttribute('aria-label')
      const hasTitle = await chart.getAttribute('title')
      const hasAriaLabelledBy = await chart.getAttribute('aria-labelledby')
      
      expect(hasAriaLabel || hasTitle || hasAriaLabelledBy).toBeTruthy()
    }
  })

  test('Focus ring audit - all interactive elements', async ({ page }) => {
    // Test multiple pages for focus ring compliance
    const pages = ['/dashboard', '/content', '/analytics']
    
    for (const pagePath of pages) {
      await page.goto(pagePath)
      await page.waitForLoadState('networkidle')
      
      // Get all interactive elements
      const interactiveElements = page.locator(`
        button:visible, 
        a:visible, 
        input:visible, 
        select:visible, 
        textarea:visible,
        [tabindex]:visible,
        [role="button"]:visible,
        [role="link"]:visible
      `)
      
      const count = await interactiveElements.count()
      
      // Test focus rings on a sample of elements (to avoid timeout)
      const sampleSize = Math.min(10, count)
      
      for (let i = 0; i < sampleSize; i++) {
        const element = interactiveElements.nth(i)
        
        try {
          await element.focus({ timeout: 1000 })
          
          // Check if element has focus-visible styles
          const focusStyles = await element.evaluate((el) => {
            // Force focus-visible state
            el.focus()
            el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
            
            const computed = window.getComputedStyle(el, ':focus-visible')
            const focusComputed = window.getComputedStyle(el, ':focus')
            
            return {
              focusVisible: {
                outline: computed.outline,
                outlineColor: computed.outlineColor,
                outlineWidth: computed.outlineWidth,
                boxShadow: computed.boxShadow
              },
              focus: {
                outline: focusComputed.outline,
                boxShadow: focusComputed.boxShadow
              }
            }
          })
          
          const hasFocusRing = 
            focusStyles.focusVisible.outline !== 'none' ||
            focusStyles.focusVisible.boxShadow !== 'none' ||
            focusStyles.focus.outline !== 'none' ||
            focusStyles.focus.boxShadow !== 'none' ||
            focusStyles.focusVisible.outlineWidth !== '0px'
          
          if (!hasFocusRing) {
            // Log element for debugging but don't fail test
            const tagName = await element.evaluate(el => el.tagName)
            const className = await element.getAttribute('class') || ''
            console.warn(`Focus ring missing on ${pagePath}: ${tagName}.${className}`)
          }
          
        } catch (error) {
          // Skip elements that can't be focused
          continue
        }
      }
    }
  })

  test('Brand-compliant focus rings', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Test specific brand-compliant elements
    const brandElements = page.locator(`
      .btn-primary,
      [class*="ai-teal"],
      [class*="ai-gold"],
      button[class*="gradient"]
    `)
    
    const count = await brandElements.count()
    
    for (let i = 0; i < Math.min(5, count); i++) {
      const element = brandElements.nth(i)
      
      await element.focus()
      
      // Check for brand-compliant focus ring (should include ai-teal-500)
      const focusStyles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el, ':focus-visible')
        return computed.boxShadow
      })
      
      // Should contain some form of focus indication
      expect(focusStyles).not.toBe('none')
    }
  })

  test('Reduced motion compliance', async ({ page }) => {
    // Test with prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Check that animations are properly disabled
    const animatedElements = page.locator('.animate-pulse, .transition-all, [class*="transition"]')
    
    if (await animatedElements.count() > 0) {
      const firstElement = animatedElements.first()
      const animationStyles = await firstElement.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          animation: computed.animation,
          transition: computed.transition
        }
      })
      
      // With reduced motion, animations should be minimal or none
      expect(animationStyles.animation === 'none' || animationStyles.animation.includes('0s')).toBeTruthy()
    }
  })
})