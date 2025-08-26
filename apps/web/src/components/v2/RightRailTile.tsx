import { cn } from '../../lib/utils'

interface RightRailTileProps {
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function RightRailTile({ 
  title, 
  subtitle, 
  icon: Icon, 
  badge, 
  action, 
  children,
  className 
}: RightRailTileProps) {
  return (
    <div
      className={cn(
        "bg-[hsl(var(--glass-fill))] backdrop-blur-md border border-[hsl(var(--glass-stroke))] rounded-2xl shadow-glass p-6",
        className
      )}
      data-surface="content"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {Icon && <Icon className="h-5 w-5 text-ai-teal-300 flex-shrink-0" />}
            <h3 className="text-lg font-semibold text-foreground truncate">{title}</h3>
            {badge && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-ai-teal-300/10 text-ai-teal-300 border border-ai-teal-300/30 flex-shrink-0">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-foreground/60">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="ml-4 flex-shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  )
}