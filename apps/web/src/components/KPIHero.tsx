import { TrendingUp, ArrowRight, Activity, Clock, Calendar } from 'lucide-react'
import { cn } from '../lib/utils'
import { useEffect, useRef } from 'react'

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
  miniStats?: {
    coverage: number
    authority: number
    timeToCitation: string
    cadence: string
  }
}

// Enhanced sparkline component with gradient
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
    
    // Set canvas size
    canvas.width = 120
    canvas.height = 40
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, 'hsl(170, 72%, 45%)')
    gradient.addColorStop(1, 'hsl(170, 76%, 38%)')
    
    // Draw sparkline
    ctx.strokeStyle = gradient
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    ctx.beginPath()
    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * (canvas.width - 10) + 5
      const y = canvas.height - 5 - ((value - min) / range) * (canvas.height - 10)
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
  }, [data, min, max, range])

  return (
    <div className="bg-panel-elevated/50 p-2 rounded-lg">
      <canvas ref={canvasRef} className={cn("w-[120px] h-[40px]", className)} />
    </div>
  )
}

// Mini stat component
function MiniStat({ 
  icon: Icon, 
  label, 
  value, 
  color = 'teal',
  link
}: { 
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  color?: 'teal' | 'gold' | 'neutral'
  link?: string
}) {
  const Component = link ? 'a' : 'div'
  const colorClasses = {
    teal: 'text-ai-teal-500 bg-ai-teal-500/10',
    gold: 'text-ai-gold-500 bg-ai-gold-500/10',
    neutral: 'text-foreground/60 bg-foreground/5'
  }

  return (
    <Component
      href={link}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all",
        link && "hover:bg-white/5 cursor-pointer"
      )}
    >
      <div className={cn("p-2 rounded-lg", colorClasses[color])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="text-xs text-foreground/60">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
      <div className="w-full max-w-[60px]">
        <div className="h-1 bg-foreground/10 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              color === 'teal' && "bg-ai-teal-500",
              color === 'gold' && "bg-ai-gold-500",
              color === 'neutral' && "bg-foreground/30"
            )}
            style={{ width: typeof value === 'number' ? `${value}%` : '50%' }}
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
    <div 
      className="glass-card" 
      data-testid="kpi-hero"
    >
      <div className="grid grid-cols-12 gap-6 p-8">
        {/* Span 7: Big score with delta and sparkline */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-panel-elevated/30 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-baseline gap-4 mb-2">
                  <span 
                    className="text-7xl font-metric text-ai-teal-300 leading-none tracking-tight"
                    aria-label={`Score: ${score}`}
                  >
                    {score}
                  </span>
                  <span className={cn(
                    "inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full",
                    delta.positive 
                      ? "bg-ai-teal-600/15 text-ai-teal-300 border border-ai-teal-600/30" 
                      : "bg-ai-gold-600/15 text-ai-gold-300 border border-ai-gold-600/30"
                  )}>
                    {delta.positive ? '▲' : '▼'} {delta.value}
                  </span>
                </div>
                <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider mb-4">
                  {label}
                </p>
              </div>
              <Sparkline data={sparklineData} />
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-border/50">
              <button
                onClick={onViewDetails}
                className="flex-1 bg-[linear-gradient(90deg,hsl(var(--ai-teal-600)),hsl(var(--ai-gold-600)))] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai-teal-500 focus-visible:ring-offset-2"
                aria-label="View detailed analytics"
              >
                View details
                <ArrowRight className="inline ml-2 h-4 w-4" />
              </button>
              <button
                onClick={onBreakdown}
                className="px-4 py-2.5 rounded-lg font-medium text-sm text-foreground/80 hover:text-foreground hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai-teal-500 focus-visible:ring-offset-2"
                aria-label="View breakdown details"
              >
                Breakdown
              </button>
            </div>
          </div>
        </div>

        {/* Span 5: Four stacked mini-stats */}
        <div className="col-span-12 lg:col-span-5">
          <div className="h-full flex flex-col justify-center space-y-2">
            <MiniStat 
              icon={Activity} 
              label="Coverage" 
              value={miniStats.coverage}
              color="teal"
              link="#coverage"
            />
            <MiniStat 
              icon={TrendingUp} 
              label="Authority Index" 
              value={miniStats.authority}
              color="gold"
              link="#authority"
            />
            <MiniStat 
              icon={Clock} 
              label="Time-to-Citation" 
              value={miniStats.timeToCitation}
              color="neutral"
              link="#citation"
            />
            <MiniStat 
              icon={Calendar} 
              label="Publishing Cadence" 
              value={miniStats.cadence}
              color="teal"
              link="#cadence"
            />
          </div>
        </div>
      </div>
    </div>
  )
}