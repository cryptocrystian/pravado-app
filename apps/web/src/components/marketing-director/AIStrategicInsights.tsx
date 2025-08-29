import { Brain, Clock, TrendingUp, ArrowRight } from 'lucide-react'

interface StrategicOpportunity {
  id: string
  title: string
  description: string
  urgency: 'high' | 'medium' | 'low'
  timeline: string
  projectedImpact: string
}

interface AIStrategicInsightsProps {
  opportunities: StrategicOpportunity[]
  onPursueOpportunity: (opportunityId: string) => void
}

export function AIStrategicInsights({ opportunities, onPursueOpportunity }: AIStrategicInsightsProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-danger border-danger/30 bg-danger/10'
      case 'medium': return 'text-warning border-warning/30 bg-warning/10'
      case 'low': return 'text-success border-success/30 bg-success/10'
      default: return 'text-text-dark/60 border-text-dark/20 bg-text-dark/5'
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return '🔥'
      case 'medium': return '⚡'
      case 'low': return '💡'
      default: return '📊'
    }
  }

  return (
    <div 
      className="bg-surface-dark rounded-2xl p-6 border border-primary/20 h-full" 
      data-testid=\"ai-strategic-insights\"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-ai/10 p-2 rounded-lg">
          <Brain className="w-6 h-6 text-ai" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-text-dark">AI Strategic Insights</h3>
          <p className="text-sm text-text-dark/60">Market opportunities</p>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {opportunities.map((opportunity, index) => (
          <div 
            key={opportunity.id}
            className="bg-bg-dark/30 rounded-xl p-4 border border-text-dark/10 hover:border-ai/30 transition-colors duration-200"
          >
            {/* Opportunity Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getUrgencyIcon(opportunity.urgency)}</span>
                <h4 className="text-lg font-semibold text-text-dark">
                  {opportunity.title}
                </h4>
              </div>
              
              <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getUrgencyColor(opportunity.urgency)}`}>
                {opportunity.urgency.toUpperCase()}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-text-dark/80 mb-4 leading-relaxed">
              {opportunity.description}
            </p>

            {/* Timeline and Impact */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-dark/60" />
                <span className="text-sm text-text-dark/70">
                  Timeline: {opportunity.timeline}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm text-success font-medium">
                  Impact
                </span>
              </div>
            </div>

            {/* Projected Impact */}
            <div className="bg-success/10 border border-success/20 rounded-lg p-3 mb-4">
              <p className="text-sm text-success font-medium">
                {opportunity.projectedImpact}
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onPursueOpportunity(opportunity.id)}
              className="w-full bg-ai/10 hover:bg-ai/20 text-ai border border-ai/30 py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              data-testid={`pursue-opportunity-${opportunity.id}`}
            >
              Pursue Opportunity
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* AI Confidence Footer */}
      <div className="mt-6 pt-4 border-t border-text-dark/10">
        <div className="flex items-center justify-between text-xs text-text-dark/60">
          <span>AI Confidence: 87%</span>
          <span>Updated 12 min ago</span>
        </div>
      </div>
    </div>
  )
}
