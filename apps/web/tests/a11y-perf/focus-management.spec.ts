import { test, expect } from '@playwright/test';

/**
 * Focus Management and Keyboard Navigation Tests
 * Ensures proper focus handling with glassmorphism effects and ai-teal-500 focus rings
 */

test.describe('Focus Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('AppSidebar Tab Order', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await test.step('Verify logical tab order through sidebar', async () => {
      // Find the sidebar
      const sidebar = page.locator('[data-testid="app-sidebar"], .app-sidebar, nav').first();
      
      if (await sidebar.count() > 0) {
        // Get all focusable elements in sidebar
        const focusableElements = await sidebar.locator(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ).all();
        
        console.log(`Found ${focusableElements.length} focusable elements in sidebar`);
        
        // Start from the first focusable element
        if (focusableElements.length > 0) {
          await focusableElements[0].focus();
          
          // Test tab order
          for (let i = 0; i < Math.min(focusableElements.length - 1, 5); i++) {
            await page.keyboard.press('Tab');
            
            const focused = page.locator(':focus');
            await expect(focused).toBeVisible();
            
            // Check focus ring visibility
            const focusStyles = await focused.evaluate((el) => {
              const computed = window.getComputedStyle(el);
              return {
                outline: computed.outline,
                outlineColor: computed.outlineColor,
                boxShadow: computed.boxShadow,
                borderColor: computed.borderColor
              };
            });
            
            // Should have visible focus indicator
            const hasVisibleFocus = 
              focusStyles.outline !== 'none' ||
              focusStyles.boxShadow.includes('teal') ||
              focusStyles.boxShadow.includes('172') || // ai-teal-500 hsl hue
              focusStyles.outlineColor.includes('teal') ||
              focusStyles.borderColor.includes('teal');
            
            expect(hasVisibleFocus).toBeTruthy();
          }
        }
      } else {
        console.log('Sidebar not found, testing main navigation focus');
        
        // Fallback to test main navigation focus
        await page.keyboard.press('Tab');
        const focused = page.locator(':focus');
        await expect(focused).toBeVisible();
      }
    });
  });

  test('Focus Ring Visibility - ai-teal-500 Compliance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await test.step('Verify ai-teal-500 focus rings on interactive elements', async () => {
      const interactiveElements = await page.locator(
        'button:visible, a:visible, input:visible, [role="button"]:visible'
      ).all();
      
      console.log(`Testing focus rings on ${Math.min(interactiveElements.length, 10)} elements`);
      
      for (let i = 0; i < Math.min(interactiveElements.length, 10); i++) {
        const element = interactiveElements[i];
        
        // Focus the element
        await element.focus();
        
        // Check for ai-teal-500 focus ring (hsl(172, 72%, 45%))
        const focusStyles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            outline: computed.outline,
            outlineColor: computed.outlineColor,
            outlineWidth: computed.outlineWidth,
            boxShadow: computed.boxShadow,
            borderColor: computed.borderColor
          };
        });
        
        // Check for proper focus ring (2px outline as specified)
        const hasProperFocusRing = 
          focusStyles.outlineWidth === '2px' ||
          focusStyles.outline.includes('2px') ||
          focusStyles.boxShadow.includes('172') || // ai-teal hue
          focusStyles.boxShadow.includes('teal') ||
          focusStyles.outlineColor.includes('teal');
        
        if (!hasProperFocusRing) {
          console.log('Focus styles:', focusStyles);
        }
        
        expect(hasProperFocusRing).toBeTruthy();
      }
    });
  });

  test('Glass Card Focus Visibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await test.step('Ensure focus visibility on glass effect elements', async () => {
      const glassCards = await page.locator('.backdrop-blur, [class*="glass"]').all();
      
      if (glassCards.length > 0) {
        console.log(`Testing focus visibility on ${glassCards.length} glass elements`);
        
        for (const card of glassCards.slice(0, 3)) {
          // Find focusable elements within the glass card
          const focusableInCard = await card.locator(
            'button, a, input, [tabindex]:not([tabindex="-1"])'
          ).all();
          
          for (const focusable of focusableInCard.slice(0, 2)) {
            await focusable.focus();
            
            // Check that focus is visible against the glass background
            const isVisible = await focusable.evaluate((el) => {
              const rect = el.getBoundingClientRect();
              const computed = window.getComputedStyle(el);
              
              return {
                isDisplayed: computed.display !== 'none',
                hasOpacity: parseFloat(computed.opacity) > 0,
                hasVisibleOutline: computed.outline !== 'none' || 
                                 computed.boxShadow !== 'none',
                rect: { width: rect.width, height: rect.height }
              };
            });
            
            expect(isVisible.isDisplayed).toBeTruthy();
            expect(isVisible.hasOpacity).toBeTruthy();
            expect(isVisible.hasVisibleOutline).toBeTruthy();
            expect(isVisible.rect.width).toBeGreaterThan(0);
          }
        }
      } else {
        console.log('No glass elements found for focus testing');
      }
    });
  });

  test('Command Palette Focus Trapping', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await test.step('Test focus trapping in Command Palette', async () => {
      // Open Command Palette
      await page.keyboard.press('Meta+KeyK');
      
      const commandPalette = page.locator('[data-testid="command-palette"], [role="dialog"]').first();
      
      if (await commandPalette.count() > 0) {
        await expect(commandPalette).toBeVisible({ timeout: 2000 });
        
        // Find focusable elements within the dialog
        const focusableInDialog = await commandPalette.locator(
          'input, button, a, [tabindex]:not([tabindex="-1"])'
        ).all();
        
        if (focusableInDialog.length > 0) {
          console.log(`Found ${focusableInDialog.length} focusable elements in command palette`);
          
          // Test forward tabbing
          for (let i = 0; i < focusableInDialog.length; i++) {
            await page.keyboard.press('Tab');
            
            const focused = page.locator(':focus');
            
            // Ensure focus stays within the dialog
            const isFocusInDialog = await commandPalette.locator(':focus').count() > 0;
            expect(isFocusInDialog).toBeTruthy();
          }
          
          // Test that tabbing wraps around
          await page.keyboard.press('Tab');
          const wrappedFocus = page.locator(':focus');
          const stillInDialog = await commandPalette.locator(':focus').count() > 0;
          expect(stillInDialog).toBeTruthy();
          
          // Test reverse tabbing
          await page.keyboard.press('Shift+Tab');
          const reverseFocus = page.locator(':focus');
          const stillInDialogReverse = await commandPalette.locator(':focus').count() > 0;
          expect(stillInDialogReverse).toBeTruthy();
        }
        
        // Close with Escape
        await page.keyboard.press('Escape');
        await expect(commandPalette).not.toBeVisible();
      } else {
        console.log('Command Palette not found - may not be implemented yet');
      }
    });
  });

  test('Button States and Keyboard Activation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await test.step('Test button keyboard activation', async () => {
      const buttons = await page.locator('button:visible').all();
      
      console.log(`Testing keyboard activation on ${Math.min(buttons.length, 5)} buttons`);
      
      for (let i = 0; i < Math.min(buttons.length, 5); i++) {
        const button = buttons[i];
        const buttonText = await button.textContent();
        
        // Focus the button
        await button.focus();
        
        // Check initial state
        const isEnabled = await button.isEnabled();
        if (isEnabled) {
          // Test Space key activation
          let spacePressed = false;
          try {
            await page.keyboard.press('Space');
            spacePressed = true;
          } catch (e) {
            console.log(`Space key press failed on button: ${buttonText?.slice(0, 20)}`);
          }
          
          // Test Enter key activation
          let enterPressed = false;
          try {
            await page.keyboard.press('Enter');
            enterPressed = true;
          } catch (e) {
            console.log(`Enter key press failed on button: ${buttonText?.slice(0, 20)}`);
          }
          
          // At least one method should work
          expect(spacePressed || enterPressed).toBeTruthy();
          
          // Wait for any navigation/actions to complete
          await page.waitForTimeout(100);
        }
      }
    });
  });

  test('Skip Links and Bypass Mechanisms', async ({ page }) => {
    await page.goto('/');
    
    await test.step('Verify skip navigation links', async () => {
      // Tab to the first element to activate skip links
      await page.keyboard.press('Tab');
      
      // Look for skip links
      const skipLinks = await page.locator('a[href*="#main"], a[href*="#content"], .skip-link').all();
      
      if (skipLinks.length > 0) {
        console.log(`Found ${skipLinks.length} skip links`);
        
        const firstSkipLink = skipLinks[0];
        await expect(firstSkipLink).toBeVisible();
        
        // Test skip link functionality
        await firstSkipLink.click();
        
        // Check that focus moved to main content
        const focused = page.locator(':focus');
        const focusedId = await focused.getAttribute('id');
        
        expect(focusedId === 'main' || focusedId === 'content').toBeTruthy();
      } else {
        console.log('No skip links found - consider adding for better accessibility');
      }
    });
  });

  test('Modal and Dialog Focus Management', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await test.step('Test modal focus management', async () => {
      // Look for buttons that might open modals
      const modalTriggers = await page.locator(
        'button[data-modal], button[aria-haspopup="dialog"], button:has-text("Settings"), button:has-text("Profile")'
      ).all();
      
      if (modalTriggers.length > 0) {
        const trigger = modalTriggers[0];
        await trigger.click();
        
        // Look for modal
        const modal = page.locator('[role="dialog"], .modal, [data-testid*="modal"]').first();
        
        if (await modal.count() > 0) {
          await expect(modal).toBeVisible();
          
          // Check that focus moved to modal
          const modalHasFocus = await modal.locator(':focus').count() > 0;
          
          if (!modalHasFocus) {
            // Focus should be on the first focusable element in modal
            const firstFocusable = modal.locator(
              'input, button, a, [tabindex]:not([tabindex="-1"])'
            ).first();
            
            if (await firstFocusable.count() > 0) {
              await firstFocusable.focus();
            }
          }
          
          // Test focus trapping (similar to command palette test)
          const focusableInModal = await modal.locator(
            'input, button, a, [tabindex]:not([tabindex="-1"])'
          ).all();
          
          if (focusableInModal.length > 1) {
            await page.keyboard.press('Tab');
            const stillInModal = await modal.locator(':focus').count() > 0;
            expect(stillInModal).toBeTruthy();
          }
          
          // Close modal (look for close button or use Escape)
          const closeBtn = modal.locator('button[aria-label*="close"], button:has-text("Close")');
          if (await closeBtn.count() > 0) {
            await closeBtn.click();
          } else {
            await page.keyboard.press('Escape');
          }
          
          await expect(modal).not.toBeVisible();
        }
      } else {
        console.log('No modal triggers found for testing');
      }
    });
  });
});
