interface BudgetTrackerProps {
  budget?: any;
  onReallocateBudget?: () => void;
}

export function BudgetTracker({ budget, onReallocateBudget }: BudgetTrackerProps) {
  return (
    <div className="bg-surface rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-text-primary">Budget Tracker</h3>
      <p className="text-text-secondary">ROI analysis with reallocation recommendations.</p>
      
      {budget && (
        <div className="mt-4">
          <div className="text-2xl font-bold text-ai-teal">{budget.utilization}%</div>
          <div className="text-sm text-text-secondary">Budget Utilization</div>
          {onReallocateBudget && (
            <button 
              onClick={onReallocateBudget}
              className="mt-3 px-4 py-2 bg-ai-teal text-white rounded-lg hover:bg-ai-teal/80 text-sm"
            >
              Reallocate Budget
            </button>
          )}
        </div>
      )}
    </div>
  )
}