/**
 * E2E Tests for CiteMind Analytics
 * Tests the complete analytics flow including dashboard tiles and chart interactions
 */

import { test, expect, Page } from '@playwright/test'
import { MockAPIResponses } from './fixtures/api-mocks'

// Mock API responses for deterministic testing
const mockApiResponses = new MockAPIResponses()

test.describe('CiteMind Analytics E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mocks to avoid network calls in CI
    await page.route('**/analytics/citemind/**', async (route, request) => {
      const url = new URL(request.url())
      const endpoint = url.pathname.split('/').pop()
      const range = url.searchParams.get('range') || '30d'
      
      let mockResponse
      switch (endpoint) {
        case 'summary':
          mockResponse = mockApiResponses.getCiteMindSummary(range)
          break
        case 'platforms':
          mockResponse = mockApiResponses.getCiteMindPlatforms(range)
          break
        case 'ttc':
          mockResponse = mockApiResponses.getCiteMindTTC(range)
          break
        case 'visibility-mix':
          mockResponse = mockApiResponses.getCiteMindVisibilityMix(range)
          break
        default:
          mockResponse = { success: false, error: 'Not found' }
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      })
    })

    // Mock dashboard metrics
    await page.route('**/dashboard/metrics', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockApiResponses.getDashboardMetrics())
      })
    })
  })

  test('Dashboard tiles display and link to Analytics correctly', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard')
    
    // Wait for page load
    await expect(page.locator('h1')).toContainText('Dashboard')
    
    // Check CiteMind tiles are displayed
    await expect(page.locator('h2')).toContainText('CiteMind Performance')
    
    // Wait for tiles to load (they fetch data)
    await page.waitForLoadState('networkidle')
    
    // Verify all 4 KPI tiles are present
    const tiles = page.locator('[data-testid*="citemind-tile"]')
    await expect(tiles).toHaveCount(4)
    
    // Check Citation Probability tile
    const citationTile = page.locator('[data-testid="citemind-tile-citation_probability"]')
    await expect(citationTile).toBeVisible()
    await expect(citationTile.locator('text=Citation Probability')).toBeVisible()
    await expect(citationTile.locator('text=%')).toBeVisible()
    
    // Check Platform Coverage tile
    const platformTile = page.locator('[data-testid="citemind-tile-platform_coverage"]')
    await expect(platformTile).toBeVisible()
    await expect(platformTile.locator('text=Platform Coverage')).toBeVisible()
    
    // Check Authority Index tile
    const authorityTile = page.locator('[data-testid="citemind-tile-authority_index"]')
    await expect(authorityTile).toBeVisible()
    await expect(authorityTile.locator('text=Authority Index')).toBeVisible()
    
    // Check Time-to-Citation tile
    const ttcTile = page.locator('[data-testid="citemind-tile-time_to_citation"]')
    await expect(ttcTile).toBeVisible()
    await expect(ttcTile.locator('text=Time-to-Citation')).toBeVisible()
    
    // Click on Citation Probability tile to navigate to Analytics
    await citationTile.click()
    
    // Should navigate to Analytics with CiteMind tab
    await expect(page.url()).toContain('/analytics')
    await expect(page.locator('h1')).toContainText('Analytics')
    await expect(page.locator('[data-testid="tab-citemind"]')).toHaveAttribute('aria-selected', 'true')
  })

  test('Analytics tab displays all CiteMind charts with data', async ({ page }) => {
    // Navigate directly to Analytics CiteMind tab
    await page.goto('/analytics?tab=citemind')
    
    // Wait for page and data loading
    await page.waitForLoadState('networkidle')
    
    // Verify CiteMind tab is active
    await expect(page.locator('[data-testid="tab-citemind"]')).toHaveAttribute('aria-selected', 'true')
    
    // Check all 4 required charts are present and have data
    const charts = [
      { selector: '[data-testid="chart-summary"]', title: 'Citation Probability & Authority Index Over Time' },
      { selector: '[data-testid="chart-platforms"]', title: 'Platform Coverage by Platform' },
      { selector: '[data-testid="chart-ttc"]', title: 'Time-to-Citation Distribution' },
      { selector: '[data-testid="chart-visibility-mix"]', title: 'Citation Frequency vs Content Velocity' }
    ]
    
    for (const chart of charts) {
      const chartElement = page.locator(chart.selector)
      await expect(chartElement).toBeVisible()
      await expect(chartElement.locator(`text=${chart.title}`)).toBeVisible()
      
      // Check for CSV export button
      const exportBtn = chartElement.locator('button:has-text("Export CSV")')
      await expect(exportBtn).toBeVisible()
    }
    
    // Verify charts have Canvas elements (Chart.js renders to canvas)
    const canvasElements = page.locator('canvas')
    await expect(canvasElements).toHaveCount(4)
    
    // Check summary metrics section is displayed
    await expect(page.locator('text=Summary Metrics')).toBeVisible()
    
    const summaryMetrics = [
      'Avg Citation Probability',
      'Platform Coverage', 
      'Authority Index',
      'Median TTC',
      'Total Citations'
    ]
    
    for (const metric of summaryMetrics) {
      await expect(page.locator(`text=${metric}`)).toBeVisible()
    }
  })

  test('Time range selector affects chart data', async ({ page }) => {
    await page.goto('/analytics?tab=citemind')
    await page.waitForLoadState('networkidle')
    
    // Check default time range is selected
    const timeRangeSelector = page.locator('[data-testid="time-range-selector"]')
    await expect(timeRangeSelector).toBeVisible()
    
    // Change time range to 7d
    await timeRangeSelector.selectOption('7d')
    
    // Should trigger new API requests with range=7d
    await page.waitForLoadState('networkidle')
    
    // Charts should still be visible after range change
    await expect(page.locator('canvas')).toHaveCount(4)
    
    // Change to 90d
    await timeRangeSelector.selectOption('90d')
    await page.waitForLoadState('networkidle')
    
    // Verify charts updated
    await expect(page.locator('canvas')).toHaveCount(4)
  })

  test('CSV export functionality works', async ({ page }) => {
    await page.goto('/analytics?tab=citemind')
    await page.waitForLoadState('networkidle')
    
    // Set up download handling
    const downloadPromise = page.waitForEvent('download')
    
    // Click export button on first chart
    const firstExportBtn = page.locator('button:has-text("Export CSV")').first()
    await firstExportBtn.click()
    
    // Verify download started
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/citemind-.*\.csv/)
    
    // Test "Export All" button
    const exportAllBtn = page.locator('button:has-text("Export All")')
    await expect(exportAllBtn).toBeVisible()
  })

  test('Empty state handling when no data', async ({ page }) => {
    // Mock empty responses
    await page.route('**/analytics/citemind/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            summary: null,
            time_series: [],
            platforms: {},
            metrics: { distribution: {} },
            visibility_mix: []
          }
        })
      })
    })
    
    await page.goto('/analytics?tab=citemind')
    await page.waitForLoadState('networkidle')
    
    // Should show empty state
    await expect(page.locator('text=No analytics data available')).toBeVisible()
  })

  test('Error handling for API failures', async ({ page }) => {
    // Mock API failures
    await page.route('**/analytics/citemind/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Internal Server Error' })
      })
    })
    
    await page.goto('/analytics?tab=citemind')
    await page.waitForLoadState('networkidle')
    
    // Should show error state
    await expect(page.locator('text=Failed to load analytics')).toBeVisible()
    
    // Should have retry button
    const retryBtn = page.locator('button:has-text("Try again")')
    await expect(retryBtn).toBeVisible()
  })

  test('Loading states display correctly', async ({ page }) => {
    // Delay API responses to test loading states
    await page.route('**/analytics/citemind/**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockApiResponses.getCiteMindSummary('30d'))
      })
    })
    
    await page.goto('/analytics?tab=citemind')
    
    // Should show loading skeletons
    const skeletons = page.locator('.animate-pulse')
    await expect(skeletons).toHaveCount(4) // One for each chart
    
    // Wait for loading to complete
    await page.waitForLoadState('networkidle')
    
    // Loading skeletons should be gone
    await expect(skeletons).toHaveCount(0)
  })

  test('Mobile responsive layout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/analytics?tab=citemind')
    await page.waitForLoadState('networkidle')
    
    // Charts should be stacked vertically on mobile
    const chartsContainer = page.locator('[data-testid="charts-container"]')
    await expect(chartsContainer).toBeVisible()
    
    // All charts should still be visible
    await expect(page.locator('canvas')).toHaveCount(4)
  })

  test('Analytics telemetry events are fired', async ({ page }) => {
    let analyticsEvents: any[] = []
    
    // Intercept PostHog events
    await page.route('**/capture/', async (route, request) => {
      const body = await request.postDataJSON()
      analyticsEvents.push(body)
      await route.fulfill({ status: 200, body: '{}' })
    })
    
    // Navigate to analytics
    await page.goto('/analytics?tab=citemind')
    await page.waitForLoadState('networkidle')
    
    // Should fire analytics_viewed event
    const viewedEvent = analyticsEvents.find(e => e.event === 'analytics_viewed')
    expect(viewedEvent).toBeTruthy()
    expect(viewedEvent.properties.tab).toBe('citemind')
    
    // Click export button
    await page.locator('button:has-text("Export CSV")').first().click()
    
    // Should fire analytics_export event
    const exportEvent = analyticsEvents.find(e => e.event === 'analytics_export')
    expect(exportEvent).toBeTruthy()
    expect(exportEvent.properties.format).toBe('csv')
  })
})