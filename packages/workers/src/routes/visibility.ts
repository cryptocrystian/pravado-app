/**
 * Visibility Score Routes
 * Implements visibility score computation and retrieval endpoints
 */

import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { Env } from '../index'

export const visibilityRoutes = new Hono<{ Bindings: Env }>()

// GET /dashboard/visibility-score - Get current visibility score with breakdown and trend
visibilityRoutes.get('/visibility-score', async (c) => {
  try {
    // Mock data for development - replace with actual database queries
    const mockVisibilityData = {
      score: 87,
      breakdown: {
        cadence: 82, // Content publishing frequency and recency
        citemind: 91, // CiteMind metrics (citation probability, authority, coverage)
        pr: 78, // PR momentum (wallet debits, submissions)
        seo: 85, // SEO baseline (keywords, positions, backlinks)
        weights: {
          cadence: 0.2,
          citemind: 0.4,
          pr: 0.2,
          seo: 0.2
        }
      },
      trend: {
        direction: 'up',
        change: 5,
        previous_score: 82
      },
      last_updated: new Date().toISOString()
    }

    // Generate sparkline data for the last 30 days
    const sparklineData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      
      // Generate realistic score progression
      const baseScore = 75 + i * 0.5 // Gradual improvement
      const variance = (Math.random() - 0.5) * 10 // ±5 variance
      const score = Math.min(100, Math.max(0, Math.round(baseScore + variance)))
      
      return {
        date: date.toISOString().split('T')[0],
        score
      }
    })

    const response = {
      success: true,
      data: {
        ...mockVisibilityData,
        history: sparklineData
      },
      timestamp: new Date().toISOString()
    }

    return c.json(response)

  } catch (error) {
    console.error('Error fetching visibility score:', error)
    throw new HTTPException(500, { message: 'Failed to fetch visibility score' })
  }
})

// GET /dashboard/visibility-score/history - Get historical visibility scores for charts
visibilityRoutes.get('/visibility-score/history', async (c) => {
  const days = c.req.query('days') || '30'
  const daysBack = Math.min(365, Math.max(1, parseInt(days, 10)))

  try {
    // Mock historical data - replace with actual database queries
    const historyData = Array.from({ length: daysBack }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (daysBack - 1 - i))
      
      // Generate realistic historical progression
      const daysSinceStart = i
      const baseScore = 60 + (daysSinceStart / daysBack) * 30 // Progress from 60 to 90
      const seasonalVariance = Math.sin((daysSinceStart / daysBack) * Math.PI * 4) * 5 // Seasonal variance
      const randomVariance = (Math.random() - 0.5) * 8 // Random daily variance
      const score = Math.min(100, Math.max(0, Math.round(baseScore + seasonalVariance + randomVariance)))
      
      return {
        date: date.toISOString().split('T')[0],
        score,
        breakdown: {
          cadence: Math.round(score * 0.2 + (Math.random() - 0.5) * 10),
          citemind: Math.round(score * 0.4 + (Math.random() - 0.5) * 10),
          pr: Math.round(score * 0.2 + (Math.random() - 0.5) * 10),
          seo: Math.round(score * 0.2 + (Math.random() - 0.5) * 10)
        }
      }
    })

    return c.json({
      success: true,
      data: historyData,
      pagination: {
        days: daysBack,
        total_points: historyData.length
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching visibility score history:', error)
    throw new HTTPException(500, { message: 'Failed to fetch visibility score history' })
  }
})

// POST /dashboard/visibility-score/compute - Trigger manual computation (for testing)
visibilityRoutes.post('/compute', async (c) => {
  try {
    // In production, this would trigger the actual score computation
    const computedData = {
      score: 87,
      breakdown: {
        cadence: 82,
        citemind: 91,
        pr: 78,
        seo: 85,
        weights: {
          cadence: 0.2,
          citemind: 0.4,
          pr: 0.2,
          seo: 0.2
        }
      },
      trend: {
        direction: 'up',
        change: 3,
        previous_score: 84
      },
      computed_at: new Date().toISOString()
    }

    // Mock the snapshot creation
    console.log('Computing visibility score snapshot...')
    
    return c.json({
      success: true,
      data: computedData,
      message: 'Visibility score computed successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error computing visibility score:', error)
    throw new HTTPException(500, { message: 'Failed to compute visibility score' })
  }
})

// GET /dashboard/visibility-score/config - Get scoring configuration
visibilityRoutes.get('/visibility-score/config', async (c) => {
  try {
    const mockConfig = {
      weights: {
        cadence: 0.2,
        citemind: 0.4,
        pr: 0.2,
        seo: 0.2
      },
      enabled: true,
      description: {
        cadence: 'Content publishing frequency and recency',
        citemind: 'CiteMind citation probability, authority index, and platform coverage',
        pr: 'PR momentum from wallet debits and press release submissions',
        seo: 'SEO baseline from keyword count, positions, and backlinks'
      },
      scoring_ranges: {
        excellent: { min: 90, max: 100 },
        good: { min: 75, max: 89 },
        fair: { min: 60, max: 74 },
        needs_improvement: { min: 0, max: 59 }
      }
    }

    return c.json({
      success: true,
      data: mockConfig,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching visibility config:', error)
    throw new HTTPException(500, { message: 'Failed to fetch visibility configuration' })
  }
})

// PUT /dashboard/visibility-score/config - Update scoring configuration (admin only)
visibilityRoutes.put('/visibility-score/config', async (c) => {
  try {
    const body = await c.req.json()
    
    // Validate weights sum to 1.0
    const weights = body.weights
    if (weights) {
      const weightSum = Object.values(weights).reduce((sum: number, weight: any) => sum + (typeof weight === 'number' ? weight : 0), 0)
      if (Math.abs(weightSum - 1.0) > 0.001) {
        throw new HTTPException(400, { message: 'Weights must sum to 1.0' })
      }
    }

    // Mock config update - in production would update database
    const updatedConfig = {
      weights: weights || {
        cadence: 0.2,
        citemind: 0.4,
        pr: 0.2,
        seo: 0.2
      },
      enabled: body.enabled ?? true,
      updated_at: new Date().toISOString()
    }

    return c.json({
      success: true,
      data: updatedConfig,
      message: 'Visibility score configuration updated successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    if (error instanceof HTTPException) {
      throw error
    }
    console.error('Error updating visibility config:', error)
    throw new HTTPException(500, { message: 'Failed to update visibility configuration' })
  }
})