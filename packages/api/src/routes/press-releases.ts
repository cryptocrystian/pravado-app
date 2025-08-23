import { Hono } from 'hono'
import { getAuthUser, getSupabase } from '../middleware/auth'
import { validateRequest, getValidatedData, schemas } from '../middleware/validation'
import { errors } from '../middleware/errors'
import { consumeWalletCredits } from '../services/wallet'
import { sendPRToPartner } from '../services/pr-partner'

const pressReleases = new Hono()

/**
 * POST /press-releases/submit
 * Submit press release with wallet validation and partner email
 */
pressReleases.post('/submit',
  validateRequest(schemas.pressReleaseSubmission),
  async (c) => {
    const user = getAuthUser(c)
    const supabase = getSupabase(c)
    const submissionData = getValidatedData<{
      title: string
      content: string
      summary?: string
      target_audience?: string
      keywords: string[]
      submission_tier: 'basic' | 'premium'
      distribution_channels: string[]
    }>(c)

    try {
      // Validate wallet credits first
      const creditType = 'press_release_credits'
      const creditsRequired = submissionData.submission_tier === 'premium' ? 2 : 1

      await consumeWalletCredits(
        supabase,
        user.tenant_id,
        user.id,
        creditType,
        creditsRequired,
        'press_release_submission',
        undefined,
        `${submissionData.submission_tier} PR submission`
      )

      // Create press release record
      const { data: pressRelease, error: prError } = await supabase
        .from('press_releases')
        .insert({
          tenant_id: user.tenant_id,
          user_id: user.id,
          title: submissionData.title,
          content: submissionData.content,
          summary: submissionData.summary,
          target_audience: submissionData.target_audience,
          keywords: submissionData.keywords,
          status: 'submitted',
          submission_tier: submissionData.submission_tier,
          distribution_channels: submissionData.distribution_channels,
          submitted_at: new Date().toISOString()
        })
        .select('*')
        .single()

      if (prError) {
        console.error('Press release creation failed:', prError)
        throw errors.badRequest('Failed to create press release')
      }

      // Send to PR partner
      let partnerResponse
      try {
        partnerResponse = await sendPRToPartner(pressRelease, c.env)
        
        // Update with partner response
        await supabase
          .from('press_releases')
          .update({
            partner_submission_id: partnerResponse.submissionId,
            partner_response: partnerResponse,
            partner_status: 'submitted'
          })
          .eq('id', pressRelease.id)

      } catch (partnerError) {
        console.error('PR partner submission failed:', partnerError)
        // Update status but don't fail the request
        await supabase
          .from('press_releases')
          .update({
            partner_response: { error: 'Partner submission failed' },
            partner_status: 'failed'
          })
          .eq('id', pressRelease.id)
      }

      // Emit pr.submitted event for CiteMind orchestration
      try {
        const response = await fetch(c.req.url.replace('/press-releases/submit', '/events/emit'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': c.req.header('authorization') || ''
          },
          body: JSON.stringify({
            eventType: 'pr.submitted',
            entityType: 'press_release',
            entityId: pressRelease.id,
            payload: {
              submission_tier: submissionData.submission_tier,
              keywords: submissionData.keywords,
              distribution_channels: submissionData.distribution_channels
            }
          })
        })

        if (!response.ok) {
          console.error('Event emission failed:', await response.text())
        }
      } catch (eventError) {
        console.error('Failed to emit pr.submitted event:', eventError)
        // Don't fail the request for event emission failures
      }

      return c.json({
        success: true,
        submission_id: pressRelease.id,
        data: {
          id: pressRelease.id,
          title: pressRelease.title,
          status: pressRelease.status,
          submission_tier: pressRelease.submission_tier,
          submitted_at: pressRelease.submitted_at,
          credits_consumed: creditsRequired,
          partner_status: partnerResponse ? 'submitted' : 'failed'
        }
      })

    } catch (error) {
      console.error('Press release submission failed:', error)
      throw error instanceof Error ? error : errors.badRequest('Press release submission failed')
    }
  }
)

/**
 * GET /press-releases
 * List press releases for the tenant
 */
pressReleases.get('/',
  validateRequest(schemas.pagination),
  async (c) => {
    const user = getAuthUser(c)
    const supabase = getSupabase(c)
    const { page, limit } = getValidatedData<{ page: number; limit: number }>(c)

    const offset = (page - 1) * limit

    try {
      const { data: prList, error: prError, count } = await supabase
        .from('press_releases')
        .select('id, title, status, submission_tier, submitted_at, created_at, partner_status', { count: 'exact' })
        .eq('tenant_id', user.tenant_id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (prError) {
        console.error('Press releases retrieval failed:', prError)
        throw errors.badRequest('Failed to retrieve press releases')
      }

      const totalPages = Math.ceil((count || 0) / limit)

      return c.json({
        success: true,
        data: prList || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1
        }
      })

    } catch (error) {
      console.error('Press releases list failed:', error)
      throw error instanceof Error ? error : errors.badRequest('Failed to retrieve press releases')
    }
  }
)

/**
 * GET /press-releases/:id
 * Get specific press release details
 */
pressReleases.get('/:id',
  async (c) => {
    const user = getAuthUser(c)
    const supabase = getSupabase(c)
    const id = c.req.param('id')

    if (!id) {
      throw errors.badRequest('Press release ID is required')
    }

    try {
      const { data: pressRelease, error: prError } = await supabase
        .from('press_releases')
        .select('*')
        .eq('tenant_id', user.tenant_id)
        .eq('id', id)
        .single()

      if (prError || !pressRelease) {
        throw errors.notFound('Press release', id)
      }

      return c.json({
        success: true,
        data: pressRelease
      })

    } catch (error) {
      console.error('Press release retrieval failed:', error)
      throw error instanceof Error ? error : errors.badRequest('Failed to retrieve press release')
    }
  }
)

export { pressReleases }