#!/usr/bin/env npx tsx
/**
 * PostHog Delivery Pipeline Telemetry
 * Sends structured events for CI/CD pipeline observability
 */

import { execSync } from 'child_process'

interface DeliveryEvent {
  event: 'dev_pr_opened' | 'dev_ci_started' | 'dev_ci_passed' | 'dev_ci_failed' | 'dev_pr_merged' | 'dev_integration_queue_entered' | 'dev_integration_ci_passed' | 'dev_integration_ci_failed'
  properties: {
    pr: number
    sha: string
    branch: string
    actor: string
    size: 'XS' | 'S' | 'M' | 'L' | 'XL'
    contracts_touched: boolean
    endpoints_touched: boolean
    ci_duration_s?: number
    est_cost_usd?: number
    preview_url?: string
    worker_preview_url?: string
    integration_branch?: string
    failing_jobs?: string[]
  }
}

interface PostHogEvent {
  event: string
  properties: Record<string, unknown>
  distinct_id: string
  timestamp: string
}

class DeliveryTelemetry {
  private posthogApiKey: string
  private posthogHost: string
  private repoOwner: string
  private repoName: string

  constructor() {
    this.posthogApiKey = process.env.POSTHOG_API_KEY || ''
    this.posthogHost = process.env.POSTHOG_HOST || 'https://app.posthog.com'
    
    if (!this.posthogApiKey) {
      console.warn('POSTHOG_API_KEY not set, telemetry disabled')
      return
    }

    // Extract repo info from GitHub context
    const repoFullName = process.env.GITHUB_REPOSITORY || 'pravado/pravado-app'
    const [owner, name] = repoFullName.split('/')
    this.repoOwner = owner
    this.repoName = name
  }

  /**
   * Send delivery event to PostHog
   */
  async sendEvent(eventData: DeliveryEvent): Promise<void> {
    if (!this.posthogApiKey) {
      console.log('PostHog disabled, would send event:', JSON.stringify(eventData, null, 2))
      return
    }

    const posthogEvent: PostHogEvent = {
      event: eventData.event,
      properties: {
        ...eventData.properties,
        // Add pipeline context
        repo_owner: this.repoOwner,
        repo_name: this.repoName,
        workflow_id: process.env.GITHUB_WORKFLOW,
        run_id: process.env.GITHUB_RUN_ID,
        run_number: process.env.GITHUB_RUN_NUMBER,
        runner_os: process.env.RUNNER_OS,
        // Mark as pipeline event
        event_type: 'delivery_pipeline',
        timestamp: new Date().toISOString()
      },
      distinct_id: `${this.repoOwner}/${this.repoName}`,
      timestamp: new Date().toISOString()
    }

    try {
      const response = await fetch(`${this.posthogHost}/capture/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'pravado-delivery-telemetry/1.0'
        },
        body: JSON.stringify({
          api_key: this.posthogApiKey,
          batch: [posthogEvent]
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`PostHog API error: ${response.status} - ${errorText}`)
      }

      console.log(`✅ Sent ${eventData.event} to PostHog`)
    } catch (error) {
      console.error('Failed to send telemetry event:', error)
      // Don't fail CI on telemetry errors
    }
  }

  /**
   * Analyze PR changes and determine size/impact
   */
  async analyzePRChanges(prNumber?: number, baseSha?: string, headSha?: string): Promise<{
    size: DeliveryEvent['properties']['size']
    contracts_touched: boolean
    endpoints_touched: boolean
    est_cost_usd: number
  }> {
    let diffStats = { additions: 0, deletions: 0, files: [] as string[] }
    
    try {
      if (baseSha && headSha) {
        // Get diff stats between commits
        const diffOutput = execSync(
          `git diff --numstat ${baseSha}...${headSha}`, 
          { encoding: 'utf8' }
        )
        
        const files: string[] = []
        let totalAdditions = 0
        let totalDeletions = 0
        
        diffOutput.trim().split('\n').forEach(line => {
          if (line) {
            const [additions, deletions, filename] = line.split('\t')
            if (filename) {
              files.push(filename)
              totalAdditions += parseInt(additions) || 0
              totalDeletions += parseInt(deletions) || 0
            }
          }
        })
        
        diffStats = { 
          additions: totalAdditions, 
          deletions: totalDeletions, 
          files 
        }
      } else if (prNumber) {
        // Fallback to GitHub API if available
        console.log(`Analyzing PR #${prNumber} changes...`)
      }
    } catch (error) {
      console.warn('Could not analyze diff stats:', error)
    }

    const totalChanges = diffStats.additions + diffStats.deletions
    
    // Determine PR size
    let size: DeliveryEvent['properties']['size'] = 'XS'
    if (totalChanges >= 1000) size = 'XL'
    else if (totalChanges >= 500) size = 'L'
    else if (totalChanges >= 200) size = 'M'
    else if (totalChanges >= 50) size = 'S'

    // Check for contract/API changes
    const contracts_touched = diffStats.files.some(file => 
      file.includes('packages/contracts/') ||
      file.includes('packages/types/') ||
      file.includes('/api/') && file.includes('routes/')
    )

    const endpoints_touched = diffStats.files.some(file =>
      file.includes('/routes/') ||
      file.includes('/api/') ||
      file.includes('openapi') ||
      file.includes('schema')
    )

    // Estimate CI cost based on size and complexity
    let est_cost_usd = 0.05 // Base cost
    if (size === 'XL') est_cost_usd = 0.25
    else if (size === 'L') est_cost_usd = 0.20
    else if (size === 'M') est_cost_usd = 0.15
    else if (size === 'S') est_cost_usd = 0.10

    // Additional cost for complex changes
    if (contracts_touched) est_cost_usd += 0.05
    if (endpoints_touched) est_cost_usd += 0.03

    return { size, contracts_touched, endpoints_touched, est_cost_usd }
  }

  /**
   * Get GitHub context information
   */
  getGitHubContext(): {
    pr: number
    sha: string
    branch: string
    actor: string
  } {
    const pr = parseInt(process.env.GITHUB_PR_NUMBER || '0')
    const sha = process.env.GITHUB_SHA || 'unknown'
    const branch = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || 'unknown'
    const actor = process.env.GITHUB_ACTOR || 'unknown'

    return { pr, sha, branch, actor }
  }
}

/**
 * CLI Interface
 */
async function main() {
  const [eventType, ...args] = process.argv.slice(2)
  
  if (!eventType) {
    console.error('Usage: ph-event.ts <event_type> [options]')
    console.error('Events: dev_pr_opened, dev_ci_started, dev_ci_passed, dev_ci_failed, dev_pr_merged, dev_integration_queue_entered, dev_integration_ci_passed, dev_integration_ci_failed')
    process.exit(1)
  }

  const telemetry = new DeliveryTelemetry()
  const context = telemetry.getGitHubContext()
  
  // Parse additional options
  const options: Record<string, string> = {}
  for (let i = 0; i < args.length; i += 2) {
    if (args[i]?.startsWith('--')) {
      options[args[i].substring(2)] = args[i + 1] || 'true'
    }
  }

  const startTime = Date.now()
  const ciDurationS = parseInt(process.env.CI_START_TIME || '0') > 0 
    ? Math.floor((startTime - parseInt(process.env.CI_START_TIME)) / 1000)
    : undefined

  // Analyze changes for context
  const analysis = await telemetry.analyzePRChanges(
    context.pr || undefined,
    options.baseSha,
    options.headSha || context.sha
  )

  const eventData: DeliveryEvent = {
    event: eventType as DeliveryEvent['event'],
    properties: {
      ...context,
      ...analysis,
      ci_duration_s: ciDurationS,
      preview_url: options.previewUrl,
      worker_preview_url: options.workerPreviewUrl,
      integration_branch: options.integrationBranch,
      failing_jobs: options.failingJobs ? options.failingJobs.split(',') : undefined
    }
  }

  await telemetry.sendEvent(eventData)
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Telemetry error:', error)
    process.exit(1)
  })
}

export { DeliveryTelemetry, type DeliveryEvent }