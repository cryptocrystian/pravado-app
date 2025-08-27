import { ArrowRight, Activity, Clock, Calendar, BarChart3 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useEffect, useRef } from 'react'
import { GlassCard } from './GlassCard'
import { trackFlow, FLOWS } from '../../services/analyticsService'

interface KPIHeroProps {
  score: number;
  label: string;
  delta: {
    value: string;
    positive: boolean;
  };
  sparklineData: number[];
  onViewDetails?: () => void;
  onBreakdown?: () => void;
  miniStats?: {
    coverage: number;
    authority: number;
    timeToCitation: string;
    cadence: string;
  };
}

// Enhanced sparkline with brand gradient
function Sparkline({ data, className }: { data: number[], className?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = 140
    canvas.height = 48
    
    // Create brand gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, 'hsl(170, 72%, 45%)')  // ai-teal-500
    gradient.addColorStop(1, 'hsl(170, 76%, 38%)')  // ai-teal-600
    
    // Enhanced sparkline styling
    ctx.strokeStyle = gradient
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowColor = 'hsl(170, 72%, 45%)'
    ctx.shadowBlur = 4
    
    ctx.beginPath()
    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * (canvas.width - 12) + 6
      const y = canvas.height - 6 - ((value - min) / range) * (canvas.height - 12)
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
    
    // Add end point highlight
    const lastX = ((data.length - 1) / (data.length - 1)) * (canvas.width - 12) + 6
    const lastY = canvas.height - 6 - ((data[data.length - 1] - min) / range) * (canvas.height - 12)
    ctx.beginPath()
    ctx.arc(lastX, lastY, 4, 0, 2 * Math.PI)
    ctx.fillStyle = 'hsl(170, 72%, 45%)'
    ctx.fill()
  }, [data, min, max, range])

  return (
    <div className="bg-surface/5 backdrop-blur-sm border border-white/10 p-3 rounded-lg">
      <canvas 
        ref={canvasRef} 
        className={cn("w-[140px] h-[48px]", className)}
        aria-label="Performance trend sparkline"
      />
    </div>
  )
}

// Mini KPI tile component
function MiniKpiTile({ 
  icon: Icon, 
  label, 
  value, 
  progress = 50,
  color = 'teal',
  onClick
}: { 
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  progress?: number
  color?: 'teal' | 'gold' | 'neutral'
  onClick?: () => void
}) {
  const colorClasses = {
    teal: {
      icon: 'text-ai bg-ai',
      progress: 'bg-ai'
    },
    gold: {
      icon: 'text-premium bg-premium', 
      progress: 'bg-premium'
    },
    neutral: {
      icon: 'text-foreground/60 bg-foreground/5',
      progress: 'bg-foreground/30'
    }
  }

  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={() => {
        if (onClick) {
          // Track mini KPI interaction
          trackFlow.phase3('kpi_hero', 'mini_kpi_click', {
            label,
            value: typeof value === 'string' ? value : String(value),
            progress,
            color
          });
          onClick();
        }
      }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl transition-all bg-surface/5 backdrop-blur-sm border border-white/10",
        onClick && "hover:bg-surface/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2"
      )}
    >
      <div className={cn("p-2.5 rounded-lg", colorClasses[color].icon)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-foreground/60 mb-1">{label}</div>
        <div className="text-sm font-semibold text-foreground mb-2">{value}</div>
        <div className="w-full h-1 bg-surface/10 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", colorClasses[color].progress)}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>
    </Component>
  )
}

export function KPIHero({
  score,
  label,
  delta,
  sparklineData,
  onViewDetails,
  onBreakdown,
  miniStats = {
    coverage: 76,
    authority: 84,
    timeToCitation: '2.4 days',
    cadence: '3.2/week'
  }
}: KPIHeroProps) {
  return (
    <GlassCard className="p-0" data-testid="kpi-hero">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-8">
        {/* Left: Big score with sparkline and CTA (span 7) */}
        <div className="lg:col-span-7">
          <div className="bg-ai border border-white/10 rounded-2xl p-6 h-full">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-baseline gap-4 mb-2">
                  <span 
                    className="text-7xl font-bold text-ai leading-none tracking-tight"
                    aria-label={`Score: ${score}`}
                  >
                    {score}
                  </span>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full border",
                    delta.positive 
                      ? "bg-ai text-ai border-ai" 
                      : "bg-premium text-premium border-premium"
                  )}>
                    {delta.positive ? '↗' : '↘'} {delta.value}
                  </span>
                </div>
                <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider mb-6">
                  {label}
                </p>
              </div>
              <Sparkline data={sparklineData} />
            </div>
            
            {/* Brand gradient CTA buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  // Track flow initiation for detailed analytics
                  trackFlow.start(FLOWS.VIEW_DETAILS, 'kpi_hero', {
                    score,
                    label,
                    delta_positive: delta.positive,
                    delta_value: delta.value
                  });
                  trackFlow.critical('kpi_click', {
                    component: 'kpi_hero',
                    action: 'view_details',
                    score
                  });
                  onViewDetails?.();
                }}
                className="flex-1 bg-ai text-white px-6 py-3 rounded-lg font-medium text-sm transition-all hover:opacity-90 hover:transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2"
                aria-label="View detailed analytics"
              >
                View Details
                <ArrowRight className="inline ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  // Track breakdown analysis flow
                  trackFlow.start(FLOWS.BREAKDOWN, 'kpi_hero', {
                    score,
                    breakdown_type: 'kpi_factors'
                  });
                  trackFlow.critical('kpi_click', {
                    component: 'kpi_hero', 
                    action: 'breakdown',
                    score
                  });
                  onBreakdown?.();
                }}
                className="px-6 py-3 rounded-lg font-medium text-sm text-foreground/80 hover:text-foreground hover:bg-surface/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2"
                aria-label="View breakdown details"
              >
                Breakdown
              </button>
            </div>
          </div>
        </div>

        {/* Right: 4 mini-KPI tiles in 2x2 grid (span 5) */}
        <div className="lg:col-span-5">
          <div className="grid grid-cols-1 gap-3 h-full">
            <MiniKpiTile 
              icon={Activity} 
              label="Coverage Score" 
              value={`${miniStats.coverage}%`}
              progress={miniStats.coverage}
              color="teal"
              onClick={() => console.log('Navigate to coverage')}
            />
            <MiniKpiTile 
              icon={BarChart3} 
              label="Authority Index" 
              value={`${miniStats.authority}%`}
              progress={miniStats.authority}
              color="gold"
              onClick={() => console.log('Navigate to authority')}
            />
            <MiniKpiTile 
              icon={Clock} 
              label="Time-" 
              value={miniStats.timeToCitation}
              progress={70}
              color="neutral"
              onClick={() => console.log('Navigate to citation')}
            />
            <MiniKpiTile 
              icon={Calendar} 
              label="Publishing Cadence" 
              value={miniStats.cadence}
              progress={85}
              color="teal"
              onClick={() => console.log('Navigate to cadence')}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  )
}