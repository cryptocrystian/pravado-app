/**
 * Analytics Routes - CiteMind KPIs and Analytics Endpoints
 * Read-only endpoints for analytics dashboard and CSV exports
 */

import { Hono } from 'hono'
import { getAuthUser, getSupabase } from '../middleware/auth'
import { validateRequest, getValidatedData, schemas } from '../middleware/validation'
import { errors } from '../middleware/errors'
import { z } from 'zod'

const analytics = new Hono()

// Analytics-specific schemas
const rangeSchema = z.object({
  range: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  format: z.enum(['json', 'csv']).default('json')
})

/**
 * GET /analytics/citemind/summary
 * Summary KPIs for CiteMind performance
 */
analytics.get('/citemind/summary',
  validateRequest(rangeSchema),
  async (c) => {
    const user = getAuthUser(c)
    const supabase = getSupabase(c)
    const { range, format } = getValidatedData<{ range: string; format: string }>(c)

    try {
      const { startDate, endDate } = getDateRange(range)
      
      // Get citation analytics summary
      const { data: summaryData, error: summaryError } = await supabase
        .from('citation_analytics')
        .select(`
          date,
          avg_citation_probability,
          platform_coverage_pct,
          authority_signal_index,
          citations_found_count,
          content_analyzed_count,
          total_queries_count
        `)
        .eq('tenant_id', user.tenant_id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })

      if (summaryError) {
        throw errors.badRequest('Failed to fetch summary data')
      }

      // Calculate aggregated metrics
      const summary = calculateSummaryMetrics(summaryData || [])

      if (format === 'csv') {
        const csv = convertSummaryToCSV(summaryData || [])
        c.header('Content-Type', 'text/csv')
        c.header('Content-Disposition', `attachment; filename="citemind-summary-${range}.csv"`)
        return c.body(csv)
      }

      return c.json({
        success: true,
        data: {
          summary,
          time_series: summaryData || [],
          date_range: { start: startDate, end: endDate, range }
        }
      })

    } catch (error) {
      console.error('CiteMind summary analytics failed:', error)
      throw error instanceof Error ? error : errors.badRequest('Failed to retrieve analytics')
    }
  }
)

/**
 * GET /analytics/citemind/platforms
 * Platform-specific coverage and performance metrics
 */
analytics.get('/citemind/platforms',
  validateRequest(rangeSchema),
  async (c) => {
    const user = getAuthUser(c)
    const supabase = getSupabase(c)
    const { range, format } = getValidatedData<{ range: string; format: string }>(c)

    try {
      const { startDate, endDate } = getDateRange(range)
      
      // Get platform citation data
      const { data: platformData, error: platformError } = await supabase
        .from('ai_platform_citations')
        .select(`
          platform,
          citation_found,
          relevance_score,
          position,
          checked_at
        `)
        .eq('tenant_id', user.tenant_id)
        .gte('checked_at', startDate)
        .lte('checked_at', endDate)

      if (platformError) {
        throw errors.badRequest('Failed to fetch platform data')
      }

      // Calculate platform metrics
      const platformMetrics = calculatePlatformMetrics(platformData || [])

      if (format === 'csv') {
        const csv = convertPlatformDataToCSV(platformData || [])
        c.header('Content-Type', 'text/csv')
        c.header('Content-Disposition', `attachment; filename="citemind-platforms-${range}.csv"`)
        return c.body(csv)
      }

      return c.json({
        success: true,
        data: {
          platforms: platformMetrics,
          raw_data: platformData || [],
          date_range: { start: startDate, end: endDate, range }
        }
      })

    } catch (error) {
      console.error('CiteMind platform analytics failed:', error)
      throw error instanceof Error ? error : errors.badRequest('Failed to retrieve platform analytics')
    }
  }
)

/**
 * GET /analytics/citemind/ttc
 * Time-to-Citation analysis and distribution
 */
analytics.get('/citemind/ttc',
  validateRequest(rangeSchema),
  async (c) => {
    const user = getAuthUser(c)
    const supabase = getSupabase(c)
    const { range, format } = getValidatedData<{ range: string; format: string }>(c)

    try {
      const { startDate, endDate } = getDateRange(range)
      
      // Get time-to-citation data
      const { data: ttcData, error: ttcError } = await supabase
        .from('ai_citation_results')
        .select(`
          content_id,
          platform,
          time_to_citation_hours,
          found_at,
          created_at
        `)
        .eq('tenant_id', user.tenant_id)
        .eq('citation_found', true)
        .gte('found_at', startDate)
        .lte('found_at', endDate)
        .order('time_to_citation_hours', { ascending: true })

      if (ttcError) {
        throw errors.badRequest('Failed to fetch time-to-citation data')
      }

      // Calculate TTC metrics
      const ttcMetrics = calculateTTCMetrics(ttcData || [])

      if (format === 'csv') {
        const csv = convertTTCDataToCSV(ttcData || [])
        c.header('Content-Type', 'text/csv')
        c.header('Content-Disposition', `attachment; filename="citemind-ttc-${range}.csv"`)
        return c.body(csv)
      }

      return c.json({
        success: true,
        data: {
          metrics: ttcMetrics,
          distribution: ttcData || [],
          date_range: { start: startDate, end: endDate, range }
        }
      })

    } catch (error) {
      console.error('CiteMind TTC analytics failed:', error)
      throw error instanceof Error ? error : errors.badRequest('Failed to retrieve TTC analytics')
    }
  }
)

/**
 * GET /analytics/citemind/visibility-mix
 * Visibility mix and content velocity analysis
 */
analytics.get('/citemind/visibility-mix',
  validateRequest(rangeSchema),
  async (c) => {
    const user = getAuthUser(c)
    const supabase = getSupabase(c)
    const { range, format } = getValidatedData<{ range: string; format: string }>(c)

    try {
      const { startDate, endDate } = getDateRange(range)
      
      // Get citation frequency data
      const { data: citationData } = await supabase
        .from('ai_citation_results')
        .select(`
          DATE(found_at) as citation_date,
          COUNT(*) as citations_count
        `)
        .eq('tenant_id', user.tenant_id)
        .eq('citation_found', true)
        .gte('found_at', startDate)
        .lte('found_at', endDate)
        .order('citation_date')

      // Get content velocity data
      const { data: contentData } = await supabase
        .from('press_releases')
        .select(`
          DATE(submitted_at) as submit_date,
          COUNT(*) as content_count
        `)
        .eq('tenant_id', user.tenant_id)
        .gte('submitted_at', startDate)
        .lte('submitted_at', endDate)
        .order('submit_date')

      // Combine and analyze
      const mixMetrics = calculateVisibilityMix(citationData || [], contentData || [])

      if (format === 'csv') {
        const csv = convertVisibilityMixToCSV(mixMetrics)
        c.header('Content-Type', 'text/csv')
        c.header('Content-Disposition', `attachment; filename="citemind-visibility-mix-${range}.csv"`)
        return c.body(csv)
      }

      return c.json({
        success: true,
        data: {
          visibility_mix: mixMetrics,
          citation_frequency: citationData || [],
          content_velocity: contentData || [],
          date_range: { start: startDate, end: endDate, range }
        }
      })

    } catch (error) {
      console.error('CiteMind visibility mix analytics failed:', error)
      throw error instanceof Error ? error : errors.badRequest('Failed to retrieve visibility mix analytics')
    }
  }
)

/**
 * Helper function: Get date range from range parameter
 */
function getDateRange(range: string): { startDate: string; endDate: string } {
  const endDate = new Date()
  const startDate = new Date()

  switch (range) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7)
      break
    case '30d':
      startDate.setDate(endDate.getDate() - 30)
      break
    case '90d':
      startDate.setDate(endDate.getDate() - 90)
      break
    case '1y':
      startDate.setFullYear(endDate.getFullYear() - 1)
      break
    default:
      startDate.setDate(endDate.getDate() - 30)
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  }
}

/**
 * Calculate summary metrics
 */
function calculateSummaryMetrics(data: any[]): any {
  if (data.length === 0) {
    return {
      avg_citation_probability: 0,
      avg_platform_coverage: 0,
      avg_authority_index: 0,
      total_citations: 0,
      total_content: 0
    }
  }

  const totals = data.reduce((acc, item) => ({
    citation_prob: acc.citation_prob + (Number(item.avg_citation_probability) || 0),
    platform_coverage: acc.platform_coverage + (Number(item.platform_coverage_pct) || 0),
    authority_index: acc.authority_index + (Number(item.authority_signal_index) || 0),
    citations: acc.citations + (item.citations_found_count || 0),
    content: acc.content + (item.content_analyzed_count || 0)
  }), {
    citation_prob: 0,
    platform_coverage: 0,
    authority_index: 0,
    citations: 0,
    content: 0
  })

  return {
    avg_citation_probability: (totals.citation_prob / data.length).toFixed(2),
    avg_platform_coverage: (totals.platform_coverage / data.length).toFixed(2),
    avg_authority_index: Math.round(totals.authority_index / data.length),
    total_citations: totals.citations,
    total_content: totals.content,
    median_ttc: calculateMedianTTC(data)
  }
}

/**
 * Calculate platform metrics
 */
function calculatePlatformMetrics(data: any[]): any {
  const platforms = ['chatgpt', 'claude', 'perplexity', 'gemini']
  const metrics: any = {}

  for (const platform of platforms) {
    const platformData = data.filter(item => item.platform === platform)
    const citationsFound = platformData.filter(item => item.citation_found === true)
    
    metrics[platform] = {
      total_queries: platformData.length,
      citations_found: citationsFound.length,
      citation_rate: platformData.length > 0 ? (citationsFound.length / platformData.length * 100).toFixed(2) : '0.00',
      avg_relevance: citationsFound.length > 0 ? 
        (citationsFound.reduce((sum, item) => sum + (item.relevance_score || 0), 0) / citationsFound.length).toFixed(2) : '0.00',
      avg_position: citationsFound.length > 0 ?
        (citationsFound.reduce((sum, item) => sum + (item.position || 0), 0) / citationsFound.length).toFixed(1) : '0.0'
    }
  }

  return metrics
}

/**
 * Calculate TTC metrics
 */
function calculateTTCMetrics(data: any[]): any {
  if (data.length === 0) {
    return { median_hours: 0, average_hours: 0, distribution: [] }
  }

  const hours = data.map(item => item.time_to_citation_hours).filter(h => h !== null && h !== undefined)
  hours.sort((a, b) => a - b)

  const median = hours.length > 0 ? hours[Math.floor(hours.length / 2)] : 0
  const average = hours.length > 0 ? hours.reduce((sum, h) => sum + h, 0) / hours.length : 0

  // Create distribution buckets
  const buckets = {
    '0-1h': 0, '1-6h': 0, '6-24h': 0, '1-3d': 0, '3-7d': 0, '7d+': 0
  }

  hours.forEach(h => {
    if (h <= 1) buckets['0-1h']++
    else if (h <= 6) buckets['1-6h']++
    else if (h <= 24) buckets['6-24h']++
    else if (h <= 72) buckets['1-3d']++
    else if (h <= 168) buckets['3-7d']++
    else buckets['7d+']++
  })

  return {
    median_hours: median,
    average_hours: average.toFixed(1),
    total_citations: data.length,
    distribution: buckets
  }
}

/**
 * Calculate visibility mix
 */
function calculateVisibilityMix(citationData: any[], contentData: any[]): any {
  const dateMap = new Map<string, { citations: number; content: number }>()

  // Process citation data
  citationData.forEach(item => {
    dateMap.set(item.citation_date, {
      citations: item.citations_count,
      content: dateMap.get(item.citation_date)?.content || 0
    })
  })

  // Process content data
  contentData.forEach(item => {
    const existing = dateMap.get(item.submit_date) || { citations: 0, content: 0 }
    dateMap.set(item.submit_date, {
      citations: existing.citations,
      content: item.content_count
    })
  })

  const timeSeriesData = Array.from(dateMap.entries()).map(([date, data]) => ({
    date,
    citations: data.citations,
    content: data.content,
    ratio: data.content > 0 ? (data.citations / data.content).toFixed(2) : '0.00'
  }))

  return timeSeriesData.sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Calculate median TTC from summary data
 */
function calculateMedianTTC(data: any[]): number {
  // This would need actual TTC data - placeholder for now
  return 24 // hours
}

/**
 * CSV conversion functions
 */
function convertSummaryToCSV(data: any[]): string {
  const headers = ['date', 'avg_citation_probability', 'platform_coverage_pct', 'authority_signal_index', 'citations_found_count', 'content_analyzed_count']
  const rows = data.map(item => headers.map(header => item[header] || '').join(','))
  return [headers.join(','), ...rows].join('\n')
}

function convertPlatformDataToCSV(data: any[]): string {
  const headers = ['platform', 'citation_found', 'relevance_score', 'position', 'checked_at']
  const rows = data.map(item => headers.map(header => item[header] || '').join(','))
  return [headers.join(','), ...rows].join('\n')
}

function convertTTCDataToCSV(data: any[]): string {
  const headers = ['content_id', 'platform', 'time_to_citation_hours', 'found_at']
  const rows = data.map(item => headers.map(header => item[header] || '').join(','))
  return [headers.join(','), ...rows].join('\n')
}

function convertVisibilityMixToCSV(data: any[]): string {
  const headers = ['date', 'citations', 'content', 'ratio']
  const rows = data.map(item => headers.map(header => item[header] || '').join(','))
  return [headers.join(','), ...rows].join('\n')
}

export { analytics }