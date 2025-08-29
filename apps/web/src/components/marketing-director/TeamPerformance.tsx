import { Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

interface TeamBottleneck {
  area: string
  impact: 'high' | 'medium' | 'low'
  solution: string
}

interface TeamPerformanceData {
  overallProductivity: number
  trend: 'up' | 'down' | 'stable'
  monthlyIncrease: number
  bottlenecks: TeamBottleneck[]
}

interface TeamPerformanceProps {
  performance: TeamPerformanceData
  onViewTeamDetails: () => void
}

export function TeamPerformance({ performance, onViewTeamDetails }: TeamPerformanceProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-danger'
      case 'medium': return 'text-warning'
      case 'low': return 'text-success'
      default: return 'text-text-dark/60'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertTriangle className="w-4 h-4" />
      case 'medium': return <AlertTriangle className="w-4 h-4" />
      case 'low': return <CheckCircle className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div 
      className="bg-surface-dark rounded-2xl p-6 border border-primary/20 h-full" 
      data-testid="team-performance"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-ai" />
          <h3 className="text-xl font-semibold text-text-dark">Team Performance</h3>
        </div>
        
        <div className={`flex items-center gap-2 ${
          performance.trend === 'up' ? 'text-success' : 
          performance.trend === 'down' ? 'text-danger' : 'text-text-dark/60'
        }`}>
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">
            {performance.trend === 'up' ? '+' : ''}{performance.monthlyIncrease}%
          </span>
        </div>
      </div>

      {/* Productivity Score - Large Visual Element */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          {/* Circular Progress Background */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-bg-dark/50"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(performance.overallProductivity / 100) * 314} 314`}
              className="text-ai transition-all duration-1000"
            />
          </svg>
          
          {/* Score in Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-text-dark">
                {performance.overallProductivity}%
              </div>
              <div className="text-xs text-text-dark/60">
                vs last month
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-text-dark/70 mt-3">
          Overall team productivity
        </p>
      </div>

      {/* Bottlenecks Analysis */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-text-dark mb-3">Current Bottlenecks</h4>
        <div className="space-y-3">
          {performance.bottlenecks.map((bottleneck, index) => (
            <div 
              key={index}
              className="bg-bg-dark/50 rounded-lg p-3"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-text-dark">
                  {bottleneck.area}
                </span>
                <div className={`flex items-center gap-1 ${getImpactColor(bottleneck.impact)}`}>
                  {getImpactIcon(bottleneck.impact)}
                  <span className="text-xs font-medium capitalize">
                    {bottleneck.impact}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-text-dark/60">
                Solution: {bottleneck.solution}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onViewTeamDetails}
        className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 py-3 px-4 rounded-xl font-medium transition-colors duration-200"
        data-testid="view-team-details"
      >
        View Team Details
      </button>
    </div>
  )
}
