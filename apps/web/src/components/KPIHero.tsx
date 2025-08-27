import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { VisibilityScore } from '../types'

interface KPIHeroProps {
  visibilityScore: VisibilityScore
  sparklineData: Array<{ value: number }>
}

export function KPIHero({ visibilityScore, sparklineData }: KPIHeroProps) {
  const { score, delta = 0 } = visibilityScore
  const isPositive = delta >= 0

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-md border border-border">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Visibility Score
          </h2>
          
          <div className="flex items-baseline space-x-3">
            <div className="text-4xl font-bold text-text-primary dark:text-text-primary-dark">
              {score}
            </div>
            
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
              isPositive 
                ? 'text-success bg-success/10' 
                : 'text-danger bg-danger/10'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(delta)}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            vs. last period
          </p>
        </div>

        {/* Sparkline */}
        <div className="w-32 h-16 ml-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(180, 100%, 33%)" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6">
        <button className="btn-primary">
          View Details
        </button>
        <button className="btn-secondary">
          Breakdown
        </button>
      </div>
    </div>
  )
}