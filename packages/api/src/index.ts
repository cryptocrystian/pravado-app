import { Hono } from 'hono'
import { authMiddleware, AuthUser } from './middleware/auth'
import { corsMiddleware } from './middleware/cors'
import { errorHandler } from './middleware/errors'
import { events } from './routes/events'
import { pressReleases } from './routes/press-releases'
import { wallet } from './routes/wallet'
import { analytics } from './routes/analytics'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  SUPABASE_JWT_SECRET: string
  NODE_ENV?: string
}

type Variables = {
  user: AuthUser
  supabase: any
}

/**
 * PRAVADO API - Cloudflare Worker
 * 
 * Main API entry point with middleware and route configuration
 */
const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Global middleware
app.use('*', errorHandler)
app.use('*', corsMiddleware)

// Health check endpoint (no auth required)
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: c.env?.NODE_ENV || 'development'
  })
})

// API info endpoint (no auth required)
app.get('/', (c) => {
  return c.json({
    name: 'PRAVADO API',
    version: '1.0.0',
    description: 'Enterprise Press Release and Content Management API',
    docs: 'https://docs.pravado.com/api',
    endpoints: {
      health: '/health',
      events: '/events',
      'press-releases': '/press-releases',
      wallet: '/wallet',
      analytics: '/analytics'
    },
    timestamp: new Date().toISOString()
  })
})

// Protected routes (require authentication)
app.use('/events/*', authMiddleware)
app.use('/press-releases/*', authMiddleware)
app.use('/wallet/*', authMiddleware)
app.use('/analytics/*', authMiddleware)

// Route handlers
app.route('/events', events)
app.route('/press-releases', pressReleases)
app.route('/wallet', wallet)
app.route('/analytics', analytics)

// Dashboard endpoints
app.get('/dashboard/visibility-score', authMiddleware, async (c) => {
  const user = c.get('user')
  const supabase = c.get('supabase')
  
  try {
    // Mock implementation - replace with actual visibility calculation
    const mockData = {
      current_score: 85,
      previous_score: 78,
      trend: 'up',
      metrics: {
        media_coverage: 92,
        social_mentions: 78,
        search_visibility: 85,
        backlink_quality: 89
      },
      recent_activities: [
        {
          type: 'press_release',
          title: 'Q4 Results Announcement',
          impact_score: 15,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'media_mention',
          title: 'Featured in TechCrunch',
          impact_score: 25,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    }

    return c.json({
      success: true,
      data: mockData
    })

  } catch (error) {
    console.error('Visibility score fetch failed:', error)
    return c.json({
      error: 'Failed to fetch visibility score'
    }, 500)
  }
})

// Dashboard stats endpoint
app.get('/dashboard/stats', authMiddleware, async (c) => {
  const user = c.get('user')
  const supabase = c.get('supabase')
  
  try {
    // Get actual stats from database
    const [prStats, walletStats] = await Promise.all([
      // Press releases stats
      supabase
        .from('press_releases')
        .select('id, status, submission_tier, created_at')
        .eq('tenant_id', user.tenant_id),
      
      // Wallet stats  
      supabase
        .from('wallets')
        .select('*')
        .eq('tenant_id', user.tenant_id)
        .single()
    ])

    const pressReleases = prStats.data || []
    const wallet = walletStats.data

    // Calculate metrics
    const totalPRs = pressReleases.length
    const activePRs = pressReleases.filter((pr: any) => ['submitted', 'approved'].includes(pr.status)).length
    const premiumPRs = pressReleases.filter((pr: any) => pr.submission_tier === 'premium').length
    
    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentPRs = pressReleases.filter((pr: any) => new Date(pr.created_at) > thirtyDaysAgo).length

    return c.json({
      success: true,
      data: {
        press_releases: {
          total: totalPRs,
          active: activePRs,
          premium: premiumPRs,
          recent: recentPRs
        },
        wallet: {
          press_release_credits: wallet?.press_release_credits || 0,
          ai_operations_credits: wallet?.ai_operations_credits || 0,
          premium_credits: wallet?.premium_credits || 0
        },
        activity: {
          last_pr_date: pressReleases.length > 0 ? pressReleases[0].created_at : null,
          total_submissions_this_month: recentPRs
        }
      }
    })

  } catch (error) {
    console.error('Dashboard stats fetch failed:', error)
    return c.json({
      error: 'Failed to fetch dashboard stats'
    }, 500)
  }
})

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    path: c.req.path
  }, 404)
})

export default app