import { useEffect } from 'react'
import { KPIHero } from '../components/KPIHero'
import { AIRecommendationCard, AutomationBar } from '../components/AIRecommendationCard'
import { ContentQueue } from '../components/ContentQueue'
import { SEOMovers } from '../components/SEOMovers'
import { Wallet } from '../components/Wallet'
import { PRQueue } from '../components/PRQueue'
import { Alerts } from '../components/Alerts'
import { AgentHealth } from '../components/AgentHealth'
import { ActivityTimeline } from '../components/ActivityTimeline'
import { 
  trackUIViewDashboardV4, 
  trackAutomationThresholdChanged, 
  trackAutomationPausedToggled 
} from '../utils/telemetry'

// Mock data
const mockVisibilityScore = {
  score: 78,
  pr: 75,
  seo: 82,
  content: 76,
  social: 68,
  delta: 5,
  period: 'last 30 days'
}

const mockSparklineData = Array.from({ length: 30 }, () => ({
  value: 70 + Math.random() * 20
}))

const mockRecommendations = [
  {
    id: '1',
    title: 'Optimize blog post for "AI marketing tools"',
    description: 'High-volume keyword with low competition detected',
    confidence: 'high' as const,
    impact: 'high' as const,
    type: 'seo' as const,
    actions: ['approve', 'ask_copilot', 'queue'] as ('approve' | 'ask_copilot' | 'queue')[],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Pitch TechCrunch about product launch',
    description: 'Based on recent coverage patterns',
    confidence: 'medium' as const,
    impact: 'high' as const,
    type: 'pr' as const,
    actions: ['approve', 'ask_copilot', 'queue'] as ('approve' | 'ask_copilot' | 'queue')[],
    createdAt: new Date().toISOString()
  }
]

const mockContentQueue = [
  {
    id: '1',
    title: 'Q4 Product Roadmap Blog Post',
    type: 'blog' as const,
    status: 'review' as const,
    dueDate: '2024-12-15'
  },
  {
    id: '2',
    title: 'Holiday Campaign Press Release',
    type: 'press_release' as const,
    status: 'draft' as const,
    dueDate: '2024-12-10'
  }
]

const mockSEOMovers = [
  {
    id: '1',
    keyword: 'marketing automation',
    currentRank: 12,
    previousRank: 18,
    change: -6,
    searchVolume: 12000,
    url: '/marketing-automation'
  },
  {
    id: '2',
    keyword: 'content marketing platform',
    currentRank: 8,
    previousRank: 5,
    change: 3,
    searchVolume: 8500,
    url: '/content-platform'
  }
]

const mockCredits = [
  {
    id: '1',
    type: 'basic' as const,
    remaining: 2,
    total: 5,
    expiresAt: '2024-12-31'
  },
  {
    id: '2',
    type: 'premium' as const,
    remaining: 1,
    total: 1,
    expiresAt: '2024-12-31'
  }
]

const mockPRQueue = [
  {
    id: '1',
    title: 'Product Launch Announcement',
    status: 'scheduled' as const,
    scheduledFor: '2024-12-01'
  }
]

const mockAlerts = [
  {
    id: '1',
    title: 'PR credit expiring soon',
    message: 'You have 1 premium credit expiring in 7 days',
    type: 'warning' as const,
    timestamp: new Date().toISOString()
  }
]

const mockAgents = [
  {
    id: '1',
    name: 'Content AI',
    status: 'healthy' as const,
    lastActive: new Date().toISOString(),
    uptime: 99.5
  },
  {
    id: '2',
    name: 'SEO Monitor',
    status: 'warning' as const,
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    uptime: 95.2
  }
]

const mockActivityEvents = [
  {
    id: '1',
    type: 'content_published' as const,
    title: 'Blog post published',
    description: '"AI Trends 2024" went live on the blog',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    pillar: 'content' as const
  },
  {
    id: '2',
    type: 'seo_rank_change' as const,
    title: 'Ranking improvement',
    description: '"marketing automation" moved up 6 positions',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    pillar: 'seo' as const
  }
]

export function Dashboard() {
  useEffect(() => {
    // Track dashboard view
    const startTime = Date.now()
    trackUIViewDashboardV4()
    
    return () => {
      const viewDuration = (Date.now() - startTime) / 1000
      trackUIViewDashboardV4(viewDuration)
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Band A: KPI Hero */}
      <div data-surface="content">
        <KPIHero 
          visibilityScore={mockVisibilityScore}
          sparklineData={mockSparklineData}
        />
      </div>

      {/* Band B: AI Recommendations + Automation Bar */}
      <div className="space-y-4" data-surface="content">
        <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">
          AI Recommendations
        </h2>
        
        <AutomationBar
          confidenceThreshold={85}
          isPaused={false}
          queueCount={3}
          onThresholdChange={(newValue) => {
            trackAutomationThresholdChanged(newValue, 85)
            console.log('Threshold changed:', newValue)
          }}
          onPauseToggle={() => {
            trackAutomationPausedToggled(true) // Would toggle based on current state
            console.log('Pause toggled')
          }}
          onViewQueue={() => console.log('View queue clicked')}
        />
        
        <div className="grid gap-4" data-testid="ai-recommendations">
          {mockRecommendations.map(rec => (
            <AIRecommendationCard
              key={rec.id}
              recommendation={rec}
              onApprove={(id) => console.log('Approved:', id)}
              onAskCopilot={(id) => console.log('Ask Copilot:', id)}
              onQueue={(id) => console.log('Queued:', id)}
            />
          ))}
        </div>
      </div>

      {/* Band C: 8/4 Grid */}
      <div className="grid grid-cols-12 gap-6" data-surface="content">
        {/* Left side - 8 columns */}
        <div className="col-span-8 grid grid-cols-2 gap-4">
          <ContentQueue items={mockContentQueue} />
          <SEOMovers movers={mockSEOMovers} />
        </div>
        
        {/* Right side - 4 columns */}
        <div className="col-span-4 space-y-4">
          <Wallet 
            credits={mockCredits} 
            onAddCredits={() => console.log('Add credits clicked')}
          />
          <PRQueue items={mockPRQueue} />
          <Alerts 
            alerts={mockAlerts}
            onDismiss={(id) => console.log('Dismissed alert:', id)}
          />
          <AgentHealth agents={mockAgents} />
        </div>
      </div>

      {/* Band D: Activity Timeline */}
      <div data-surface="content">
        <ActivityTimeline events={mockActivityEvents} />
      </div>
    </div>
  )
}