import { ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { trackFlow } from '../../services/analyticsService'

interface RightRailTileProps {
  icon: LucideIcon
  title: string
  value: string | number
  subtitle?: string
  progress?: {
    value: number
    max: number
    label?: string
  }
  status?: 'normal' | 'warning' | 'critical'
  href?: string
}

export function RightRailTile({
  icon: Icon,
  title,
  value,
  subtitle,
  progress,
  status = 'normal',
  href
}: RightRailTileProps) {
  const handleClick = () => {
    if (href) {
      trackFlow.start('ops_rail_clicked', 'dashboard', {
        tile: title,
        value: String(value),
        has_progress: !!progress,
        status
      })
      window.location.href = href
    }
  }

  const Component = href ? 'button' : 'div'
  const progressPercent = progress ? (progress.value / progress.max) * 100 : 0

  return (
    <Component
      onClick={href ? handleClick : undefined}
      className={cn(
        "glass-card p-4 w-full text-left transition-all",
        href && "hover:bg-foreground/5 cursor-pointer group"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={cn(
            "h-4 w-4",
            status === 'warning' ? "text-premium" :
            status === 'critical' ? "text-danger" :
            "text-ai"
          )} />
          <h3 className="font-medium text-foreground">{title}</h3>
        </div>
        {href && (
          <ArrowUpRight className="h-4 w-4 text-foreground/40 group-hover:text-ai transition-colors" />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className={cn(
            "text-2xl font-bold",
            status === 'warning' ? "text-premium" :
            status === 'critical' ? "text-danger" :
            "text-foreground"
          )}>
            {value}
          </span>
          {subtitle && (
            <span className="text-xs text-foreground/50">{subtitle}</span>
          )}
        </div>

        {progress && (
          <div className="space-y-1">
            <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  progressPercent > 80 ? "bg-premium" :
                  progressPercent > 60 ? "bg-ai" :
                  "bg-ai"
                )}
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            {progress.label && (
              <div className="text-xs text-foreground/50 text-right">
                {progress.label}
              </div>
            )}
          </div>
        )}
      </div>
    </Component>
  )
}