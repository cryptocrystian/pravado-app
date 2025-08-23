import { SupabaseClient } from '@supabase/supabase-js'

/**
 * CiteMind Event Orchestration Service
 * Handles job enqueueing and processing based on system events
 */

export interface Event {
  id: string
  tenant_id: string
  user_id: string
  event_type: string
  entity_type?: string
  entity_id?: string
  payload: Record<string, unknown>
  created_at: string
}

export interface CMJob {
  id: string
  job_type: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  priority: number
  payload: Record<string, unknown>
  retry_count: number
  retry_after?: string
  meta: Record<string, unknown>
  created_at: string
}

/**
 * Main orchestration function - enqueues jobs based on event type
 */
export async function enqueueJobsForEvent(
  event: Event,
  env: any
): Promise<CMJob[]> {
  const jobs: CMJob[] = []
  
  try {
    // Create Supabase client from environment
    const supabase = createSupabaseClient(env)
    
    switch (event.event_type) {
      case 'pr.submitted':
        jobs.push(...await enqueuePRJobs(event, supabase))
        break
      
      case 'content.created':
        jobs.push(...await enqueueContentJobs(event, supabase))
        break
      
      case 'visibility.refresh_requested':
        jobs.push(...await enqueueVisibilityJobs(event, supabase))
        break
      
      case 'ai.analysis_requested':
        jobs.push(...await enqueueAIJobs(event, supabase))
        break
      
      default:
        console.log(`No job handlers for event type: ${event.event_type}`)
    }

    return jobs

  } catch (error) {
    console.error('Job enqueueing failed:', error)
    return []
  }
}

/**
 * Enqueue jobs for press release submission events
 */
async function enqueuePRJobs(event: Event, supabase: SupabaseClient): Promise<CMJob[]> {
  const jobs: CMJob[] = []
  const payload = event.payload

  try {
    // High priority: Generate PR insights using multiple AI platforms
    const insightJob = await createJob(supabase, {
      tenant_id: event.tenant_id,
      user_id: event.user_id,
      job_type: 'pr_insight_generation',
      priority: 2,
      payload: {
        press_release_id: event.entity_id,
        event_id: event.id,
        submission_tier: payload.submission_tier,
        keywords: payload.keywords
      },
      meta: {
        platforms: ['openai', 'anthropic', 'google'],
        analysis_types: ['sentiment', 'reach_prediction', 'keyword_optimization']
      }
    })
    jobs.push(insightJob)

    // Medium priority: Update visibility scores
    const visibilityJob = await createJob(supabase, {
      tenant_id: event.tenant_id,
      user_id: event.user_id,
      job_type: 'visibility_score_update',
      priority: 5,
      payload: {
        press_release_id: event.entity_id,
        event_id: event.id
      },
      meta: {
        score_types: ['media_coverage', 'social_mentions', 'search_visibility']
      }
    })
    jobs.push(visibilityJob)

    // Low priority: Generate follow-up recommendations
    if (payload.submission_tier === 'premium') {
      const recommendationJob = await createJob(supabase, {
        tenant_id: event.tenant_id,
        user_id: event.user_id,
        job_type: 'followup_recommendations',
        priority: 7,
        payload: {
          press_release_id: event.entity_id,
          event_id: event.id,
          distribution_channels: payload.distribution_channels
        },
        meta: {
          recommendation_types: ['social_media', 'influencer_outreach', 'content_amplification']
        }
      })
      jobs.push(recommendationJob)
    }

    return jobs

  } catch (error) {
    console.error('PR job enqueueing failed:', error)
    return []
  }
}

/**
 * Enqueue jobs for content creation events
 */
async function enqueueContentJobs(event: Event, supabase: SupabaseClient): Promise<CMJob[]> {
  const jobs: CMJob[] = []

  try {
    // AI content analysis
    const analysisJob = await createJob(supabase, {
      tenant_id: event.tenant_id,
      user_id: event.user_id,
      job_type: 'content_analysis',
      priority: 4,
      payload: {
        content_id: event.entity_id,
        event_id: event.id
      },
      meta: {
        analysis_platforms: ['openai', 'anthropic'],
        metrics: ['readability', 'engagement_prediction', 'seo_optimization']
      }
    })
    jobs.push(analysisJob)

    return jobs

  } catch (error) {
    console.error('Content job enqueueing failed:', error)
    return []
  }
}

/**
 * Enqueue jobs for visibility refresh events
 */
async function enqueueVisibilityJobs(event: Event, supabase: SupabaseClient): Promise<CMJob[]> {
  const jobs: CMJob[] = []

  try {
    // Comprehensive visibility refresh
    const refreshJob = await createJob(supabase, {
      tenant_id: event.tenant_id,
      user_id: event.user_id,
      job_type: 'visibility_comprehensive_refresh',
      priority: 3,
      payload: {
        entity_id: event.entity_id,
        event_id: event.id
      },
      meta: {
        refresh_sources: ['google_search', 'social_media', 'news_mentions', 'backlinks'],
        lookback_days: 30
      }
    })
    jobs.push(refreshJob)

    return jobs

  } catch (error) {
    console.error('Visibility job enqueueing failed:', error)
    return []
  }
}

/**
 * Enqueue jobs for AI analysis requests
 */
async function enqueueAIJobs(event: Event, supabase: SupabaseClient): Promise<CMJob[]> {
  const jobs: CMJob[] = []
  const payload = event.payload

  try {
    // Create jobs for each requested AI platform
    const platforms = payload.platforms as string[] || ['openai']
    
    for (const platform of platforms) {
      const aiJob = await createJob(supabase, {
        tenant_id: event.tenant_id,
        user_id: event.user_id,
        job_type: 'ai_platform_analysis',
        priority: 3,
        payload: {
          entity_id: event.entity_id,
          event_id: event.id,
          analysis_type: payload.analysis_type,
          platform
        },
        meta: {
          platform,
          analysis_config: payload.config || {}
        }
      })
      jobs.push(aiJob)
    }

    return jobs

  } catch (error) {
    console.error('AI job enqueueing failed:', error)
    return []
  }
}

/**
 * Create a new job in the database
 */
async function createJob(
  supabase: SupabaseClient,
  jobData: {
    tenant_id: string
    user_id: string
    job_type: string
    priority: number
    payload: Record<string, unknown>
    meta?: Record<string, unknown>
  }
): Promise<CMJob> {
  const { data, error } = await supabase
    .from('cm_jobs')
    .insert({
      tenant_id: jobData.tenant_id,
      user_id: jobData.user_id,
      job_type: jobData.job_type,
      status: 'pending',
      priority: jobData.priority,
      payload: jobData.payload,
      retry_count: 0,
      meta: jobData.meta || {}
    })
    .select('*')
    .single()

  if (error) {
    console.error('Job creation failed:', error)
    throw new Error(`Failed to create ${jobData.job_type} job`)
  }

  console.log(`Enqueued job: ${data.job_type} (${data.id}) for tenant ${data.tenant_id}`)
  
  return data
}

/**
 * Get next pending job for processing
 */
export async function getNextPendingJob(env: any): Promise<CMJob | null> {
  try {
    const supabase = createSupabaseClient(env)
    
    const { data, error } = await supabase
      .from('cm_jobs')
      .select('*')
      .eq('status', 'pending')
      .or(`retry_after.is.null,retry_after.lt.${new Date().toISOString()}`)
      .order('priority', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Failed to fetch next job:', error)
      return null
    }

    return data || null

  } catch (error) {
    console.error('Get next job failed:', error)
    return null
  }
}

/**
 * Update job status
 */
export async function updateJobStatus(
  env: any,
  jobId: string,
  status: 'running' | 'completed' | 'failed',
  result?: Record<string, unknown>,
  errorMessage?: string
): Promise<void> {
  try {
    const supabase = createSupabaseClient(env)
    
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (result) {
      updateData.result = result
    }

    if (errorMessage) {
      updateData.error_message = errorMessage
    }

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('cm_jobs')
      .update(updateData)
      .eq('id', jobId)

    if (error) {
      console.error('Job status update failed:', error)
      throw error
    }

  } catch (error) {
    console.error('Update job status failed:', error)
    throw error
  }
}

/**
 * Create Supabase client from environment variables
 */
function createSupabaseClient(env: any): SupabaseClient {
  const { createClient } = require('@supabase/supabase-js')
  
  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  )
}