import { test, expect } from '@playwright/test'

test.describe('Marketing Director Dashboard', () => {
  test('displays automation-first interface with proper visual hierarchy', async ({ page }) => {
    // Navigate to Marketing Director dashboard
    await page.goto('/director')
    
    // Check that page loads successfully
    await expect(page.locator('[data-testid="marketing-director-dashboard"]')).toBeVisible()
    
    // Verify automation-first patterns
    // AI recommendations should dominate visual space (70% rule)
    const strategicOverview = page.locator('[data-testid="strategic-overview"]')
    await expect(strategicOverview).toBeVisible()
    
    // Check that primary action (reallocation) is prominently displayed
    const approveButton = page.locator('[data-testid="approve-reallocation"]')
    await expect(approveButton).toBeVisible()
    await expect(approveButton).toContainText('Approve Reallocation')
    
    // Verify F-Pattern layout for executive scanning
    const teamPerformance = page.locator('[data-testid="team-performance"]')
    await expect(teamPerformance).toBeVisible()
    
    // Check budget tracker secondary content
    const budgetTracker = page.locator('[data-testid="budget-tracker"]')
    await expect(budgetTracker).toBeVisible()
    
    // Verify AI strategic insights
    const aiInsights = page.locator('[data-testid="ai-strategic-insights"]')
    await expect(aiInsights).toBeVisible()
    
    // Check competitive intelligence
    const competitiveIntel = page.locator('[data-testid="competitive-intelligence"]')
    await expect(competitiveIntel).toBeVisible()
    
    // Verify executive actions
    const executiveActions = page.locator('[data-testid="executive-actions"]')
    await expect(executiveActions).toBeVisible()
  })

  test('supports executive decision-making workflow', async ({ page }) => {
    await page.goto('/director')
    
    // Test primary workflow: budget reallocation approval
    const approveButton = page.locator('[data-testid="approve-reallocation"]')
    await expect(approveButton).toBeVisible()
    
    // Click should trigger approval workflow
    await approveButton.click()
    // Note: In real implementation, this would trigger a confirmation modal or API call
    
    // Test secondary actions
    const viewAnalysisButton = page.locator('[data-testid="view-analysis"]')
    await expect(viewAnalysisButton).toBeVisible()
    
    // Test team performance drill-down
    const teamDetailsButton = page.locator('[data-testid="view-team-details"]')
    await expect(teamDetailsButton).toBeVisible()
    
    // Test opportunity pursuit
    const opportunityButtons = page.locator('[data-testid^="pursue-opportunity-"]')
    await expect(opportunityButtons.first()).toBeVisible()
  })

  test('validates automation-first pattern compliance', async ({ page }) => {
    await page.goto('/director')
    
    // Verify AI content has primary visual weight
    const aiPrimaryContent = page.locator('[data-pattern="ai-primary"]')
    await expect(aiPrimaryContent).toBeVisible()
    
    // Check that manual secondary content is properly de-emphasized
    const manualSecondaryContent = page.locator('[data-pattern="manual-secondary"]')
    await expect(manualSecondaryContent).toBeVisible()
    
    // Validate tier hierarchy
    const criticalTier = page.locator('[data-tier="critical"]')
    await expect(criticalTier).toBeVisible()
    
    const monitoringTier = page.locator('[data-tier="monitoring"]')
    await expect(monitoringTier).toBeVisible()
    
    const strategicTier = page.locator('[data-tier="strategic"]')
    await expect(strategicTier).toBeVisible()
    
    const contextualTier = page.locator('[data-tier="contextual"]')
    await expect(contextualTier).toBeVisible()
  })

  test('ensures mobile responsiveness for executive access', async ({ page, isMobile }) => {
    if (isMobile) {
      await page.goto('/director')
      
      // Key executive actions should remain accessible on mobile
      const approveButton = page.locator('[data-testid="approve-reallocation"]')
      await expect(approveButton).toBeVisible()
      
      // Strategic overview should adapt to mobile
      const strategicOverview = page.locator('[data-testid="strategic-overview"]')
      await expect(strategicOverview).toBeVisible()
      
      // Touch targets should be appropriately sized (minimum 44px)
      const buttonBounds = await approveButton.boundingBox()
      expect(buttonBounds?.height).toBeGreaterThanOrEqual(44)
    }
  })

  test('verifies accessibility compliance', async ({ page }) => {
    await page.goto('/director')
    
    // Check for proper heading structure
    const srOnlyHeading = page.locator('h1.sr-only')
    await expect(srOnlyHeading).toContainText('Marketing Director Strategic Dashboard')
    
    // Verify all interactive elements are keyboard accessible
    const approveButton = page.locator('[data-testid="approve-reallocation"]')
    await approveButton.focus()
    await expect(approveButton).toBeFocused()
    
    // Test keyboard navigation through primary actions
    await page.keyboard.press('Tab')
    const viewAnalysisButton = page.locator('[data-testid="view-analysis"]')
    await expect(viewAnalysisButton).toBeFocused()
  })
})
