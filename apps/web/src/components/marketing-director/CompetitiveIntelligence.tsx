import { Target, TrendingUp, TrendingDown, Eye, BarChart3 } from 'lucide-react'

interface Competitor {
  name: string
  marketShare: number
  trend: 'up' | 'down' | 'stable'
  change: number
  keyMoves: string
}

interface MarketPosition {
  currentRank: number
  shareOfVoice: number
  opportunityScore: number
}

interface CompetitiveData {
  competitors: Competitor[]
  marketPosition: MarketPosition
}

interface CompetitiveIntelligenceProps {
  competitiveData: CompetitiveData
  onViewCompetitorDetails: (competitor: string) => void
}

export function CompetitiveIntelligence({ competitiveData, onViewCompetitorDetails }: CompetitiveIntelligenceProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-success" />
      case 'down': return <TrendingDown className="w-4 h-4 text-danger" />
      default: return <BarChart3 className="w-4 h-4 text-text-dark/60" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-success'
      case 'down': return 'text-danger'
      default: return 'text-text-dark/60'
    }
  }

  const getOpportunityColor = (score: number) => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-warning'
    return 'text-danger'
  }

  return (
    <div 
      className="bg-surface-dark rounded-2xl p-6 border border-primary/20" 
      data-testid=\"competitive-intelligence\"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-text-dark">Competitive Intelligence</h3>
            <p className="text-sm text-text-dark/60">Market positioning & opportunities</p>
          </div>
        </div>

        {/* Market Position Summary */}
        <div className="text-right">
          <div className="text-2xl font-bold text-ai">#{competitiveData.marketPosition.currentRank}</div>
          <div className="text-sm text-text-dark/60">Market Position</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Competitor Analysis */}
        <div className="col-span-8">
          <h4 className="text-lg font-semibold text-text-dark mb-4">Competitor Movement</h4>
          
          <div className="space-y-4">
            {competitiveData.competitors.map((competitor, index) => (
              <div 
                key={competitor.name}
                className="bg-bg-dark/30 rounded-xl p-4 border border-text-dark/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                      {competitor.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-semibold text-text-dark">{competitor.name}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-dark/60">
                          {competitor.marketShare.toFixed(1)}% market share
                        </span>
                        <div className={`flex items-center gap-1 ${getTrendColor(competitor.trend)}`}>
                          {getTrendIcon(competitor.trend)}
                          <span className="text-sm font-medium">
                            {competitor.change > 0 ? '+' : ''}{competitor.change.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewCompetitorDetails(competitor.name)}
                    className="p-2 text-text-dark/60 hover:text-ai hover:bg-ai/10 rounded-lg transition-colors duration-200"
                    data-testid={`view-competitor-${competitor.name.toLowerCase()}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-bg-dark/50 rounded-lg p-3">
                  <h6 className="text-sm font-medium text-text-dark mb-1">Recent Key Moves:</h6>
                  <p className="text-sm text-text-dark/80">{competitor.keyMoves}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Our Position & Opportunities */}
        <div className="col-span-4">
          <h4 className="text-lg font-semibold text-text-dark mb-4">Our Position</h4>
          
          {/* Share of Voice */}
          <div className="bg-bg-dark/30 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-dark/70">Share of Voice</span>
              <span className="text-lg font-bold text-ai">
                {competitiveData.marketPosition.shareOfVoice}%
              </span>
            </div>
            
            <div className="w-full bg-bg-dark/50 rounded-full h-2">
              <div 
                className="h-2 bg-ai rounded-full transition-all duration-500"
                style={{ width: `${competitiveData.marketPosition.shareOfVoice}%` }}
              />
            </div>
          </div>

          {/* Opportunity Score */}
          <div className="bg-bg-dark/30 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-dark/70">Opportunity Score</span>
              <span className={`text-lg font-bold ${getOpportunityColor(competitiveData.marketPosition.opportunityScore)}`}>
                {competitiveData.marketPosition.opportunityScore}/100
              </span>
            </div>
            
            <div className="w-full bg-bg-dark/50 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  competitiveData.marketPosition.opportunityScore >= 80 ? 'bg-success' :
                  competitiveData.marketPosition.opportunityScore >= 60 ? 'bg-warning' : 'bg-danger'
                }`}
                style={{ width: `${competitiveData.marketPosition.opportunityScore}%` }}
              />
            </div>
            
            <p className="text-xs text-text-dark/60 mt-2">
              High opportunity for market share capture
            </p>
          </div>

          {/* Strategic Recommendation */}
          <div className="bg-success/10 border border-success/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-success" />
              <span className="text-sm font-semibold text-success">Strategic Opportunity</span>
            </div>
            <p className="text-sm text-text-dark/80">
              CompetitorA's 40% PR reduction creates opening for thought leadership capture. 
              Recommend aggressive content & speaking strategy.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom: Market Insights */}
      <div className="mt-6 pt-6 border-t border-text-dark/10">
        <div className="bg-ai/5 border border-ai/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-ai/10 p-2 rounded-lg">
              <Eye className="w-4 h-4 text-ai" />
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-semibold text-ai mb-1">AI Market Analysis</h5>
              <p className="text-sm text-text-dark/70 leading-relaxed">
                Market consolidation opportunity detected. CompetitorA's investment cuts and CompetitorB's 
                late-stage campaign launch suggest 60-day window for aggressive market positioning. 
                Recommend 25% budget increase to PR and thought leadership initiatives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
