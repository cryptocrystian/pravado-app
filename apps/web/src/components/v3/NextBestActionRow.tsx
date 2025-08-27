import { TrendingUp, ExternalLink } from 'lucide-react'
import { cn } from '../../lib/utils'
import { trackFlow } from '../../services/analyticsService'

interface NextBestActionRowProps {
  id: string
  title: string
  rationale: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  actionType: 'apply' | 'run' | 'view'
  deepLink: string
  prefillParams?: Record<string, any>
}

const IMPACT_LABELS = {
  high: 'High Impact',
  medium: 'Medium Impact', 
  low: 'Low Impact'
}

const ACTION_LABELS = {
  apply: 'Apply',
  run: 'Run Analysis',
  view: 'View Details'
}

export function NextBestActionRow({
  id,
  title,
  rationale,
  confidence,
  impact,
  actionType,
  deepLink,
  prefillParams
}: NextBestActionRowProps) {
  const handleAction = () => {
    trackFlow.start('nba_action', 'next_best_action', {
      action_id: id,
      confidence,
      impact,
      action_type: actionType
    })

    // Navigate with prefilled params
    const url = new URL(deepLink, window.location.origin)
    if (prefillParams) {
      Object.entries(prefillParams).forEach(([key, value]) => {
        url.searchParams.set(key, String(value))
      })
    }
    window.location.href = url.toString()
  }

  return (
    <div className="p-4 bg-foreground/3 border border-foreground/5 rounded-lg hover:bg-foreground/5 transition-all group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-foreground group-hover:text-ai-teal-300 transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-foreground/70">{rationale}</p>
          
          {/* Chips */}
          <div className="flex items-center gap-3">
            {/* Confidence chip - teal */}
            <div className="chip-positive inline-flex items-center gap-1">
              {confidence}% confident
            </div>
            
            {/* Impact chip - gold, not rounded-full */}
            <div className={cn(
              "inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium",
              impact === 'high' ? "chip-attention" : "bg-foreground/10 text-foreground/60"
            )}>
              <TrendingUp className="h-3 w-3" />
              {IMPACT_LABELS[impact]}
            </div>
          </div>
        </div>

        {/* Gradient CTA */}
        <button
          onClick={handleAction}
          className="btn-primary px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap"
        >
          {ACTION_LABELS[actionType]}
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}