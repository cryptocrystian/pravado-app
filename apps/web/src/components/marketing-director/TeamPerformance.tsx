interface TeamPerformanceProps {
  performance?: any;
  onViewTeamDetails?: () => void;
}

export function TeamPerformance({ performance, onViewTeamDetails }: TeamPerformanceProps) {
  return (
    <div className="bg-surface rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-text-primary">Team Performance</h3>
      <p className="text-text-secondary">Productivity metrics with bottleneck analysis.</p>
      
      {performance && (
        <div className="mt-4">
          <div className="text-2xl font-bold text-ai-teal">{performance.overallProductivity}%</div>
          <div className="text-sm text-text-secondary">Overall Productivity</div>
          {onViewTeamDetails && (
            <button 
              onClick={onViewTeamDetails}
              className="mt-3 px-4 py-2 bg-ai-teal text-white rounded-lg hover:bg-ai-teal/80 text-sm"
            >
              View Details
            </button>
          )}
        </div>
      )}
    </div>
  )
}