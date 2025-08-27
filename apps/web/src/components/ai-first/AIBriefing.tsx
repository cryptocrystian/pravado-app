import { TrendingUp, Eye, Clock } from 'lucide-react'
import { trackFlow } from '../../services/analyticsService'

interface AIBriefingProps {
  visibilityScore: number
  scoreDelta: { value: number; positive: boolean }
  miniKpis: {
    coverage: number
    authority: number
    timeToCitation: number
    publishingCadence: number
  }
}

const FLOWS = {
  VIEW_DETAILS: 'visibility_details',
  VIEW_BREAKDOWN: 'visibility_breakdown',
  VIEW_COVERAGE: 'coverage_details',
  VIEW_AUTHORITY: 'authority_details'
}

export function AIBriefing({ visibilityScore, scoreDelta, miniKpis }: AIBriefingProps) {
  const handleViewDetails = () => {
    trackFlow.start(FLOWS.VIEW_DETAILS, 'ai_briefing', {
      visibility_score: visibilityScore,
      score_delta: scoreDelta.value
    })
    // Navigate to visibility details page
    window.location.href = '/visibility'
  }

  const handleBreakdown = () => {
    trackFlow.start(FLOWS.VIEW_BREAKDOWN, 'ai_briefing', {
      visibility_score: visibilityScore
    })
    // Navigate to breakdown view
    window.location.href = '/visibility/breakdown'
  }

  const handleMiniKpiClick = (kpiType: string, value: number) => {
    trackFlow.start(`${kpiType}_details`, 'mini_kpi', { value, source: 'ai_briefing' })
  }

  return (
    <div className="glass-card p-6 md:p-8" data-surface="content" data-testid="ai-briefing">
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Primary Visibility Score */}
        <div className="col-span-12 md:col-span-7 space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground/80">AI Visibility Score</h2>
            <div className="flex items-baseline gap-4">
              <div className="text-4xl md:text-5xl font-bold text-ai-teal-300 visibility-score">
                {visibilityScore}
              </div>
              <div className={`chip-${scoreDelta.positive ? 'positive' : 'attention'} flex items-center gap-1`}>
                <TrendingUp className={`h-3 w-3 ${!scoreDelta.positive ? 'rotate-180' : ''}`} />
                {scoreDelta.positive ? '+' : ''}{scoreDelta.value}%
              </div>
            </div>
            {/* Mini sparkline placeholder */}
            <div className="h-8 bg-gradient-to-r from-ai-teal-500/20 to-ai-gold-500/20 rounded opacity-60" />
          </div>

          {/* Primary Actions */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleViewDetails}
              className="btn-primary px-6 py-3 rounded-lg font-semibold"
            >
              View Details
            </button>
            <button 
              onClick={handleBreakdown}
              className="px-6 py-3 bg-foreground/5 border border-foreground/10 text-foreground rounded-lg font-medium hover:bg-foreground/10 transition-colors"
            >
              Breakdown
            </button>
          </div>
        </div>

        {/* Right: Mini-KPIs */}
        <div className="col-span-12 md:col-span-5 space-y-4">
          <h3 className="text-sm font-medium text-foreground/60 uppercase tracking-wide">Quick Insights</h3>
          
          <div className="space-y-3">
            {/* Coverage % */}
            <button
              onClick={() => handleMiniKpiClick('coverage', miniKpis.coverage)}
              className="w-full p-3 bg-foreground/3 border border-foreground/5 rounded-lg hover:bg-foreground/5 transition-colors text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground/70">Coverage %</span>
                <span className="text-ai-teal-300 group-hover:text-ai-teal-500 transition-colors">→</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-lg font-semibold text-foreground">{miniKpis.coverage}%</div>
                <div className="flex-1 h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-ai-teal-500 to-ai-gold-500"
                    style={{ width: `${miniKpis.coverage}%` }}
                  />
                </div>
              </div>
            </button>

            {/* Authority Index */}
            <button
              onClick={() => handleMiniKpiClick('authority', miniKpis.authority)}
              className="w-full p-3 bg-foreground/3 border border-foreground/5 rounded-lg hover:bg-foreground/5 transition-colors text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground/70">Authority Index</span>
                <span className="text-ai-teal-300 group-hover:text-ai-teal-500 transition-colors">→</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-lg font-semibold text-foreground">{miniKpis.authority}</div>
                <div className="flex-1 h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-ai-teal-500 to-ai-gold-500"
                    style={{ width: `${miniKpis.authority}%` }}
                  />
                </div>
              </div>
            </button>

            {/* Time-to-Citation */}
            <button
              onClick={() => handleMiniKpiClick('time_to_citation', miniKpis.timeToCitation)}
              className="w-full p-3 bg-foreground/3 border border-foreground/5 rounded-lg hover:bg-foreground/5 transition-colors text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground/70">Time-to-Citation</span>
                <span className="text-ai-teal-300 group-hover:text-ai-teal-500 transition-colors">→</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-ai-teal-300" />
                <div className="text-lg font-semibold text-foreground">{miniKpis.timeToCitation}d</div>
                <div className="text-xs text-foreground/50">median</div>
              </div>
            </button>

            {/* Publishing Cadence */}
            <button
              onClick={() => handleMiniKpiClick('publishing_cadence', miniKpis.publishingCadence)}
              className="w-full p-3 bg-foreground/3 border border-foreground/5 rounded-lg hover:bg-foreground/5 transition-colors text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground/70">Publishing Cadence</span>
                <span className="text-ai-teal-300 group-hover:text-ai-teal-500 transition-colors">→</span>
              </div>
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-ai-teal-300" />
                <div className="text-lg font-semibold text-foreground">{miniKpis.publishingCadence}</div>
                <div className="text-xs text-foreground/50">30d</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}