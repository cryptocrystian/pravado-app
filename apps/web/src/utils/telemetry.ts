import { TelemetryEvent } from '../types'

class TelemetryService {
  private events: TelemetryEvent[] = []
  
  emit(event: string, properties?: Record<string, unknown>) {
    const telemetryEvent: TelemetryEvent = {
      event,
      properties,
      timestamp: new Date().toISOString()
    }
    
    this.events.push(telemetryEvent)
    
    // In production, this would send to analytics service
    console.log('[Telemetry]', telemetryEvent)
    
    // Example: Send to analytics endpoint
    void this.sendToAnalytics(telemetryEvent)
  }
  
  private async sendToAnalytics(event: TelemetryEvent) {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.error('Failed to send telemetry event:', error)
    }
  }
  
  getEvents() {
    return [...this.events]
  }
  
  clearEvents() {
    this.events = []
  }
}

export const telemetry = new TelemetryService()

// Convenience functions for specific events
export const trackAutomationThresholdChanged = (newThreshold: number, oldThreshold: number) => {
  telemetry.emit('automation_threshold_changed', {
    new_threshold: newThreshold,
    old_threshold: oldThreshold,
    change: newThreshold - oldThreshold
  })
}

export const trackAutomationPausedToggled = (isPaused: boolean) => {
  telemetry.emit('automation_paused_toggled', {
    is_paused: isPaused,
    action: isPaused ? 'paused' : 'resumed'
  })
}

export const trackFlowPathSubmitPR = (stepCount: number, timeSpent: number) => {
  telemetry.emit('flow_path_len_submit_pr', {
    step_count: stepCount,
    time_spent_seconds: timeSpent,
    completion_rate: 100
  })
}

export const trackFlowPathExport = (exportType: string, stepCount: number, timeSpent: number) => {
  telemetry.emit('flow_path_len_export', {
    export_type: exportType,
    step_count: stepCount,
    time_spent_seconds: timeSpent,
    completion_rate: 100
  })
}

export const trackUIViewDashboardV4 = (viewDuration?: number) => {
  telemetry.emit('ui_view_dashboard_v4', {
    view_duration_seconds: viewDuration,
    timestamp: new Date().toISOString()
  })
}

// Hook for React components to easily track events
export const useTelemetry = () => {
  return {
    trackAutomationThresholdChanged,
    trackAutomationPausedToggled,
    trackFlowPathSubmitPR,
    trackFlowPathExport,
    trackUIViewDashboardV4,
    track: telemetry.emit.bind(telemetry)
  }
}