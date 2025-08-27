import { Zap, TrendingUp, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { trackFlow } from '../../services/analyticsService'

interface ActionCard {
  id: string
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  kpiLift: number
  kpiType: string
  actionType: 'apply' | 'run' | 'view'
  deepLink: string
  prefillParams?: Record<string, any>
}

interface NextBestActionsProps {
  actions: ActionCard[]
  autoApplyEnabled?: boolean
  autoApplyThreshold?: number
}

const IMPACT_STYLES = {
  high: 'chip-attention',
  medium: 'chip-positive', 
  low: 'bg-foreground/5 text-foreground/60'
}

const ACTION_LABELS = {
  apply: 'Apply',
  run: 'Run Analysis',
  view: 'View Details'
}

export function NextBestActions({ 
  actions, 
  autoApplyEnabled = false, 
  autoApplyThreshold = 85 
}: NextBestActionsProps) {
  const [autoApply, setAutoApply] = useState(autoApplyEnabled)
  const [threshold] = useState(autoApplyThreshold)

  const handleActionClick = (action: ActionCard) => {
    trackFlow.start('nba_apply_clicked', 'next_best_action', {
      action_id: action.id,
      confidence: action.confidence,
      impact: action.impact,
      kpi_lift: action.kpiLift,
      action_type: action.actionType
    })

    // Deep link with prefilled params
    const url = new URL(action.deepLink, window.location.origin)
    if (action.prefillParams) {
      Object.entries(action.prefillParams).forEach(([key, value]) => {
        url.searchParams.set(key, String(value))
      })
    }
    
    window.location.href = url.toString()
  }

  const handleAutoApplyToggle = () => {
    setAutoApply(!autoApply)
    // Log to analytics service directly since trackFlow doesn't support this event
    if (window.posthog) {
      window.posthog.capture('auto_apply_toggled', {
        enabled: !autoApply,
        threshold,
        action_count: actions.length
      })
    }
  }

  return (
    <div className="glass-card p-6 md:p-8" data-surface="content" data-testid="next-best-actions">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ai rounded-lg">
            <Zap className="h-5 w-5 text-ai" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Next-Best Actions</h2>
            <p className="text-sm text-foreground/60">AI-driven recommendations ranked by impact</p>
          </div>
        </div>

        {/* Auto-apply toggle */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-foreground/50">Auto-apply when confidence ≥</div>
            <div className="text-sm font-medium text-foreground">{threshold}%</div>
          </div>
          <button
            onClick={handleAutoApplyToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ai focus:ring-offset-2 focus:ring-offset-background ${
              autoApply ? 'bg-ai' : 'bg-foreground/10'
            }`}
            disabled={true} // UI only - no background jobs
            title="UI preview only - automation not implemented"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-panel transition-transform ${
                autoApply ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {actions.map((action, index) => (
          <div
            key={action.id}
            className="p-4 bg-foreground/3 border border-foreground/5 rounded-lg hover:bg-foreground/5 transition-colors group nba-card"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-ai">#{index + 1}</span>
                  <h3 className="font-semibold text-foreground group-hover:text-ai transition-colors">
                    {action.title}
                  </h3>
                </div>
                
                <p className="text-sm text-foreground/70">{action.description}</p>
                
                <div className="flex items-center gap-4">
                  {/* Confidence */}
                  <div className="chip-positive">
                    {action.confidence}% confident
                  </div>
                  
                  {/* Impact */}
                  <div className={`${IMPACT_STYLES[action.impact]} inline-flex items-center gap-1`}>
                    <TrendingUp className="h-3 w-3" />
                    {action.impact} impact
                  </div>
                  
                  {/* KPI Lift */}
                  <div className="text-xs text-ai font-medium">
                    +{action.kpiLift}% {action.kpiType}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleActionClick(action)}
                className="btn-primary px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap"
              >
                {ACTION_LABELS[action.actionType]}
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {actions.length === 0 && (
          <div className="text-center py-8 text-foreground/50">
            <Zap className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No AI recommendations available</p>
            <p className="text-sm">Check back later for new opportunities</p>
          </div>
        )}
      </div>
    </div>
  )
}