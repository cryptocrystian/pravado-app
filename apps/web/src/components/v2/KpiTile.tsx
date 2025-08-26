import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../lib/utils'

interface KpiTileProps {
  title: string
  value: string | number
  delta?: {
    value: string
    positive: boolean
  }
  trend?: number[]
  unit?: string
  subtitle?: string
  className?: string
}

export function KpiTile({ 
  title, 
  value, 
  delta, 
  trend, 
  unit, 
  subtitle,
  className 
}: KpiTileProps) {
  return (
    <div
      className={cn(
        "bg-[hsl(var(--glass-fill))] backdrop-blur-md border border-[hsl(var(--glass-stroke))] rounded-2xl shadow-glass p-6",
        "hover:shadow-glass-hover transition-all duration-200",
        className
      )}
    >
      <div className="space-y-4">
        {/* Header */}
        <div>
          <div className="text-sm text-foreground/60 font-medium">{title}</div>
          {subtitle && (
            <div className="text-xs text-foreground/40 mt-1">{subtitle}</div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-ai-teal-300">{value}</span>
            {unit && <span className="text-sm text-foreground/60">{unit}</span>}
          </div>
          
          {/* Delta */}
          {delta && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
              delta.positive 
                ? "text-ai-teal-300 bg-ai-teal-300/10 border border-ai-teal-300/30" 
                : "text-red-400 bg-red-400/10 border border-red-400/30"
            )}>
              {delta.positive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {delta.value}
            </div>
          )}
        </div>

        {/* Trend sparkline */}
        {trend && trend.length > 0 && (
          <div className="flex items-end gap-1 h-8">
            {trend.map((point, index) => {
              const height = Math.max((point / Math.max(...trend)) * 32, 4)
              return (
                <div
                  key={index}
                  className="bg-ai-teal-300/50 rounded-sm flex-1 transition-all"
                  style={{ height: `${height}px` }}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}