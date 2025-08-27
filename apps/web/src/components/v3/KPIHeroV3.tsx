import { ArrowRight, TrendingUp } from 'lucide-react'
import { cn } from '../../lib/utils'
import { trackFlow } from '../../services/analyticsService'

interface KPIHeroV3Props {
  score: number
  label?: string
  delta: {
    value: number
    positive: boolean
  }
  sparklineData?: number[]
  onViewDetails?: () => void
  onBreakdown?: () => void
}

export function KPIHeroV3({
  score,
  label = 'AI Visibility Score',
  delta,
  sparklineData,
  onViewDetails,
  onBreakdown
}: KPIHeroV3Props) {
  const handleViewDetails = () => {
    trackFlow.start('visibility_details', 'kpi_hero_v3', {
      score,
      delta_value: delta.value
    })
    onViewDetails?.()
  }

  const handleBreakdown = () => {
    trackFlow.start('visibility_breakdown', 'kpi_hero_v3', { score })
    onBreakdown?.()
  }

  return (
    <div className="glass-card p-6 md:p-8 min-h-[280px]" data-testid="kpi-hero-v3">
      <div className="flex items-stretch gap-6 h-full">
        {/* Left section - score and actions */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground/80 mb-4">{label}</h2>
            
            <div className="flex items-baseline gap-4 mb-6">
              {/* Big score - 64px metric weight */}
              <div 
                className="text-[64px] leading-[72px] font-metric text-ai-teal-300"
                aria-label={`Score: ${score}`}
              >
                {score}
              </div>
              
              {/* Delta chip */}
              <div className={cn(
                "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium",
                delta.positive ? "chip-positive" : "chip-attention"
              )}>
                <TrendingUp className={cn("h-3 w-3", !delta.positive && "rotate-180")} />
                {delta.positive ? '+' : ''}{delta.value}%
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleViewDetails}
              className="btn-primary px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              View Details
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleBreakdown}
              className="px-6 py-3 bg-foreground/5 border border-foreground/10 text-foreground rounded-lg font-medium hover:bg-foreground/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai-teal-500/70 focus-visible:ring-offset-2"
            >
              Breakdown
            </button>
          </div>
        </div>

        {/* Right section - sparkline */}
        {sparklineData && (
          <div className="w-[200px] bg-panel-elevated/30 rounded-lg p-4 flex items-center justify-center">
            <SparklineChart data={sparklineData} />
          </div>
        )}
      </div>
    </div>
  )
}

// Simple sparkline visualization
function SparklineChart({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 160
  const height = 60
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="text-ai-teal-300">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={points}
        className="opacity-60"
      />
      {/* Gradient fill */}
      <defs>
        <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        fill="url(#sparkline-gradient)"
        points={`${points} ${width},${height} 0,${height}`}
      />
    </svg>
  )
}