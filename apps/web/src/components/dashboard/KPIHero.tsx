import { TrendingUp, TrendingDown, Eye, BarChart3 } from 'lucide-react'

export function KPIHero() {
  const score = 78
  const delta = "+12%"
  const isPositive = true
  
  // Mock sparkline data points
  const sparklinePoints = [45, 52, 48, 61, 69, 74, 71, 78]
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-ai-teal-300" />
            <h2 className="text-lg font-semibold text-white">AI Visibility Score</h2>
          </div>
          <p className="text-sm text-gray-400">
            Unified metric across PR, Content, and SEO/GEO performance
          </p>
        </div>
        
        {/* Sparkline */}
        <div className="w-24 h-12">
          <svg className="w-full h-full" viewBox="0 0 96 48">
            <polyline
              points={sparklinePoints.map((point, index) => 
                `${(index / (sparklinePoints.length - 1)) * 96},${48 - (point / 100) * 48}`
              ).join(' ')}
              fill="none"
              stroke="hsl(var(--ai-teal-300))"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
          </svg>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        {/* Score Display */}
        <div className="flex items-baseline gap-4">
          <span className="text-5xl font-bold text-ai-teal-300">{score}</span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
            isPositive 
              ? 'chip-delta-up bg-success-500/20' 
              : 'chip-delta-down bg-danger-500/20'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {delta}
          </div>
        </div>
        
        {/* CTAs */}
        <div className="flex gap-3">
          <button className="btn-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            View Details
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium border border-white/20 text-gray-300 hover:bg-white/5 transition-colors">
            Breakdown
          </button>
        </div>
      </div>
    </div>
  )
}