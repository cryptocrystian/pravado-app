/**
 * Telemetry Collector - PostHog and Sentry integration
 * Collects and forwards telemetry data with proper PII handling
 */

export interface TelemetryEvent {
  event: string
  properties?: Record<string, unknown>
  timestamp?: number
}

export interface TelemetryConfig {
  POSTHOG_API_KEY?: string
  POSTHOG_HOST?: string
  SENTRY_DSN?: string
  ENVIRONMENT?: string
  DISABLE_TELEMETRY?: boolean
}

export class TelemetryCollector {
  private config: TelemetryConfig
  private eventQueue: TelemetryEvent[] = []
  private batchSize = 10
  private flushInterval = 30000 // 30 seconds

  constructor(config: TelemetryConfig) {
    this.config = config
    
    // Start background flush if telemetry is enabled
    if (!config.DISABLE_TELEMETRY) {
      this.startBackgroundFlush()
    }
  }

  /**
   * Track an event
   */
  trackEvent(event: string, properties?: Record<string, unknown>): void {
    if (this.config.DISABLE_TELEMETRY) return

    const telemetryEvent: TelemetryEvent = {
      event,
      properties: this.sanitizeProperties(properties || {}),
      timestamp: Date.now()
    }

    this.eventQueue.push(telemetryEvent)

    // Flush if queue is full
    if (this.eventQueue.length >= this.batchSize) {
      this.flush()
    }
  }

  /**
   * Track CiteMind specific events
   */
  trackCiteMindEvent(
    event: 'citemind_job_enqueued' | 'agent_run_completed' | 'agent_budget_exceeded' | 'analytics_export',
    properties: Record<string, unknown>
  ): void {
    const sanitizedProps = {
      ...this.sanitizeProperties(properties),
      citemind: true,
      environment: this.config.ENVIRONMENT || 'unknown'
    }

    this.trackEvent(event, sanitizedProps)
  }

  /**
   * Track errors to Sentry
   */
  trackError(error: Error, context?: Record<string, unknown>): void {
    if (this.config.DISABLE_TELEMETRY || !this.config.SENTRY_DSN) return

    const sanitizedContext = this.sanitizeProperties(context || {})
    
    // In a real implementation, would use Sentry SDK
    console.error('Tracked error:', {
      error: error.message,
      stack: error.stack,
      context: sanitizedContext,
      timestamp: Date.now()
    })

    // Also track as event for PostHog
    this.trackEvent('error_occurred', {
      error_message: error.message,
      error_type: error.constructor.name,
      ...sanitizedContext
    })
  }

  /**
   * Flush events immediately
   */
  async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    try {
      await Promise.all([
        this.sendToPostHog(events),
        this.sendToSentry(events)
      ])
    } catch (error) {
      console.error('Failed to flush telemetry events:', error)
      // Re-queue events on failure (up to a limit)
      if (this.eventQueue.length < 100) {
        this.eventQueue.unshift(...events)
      }
    }
  }

  /**
   * Send events to PostHog
   */
  private async sendToPostHog(events: TelemetryEvent[]): Promise<void> {
    if (!this.config.POSTHOG_API_KEY) return

    const posthogEvents = events.map(event => ({
      event: event.event,
      properties: {
        ...event.properties,
        $timestamp: new Date(event.timestamp || Date.now()).toISOString()
      },
      distinct_id: this.getDistinctId(event.properties || {})
    }))

    const payload = {
      api_key: this.config.POSTHOG_API_KEY,
      batch: posthogEvents
    }

    // Mock implementation - replace with actual PostHog API call
    console.log('PostHog events (mock):', JSON.stringify(payload, null, 2))

    // Actual implementation would be:
    // await fetch(`${this.config.POSTHOG_HOST || 'https://app.posthog.com'}/batch/`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // })
  }

  /**
   * Send events to Sentry (for error tracking)
   */
  private async sendToSentry(events: TelemetryEvent[]): Promise<void> {
    if (!this.config.SENTRY_DSN) return

    const errorEvents = events.filter(event => 
      event.event.includes('error') || 
      event.event.includes('failed') || 
      event.event.includes('exception')
    )

    if (errorEvents.length === 0) return

    // Mock implementation - replace with actual Sentry SDK calls
    for (const event of errorEvents) {
      console.log('Sentry event (mock):', {
        message: event.event,
        tags: {
          org_id: event.properties?.org_id,
          job_id: event.properties?.job_id,
          run_id: event.properties?.run_id,
          environment: this.config.ENVIRONMENT
        },
        extra: this.redactSensitiveData(event.properties || {}),
        timestamp: event.timestamp
      })
    }

    // Actual implementation would use Sentry SDK:
    // Sentry.captureMessage(event.event, {
    //   tags: { ... },
    //   extra: { ... }
    // })
  }

  /**
   * Start background flush timer
   */
  private startBackgroundFlush(): void {
    setInterval(() => {
      this.flush().catch(console.error)
    }, this.flushInterval)
  }

  /**
   * Get distinct ID for PostHog (anonymized)
   */
  private getDistinctId(properties: Record<string, unknown>): string {
    const orgId = properties.org_id as string
    const userId = properties.user_id as string
    
    // Use org_id as distinct_id (no personal data)
    return orgId || 'anonymous'
  }

  /**
   * Sanitize properties to remove PII
   */
  private sanitizeProperties(properties: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(properties)) {
      // Skip sensitive fields
      if (this.isSensitiveField(key)) {
        continue
      }

      // Hash email addresses
      if (key.includes('email') && typeof value === 'string') {
        sanitized[key] = this.hashValue(value)
        continue
      }

      // Keep safe values
      sanitized[key] = this.sanitizeValue(value)
    }

    return sanitized
  }

  /**
   * Check if field contains sensitive information
   */
  private isSensitiveField(field: string): boolean {
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'credit_card',
      'ssn',
      'phone',
      'address',
      'ip_address',
      'user_agent'
    ]

    const fieldLower = field.toLowerCase()
    return sensitiveFields.some(sensitive => fieldLower.includes(sensitive))
  }

  /**
   * Sanitize individual values
   */
  private sanitizeValue(value: unknown): unknown {
    if (typeof value === 'string') {
      // Truncate very long strings
      if (value.length > 500) {
        return value.substring(0, 500) + '...[truncated]'
      }
      return value
    }

    if (typeof value === 'object' && value !== null) {
      // Recursively sanitize objects
      if (Array.isArray(value)) {
        return value.slice(0, 10).map(item => this.sanitizeValue(item)) // Limit array size
      } else {
        const sanitized: Record<string, unknown> = {}
        const entries = Object.entries(value).slice(0, 20) // Limit object size
        for (const [k, v] of entries) {
          if (!this.isSensitiveField(k)) {
            sanitized[k] = this.sanitizeValue(v)
          }
        }
        return sanitized
      }
    }

    return value
  }

  /**
   * Redact sensitive data for Sentry
   */
  private redactSensitiveData(properties: Record<string, unknown>): Record<string, unknown> {
    const redacted: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(properties)) {
      if (this.isSensitiveField(key)) {
        redacted[key] = '[REDACTED]'
      } else {
        redacted[key] = this.sanitizeValue(value)
      }
    }

    return redacted
  }

  /**
   * Simple hash function for anonymization
   */
  private hashValue(value: string): string {
    // Simple hash - in production would use crypto.subtle
    let hash = 0
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return `hash_${Math.abs(hash).toString(16)}`
  }

  /**
   * Clean shutdown
   */
  async shutdown(): Promise<void> {
    await this.flush()
  }
}