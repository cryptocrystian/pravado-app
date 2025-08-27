import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { SEOMover } from '../types'

interface SEOMoversProps {
  movers: SEOMover[]
}

export function SEOMovers({ movers }: SEOMoversProps) {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-lg p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          SEO Movers
        </h3>
      </div>
      
      <div className="space-y-3">
        {movers.map((mover) => {
          const isImproving = mover.change < 0 // Lower rank number is better
          const Icon = isImproving ? TrendingUp : TrendingDown
          const changeColor = isImproving ? 'text-success' : 'text-danger'
          
          return (
            <div key={mover.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Icon className={`w-4 h-4 ${changeColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark truncate">
                  {mover.keyword}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">#{mover.previousRank}</span>
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                  <span className={`text-xs font-medium ${changeColor}`}>#{mover.currentRank}</span>
                  <span className="text-xs text-gray-500">
                    ({mover.searchVolume.toLocaleString()} searches)
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}