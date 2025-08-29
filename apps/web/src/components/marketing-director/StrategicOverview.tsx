import { TrendingUp, DollarSign, Clock, Target } from 'lucide-react'

interface StrategicRecommendation {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  projectedROI: number
  timeline: string
  details: {
    currentAllocation: { social: number; pr: number }
    proposedAllocation: { social: number; pr: number }
    reasoning: string
  }
}

interface BudgetData {
  allocated: number
  remaining: number
  utilization: number
  topPerformer: { pillar: string; roi: number }
  underperformer: { pillar: string; roi: number }
  monthlyBurn: number
}

interface StrategicOverviewProps {
  recommendation: StrategicRecommendation
  budget: BudgetData
  onApproveReallocation: (details: any) => void
  onViewAnalysis: () => void
}

export function StrategicOverview({ 
  recommendation, 
  budget, 
  onApproveReallocation, 
  onViewAnalysis 
}: StrategicOverviewProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`
    }
    return `$${amount}`
  }

  return (
    <div 
      className="bg-surface-dark rounded-2xl p-8 border border-primary/20 shadow-lg" 
      data-pattern="ai-primary"
      data-testid="strategic-overview"
    >
      {/* AI Recommendation Header - Visual Dominance */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-ai/10 text-ai border border-ai/30 px-3 py-1 rounded-full text-sm font-medium">
            AI Strategic Recommendation
          </div>
          <div className="flex items-center gap-1 text-success">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">{recommendation.confidence}% Confidence</span>
          </div>
        </div>

        {/* Primary Recommendation - 70% of visual weight */}
        <h2 className="text-2xl font-bold text-text-dark mb-4 leading-tight">
          {recommendation.title}
        </h2>
        
        <p className="text-lg text-text-dark/90 mb-6 leading-relaxed">
          {recommendation.description}
        </p>

        {/* Key Impact Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-bg-dark/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-success" />
              <span className="text-sm text-text-dark/70">Projected ROI</span>
            </div>
            <div className="text-2xl font-bold text-success">
              +{formatCurrency(recommendation.projectedROI)}
            </div>
          </div>

          <div className="bg-bg-dark/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-ai" />
              <span className="text-sm text-text-dark/70">Impact Level</span>
            </div>
            <div className="text-2xl font-bold text-ai capitalize">
              {recommendation.impact}
            </div>
          </div>

          <div className="bg-bg-dark/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-warning" />
              <span className="text-sm text-text-dark/70">Timeline</span>
            </div>
            <div className="text-2xl font-bold text-warning">
              {recommendation.timeline}
            </div>
          </div>
        </div>
      </div>

      {/* AI Reasoning - Supporting Context (20% visual weight) */}
      <div className="bg-bg-dark/30 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-text-dark mb-3">AI Analysis:</h3>
        <p className="text-text-dark/80 mb-4 leading-relaxed">
          {recommendation.details.reasoning}
        </p>

        {/* Budget Allocation Visualization */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-text-dark/70 mb-2">Current Allocation</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Social:</span>
                <span className="font-medium">{formatCurrency(recommendation.details.currentAllocation.social)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">PR:</span>
                <span className="font-medium">{formatCurrency(recommendation.details.currentAllocation.pr)}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-dark/70 mb-2">Proposed Allocation</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Social:</span>
                <span className="font-medium text-danger">{formatCurrency(recommendation.details.proposedAllocation.social)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">PR:</span>
                <span className="font-medium text-success">{formatCurrency(recommendation.details.proposedAllocation.pr)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Actions - Primary User Response (10% visual weight) */}
      <div className="flex gap-4">
        <button
          onClick={() => onApproveReallocation(recommendation.details)}
          className="flex-1 bg-success hover:bg-success/90 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 shadow-md"
          data-testid="approve-reallocation"
        >
          Approve Reallocation
        </button>
        
        <button
          onClick={onViewAnalysis}
          className="px-6 py-4 border border-primary/30 text-primary hover:bg-primary/10 rounded-xl font-semibold transition-colors duration-200"
          data-testid="view-analysis"
        >
          View Detailed Analysis
        </button>
      </div>

      {/* Performance Context Bar */}
      <div className="mt-6 pt-6 border-t border-text-dark/10">
        <div className="flex justify-between items-center text-sm text-text-dark/60">
          <span>Current top performer: {budget.topPerformer.pillar} ({budget.topPerformer.roi}% ROI)</span>
          <span>Budget utilization: {budget.utilization}%</span>
          <span>Monthly burn: {formatCurrency(budget.monthlyBurn)}</span>
        </div>
      </div>
    </div>
  )
}
