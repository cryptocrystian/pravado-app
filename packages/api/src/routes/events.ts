import { Hono } from 'hono'
import { getAuthUser, getSupabase } from '../middleware/auth'
import { validateRequest, getValidatedData, schemas } from '../middleware/validation'
import { errors } from '../middleware/errors'
import { enqueueJobsForEvent } from '../services/citemind-orchestrator'

const events = new Hono()

/**
 * POST /events/emit
 * Internal event emission for orchestration
 */
events.post('/emit', 
  validateRequest(schemas.eventEmission),
  async (c) => {
    const user = getAuthUser(c)
    const supabase = getSupabase(c)
    const { eventType, entityType, entityId, payload } = getValidatedData<{
      eventType: string
      entityType?: string
      entityId?: string
      payload: Record<string, unknown>
    }>(c)

    try {
      // Insert event into database
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          tenant_id: user.tenant_id,
          user_id: user.id,
          event_type: eventType,
          entity_type: entityType,
          entity_id: entityId,
          payload,
          event_source: 'api'
        })
        .select('*')
        .single()

      if (eventError) {
        console.error('Event insertion failed:', eventError)
        throw errors.badRequest('Failed to create event')
      }

      // Enqueue jobs based on event type
      const jobs = await enqueueJobsForEvent(event, c.env)
      
      // Mark event as processed
      await supabase
        .from('events')
        .update({ 
          processed_at: new Date().toISOString(),
          processing_status: 'processed' 
        })
        .eq('id', event.id)

      return c.json({
        success: true,
        event: {
          id: event.id,
          event_type: event.event_type,
          created_at: event.created_at
        },
        jobs_enqueued: jobs.length,
        jobs: jobs.map(job => ({
          id: job.id,
          job_type: job.job_type,
          status: job.status
        }))
      })

    } catch (error) {
      console.error('Event emission failed:', error)
      throw error instanceof Error ? error : errors.badRequest('Event emission failed')
    }
  }
)

/**
 * GET /events
 * Retrieve event history with pagination
 */
events.get('/',
  validateRequest(schemas.pagination),
  async (c) => {
    const user = getAuthUser(c)
    const supabase = getSupabase(c)
    const { page, limit } = getValidatedData<{ page: number; limit: number }>(c)

    const offset = (page - 1) * limit

    try {
      // Get events for tenant
      const { data: eventsList, error: eventsError, count } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .eq('tenant_id', user.tenant_id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (eventsError) {
        console.error('Events retrieval failed:', eventsError)
        throw errors.badRequest('Failed to retrieve events')
      }

      const totalPages = Math.ceil((count || 0) / limit)

      return c.json({
        success: true,
        data: eventsList || [],
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
      console.error('Events list failed:', error)
      throw error instanceof Error ? error : errors.badRequest('Failed to retrieve events')
    }
  }
)

export { events }