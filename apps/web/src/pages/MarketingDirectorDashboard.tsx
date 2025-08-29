import { useEffect } from 'react'
import { StrategicOverview } from '../components/marketing-director/StrategicOverview'
import { TeamPerformance } from '../components/marketing-director/TeamPerformance'
import { BudgetTracker } from '../components/marketing-director/BudgetTracker'
import { AIStrategicInsights } from '../components/marketing-director/AIStrategicInsights'
import { CompetitiveIntelligence } from '../components/marketing-director/CompetitiveIntelligence'
import { ExecutiveActions } from '../components/marketing-director/ExecutiveActions'

// Mock data for Marketing Director - Strategic Level
const mockStrategicData = {
  // Primary AI recommendation for executive action
  primaryRecommendation: {
    id: 'budget_reallocation_001',
    title: 'Campaign X budget reallocation opportunity detected',
    description: 'Move $3.2K from Social→PR for 28% pipeline improvement. ROI: +$47K projected',
    impact: 'high' as const,
    confidence: 92,
    projectedROI: 47000,
    timeline: '7 days to implement',
    details: {
      currentAllocation: { social: 8200, pr: 12000 },
      proposedAllocation: { social: 5000, pr: 15200 },
      reasoning: 'PR campaigns showing 340% ROI vs Social at 45%. Market timing optimal for thought leadership push.'
    }
  },

  // Budget performance overview
  budget: {
    allocated: 125000,
    remaining: 38000,
    utilization: 69.6,
    topPerformer: { pillar: 'PR', roi: 340 },
    underperformer: { pillar: 'Social', roi: 45 },
    monthlyBurn: 18500
  },

  // Team productivity metrics  
  team: {
    overallProductivity: 87,
    trend: 'up' as const,
    monthlyIncrease: 12,
    bottlenecks: [
      { area: 'Content review', impact: 'medium', solution: 'AI pre-screening' },
      { area: 'PR approval', impact: 'low', solution: 'Automated workflows' }
    ]
  },

  // Strategic market opportunities
  opportunities: [
    {
      id: 'thought_leadership_gap',
      title: 'Tech leadership gap',
      description: 'Conference speaking opportunities ready. 3 tier-1 events with open CFPs.',
      urgency: 'high' as const,
      timeline: '14 days',
      projectedImpact: 'Brand authority +23%, Lead gen +15%'
    },
    {
      id: 'competitor_weakness',
      title: 'Competitor vulnerability window',
      description: 'MainCompetitor reducing PR spend 40%. Market share capture opportunity.',
      urgency: 'medium' as const,
      timeline: '30 days',
      projectedImpact: 'Market share +8%, SOV +12%'
    }
  ]
}

const mockCompetitiveData = {
  competitors: [
    {
      name: 'CompetitorA',
      marketShare: 28.5,
      trend: 'down' as const,
      change: -2.1,
      keyMoves: 'Reduced PR investment by 40%'
    },
    {
      name: 'CompetitorB', 
      marketShare: 19.2,
      trend: 'up' as const,
      change: 1.8,
      keyMoves: 'Launched thought leadership campaign'
    }
  ],
  marketPosition: {
    currentRank: 3,
    shareOfVoice: 16.8,
    opportunityScore: 84
  }
}

const mockExecutiveActions = [
  {
    id: 'campaign_approval_001',
    title: 'Q1 Thought Leadership Campaign',
    type: 'approval' as const,
    urgency: 'high' as const,
    context: 'Conference season starts in 6 weeks. Need approval for speaker bureau and content development.',
    impact: 'Brand authority +25%, Pipeline +$180K',
    deadline: '2024-12-05'
  },
  {
    id: 'budget_approval_002', 
    title: 'Additional PR Credits Purchase',
    type: 'budget' as const,
    urgency: 'medium' as const,
    context: 'Current success rate 78% above target. Request 5 additional premium credits.',
    impact: 'Coverage reach +40%, Media value +$85K',
    deadline: '2024-12-10'
  }
]

export function MarketingDirectorDashboard() {
  useEffect(() => {
    // Track executive dashboard view
    const startTime = Date.now()
    console.log('Marketing Director Dashboard accessed')
    
    return () => {
      const viewDuration = (Date.now() - startTime) / 1000
      console.log(`Executive session duration: ${viewDuration}s`)
    }
  }, [])

  return (
    <div className="space-y-6 p-6 bg-bg-dark text-text-dark min-h-screen" data-testid="marketing-director-dashboard">
      {/* Hidden heading for accessibility */}
      <h1 className="sr-only">Marketing Director Strategic Dashboard</h1>
      
      {/* F-Pattern Layout: Primary Strategic Overview spans full width */}
      <div className="grid grid-cols-12 gap-6" data-pattern="ai-primary" data-tier="critical">
        {/* Left: Strategic Overview - 8 columns (70% visual weight) */}
        <div className="col-span-8">
          <StrategicOverview 
            recommendation={mockStrategicData.primaryRecommendation}
            budget={mockStrategicData.budget}
            onApproveReallocation={(details) => {
              console.log('Budget reallocation approved:', details)
              // Trigger reallocation workflow
            }}
            onViewAnalysis={() => {
              console.log('View detailed analysis requested')
              // Open detailed analysis modal
            }}
          />
        </div>

        {/* Right: Team Performance - 4 columns (30% visual weight) */}
        <div className="col-span-4">
          <TeamPerformance 
            performance={mockStrategicData.team}
            onViewTeamDetails={() => {
              console.log('Team details requested')
              // Navigate to team performance page
            }}
          />
        </div>
      </div>

      {/* Secondary Tier: Budget Tracker and Strategic Insights */}
      <div className="grid grid-cols-12 gap-6" data-pattern="manual-secondary" data-tier="monitoring">
        <div className="col-span-8">
          <BudgetTracker 
            budget={mockStrategicData.budget}
            onReallocateBudget={() => {
              console.log('Budget reallocation interface requested')
              // Open budget reallocation tool
            }}
          />
        </div>

        <div className="col-span-4">
          <AIStrategicInsights 
            opportunities={mockStrategicData.opportunities}
            onPursueOpportunity={(opportunityId) => {
              console.log('Opportunity pursuit requested:', opportunityId)
              // Initialize opportunity campaign
            }}
          />
        </div>
      </div>

      {/* Tertiary Tier: Competitive Intelligence */}
      <div className="grid grid-cols-12 gap-6" data-tier="strategic">
        <div className="col-span-12">
          <CompetitiveIntelligence 
            competitiveData={mockCompetitiveData}
            onViewCompetitorDetails={(competitor) => {
              console.log('Competitor deep dive requested:', competitor)
              // Open competitive analysis dashboard
            }}
          />
        </div>
      </div>

      {/* Contextual Actions: Executive Approval Queue */}
      <div className="grid grid-cols-12 gap-6" data-tier="contextual">
        <div className="col-span-12">
          <ExecutiveActions 
            actions={mockExecutiveActions}
            onApproveAction={(actionId) => {
              console.log('Executive action approved:', actionId)
              // Process approval and notify team
            }}
            onRequestMoreInfo={(actionId) => {
              console.log('More information requested for:', actionId)
              // Request additional context from team
            }}
          />
        </div>
      </div>
    </div>
  )
}
