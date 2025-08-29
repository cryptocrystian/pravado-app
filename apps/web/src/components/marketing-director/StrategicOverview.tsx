interface StrategicOverviewProps {
  recommendation?: any;
  budget?: any;
  onApproveReallocation?: (details: any) => void;
  onViewAnalysis?: () => void;
}

export function StrategicOverview({ recommendation, budget, onApproveReallocation, onViewAnalysis }: StrategicOverviewProps) {
  return (
    <div className="bg-surface rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-text-primary">Strategic Overview</h2>
      <p className="text-text-secondary mb-4">AI-driven strategic recommendations for executive decision-making.</p>
      
      {recommendation && (
        <div className="p-4 bg-ai-teal/10 rounded-lg">
          <h3 className="font-semibold text-ai-teal mb-2">{recommendation.title}</h3>
          <p className="text-sm text-text-secondary">{recommendation.description}</p>
          {onApproveReallocation && (
            <button 
              onClick={() => onApproveReallocation(recommendation)}
              className="mt-3 px-4 py-2 bg-ai-teal text-white rounded-lg hover:bg-ai-teal/80"
            >
              Approve Reallocation
            </button>
          )}
        </div>
      )}
    </div>
  )
}