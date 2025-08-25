import { TrendingUp, ArrowRight, Activity, Clock, Users, Target } from 'lucide-react'
import { cn } from '../../lib/utils'
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
}

// Mini sparkline component
function MiniSparkline({ data }: { data: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    canvas.width = 80
    canvas.height = 20
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, 'hsl(170, 72%, 45%)')
    gradient.addColorStop(1, 'hsl(40, 92%, 52%)')
    
    // Draw sparkline
    ctx.strokeStyle = gradient
    ctx.lineWidth = 1.5
    ctx.lineCap = 'round'
    
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    
    ctx.beginPath()
    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * (canvas.width - 4) + 2
      const y = canvas.height - 2 - ((value - min) / range) * (canvas.height - 4)
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
  }, [data])

  return <canvas ref={canvasRef} className="w-20 h-5" />
}

// Mini-KPI component for right panel
function MiniKPI({ 
  icon: Icon, 
  label, 
  value, 
  color = 'teal',
  progress,
  onClick 
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color?: 'teal' | 'gold' | 'neutral'
  progress: number
  onClick?: () => void
}) {
  const colorClasses = {
    teal: 'bg-ai-teal-500',
    gold: 'bg-ai-gold-500', 
    neutral: 'bg-foreground/30'
  }

  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all",
        onClick && "hover:bg-white/5 cursor-pointer focus:outline-2 focus:outline-ai-teal-500"
      )}
    >
      <Icon className="h-4 w-4 text-foreground/70" />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-foreground/60 mb-1">{label}</div>
        <div className="text-sm font-semibold text-foreground">{value}</div>
      </div>
      <div className="w-16">
        <div className="h-1 bg-foreground/10 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", colorClasses[color])}
            style={{ width: `${progress}%` }}
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
  onBreakdown
}: KPIHeroProps) {
  return (
    <div className="glass-card p-8">
      <div className="grid grid-cols-12 gap-8">
        {/* Left (span 7): Score, delta, sparkline, CTAs */}
        <div className="col-span-12 lg:col-span-7">
          <div className="space-y-6">
            {/* Score and delta */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-4">
                <span 
                  className="text-7xl leading-none font-metric text-ai-teal-300"
                  aria-label={`Score: ${score}`}
                >
                  {score}
                </span>
                <span className={cn(
                  "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium",
                  delta.positive 
                    ? "text-ai-teal-300 bg-ai-teal-300/10 ring-1 ring-ai-teal-300/20" 
                    : "text-ai-gold-500 bg-ai-gold-500/10 ring-1 ring-ai-gold-500/20"
                )}>
                  {delta.positive ? '▲' : '▼'} {delta.value}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground/60 uppercase tracking-wider">
                {label}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/60" />

            {/* Mini sparkline area */}
            <div className="bg-panel-elevated rounded-md px-3 py-2 w-fit">
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground/60">7-day trend</span>
                <MiniSparkline data={sparklineData} />
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onViewDetails}
                className="bg-[var(--brand-grad)] text-white rounded-lg px-5 py-2.5 font-medium text-sm hover:opacity-95 transition-opacity focus:outline-2 focus:outline-ai-teal-500 focus:outline-offset-2"
              >
                View Details
                <ArrowRight className="inline ml-2 h-4 w-4" />
              </button>
              <button
                onClick={onBreakdown}
                className="px-4 py-2.5 rounded-lg font-medium text-sm text-foreground/80 hover:text-foreground hover:bg-white/5 transition-all focus:outline-2 focus:outline-ai-teal-500 focus:outline-offset-2"
              >
                Breakdown
              </button>
            </div>
          </div>
        </div>

        {/* Right (span 5): Four stacked mini-KPIs */}
        <div className="col-span-12 lg:col-span-5">
          <div className="space-y-2">
            <MiniKPI
              icon={Activity}
              label="Coverage"
              value="76%"
              color="teal"
              progress={76}
              onClick={() => console.log('Coverage clicked')}
            />
            <MiniKPI
              icon={Target}
              label="Authority"
              value="84%"
              color="gold"
              progress={84}
              onClick={() => console.log('Authority clicked')}
            />
            <MiniKPI
              icon={Clock}
              label="Time-to-Citation"
              value="2.4 days"
              color="neutral"
              progress={65}
              onClick={() => console.log('Time-to-Citation clicked')}
            />
            <MiniKPI
              icon={Users}
              label="Cadence"
              value="3.2/week"
              color="teal"
              progress={80}
              onClick={() => console.log('Cadence clicked')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}