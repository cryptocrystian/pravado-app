import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Activity, 
  Zap,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { cn, formatNumber, formatChange, getChangeColor } from '@/lib/utils'
import { trackMetricClicked } from '@/lib/analytics'
import type { MetricCardProps } from '@/types'

const iconMap = {
  users: Users,
  'dollar-sign': DollarSign,
  'trending-up': TrendingUp,
  clock: Clock,
  activity: Activity,
  zap: Zap,
}

const changeIconMap = {
  up: ArrowUp,
  down: ArrowDown,
  neutral: Minus,
}

export default function MetricCard({ 
  metric, 
  onClick, 
  className 
}: MetricCardProps) {
  const Icon = iconMap[metric.icon as keyof typeof iconMap] || TrendingUp
  const ChangeIcon = metric.change ? 
    changeIconMap[metric.change.direction] : 
    Minus

  const handleClick = () => {
    trackMetricClicked(metric.id, metric.label)
    onClick?.()
  }

  const formattedValue = typeof metric.value === 'number' ? 
    formatNumber(metric.value, metric.format) : 
    metric.value

  return (
    <div 
      className={cn(
        'metric-card group',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      <div className="card-body">
        {/* Header with icon */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
            {metric.label}
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary-600" />
          </div>
        </div>

        {/* Main value */}
        <div className="metric-value mb-1">
          {formattedValue}
        </div>

        {/* Change indicator */}
        {metric.change && (
          <div className={cn(
            'metric-change',
            getChangeColor(metric.change.direction)
          )}>
            <ChangeIcon className="w-3 h-3 mr-1" />
            <span>
              {formatChange(metric.change.percentage)} 
              {metric.change.value > 0 && ` (+${formatNumber(Math.abs(metric.change.value))})`}
              {metric.change.value < 0 && ` (${formatNumber(metric.change.value)})`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Specialized metric cards
export function KPIGrid({ 
  metrics, 
  onMetricClick 
}: { 
  metrics: Array<any>
  onMetricClick?: (metric: any) => void 
}) {
  if (!metrics.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="card-body space-y-3">
              <div className="flex justify-between items-start">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-8 w-8 bg-gray-200 rounded" />
              </div>
              <div className="h-8 bg-gray-200 rounded w-20" />
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.id}
          metric={metric}
          onClick={() => onMetricClick?.(metric)}
          className="animate-fade-in"
        />
      ))}
    </div>
  )
}