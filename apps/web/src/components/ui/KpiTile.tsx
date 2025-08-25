import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../lib/utils'

interface KpiTileProps {
  title: string
  value: string | number
  subtitle?: string
  delta?: {
    value: string
    positive: boolean
    label?: string
  }
  icon?: React.ComponentType<{ className?: string }>
  color?: 'teal' | 'gold' | 'neutral' | 'success' | 'warning' | 'danger'
  onClick?: () => void
  className?: string
}

export function KpiTile({
  title,
  value,
  subtitle,
  delta,
  icon: Icon,
  color = 'neutral',
  onClick,
  className
}: KpiTileProps) {
  const colorClasses = {
    teal: 'text-ai-teal-300 border-ai-teal-300/20',
    gold: 'text-ai-gold-500 border-ai-gold-500/20',
    neutral: 'text-foreground border-border',
    success: 'text-success border-success/20',
    warning: 'text-warning border-warning/20',
    danger: 'text-danger border-danger/20'
  }

  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={cn(
        "glass-card p-6 space-y-4 transition-all",
        onClick && "hover:scale-[1.02] cursor-pointer focus:outline-2 focus:outline-ai-teal-500 focus:outline-offset-2",
        className
      )}
    >
      {/* Header with icon and title */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-foreground/60">{title}</h3>
          {subtitle && (
            <p className="text-xs text-foreground/40">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <Icon className={cn("h-5 w-5", colorClasses[color].split(' ')[0])} />
        )}
      </div>

      {/* Value */}
      <div className="space-y-2">
        <div className={cn(
          "text-3xl font-bold",
          colorClasses[color].split(' ')[0]
        )}>
          {value}
        </div>

        {/* Delta indicator */}
        {delta && (
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
              delta.positive
                ? "text-ai-teal-300 bg-ai-teal-300/10 border border-ai-teal-300/20"
                : "text-ai-gold-500 bg-ai-gold-500/10 border border-ai-gold-500/20"
            )}>
              {delta.positive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {delta.value}
            </div>
            {delta.label && (
              <span className="text-xs text-foreground/40">{delta.label}</span>
            )}
          </div>
        )}
      </div>
    </Component>
  )
}