import { TrendingUp, ArrowRight, MoreHorizontal } from 'lucide-react'
import { cn } from '../lib/utils'

interface KPIHeroProps {
  score: number
  label: string
  delta: {
    value: string
    positive: boolean
  }
  sparklineData: number[]
  onViewDetails?: () => void
  onBreakdown?: () => void
}

// Simple sparkline component
function Sparkline({ data, className }: { data: number[], className?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  return (
    <div className="bg-panel-elevated p-2 rounded">
      <svg className={cn("w-20 h-10 sparkline", className)} viewBox="0 0 80 40" aria-hidden="true">
        <polyline
          points={data
            .map((value, index) => {
              const x = (index / (data.length - 1)) * 76 + 2
              const y = 36 - ((value - min) / range) * 32
              return `${x},${y}`
            })
            .join(' ')}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-brand"
        />
      </svg>
    </div>
  )
}

export function KPIHero({
  score,
  label,
  delta,
  sparklineData,
  onViewDetails,
  onBreakdown
}: KPIHeroProps) {
  return (
    <div 
      className="bg-panel shadow-card rounded-2xl p-8 md:p-10 border border-border" 
      data-surface="content"
      data-testid="kpi-hero"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Big score and label */}
        <div className="lg:col-span-4">
          <div className="space-y-2">
            <div className="flex items-baseline gap-4">
              <span 
                className="text-6xl md:text-7xl font-metric text-brand leading-none"
                aria-label={`Score: ${score}`}
              >
                {score}
              </span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className={cn(
                  "text-sm font-medium px-2 py-1 rounded",
                  delta.positive ? "chip-success" : "chip-danger"
                )}>
                  {delta.positive ? '▲' : '▼'} {delta.value}
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-foreground/80">{label}</p>
          </div>
        </div>

        {/* Center/Right: Sparkline and actions */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">
                  7-Day Trend
                </p>
                <Sparkline data={sparklineData} />
              </div>
              <div className="text-xs text-foreground/60 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand rounded-full"></div>
                  <span>Performance Index</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onBreakdown}
                className="btn-ghost"
                aria-label="View breakdown details"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Breakdown</span>
              </button>
              <button
                onClick={onViewDetails}
                className="btn-primary"
                aria-label="View detailed analytics"
              >
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}