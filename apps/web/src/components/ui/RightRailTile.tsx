import { cn } from '../../lib/utils'
import { ChevronRight, ArrowUpRight } from 'lucide-react'

interface RightRailTileProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'primary' | 'ghost'
  }
  badge?: {
    text: string
    color?: 'teal' | 'gold' | 'success' | 'warning' | 'danger'
  }
  className?: string
}

export function RightRailTile({
  title,
  subtitle,
  children,
  action,
  badge,
  className
}: RightRailTileProps) {
  const badgeColors = {
    teal: 'text-ai bg-ai border-ai',
    gold: 'text-premium bg-premium border-premium',
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    danger: 'text-danger bg-danger/10 border-danger/20'
  }

  const actionVariants = {
    default: 'px-3 py-1.5 text-sm text-foreground/80 hover:text-foreground hover:bg-surface/5 rounded transition-all',
    primary: 'px-3 py-1.5 text-sm bg-[var(--bg-ai)] text-white rounded hover:opacity-95 transition-opacity',
    ghost: 'p-1.5 text-foreground/60 hover:text-foreground hover:bg-surface/5 rounded transition-all'
  }

  return (
    <div className={cn("glass-card p-4 space-y-4", className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {badge && (
              <span className={cn(
                "px-2 py-0.5 rounded text-xs font-medium border",
                badgeColors[badge.color || 'teal']
              )}>
                {badge.text}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-foreground/60">{subtitle}</p>
          )}
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              actionVariants[action.variant || 'default'],
              "focus:outline-2 focus:outline-ai-teal-500 focus:outline-offset-2 flex items-center gap-1"
            )}
          >
            {action.variant === 'ghost' ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <>
                {action.label}
                <ChevronRight className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  )
}