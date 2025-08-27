import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { trackFlow } from '../../services/analyticsService'

interface QuickActionCardProps {
  icon: LucideIcon
  label: string
  description: string
  href: string
  accentColor?: 'teal' | 'gold'
}

export function QuickActionCard({
  icon: Icon,
  label,
  description,
  href,
  accentColor = 'teal'
}: QuickActionCardProps) {
  const handleClick = () => {
    trackFlow.start('quick_action_clicked', 'dashboard', {
      action: label,
      href,
      accent: accentColor
    })
    window.location.href = href
  }

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-3 rounded-lg",
          accentColor === 'teal' ? "bg-ai" : "bg-premium"
        )}>
          <Icon className={cn(
            "h-6 w-6",
            accentColor === 'teal' ? "text-ai" : "text-premium"
          )} />
        </div>
      </div>

      <h3 className="font-semibold text-foreground mb-2">{label}</h3>
      <p className="text-sm text-foreground/60 mb-4 flex-1">{description}</p>

      <button
        onClick={handleClick}
        className="btn-primary w-full py-2 rounded-lg font-medium"
      >
        Start
      </button>
    </div>
  )
}