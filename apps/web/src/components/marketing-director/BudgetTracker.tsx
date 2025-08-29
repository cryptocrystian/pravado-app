import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

interface BudgetData {
  allocated: number
  remaining: number
  utilization: number
  topPerformer: { pillar: string; roi: number }
  underperformer: { pillar: string; roi: number }
  monthlyBurn: number
}

interface BudgetTrackerProps {
  budget: BudgetData
  onReallocateBudget: () => void
}

export function BudgetTracker({ budget, onReallocateBudget }: BudgetTrackerProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`
    }
    return `$${amount}`
  }

  const spent = budget.allocated - budget.remaining
  const utilizationPercentage = (spent / budget.allocated) * 100

  return (
    <div 
      className="bg-surface-dark rounded-2xl p-6 border border-primary/20" 
      data-testid=\"budget-tracker\"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-success" />
          <h3 className="text-xl font-semibold text-text-dark">Budget Tracker</h3>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-text-dark">
            {formatCurrency(budget.remaining)}
          </div>
          <div className="text-sm text-text-dark/60">
            of {formatCurrency(budget.allocated)} remaining
          </div>
        </div>
      </div>

      {/* Budget Utilization Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-text-dark/70">Budget Utilization</span>
          <span className="text-sm font-medium text-text-dark">
            {utilizationPercentage.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-bg-dark/50 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              utilizationPercentage > 85 ? 'bg-danger' : 
              utilizationPercentage > 70 ? 'bg-warning' : 'bg-success'
            }`}
            style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Top Performer */}
        <div className="bg-bg-dark/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">Top Performer</span>
          </div>
          <div className="text-lg font-bold text-text-dark">
            {budget.topPerformer.pillar}
          </div>
          <div className="text-2xl font-bold text-success">
            {budget.topPerformer.roi}% ROI
          </div>
        </div>

        {/* Underperformer */}
        <div className="bg-bg-dark/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-danger" />
            <span className="text-sm text-danger font-medium">Needs Attention</span>
          </div>
          <div className="text-lg font-bold text-text-dark">
            {budget.underperformer.pillar}
          </div>
          <div className="text-2xl font-bold text-danger">
            {budget.underperformer.roi}% ROI
          </div>
        </div>
      </div>

      {/* Monthly Burn Rate */}
      <div className="bg-bg-dark/30 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-ai" />
            <span className="text-sm text-text-dark/70">Monthly Burn Rate</span>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-text-dark">
              {formatCurrency(budget.monthlyBurn)}
            </div>
            <div className="text-xs text-text-dark/60">
              {Math.ceil(budget.remaining / budget.monthlyBurn)} months remaining
            </div>
          </div>
        </div>
      </div>

      {/* Reallocation Alert */}
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="bg-warning/20 p-2 rounded-lg">
            <TrendingUp className="w-4 h-4 text-warning" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-warning mb-1">
              Optimization Opportunity
            </h4>
            <p className="text-xs text-text-dark/70">
              Consider reallocating {formatCurrency(3200)} from {budget.underperformer.pillar} to {budget.topPerformer.pillar} 
              for potential {formatCurrency(47000)} additional ROI.
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onReallocateBudget}
        className="w-full bg-success hover:bg-success/90 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200"
        data-testid=\"reallocate-budget\"
      >
        Reallocate Budget
      </button>
    </div>
  )
}
