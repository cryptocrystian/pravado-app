import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

interface SectionCardProps {
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionCard({
  title,
  subtitle,
  icon: Icon,
  badge,
  action,
  children,
  className
}: SectionCardProps) {
  return (
    <div 
      className={cn(
        "bg-panel shadow-card rounded-2xl p-6 md:p-8 border border-border",
        className
      )}
      data-surface="content"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-6 w-6 text-brand" />}
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {subtitle && (
              <p className="text-sm text-foreground/60 mt-1">{subtitle}</p>
            )}
          </div>
          {badge && (
            <span className="chip-success">{badge}</span>
          )}
        </div>
        {action && (
          <div className="flex items-center gap-2">
            {action}
          </div>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}