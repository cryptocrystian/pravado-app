/**
 * Agent Runner - Core agentic execution framework
 * Implements agent runs with step tracking, cost monitoring, and observability
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { Governor } from './governor'
import { Critic } from './critic'
import { TelemetryCollector } from '../telemetry/collector'

export interface AgentConfig {
  CITEMIND_ENABLED: boolean
  AGENT_MAX_STEPS: number
  AGENT_COST_CAP_USD: number
  MODEL_PRIMARY: string
  MODEL_FALLBACK: string
}

export interface AgentRun {
  id: string
  org_id: string
  job_id: string
  planner: string
  status: 'running' | 'completed' | 'failed' | 'budget_exceeded'
  cost_usd: number
  tokens_in: number
  tokens_out: number
  steps: number
  started_at: string
  finished_at?: string
  meta_json: Record<string, unknown>
}

export interface AgentStep {
  id: string
  run_id: string
  step_no: number
  tool: string
  input_hash: string
  tokens_in: number
  tokens_out: number
  cost_usd: number
  duration_ms: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  output_ref?: string
  error_message?: string
}

export interface ToolInvocation {
  tool: string
  input: Record<string, unknown>
  metadata?: Record<string, unknown>
}

export interface ToolResult {
  output: unknown
  tokens_in?: number
  tokens_out?: number
  cost_usd?: number
  artifacts?: Array<{
    kind: string
    content: unknown
    metadata?: Record<string, unknown>
  }>
}

/**
 * Agent Runner - Orchestrates agentic job execution with observability
 */
export class AgentRunner {
  private supabase: SupabaseClient
  private governor: Governor
  private critic: Critic
  private telemetry: TelemetryCollector
  private config: AgentConfig

  constructor(
    supabase: SupabaseClient,
    telemetry: TelemetryCollector,
    config: AgentConfig
  ) {
    this.supabase = supabase
    this.governor = new Governor(config)
    this.critic = new Critic()
    this.telemetry = telemetry
    this.config = config
  }

  /**
   * Execute a job as an agent run with full observability
   */
  async executeJob(
    orgId: string,
    jobId: string,
    planner: string,
    executor: (runner: AgentRunner) => Promise<unknown>
  ): Promise<{ success: boolean; result?: unknown; error?: string }> {
    if (!this.config.CITEMIND_ENABLED) {
      console.log('CiteMind disabled, skipping agent execution')
      return { success: false, error: 'CiteMind disabled' }
    }

    const runId = await this.initializeRun(orgId, jobId, planner)
    const startTime = Date.now()

    try {
      // Execute the job with governor oversight
      const result = await this.governor.executeWithBudget(
        runId,
        async () => await executor(this)
      )

      // Critic validation
      const validation = await this.critic.validateResult(result)
      if (!validation.valid) {
        await this.finalizeRun(runId, 'failed', Date.now() - startTime, {
          error: 'Critic validation failed',
          validation_errors: validation.errors
        })
        return { success: false, error: validation.errors.join('; ') }
      }

      await this.finalizeRun(runId, 'completed', Date.now() - startTime)
      
      this.telemetry.trackEvent('agent_run_completed', {
        run_id: runId,
        org_id: orgId,
        planner,
        duration_ms: Date.now() - startTime
      })

      return { success: true, result }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      let status: AgentRun['status'] = 'failed'
      if (errorMessage.includes('budget exceeded')) {
        status = 'budget_exceeded'
        this.telemetry.trackEvent('agent_budget_exceeded', {
          run_id: runId,
          org_id: orgId,
          planner
        })
      }

      await this.finalizeRun(runId, status, Date.now() - startTime, {
        error: errorMessage
      })

      console.error(`Agent run ${runId} failed:`, error)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Execute a tool step with tracking
   */
  async executeStep(
    runId: string,
    invocation: ToolInvocation
  ): Promise<ToolResult> {
    const stepNo = await this.getNextStepNumber(runId)
    const stepStartTime = Date.now()
    
    const stepId = await this.createStep(runId, stepNo, invocation.tool, invocation.input)
    
    try {
      // Governor step validation
      await this.governor.validateStep(runId, stepNo, invocation)
      
      // Execute the tool
      const result = await this.invokeTool(invocation)
      const duration = Date.now() - stepStartTime
      
      // Store artifacts if any
      const outputRef = await this.storeArtifacts(stepId, result.artifacts || [])
      
      // Update step with results
      await this.updateStep(stepId, {
        tokens_in: result.tokens_in || 0,
        tokens_out: result.tokens_out || 0,
        cost_usd: result.cost_usd || 0,
        duration_ms: duration,
        status: 'completed',
        output_ref: outputRef
      })
      
      // Update run totals
      await this.updateRunTotals(runId, {
        tokens_in: result.tokens_in || 0,
        tokens_out: result.tokens_out || 0,
        cost_usd: result.cost_usd || 0,
        steps: 1
      })

      return result

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Step failed'
      
      await this.updateStep(stepId, {
        duration_ms: Date.now() - stepStartTime,
        status: 'failed',
        error_message: errorMessage
      })
      
      throw error
    }
  }

  /**
   * Initialize a new agent run
   */
  private async initializeRun(
    orgId: string,
    jobId: string,
    planner: string
  ): Promise<string> {
    const { data, error } = await this.supabase
      .from('agent_runs')
      .insert({
        org_id: orgId,
        job_id: jobId,
        planner,
        status: 'running',
        cost_usd: 0,
        tokens_in: 0,
        tokens_out: 0,
        steps: 0,
        meta_json: {
          model_primary: this.config.MODEL_PRIMARY,
          model_fallback: this.config.MODEL_FALLBACK,
          max_steps: this.config.AGENT_MAX_STEPS,
          cost_cap: this.config.AGENT_COST_CAP_USD
        }
      })
      .select('id')
      .single()

    if (error || !data) {
      throw new Error(`Failed to initialize agent run: ${error?.message}`)
    }

    return data.id
  }

  /**
   * Finalize agent run with status and metadata
   */
  private async finalizeRun(
    runId: string,
    status: AgentRun['status'],
    durationMs: number,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const updates: Partial<AgentRun> = {
      status,
      finished_at: new Date().toISOString()
    }

    if (metadata) {
      updates.meta_json = metadata
    }

    await this.supabase
      .from('agent_runs')
      .update(updates)
      .eq('id', runId)
  }

  /**
   * Create a new agent step
   */
  private async createStep(
    runId: string,
    stepNo: number,
    tool: string,
    input: Record<string, unknown>
  ): Promise<string> {
    const inputHash = this.hashInput(input)
    
    const { data, error } = await this.supabase
      .from('agent_steps')
      .insert({
        run_id: runId,
        step_no: stepNo,
        tool,
        input_hash: inputHash,
        status: 'running'
      })
      .select('id')
      .single()

    if (error || !data) {
      throw new Error(`Failed to create agent step: ${error?.message}`)
    }

    return data.id
  }

  /**
   * Update agent step with results
   */
  private async updateStep(
    stepId: string,
    updates: Partial<AgentStep>
  ): Promise<void> {
    await this.supabase
      .from('agent_steps')
      .update(updates)
      .eq('id', stepId)
  }

  /**
   * Update agent run totals
   */
  private async updateRunTotals(
    runId: string,
    increments: {
      tokens_in: number
      tokens_out: number
      cost_usd: number
      steps: number
    }
  ): Promise<void> {
    const { data: currentRun } = await this.supabase
      .from('agent_runs')
      .select('tokens_in, tokens_out, cost_usd, steps')
      .eq('id', runId)
      .single()

    if (currentRun) {
      await this.supabase
        .from('agent_runs')
        .update({
          tokens_in: currentRun.tokens_in + increments.tokens_in,
          tokens_out: currentRun.tokens_out + increments.tokens_out,
          cost_usd: Number(currentRun.cost_usd) + increments.cost_usd,
          steps: currentRun.steps + increments.steps
        })
        .eq('id', runId)
    }
  }

  /**
   * Store tool artifacts
   */
  private async storeArtifacts(
    stepId: string,
    artifacts: Array<{
      kind: string
      content: unknown
      metadata?: Record<string, unknown>
    }>
  ): Promise<string | undefined> {
    if (artifacts.length === 0) return undefined

    const refs: string[] = []
    
    for (const artifact of artifacts) {
      const ref = await this.storeArtifact(stepId, artifact)
      refs.push(ref)
    }
    
    return refs.join(',')
  }

  /**
   * Store individual artifact
   */
  private async storeArtifact(
    stepId: string,
    artifact: {
      kind: string
      content: unknown
      metadata?: Record<string, unknown>
    }
  ): Promise<string> {
    const content = JSON.stringify(artifact.content)
    const sizeBytes = Buffer.byteLength(content, 'utf8')
    
    // For now, store inline for small artifacts, later can use R2
    const ref = sizeBytes < 1024 * 10 ? `inline:${content}` : `artifact:${stepId}:${Date.now()}`
    
    const { data, error } = await this.supabase
      .from('tool_artifacts')
      .insert({
        step_id: stepId,
        kind: artifact.kind,
        ref,
        meta_json: artifact.metadata || {},
        size_bytes: sizeBytes
      })
      .select('id')
      .single()

    if (error) {
      throw new Error(`Failed to store artifact: ${error.message}`)
    }

    return ref
  }

  /**
   * Get next step number for run
   */
  private async getNextStepNumber(runId: string): Promise<number> {
    const { data } = await this.supabase
      .from('agent_steps')
      .select('step_no')
      .eq('run_id', runId)
      .order('step_no', { ascending: false })
      .limit(1)
      .single()

    return (data?.step_no || 0) + 1
  }

  /**
   * Tool invocation router
   */
  private async invokeTool(invocation: ToolInvocation): Promise<ToolResult> {
    // This would route to actual tool implementations
    // For now, return mock results
    const mockResults: Record<string, ToolResult> = {
      'llm_call': {
        output: { response: 'Mock LLM response' },
        tokens_in: 150,
        tokens_out: 200,
        cost_usd: 0.025,
        artifacts: [{ kind: 'llm_response', content: 'Mock response content' }]
      },
      'web_search': {
        output: { results: ['Mock search result 1', 'Mock search result 2'] },
        cost_usd: 0.005,
        artifacts: [{ kind: 'search_results', content: { query: invocation.input, results: [] } }]
      },
      'db_query': {
        output: { rows: [{ id: 1, name: 'Mock data' }] },
        cost_usd: 0.001
      }
    }

    return mockResults[invocation.tool] || {
      output: { error: `Unknown tool: ${invocation.tool}` },
      cost_usd: 0
    }
  }

  /**
   * Hash input for deduplication
   */
  private hashInput(input: Record<string, unknown>): string {
    const content = JSON.stringify(input, Object.keys(input).sort())
    // Simple hash - in production would use crypto.subtle
    return Buffer.from(content).toString('base64').substring(0, 32)
  }
}