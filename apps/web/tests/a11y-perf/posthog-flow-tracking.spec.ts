import { test, expect } from '@playwright/test';

/**
 * PostHog Flow Path Tracking Tests for Phase 3
 * Validates user journey tracking and analytics implementation
 */

test.describe('PostHog Flow Path Tracking', () => {
  let capturedEvents: Array<{ event: string; properties: Record<string, any> }> = [];

  test.beforeEach(async ({ page }) => {
    // Mock PostHog to capture events
    await page.addInitScript(() => {
      (window as any).posthogEvents = [];
      (window as any).posthog = {
        capture: (event: string, properties: any) => {
          (window as any).posthogEvents.push({ event, properties });
          console.log('PostHog Event:', event, properties);
        }
      };
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page }) => {
    // Capture events for analysis
    capturedEvents = await page.evaluate(() => (window as any).posthogEvents || []);
  });

  test('Dashboard page view tracking', async ({ page }) => {
    // Wait for page view tracking
    await page.waitForTimeout(1000);
    
    const events = await page.evaluate(() => (window as any).posthogEvents || []);
    
    // Should track page view
    const pageViewEvent = events.find((e: any) => e.event === 'user_engagement' && e.properties?.event === 'page_view');
    expect(pageViewEvent).toBeTruthy();
    expect(pageViewEvent?.properties.page).toBe('dashboard');
  });

  test('KPI Hero interactions flow tracking', async ({ page }) => {
    const kpiHero = page.locator('[data-testid="kpi-hero"]');
    await expect(kpiHero).toBeVisible();
    
    // Click "View Details" button
    const viewDetailsBtn = kpiHero.locator('button:has-text("View Details")');
    if (await viewDetailsBtn.count() > 0) {
      await viewDetailsBtn.click();
      await page.waitForTimeout(500);
      
      const events = await page.evaluate(() => (window as any).posthogEvents || []);
      
      // Should track flow start
      const flowStartEvent = events.find((e: any) => e.event === 'flow_started' && e.properties?.flow === 'view_kpi_details');
      expect(flowStartEvent).toBeTruthy();
      expect(flowStartEvent?.properties.component).toBe('kpi_hero');
      
      // Should track critical action
      const criticalEvent = events.find((e: any) => e.event === 'critical_action' && e.properties?.action_type === 'kpi_click');
      expect(criticalEvent).toBeTruthy();
      expect(criticalEvent?.properties.component).toBe('kpi_hero');
    }
  });

  test('Quick Actions flow tracking', async ({ page }) => {
    const quickActions = page.locator('.quick-actions, [data-testid="quick-actions"]').first();
    
    // Find first quick action button
    const actionButton = quickActions.locator('button').first();
    if (await actionButton.count() > 0) {
      await actionButton.click();
      await page.waitForTimeout(500);
      
      const events = await page.evaluate(() => (window as any).posthogEvents || []);
      
      // Should track flow start
      const flowStartEvent = events.find((e: any) => e.event === 'flow_started');
      expect(flowStartEvent).toBeTruthy();
      expect(flowStartEvent?.properties.component).toBe('quick_actions');
      
      // Should track quick action
      const quickActionEvent = events.find((e: any) => e.event === 'critical_action' && e.properties?.action_type === 'quick_action');
      expect(quickActionEvent).toBeTruthy();
      
      // Should track Phase 3 interaction
      const phase3Event = events.find((e: any) => e.event === 'phase3_interaction' && e.properties?.component === 'quick_actions');
      expect(phase3Event).toBeTruthy();
    }
  });

  test('Sidebar navigation flow tracking', async ({ page }) => {
    const sidebar = page.locator('aside, [data-testid="sidebar"], .app-sidebar').first();
    
    const navButton = sidebar.locator('button').first();
    if (await navButton.count() > 0) {
      await navButton.click();
      await page.waitForTimeout(500);
      
      const events = await page.evaluate(() => (window as any).posthogEvents || []);
      
      // Should track navigation flow
      const navigationEvent = events.find((e: any) => e.event === 'flow_started' && e.properties?.flow === 'dashboard_navigation');
      expect(navigationEvent).toBeTruthy();
      expect(navigationEvent?.properties.component).toBe('sidebar');
      
      // Should track critical navigation action
      const criticalNavEvent = events.find((e: any) => e.event === 'critical_action' && e.properties?.action_type === 'navigation');
      expect(criticalNavEvent).toBeTruthy();
    }
  });

  test('Flow completion tracking', async ({ page }) => {
    // Simulate a complete flow
    const quickActions = page.locator('.quick-actions, [data-testid="quick-actions"]').first();
    const actionButton = quickActions.locator('button').first();
    
    if (await actionButton.count() > 0) {
      await actionButton.click();
      
      // Wait for flow completion tracking
      await page.waitForTimeout(200);
      
      const events = await page.evaluate(() => (window as any).posthogEvents || []);
      
      // Should track flow completion
      const completionEvent = events.find((e: any) => e.event === 'flow_completed');
      expect(completionEvent).toBeTruthy();
      expect(completionEvent?.properties.outcome).toBe('success');
      expect(completionEvent?.properties.steps_to_action).toBe(1);
      
      // Should track flow efficiency
      const efficiencyEvent = events.find((e: any) => e.event === 'flow_path_len');
      expect(efficiencyEvent).toBeTruthy();
      expect(efficiencyEvent?.properties.steps).toBeLessThanOrEqual(3); // Phase 3 requirement
    }
  });

  test('Event properties validation', async ({ page }) => {
    // Trigger multiple events
    const kpiHero = page.locator('[data-testid="kpi-hero"]');
    const viewDetailsBtn = kpiHero.locator('button:has-text("View Details")');
    
    if (await viewDetailsBtn.count() > 0) {
      await viewDetailsBtn.click();
      await page.waitForTimeout(500);
      
      const events = await page.evaluate(() => (window as any).posthogEvents || []);
      
      // Validate required properties are present
      for (const event of events) {
        expect(event.event).toBeDefined();
        expect(event.properties).toBeDefined();
        
        if (event.properties.session_id) {
          expect(event.properties.session_id).toMatch(/\d+-\w+/); // Format: timestamp-random
        }
        
        if (event.properties.timestamp) {
          expect(new Date(event.properties.timestamp)).toBeInstanceOf(Date);
        }
        
        if (event.properties.route) {
          expect(event.properties.route).toMatch(/^\/.*$/); // Should start with /
        }
      }
    }
  });

  test('Flow efficiency scoring', async ({ page }) => {
    // Test that quick actions meet the ≤3 actions requirement
    const quickActions = page.locator('.quick-actions, [data-testid="quick-actions"]').first();
    const actionButton = quickActions.locator('button').first();
    
    if (await actionButton.count() > 0) {
      await actionButton.click();
      await page.waitForTimeout(200);
      
      const events = await page.evaluate(() => (window as any).posthogEvents || []);
      
      const efficiencyEvent = events.find((e: any) => e.event === 'flow_path_len');
      if (efficiencyEvent) {
        expect(efficiencyEvent.properties.steps).toBeLessThanOrEqual(3);
        expect(efficiencyEvent.properties.efficiency_score).toBeGreaterThanOrEqual(5); // Excellent score for ≤3 steps
      }
    }
  });

  test('Error handling and edge cases', async ({ page }) => {
    // Remove PostHog to test graceful degradation
    await page.evaluate(() => {
      delete (window as any).posthog;
    });
    
    // Trigger actions without PostHog
    const kpiHero = page.locator('[data-testid="kpi-hero"]');
    const viewDetailsBtn = kpiHero.locator('button:has-text("View Details")');
    
    if (await viewDetailsBtn.count() > 0) {
      // Should not throw errors
      await expect(async () => {
        await viewDetailsBtn.click();
        await page.waitForTimeout(100);
      }).not.toThrow();
    }
  });

  test('Session consistency', async ({ page }) => {
    // Trigger multiple events and verify session ID consistency
    const kpiHero = page.locator('[data-testid="kpi-hero"]');
    const quickActions = page.locator('.quick-actions, [data-testid="quick-actions"]').first();
    
    // Trigger KPI event
    const viewDetailsBtn = kpiHero.locator('button:has-text("View Details")');
    if (await viewDetailsBtn.count() > 0) {
      await viewDetailsBtn.click();
      await page.waitForTimeout(200);
    }
    
    // Trigger Quick Action event
    const actionButton = quickActions.locator('button').first();
    if (await actionButton.count() > 0) {
      await actionButton.click();
      await page.waitForTimeout(200);
    }
    
    const events = await page.evaluate(() => (window as any).posthogEvents || []);
    
    // Get all session IDs
    const sessionIds = events
      .map((e: any) => e.properties?.session_id)
      .filter(Boolean);
    
    if (sessionIds.length > 1) {
      // All events should have the same session ID
      const firstSessionId = sessionIds[0];
      for (const sessionId of sessionIds) {
        expect(sessionId).toBe(firstSessionId);
      }
    }
  });
});

test.describe('Flow Path Optimization Analytics', () => {
  test('Critical user flows meet ≤3 actions requirement', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).posthogEvents = [];
      (window as any).posthog = {
        capture: (event: string, properties: any) => {
          (window as any).posthogEvents.push({ event, properties });
        }
      };
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Test each quick action flow
    const quickActions = page.locator('.quick-actions, [data-testid="quick-actions"]').first();
    const actionButtons = quickActions.locator('button');
    const buttonCount = await actionButtons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 4); i++) {
      const button = actionButtons.nth(i);
      const buttonText = await button.textContent();
      
      await button.click();
      await page.waitForTimeout(200);
      
      const events = await page.evaluate(() => (window as any).posthogEvents || []);
      const flowEvents = events.filter((e: any) => e.event === 'flow_path_len');
      
      // Each flow should complete in ≤3 steps
      for (const flowEvent of flowEvents) {
        expect(flowEvent.properties.steps).toBeLessThanOrEqual(3);
        console.log(`✅ ${buttonText}: ${flowEvent.properties.steps} step(s) - meets requirement`);
      }
    }
  });
});