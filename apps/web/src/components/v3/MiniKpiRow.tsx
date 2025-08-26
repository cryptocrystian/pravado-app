import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { trackFlow } from '../../services/analyticsService'

interface MiniKpiRowProps {
  label: string
  value: string | number
  unit?: string
  progress?: number
  onClick?: () => void
}

export function MiniKpiRow({ 
  label, 
  value, 
  unit,
  progress,
  onClick 
}: MiniKpiRowProps) {
  const handleClick = () => {
    if (onClick) {
      trackFlow.engagement('mini_kpi_click', {
        label,
        value: String(value),
        has_progress: !!progress
      })
      onClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={!onClick}
      className={cn(
        "w-full p-3 bg-foreground/3 border border-foreground/5 rounded-lg transition-all text-left group",
        onClick && "hover:bg-foreground/5 hover:border-ai-teal-500/30 cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-foreground/70">{label}</span>
        {onClick && (
          <ArrowRight className="h-3 w-3 text-ai-teal-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold text-foreground">
          {value}{unit && <span className="text-sm text-foreground/50 ml-1">{unit}</span>}
        </div>
        
        {progress !== undefined && (
          <div className="flex-1 h-1.5 bg-foreground/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-ai-teal-500 to-ai-gold-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>
    </button>
  )
}