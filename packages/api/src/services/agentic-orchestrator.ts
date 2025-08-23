/**
 * Agentic CiteMind Orchestrator - Enhanced with agent observability
 * Wraps existing orchestrator with agent run instrumentation
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { AgentRunner, AgentConfig } from './agentic/agent-runner'
import { TelemetryCollector } from './telemetry/collector'
import { enqueueJobsForEvent, Event, CMJob } from './citemind-orchestrator'

export interface AgenticJobProcessor {
  processWithAgent(job: CMJob): Promise<unknown>
}

/**
 * Enhanced orchestrator with agentic observability
 */
export class AgenticOrchestrator {
  private agentRunner: AgentRunner
  private telemetry: TelemetryCollector
  private supabase: SupabaseClient
  private config: AgentConfig

  constructor(supabase: SupabaseClient, env: any) {
    this.supabase = supabase
    
    // Parse config from environment
    this.config = {
      CITEMIND_ENABLED: env.CITEMIND_ENABLED === 'true',
      AGENT_MAX_STEPS: parseInt(env.AGENT_MAX_STEPS || '12'),
      AGENT_COST_CAP_USD: parseFloat(env.AGENT_COST_CAP_USD || '0.35'),
      MODEL_PRIMARY: env.MODEL_PRIMARY || 'anthropic/claude-3.7-sonnet',
      MODEL_FALLBACK: env.MODEL_FALLBACK || 'anthropic/haiku-latest'
    }

    // Initialize telemetry
    this.telemetry = new TelemetryCollector({
      POSTHOG_API_KEY: env.POSTHOG_API_KEY,
      POSTHOG_HOST: env.POSTHOG_HOST,
      SENTRY_DSN: env.SENTRY_DSN,
      ENVIRONMENT: env.ENVIRONMENT || env.NODE_ENV,
      DISABLE_TELEMETRY: env.NODE_ENV === 'development'
    })

    // Initialize agent runner
    this.agentRunner = new AgentRunner(supabase, this.telemetry, this.config)
  }

  /**
   * Enhanced job enqueueing with telemetry
   */
  async enqueueJobsForEvent(event: Event): Promise<CMJob[]> {
    try {
      // Use existing orchestrator logic
      const jobs = await enqueueJobsForEvent(event, {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      })

      // Track telemetry for each enqueued job
      for (const job of jobs) {
        this.telemetry.trackCiteMindEvent('citemind_job_enqueued', {
          job_id: job.id,
          job_type: job.job_type,
          org_id: event.tenant_id,
          event_type: event.event_type,
          priority: job.priority
        })
      }

      return jobs

    } catch (error) {
      this.telemetry.trackError(
        error instanceof Error ? error : new Error('Job enqueueing failed'),
        { event_id: event.id, org_id: event.tenant_id }
      )
      throw error
    }
  }

  /**
   * Process job with agent run instrumentation
   */
  async processJobWithAgent(job: CMJob): Promise<{ success: boolean; result?: unknown; error?: string }> {
    if (!this.config.CITEMIND_ENABLED) {
      console.log(`CiteMind disabled, skipping job ${job.id}`)
      return { success: false, error: 'CiteMind disabled' }
    }

    // Get org_id from job metadata or fetch from database
    const orgId = await this.getJobOrgId(job)
    
    return await this.agentRunner.executeJob(
      orgId,
      job.id,
      'citemind-orchestrator',
      async (runner) => {
        return await this.executeJobSteps(runner, job)
      }
    )
  }

  /**
   * Execute job steps with instrumentation
   */
  private async executeJobSteps(runner: AgentRunner, job: CMJob): Promise<unknown> {
    const runId = await this.getCurrentRunId(job.id)
    
    switch (job.job_type) {
      case 'pr_insight_generation':
        return await this.executePRInsightSteps(runner, runId, job)
      
      case 'visibility_score_update':
        return await this.executeVisibilitySteps(runner, runId, job)
      
      case 'followup_recommendations':
        return await this.executeFollowupSteps(runner, runId, job)
      
      case 'content_analysis':
        return await this.executeContentAnalysisSteps(runner, runId, job)
      
      default:
        throw new Error(`Unknown job type: ${job.job_type}`)
    }
  }

  /**
   * Execute PR insight generation steps
   */
  private async executePRInsightSteps(runner: AgentRunner, runId: string, job: CMJob): Promise<unknown> {
    const results: Record<string, unknown> = {}

    // Step 1: Fetch press release content
    const contentResult = await runner.executeStep(runId, {
      tool: 'db_query',
      input: {
        query: 'fetch_press_release',
        press_release_id: job.payload.press_release_id
      }
    })
    results.content = contentResult.output

    // Step 2: Analyze with primary AI model
    const analysisResult = await runner.executeStep(runId, {
      tool: 'llm_call',
      input: {
        model: this.config.MODEL_PRIMARY,
        prompt: 'Analyze this press release for sentiment, reach potential, and optimization opportunities',
        content: contentResult.output,
        analysis_types: job.meta.analysis_types || []
      }
    })
    results.primary_analysis = analysisResult.output

    // Step 3: Cross-validate with fallback model
    const validationResult = await runner.executeStep(runId, {
      tool: 'llm_call',
      input: {
        model: this.config.MODEL_FALLBACK,
        prompt: 'Review and validate this analysis',
        original_analysis: analysisResult.output
      }
    })
    results.validation = validationResult.output

    // Step 4: Generate citation queries
    const citationResult = await runner.executeStep(runId, {
      tool: 'citation_check',
      input: {
        content_id: job.payload.press_release_id,
        platforms: job.meta.platforms || ['openai', 'anthropic', 'google'],
        keywords: job.payload.keywords || []
      }
    })
    results.citations = citationResult.output

    // Step 5: Store results
    const storeResult = await runner.executeStep(runId, {
      tool: 'db_query',
      input: {
        query: 'store_pr_insights',
        press_release_id: job.payload.press_release_id,
        insights: results
      }
    })

    return {
      success: true,
      press_release_id: job.payload.press_release_id,
      insights: results,
      storage_result: storeResult.output
    }
  }

  /**
   * Execute visibility score update steps
   */
  private async executeVisibilitySteps(runner: AgentRunner, runId: string, job: CMJob): Promise<unknown> {
    const results: Record<string, unknown> = {}

    // Step 1: Collect current metrics
    const metricsResult = await runner.executeStep(runId, {
      tool: 'db_query',
      input: {
        query: 'collect_visibility_metrics',
        press_release_id: job.payload.press_release_id
      }
    })
    results.current_metrics = metricsResult.output

    // Step 2: Calculate visibility scores
    const scoreResult = await runner.executeStep(runId, {
      tool: 'content_analysis',
      input: {
        metrics: metricsResult.output,
        score_types: job.meta.score_types || []
      }
    })
    results.scores = scoreResult.output

    // Step 3: Update database
    const updateResult = await runner.executeStep(runId, {
      tool: 'db_query',
      input: {
        query: 'update_visibility_scores',
        press_release_id: job.payload.press_release_id,
        scores: scoreResult.output
      }
    })

    return {
      success: true,
      press_release_id: job.payload.press_release_id,
      visibility_scores: results.scores,
      updated: updateResult.output
    }
  }

  /**
   * Execute followup recommendations steps
   */
  private async executeFollowupSteps(runner: AgentRunner, runId: string, job: CMJob): Promise<unknown> {
    const results: Record<string, unknown> = {}

    // Step 1: Analyze current performance
    const performanceResult = await runner.executeStep(runId, {
      tool: 'content_analysis',
      input: {
        press_release_id: job.payload.press_release_id,
        distribution_channels: job.payload.distribution_channels
      }
    })
    results.performance = performanceResult.output

    // Step 2: Generate recommendations
    const recommendationsResult = await runner.executeStep(runId, {
      tool: 'llm_call',
      input: {
        model: this.config.MODEL_PRIMARY,
        prompt: 'Generate followup recommendations based on performance data',
        performance_data: performanceResult.output,
        recommendation_types: job.meta.recommendation_types || []
      }
    })
    results.recommendations = recommendationsResult.output

    return {
      success: true,
      press_release_id: job.payload.press_release_id,
      recommendations: results.recommendations
    }
  }

  /**
   * Execute content analysis steps
   */
  private async executeContentAnalysisSteps(runner: AgentRunner, runId: string, job: CMJob): Promise<unknown> {
    const results: Record<string, unknown> = {}

    // Step 1: Fetch content
    const contentResult = await runner.executeStep(runId, {
      tool: 'db_query',
      input: {
        query: 'fetch_content',
        content_id: job.payload.content_id
      }
    })
    results.content = contentResult.output

    // Step 2: Multi-platform analysis
    const platforms = job.meta.analysis_platforms as string[] || ['openai', 'anthropic']
    for (const platform of platforms) {
      const analysisResult = await runner.executeStep(runId, {
        tool: 'llm_call',
        input: {
          model: platform === 'openai' ? 'gpt-4' : this.config.MODEL_PRIMARY,
          prompt: 'Analyze content for readability, engagement, and SEO',
          content: contentResult.output,
          metrics: job.meta.metrics || []
        }
      })
      results[`${platform}_analysis`] = analysisResult.output
    }

    return {
      success: true,
      content_id: job.payload.content_id,
      analysis_results: results
    }
  }

  /**
   * Get organization ID for a job
   */
  private async getJobOrgId(job: CMJob): Promise<string> {
    // First check if org_id is in job metadata
    if (job.meta?.org_id) {
      return job.meta.org_id as string
    }

    // Otherwise fetch from database via tenant_id
    const { data } = await this.supabase
      .from('cm_jobs')
      .select('tenant_id')
      .eq('id', job.id)
      .single()

    return data?.tenant_id || 'unknown'
  }

  /**
   * Get current run ID for a job (helper for steps)
   */
  private async getCurrentRunId(jobId: string): Promise<string> {
    const { data } = await this.supabase
      .from('agent_runs')
      .select('id')
      .eq('job_id', jobId)
      .eq('status', 'running')
      .single()

    return data?.id || 'unknown'
  }

  /**
   * Process a batch of jobs
   */
  async processBatch(jobs: CMJob[]): Promise<Array<{ jobId: string; success: boolean; error?: string }>> {
    const results = []

    for (const job of jobs) {
      try {
        const result = await this.processJobWithAgent(job)
        results.push({
          jobId: job.id,
          success: result.success,
          error: result.error
        })
      } catch (error) {
        results.push({
          jobId: job.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return results
  }

  /**
   * Shutdown and cleanup
   */
  async shutdown(): Promise<void> {
    await this.telemetry.shutdown()
  }
}