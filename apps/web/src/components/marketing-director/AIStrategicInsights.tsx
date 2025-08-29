interface AIStrategicInsightsProps {
  opportunities?: any[];
  onPursueOpportunity?: (opportunityId: string) => void;
}

export function AIStrategicInsights({ opportunities, onPursueOpportunity }: AIStrategicInsightsProps) {
  return (
    <div className="bg-surface rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-text-primary">AI Strategic Insights</h3>
      <p className="text-text-secondary">Market opportunities with urgency scoring.</p>
      
      {opportunities && opportunities.length > 0 && (
        <div className="mt-4 space-y-3">
          {opportunities.map((opp, index) => (
            <div key={opp.id || index} className="p-3 bg-ai-teal/10 rounded-lg">
              <h4 className="font-semibold text-ai-teal text-sm">{opp.title}</h4>
              <p className="text-xs text-text-secondary">{opp.projectedImpact}</p>
              {onPursueOpportunity && (
                <button 
                  onClick={() => onPursueOpportunity(opp.id)}
                  className="mt-2 px-3 py-1 bg-ai-teal text-white rounded text-xs hover:bg-ai-teal/80"
                >
                  Pursue
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}