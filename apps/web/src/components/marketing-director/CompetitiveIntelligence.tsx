interface CompetitiveIntelligenceProps {
  competitiveData?: any;
  onViewCompetitorDetails?: (competitor: any) => void;
}

export function CompetitiveIntelligence({ competitiveData, onViewCompetitorDetails }: CompetitiveIntelligenceProps) {
  return (
    <div className="bg-surface rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-text-primary">Competitive Intelligence</h3>
      <p className="text-text-secondary">Competitor analysis with positioning data.</p>
      
      {competitiveData && (
        <div className="mt-4">
          <div className="text-sm text-text-secondary mb-2">Current Market Position: #{competitiveData.marketPosition?.currentRank || 'N/A'}</div>
          {competitiveData.competitors && competitiveData.competitors.length > 0 && (
            <div className="space-y-2">
              {competitiveData.competitors.map((comp: any, index: number) => (
                <div key={comp.name || index} className="flex justify-between items-center p-2 bg-ai-teal/10 rounded">
                  <span className="text-sm font-medium">{comp.name}</span>
                  <span className="text-sm text-ai-teal">{comp.marketShare}%</span>
                  {onViewCompetitorDetails && (
                    <button 
                      onClick={() => onViewCompetitorDetails(comp)}
                      className="ml-2 px-2 py-1 bg-ai-teal text-white rounded text-xs hover:bg-ai-teal/80"
                    >
                      Details
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}