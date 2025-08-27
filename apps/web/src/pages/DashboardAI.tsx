import { useEffect } from 'react'
import { Activity, BarChart3, Users, Target, FileText } from 'lucide-react'
import { AIBriefing } from '../components/ai-first/AIBriefing'
import { NextBestActions } from '../components/ai-first/NextBestActions'
import { OpsCenter } from '../components/ai-first/OpsCenter'
import { QuickActions } from '../components/ai-first/QuickActions'
import { KpiTile } from '../components/v2/KpiTile'
import { useDashboardData } from '../hooks/useKPIData'
import { trackFlow } from '../services/analyticsService'

// Icon mapping for secondary KPIs
const ICON_MAP = {
  'content-velocity': FileText,
  'audience-growth': Users,
  'engagement-rate': Target,
  'lead-quality': BarChart3
}

// Mock data for AI-first components
const MOCK_AI_BRIEFING = {
  visibilityScore: 87,
  scoreDelta: { value: 12, positive: true },
  miniKpis: {
    coverage: 73,
    authority: 82,
    timeToCitation: 3,
    publishingCadence: 8
  }
}

const MOCK_NEXT_BEST_ACTIONS = [
  {
    id: 'repurpose-top-post',
    title: 'Repurpose top-performing post into PR',
    description: 'Your "AI Marketing Trends" post has 2.3K shares. Convert it into a press release for wider reach.',
    confidence: 92,
    impact: 'high' as const,
    kpiLift: 15,
    kpiType: 'visibility',
    actionType: 'apply' as const,
    deepLink: '/pr/new',
    prefillParams: {
      source: 'blog-post',
      post_id: 'ai-marketing-trends-2024',
      title: 'AI Marketing Trends Reshape Industry Standards'
    }
  },
  {
    id: 'submit-pr-topic',
    title: 'Submit PR for "Sustainable Tech" today',
    description: 'High search volume + trending topic. 3 journalists already covering related stories.',
    confidence: 88,
    impact: 'high' as const,
    kpiLift: 22,
    kpiType: 'authority',
    actionType: 'apply' as const,
    deepLink: '/pr/new',
    prefillParams: {
      topic: 'sustainable-technology',
      angle: 'industry-innovation',
      urgency: 'high'
    }
  },
  {
    id: 'analyze-competitor-url',
    title: 'Analyze competitor URL for quick wins',
    description: 'TechCorp.com gained 15% visibility. Identify their successful tactics.',
    confidence: 76,
    impact: 'medium' as const,
    kpiLift: 8,
    kpiType: 'coverage',
    actionType: 'run' as const,
    deepLink: '/analyze',
    prefillParams: {
      url: 'techcorp.com/blog/latest',
      analysis_type: 'competitive-gap'
    }
  }
]

const MOCK_OPS_DATA = {
  wallet: {
    credits: 1247,
    spend: 186,
    monthlyLimit: 500
  },
  prQueue: {
    pending: 3,
    inReview: 2,
    total: 12
  },
  alerts: {
    failures: 1,
    anomalies: 0,
    total: 1
  },
  agentHealth: {
    runs24h: 47,
    errors: 2,
    successRate: 96
  }
}

export function DashboardAI() {
  // Fetch dashboard data using our KPI service
  const { 
    data: dashboardData, 
    loading, 
    error, 
    refresh 
  } = useDashboardData({
    onError: (error) => {
      console.error('Dashboard data error:', error)
    }
  })
  
  // Handle notifications/alerts (unused for now)
  // const { 
  //   notifications, 
  //   unreadCount 
  // } = useKPINotifications()

  // Track page view and engagement
  useEffect(() => {
    const pageStartTime = Date.now()
    
    // Track dashboard page view
    trackFlow.engagement('page_view', {
      page: 'dashboard_ai',
      has_data: !!dashboardData,
      loading_state: loading,
      error_state: !!error,
      layout: 'ai_first'
    })

    // Track session duration on unmount
    return () => {
      const sessionDuration = Date.now() - pageStartTime
      // Log session duration directly to analytics
      if (window.posthog) {
        window.posthog.capture('session_duration', {
          page: 'dashboard_ai',
          duration_ms: sessionDuration,
          had_interactions: true
        })
      }
    }
  }, [dashboardData, loading, error])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="glass-card h-48" data-surface="content" />
            <div className="glass-card h-32" data-surface="content" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card h-24" data-surface="content" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md" data-surface="content">
          <div className="text-ai-gold-300 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Dashboard Unavailable</h2>
          <p className="text-foreground/60 mb-4">Unable to load dashboard data. Please try again.</p>
          <button 
            onClick={refresh}
            className="btn-primary px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto mb-10" data-surface="content">
          <h1 className="text-3xl font-bold text-foreground">🤖 AI Marketing Command Center</h1>
          <p className="text-foreground/60 mt-2">Automated insights, next-best actions, and intelligent operations</p>
          
          {/* Phase indicator with teal accent */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-ai-teal-500/15 to-ai-gold-500/10 border border-ai-teal-500/30 rounded-lg text-sm text-ai-teal-300 mt-4">
            <div className="w-2 h-2 bg-ai-teal-500 rounded-full animate-pulse"></div>
            AI-First Dashboard Active
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-10">
          {/* A) AI Briefing */}
          <section className="mt-10">
            <AIBriefing {...MOCK_AI_BRIEFING} />
          </section>

          {/* B) Next-Best Actions */}
          <section className="mt-10">
            <NextBestActions actions={MOCK_NEXT_BEST_ACTIONS} />
          </section>

          {/* Layout: Quick Actions + Ops Center */}
          <div className="grid grid-cols-12 gap-6">
            {/* D) Quick Actions */}
            <section className="col-span-12 xl:col-span-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
                  <QuickActions />
                </div>

                {/* E) KPI Tiles - Compact density */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Performance Metrics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {dashboardData?.secondaryKPIs?.map((kpi: any) => {
                      const IconComponent = ICON_MAP[kpi.id as keyof typeof ICON_MAP] || Activity
                      return (
                        <KpiTile
                          key={kpi.id}
                          title={kpi.label}
                          value={kpi.value}
                          delta={{
                            value: `${kpi.trendValue}%`,
                            positive: kpi.trend === 'up'
                          }}
                          trend={kpi.trend}
                          icon={IconComponent}
                          variant="mini"
                          accentColor="teal"
                        />
                      )
                    }) || [
                      // Fallback KPIs
                      <KpiTile
                        key="content-velocity"
                        title="Content Velocity"
                        value="12 posts/week"
                        delta={{ value: "8%", positive: true }}
                        trend="up"
                        icon={FileText}
                        variant="mini"
                        accentColor="teal"
                      />,
                      <KpiTile
                        key="audience-growth"
                        title="Audience Growth"
                        value="2.3K followers"
                        delta={{ value: "15%", positive: true }}
                        trend="up"
                        icon={Users}
                        variant="mini"
                        accentColor="teal"
                      />,
                      <KpiTile
                        key="engagement-rate"
                        title="Engagement Rate"
                        value="4.7%"
                        delta={{ value: "12%", positive: true }}
                        trend="up"
                        icon={Target}
                        variant="mini"
                        accentColor="gold"
                      />,
                      <KpiTile
                        key="lead-quality"
                        title="Lead Quality"
                        value="87"
                        delta={{ value: "5%", positive: true }}
                        trend="up"
                        icon={BarChart3}
                        variant="mini"
                        accentColor="gold"
                      />
                    ]}
                  </div>
                </div>
              </div>
            </section>

            {/* C) Ops Center - Right Rail */}
            <aside className="col-span-12 xl:col-span-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Operations Center</h2>
                <OpsCenter data={MOCK_OPS_DATA} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}