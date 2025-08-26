/**
 * Analytics Service - PostHog Flow Path Tracking for Phase 3
 * Implements comprehensive user journey tracking across the dashboard
 */

interface FlowPathEvent {
  flow: string;
  step: number;
  action: string;
  component: string;
  timestamp: string;
  route: string;
  sessionId?: string;
  properties?: Record<string, any>;
}

interface UserFlowContext {
  sessionId: string;
  currentFlow?: string;
  stepCount: number;
  startTime: string;
  lastAction?: string;
  route: string;
}

class AnalyticsService {
  private flowContext: UserFlowContext;
  private sessionStartTime: string;

  constructor() {
    this.sessionStartTime = new Date().toISOString();
    this.flowContext = {
      sessionId: this.generateSessionId(),
      stepCount: 0,
      startTime: this.sessionStartTime,
      route: window.location.pathname || '/'
    };
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private isPostHogAvailable(): boolean {
    return typeof window !== 'undefined' && window.posthog && typeof window.posthog.capture === 'function';
  }

  /**
   * Track user flow initiation (when user starts a specific journey)
   */
  startFlow(flowName: string, component: string, properties: Record<string, any> = {}) {
    this.flowContext.currentFlow = flowName;
    this.flowContext.stepCount = 1;
    this.flowContext.startTime = new Date().toISOString();
    this.flowContext.lastAction = 'flow_start';

    if (this.isPostHogAvailable()) {
      window.posthog!.capture('flow_started', {
        flow: flowName,
        component,
        step: 1,
        session_id: this.flowContext.sessionId,
        timestamp: this.flowContext.startTime,
        route: window.location.pathname,
        ...properties
      });

      console.log(`🔄 Flow started: ${flowName} from ${component}`);
    }
  }

  /**
   * Track flow progression (each step in a user journey)
   */
  trackFlowStep(action: string, component: string, properties: Record<string, any> = {}) {
    if (!this.flowContext.currentFlow) {
      console.warn('Tracking flow step without active flow. Starting implicit flow.');
      this.startFlow('implicit_flow', component);
    }

    this.flowContext.stepCount += 1;
    this.flowContext.lastAction = action;
    this.flowContext.route = window.location.pathname;

    if (this.isPostHogAvailable()) {
      window.posthog!.capture('flow_step', {
        flow: this.flowContext.currentFlow,
        action,
        component,
        step: this.flowContext.stepCount,
        session_id: this.flowContext.sessionId,
        timestamp: new Date().toISOString(),
        route: this.flowContext.route,
        flow_duration: Date.now() - new Date(this.flowContext.startTime).getTime(),
        ...properties
      });

      console.log(`📊 Flow step: ${action} (${this.flowContext.stepCount}) in ${component}`);
    }
  }

  /**
   * Track flow completion (successful end of user journey)
   */
  completeFlow(outcome: 'success' | 'abandoned' | 'error', properties: Record<string, any> = {}) {
    if (!this.flowContext.currentFlow) {
      return;
    }

    const flowDuration = Date.now() - new Date(this.flowContext.startTime).getTime();
    
    if (this.isPostHogAvailable()) {
      window.posthog!.capture('flow_completed', {
        flow: this.flowContext.currentFlow,
        outcome,
        total_steps: this.flowContext.stepCount,
        session_id: this.flowContext.sessionId,
        timestamp: new Date().toISOString(),
        duration_ms: flowDuration,
        duration_seconds: Math.round(flowDuration / 1000),
        final_route: window.location.pathname,
        ...properties
      });

      // Track flow efficiency metrics
      window.posthog!.capture('flow_path_len', {
        flow: this.flowContext.currentFlow,
        steps: this.flowContext.stepCount,
        outcome,
        efficiency_score: this.calculateEfficiencyScore(this.flowContext.stepCount)
      });

      console.log(`✅ Flow completed: ${this.flowContext.currentFlow} - ${outcome} (${this.flowContext.stepCount} steps)`);
    }

    // Reset flow context
    this.flowContext.currentFlow = undefined;
    this.flowContext.stepCount = 0;
  }

  /**
   * Track critical user interactions for Phase 3 acceptance criteria
   */
  trackCriticalAction(actionType: 'kpi_click' | 'quick_action' | 'navigation' | 'filter' | 'export', details: Record<string, any> = {}) {
    if (this.isPostHogAvailable()) {
      window.posthog!.capture('critical_action', {
        action_type: actionType,
        session_id: this.flowContext.sessionId,
        timestamp: new Date().toISOString(),
        route: window.location.pathname,
        current_flow: this.flowContext.currentFlow,
        flow_step: this.flowContext.stepCount,
        ...details
      });
    }

    // Auto-track as flow step if in active flow
    if (this.flowContext.currentFlow) {
      this.trackFlowStep(actionType, details.component || 'unknown', details);
    }
  }

  /**
   * Track component interactions specifically for Phase 3 components
   */
  trackPhase3Interaction(component: 'kpi_hero' | 'quick_actions' | 'glass_card' | 'sidebar', interaction: string, properties: Record<string, any> = {}) {
    if (this.isPostHogAvailable()) {
      window.posthog!.capture('phase3_interaction', {
        component,
        interaction,
        session_id: this.flowContext.sessionId,
        timestamp: new Date().toISOString(),
        route: window.location.pathname,
        ...properties
      });
    }
  }

  /**
   * Track user engagement metrics for dashboard optimization
   */
  trackEngagement(event: 'page_view' | 'time_on_page' | 'scroll_depth' | 'hover' | 'focus', data: Record<string, any> = {}) {
    if (this.isPostHogAvailable()) {
      window.posthog!.capture('user_engagement', {
        event,
        session_id: this.flowContext.sessionId,
        timestamp: new Date().toISOString(),
        route: window.location.pathname,
        session_duration: Date.now() - new Date(this.sessionStartTime).getTime(),
        ...data
      });
    }
  }

  /**
   * Calculate flow efficiency score (lower is better, max of 5 means ≤3 actions)
   */
  private calculateEfficiencyScore(steps: number): number {
    if (steps <= 3) return 5; // Excellent - meets Phase 3 criteria
    if (steps <= 5) return 4; // Good
    if (steps <= 7) return 3; // Fair
    if (steps <= 10) return 2; // Poor
    return 1; // Very poor
  }

  /**
   * Get current flow context for debugging/monitoring
   */
  getCurrentFlowContext(): UserFlowContext {
    return { ...this.flowContext };
  }

  /**
   * Pre-defined flows for common user journeys
   */
  flows = {
    // Dashboard primary flows
    VIEW_DETAILS: 'view_kpi_details',
    CREATE_CONTENT: 'create_new_content',
    START_PR: 'start_press_release',
    ANALYZE_URL: 'analyze_competitor_url',
    EXPORT_DATA: 'export_analytics',
    
    // Navigation flows
    NAVIGATION: 'dashboard_navigation',
    SEARCH: 'command_palette_search',
    
    // Analysis flows
    BREAKDOWN: 'kpi_breakdown_analysis',
    TREND_ANALYSIS: 'trend_exploration',
    
    // Settings/Management flows
    SETTINGS: 'settings_management',
    ACCOUNT_MANAGEMENT: 'account_actions'
  } as const;
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Convenience functions for common tracking scenarios
export const trackFlow = {
  start: (flow: string, component: string, props?: Record<string, any>) => 
    analyticsService.startFlow(flow, component, props),
  
  step: (action: string, component: string, props?: Record<string, any>) => 
    analyticsService.trackFlowStep(action, component, props),
  
  complete: (outcome: 'success' | 'abandoned' | 'error', props?: Record<string, any>) => 
    analyticsService.completeFlow(outcome, props),
  
  critical: (actionType: 'kpi_click' | 'quick_action' | 'navigation' | 'filter' | 'export', details?: Record<string, any>) => 
    analyticsService.trackCriticalAction(actionType, details),
  
  phase3: (component: 'kpi_hero' | 'quick_actions' | 'glass_card' | 'sidebar', interaction: string, props?: Record<string, any>) => 
    analyticsService.trackPhase3Interaction(component, interaction, props),
    
  engagement: (event: 'page_view' | 'time_on_page' | 'scroll_depth' | 'hover' | 'focus', data?: Record<string, any>) => 
    analyticsService.trackEngagement(event, data)
};

// Export flows constant
export const FLOWS = analyticsService.flows;