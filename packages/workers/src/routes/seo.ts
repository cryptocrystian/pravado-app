/**
 * SEO Routes - Keywords, Competitors, Backlinks
 * Implements read-only SEO data endpoints
 */

import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'
import type { Env } from '../index'

// Validation schemas
const seoQuerySchema = z.object({
  sort: z.enum(['keyword', 'difficulty', 'position', 'last_seen', 'domain', 'share_of_voice', 'source_url', 'da', 'discovered_at']).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.string().transform(val => parseInt(val, 10)).refine(val => val >= 1).default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).refine(val => val >= 1 && val <= 100).default('20'),
})

export const seoRoutes = new Hono<{ Bindings: Env }>()

// GET /seo/keywords - Fetch SEO keywords with pagination and sorting
seoRoutes.get('/keywords', validator('query', (value, c) => {
  const parsed = seoQuerySchema.safeParse(value)
  if (!parsed.success) {
    return c.json({ success: false, error: 'Invalid query parameters' }, 400)
  }
  return parsed.data
}), async (c) => {
  const { sort = 'last_seen', order, page, limit } = c.req.valid('query')
  
  try {
    // Mock data for development - replace with actual database queries
    const mockKeywords = [
      {
        id: '1',
        keyword: 'ai content writing',
        difficulty_0_100: 85,
        position: 3,
        last_seen: new Date('2025-08-23T10:00:00Z').toISOString(),
      },
      {
        id: '2',
        keyword: 'automated press release',
        difficulty_0_100: 72,
        position: 7,
        last_seen: new Date('2025-08-22T15:30:00Z').toISOString(),
      },
      {
        id: '3',
        keyword: 'digital pr platform',
        difficulty_0_100: 91,
        position: 2,
        last_seen: new Date('2025-08-24T08:15:00Z').toISOString(),
      },
      {
        id: '4',
        keyword: 'content marketing automation',
        difficulty_0_100: 68,
        position: 12,
        last_seen: new Date('2025-08-21T12:45:00Z').toISOString(),
      },
      {
        id: '5',
        keyword: 'seo content tools',
        difficulty_0_100: 76,
        position: 15,
        last_seen: new Date('2025-08-19T14:20:00Z').toISOString(),
      },
    ]

    // Sort the data
    let sortedKeywords = [...mockKeywords]
    if (sort === 'keyword') {
      sortedKeywords.sort((a, b) => order === 'asc' ? a.keyword.localeCompare(b.keyword) : b.keyword.localeCompare(a.keyword))
    } else if (sort === 'difficulty') {
      sortedKeywords.sort((a, b) => order === 'asc' ? a.difficulty_0_100 - b.difficulty_0_100 : b.difficulty_0_100 - a.difficulty_0_100)
    } else if (sort === 'position') {
      sortedKeywords.sort((a, b) => order === 'asc' ? a.position - b.position : b.position - a.position)
    } else if (sort === 'last_seen') {
      sortedKeywords.sort((a, b) => order === 'asc' ? new Date(a.last_seen).getTime() - new Date(b.last_seen).getTime() : new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime())
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedKeywords = sortedKeywords.slice(startIndex, endIndex)

    // Tab header aggregates
    const aggregates = {
      total_count: sortedKeywords.length,
      avg_difficulty: Math.round(sortedKeywords.reduce((sum, k) => sum + k.difficulty_0_100, 0) / sortedKeywords.length),
      avg_position: Math.round(sortedKeywords.reduce((sum, k) => sum + k.position, 0) / sortedKeywords.length),
      top_10_count: sortedKeywords.filter(k => k.position <= 10).length,
      last_updated: sortedKeywords.length > 0 ? sortedKeywords[0].last_seen : null,
    }

    return c.json({
      success: true,
      data: paginatedKeywords,
      pagination: {
        page,
        limit,
        total: sortedKeywords.length,
        pages: Math.ceil(sortedKeywords.length / limit),
      },
      aggregates,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Error fetching SEO keywords:', error)
    throw new HTTPException(500, { message: 'Failed to fetch SEO keywords' })
  }
})

// GET /seo/competitors - Fetch SEO competitors data
seoRoutes.get('/competitors', validator('query', (value, c) => {
  const parsed = seoQuerySchema.safeParse(value)
  if (!parsed.success) {
    return c.json({ success: false, error: 'Invalid query parameters' }, 400)
  }
  return parsed.data
}), async (c) => {
  const { sort = 'last_seen', order, page, limit } = c.req.valid('query')
  
  try {
    // Mock data for development
    const mockCompetitors = [
      {
        id: '1',
        domain: 'semrush.com',
        share_of_voice_0_100: 95,
        last_seen: new Date('2025-08-23T10:00:00Z').toISOString(),
      },
      {
        id: '2',
        domain: 'ahrefs.com',
        share_of_voice_0_100: 92,
        last_seen: new Date('2025-08-24T08:15:00Z').toISOString(),
      },
      {
        id: '3',
        domain: 'moz.com',
        share_of_voice_0_100: 88,
        last_seen: new Date('2025-08-23T15:30:00Z').toISOString(),
      },
      {
        id: '4',
        domain: 'brightedge.com',
        share_of_voice_0_100: 84,
        last_seen: new Date('2025-08-22T12:45:00Z').toISOString(),
      },
      {
        id: '5',
        domain: 'contentking.com',
        share_of_voice_0_100: 78,
        last_seen: new Date('2025-08-22T14:20:00Z').toISOString(),
      },
    ]

    // Sort the data
    let sortedCompetitors = [...mockCompetitors]
    if (sort === 'domain') {
      sortedCompetitors.sort((a, b) => order === 'asc' ? a.domain.localeCompare(b.domain) : b.domain.localeCompare(a.domain))
    } else if (sort === 'share_of_voice') {
      sortedCompetitors.sort((a, b) => order === 'asc' ? a.share_of_voice_0_100 - b.share_of_voice_0_100 : b.share_of_voice_0_100 - a.share_of_voice_0_100)
    } else if (sort === 'last_seen') {
      sortedCompetitors.sort((a, b) => order === 'asc' ? new Date(a.last_seen).getTime() - new Date(b.last_seen).getTime() : new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime())
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCompetitors = sortedCompetitors.slice(startIndex, endIndex)

    // Tab header aggregates
    const aggregates = {
      total_count: sortedCompetitors.length,
      avg_share_of_voice: Math.round(sortedCompetitors.reduce((sum, c) => sum + c.share_of_voice_0_100, 0) / sortedCompetitors.length),
      top_competitor: sortedCompetitors.length > 0 ? sortedCompetitors[0].domain : null,
      last_updated: sortedCompetitors.length > 0 ? sortedCompetitors[0].last_seen : null,
    }

    return c.json({
      success: true,
      data: paginatedCompetitors,
      pagination: {
        page,
        limit,
        total: sortedCompetitors.length,
        pages: Math.ceil(sortedCompetitors.length / limit),
      },
      aggregates,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Error fetching SEO competitors:', error)
    throw new HTTPException(500, { message: 'Failed to fetch SEO competitors' })
  }
})

// GET /seo/backlinks - Fetch SEO backlinks data
seoRoutes.get('/backlinks', validator('query', (value, c) => {
  const parsed = seoQuerySchema.safeParse(value)
  if (!parsed.success) {
    return c.json({ success: false, error: 'Invalid query parameters' }, 400)
  }
  return parsed.data
}), async (c) => {
  const { sort = 'discovered_at', order, page, limit } = c.req.valid('query')
  
  try {
    // Mock data for development
    const mockBacklinks = [
      {
        id: '1',
        source_url: 'https://techcrunch.com/2024/01/15/ai-content-revolution/',
        target_path: '/features/content-ai',
        da_0_100: 94,
        discovered_at: new Date('2025-08-10T10:00:00Z').toISOString(),
      },
      {
        id: '2',
        source_url: 'https://forbes.com/sites/ai-content-marketing/',
        target_path: '/case-studies/forbes',
        da_0_100: 96,
        discovered_at: new Date('2025-08-22T15:30:00Z').toISOString(),
      },
      {
        id: '3',
        source_url: 'https://venturebeat.com/ai/content-marketing-ai/',
        target_path: '/blog/content-marketing',
        da_0_100: 91,
        discovered_at: new Date('2025-08-17T12:45:00Z').toISOString(),
      },
      {
        id: '4',
        source_url: 'https://inc.com/ai-powered-marketing/',
        target_path: '/features/ai-marketing',
        da_0_100: 90,
        discovered_at: new Date('2025-08-18T08:15:00Z').toISOString(),
      },
      {
        id: '5',
        source_url: 'https://mashable.com/article/automated-pr-tools/',
        target_path: '/platform/press-release',
        da_0_100: 89,
        discovered_at: new Date('2025-08-14T14:20:00Z').toISOString(),
      },
    ]

    // Sort the data
    let sortedBacklinks = [...mockBacklinks]
    if (sort === 'source_url') {
      sortedBacklinks.sort((a, b) => order === 'asc' ? a.source_url.localeCompare(b.source_url) : b.source_url.localeCompare(a.source_url))
    } else if (sort === 'da') {
      sortedBacklinks.sort((a, b) => order === 'asc' ? a.da_0_100 - b.da_0_100 : b.da_0_100 - a.da_0_100)
    } else if (sort === 'discovered_at') {
      sortedBacklinks.sort((a, b) => order === 'asc' ? new Date(a.discovered_at).getTime() - new Date(b.discovered_at).getTime() : new Date(b.discovered_at).getTime() - new Date(a.discovered_at).getTime())
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBacklinks = sortedBacklinks.slice(startIndex, endIndex)

    // Tab header aggregates
    const aggregates = {
      total_count: sortedBacklinks.length,
      avg_da: Math.round(sortedBacklinks.reduce((sum, b) => sum + b.da_0_100, 0) / sortedBacklinks.length),
      high_da_count: sortedBacklinks.filter(b => b.da_0_100 >= 80).length,
      recent_count: sortedBacklinks.filter(b => {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        return new Date(b.discovered_at) >= sevenDaysAgo
      }).length,
      last_discovered: sortedBacklinks.length > 0 ? sortedBacklinks[0].discovered_at : null,
    }

    return c.json({
      success: true,
      data: paginatedBacklinks,
      pagination: {
        page,
        limit,
        total: sortedBacklinks.length,
        pages: Math.ceil(sortedBacklinks.length / limit),
      },
      aggregates,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Error fetching SEO backlinks:', error)
    throw new HTTPException(500, { message: 'Failed to fetch SEO backlinks' })
  }
})