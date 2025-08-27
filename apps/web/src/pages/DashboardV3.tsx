import { useEffect } from 'react'
import { FileText, Megaphone, Link2, Download, Wallet, AlertTriangle, Activity } from 'lucide-react'
import { 
  KPIHeroV3,
  MiniKpiRow,
  NextBestActionRow,
  QuickActionCard,
  RightRailTile
} from '../components/v3'
import { KpiTile } from '../components/v2/KpiTile'
import { useDashboardData } from '../hooks/useKPIData'
import { trackFlow } from '../services/analyticsService'

// Mock data for V3 dashboard
const MOCK_HERO_DATA = {
  score: 87,
  delta: { value: 12, positive: true },
  sparklineData: [65, 68, 72, 70, 75, 78, 82, 85, 87]
}

const MOCK_MINI_KPIS = [
  { label: 'Coverage %', value: 73, unit: '%', progress: 73 },
  { label: 'Authority Index', value: 82, progress: 82 },
  { label: 'Time-to-Citation', value: '3.2', unit: 'days' },
  { label: 'Publishing Cadence', value: 8, unit: '30d' }
]

const MOCK_NEXT_BEST_ACTIONS = [
  {
    id: 'repurpose-top-post',
    title: 'Repurpose top-performing post into PR',
    rationale: 'Your "AI Marketing Trends" post has 2.3K shares. Convert it into a press release for wider reach.',
    confidence: 92,
    impact: 'high' as const,
    actionType: 'apply' as const,
    deepLink: '/pr/new',
    prefillParams: { source: 'blog-post', post_id: 'ai-marketing-trends-2024' }
  },
  {
    id: 'submit-pr-topic',
    title: 'Submit PR for "Sustainable Tech" today',
    rationale: 'High search volume + trending topic. 3 journalists already covering related stories.',
    confidence: 88,
    impact: 'high' as const,
    actionType: 'apply' as const,
    deepLink: '/pr/new',
    prefillParams: { topic: 'sustainable-technology' }
  },
  {
    id: 'analyze-competitor',
    title: 'Analyze competitor URL for quick wins',
    rationale: 'TechCorp.com gained 15% visibility. Identify their successful tactics.',
    confidence: 76,
    impact: 'medium' as const,
    actionType: 'run' as const,
    deepLink: '/analyze',
    prefillParams: { url: 'techcorp.com/blog/latest' }
  }
]

const MOCK_OPS_DATA = {
  wallet: { value: 1247, subtitle: 'credits', progress: { value: 186, max: 500, label: '$186 of $500' } },
  prQueue: { value: 3, subtitle: 'pending', secondary: { label: 'In review', value: 2 } },
  alerts: { value: 1, subtitle: 'active', status: 'warning' as const },
  agentHealth: { value: 47, subtitle: 'runs 24h', progress: { value: 96, max: 100, label: '96% success rate' } }
}

export function DashboardV3() {
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

  useEffect(() => {
    trackFlow.engagement('page_view', {
      page: 'dashboard_v3',
      layout: 'ai_first',
      has_data: !!dashboardData
    })
  }, [dashboardData])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="glass-card h-[280px]" />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8 glass-card h-48" />
              <div className="col-span-4 glass-card h-48" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <AlertTriangle className="h-8 w-8 text-ai-gold-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Dashboard Unavailable</h2>
          <p className="text-foreground/60 mb-4">Unable to load dashboard data.</p>
          <button onClick={refresh} className="btn-primary px-4 py-2 rounded-lg">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="px-6 md:px-8 pt-6">
        <div className="max-w-[1400px] mx-auto mb-8">
          <h1 className="text-[32px] leading-9 font-semibold text-foreground">AI Marketing Command Center</h1>
          <p className="text-foreground/60 mt-2">Automated insights, next-best actions, and intelligent operations</p>
        </div>
      </div>

      {/* Main Content - Island Area */}
      <section data-surface="content" className="px-6 md:px-8 pb-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
          {/* Row A: Hero Section */}
          <div className="col-span-12 grid grid-cols-12 gap-6">
            {/* A1: AI Briefing */}
            <div className="col-span-12 lg:col-span-8">
              <KPIHeroV3
                score={MOCK_HERO_DATA.score}
                delta={MOCK_HERO_DATA.delta}
                sparklineData={MOCK_HERO_DATA.sparklineData}
                onViewDetails={() => window.location.href = '/visibility'}
                onBreakdown={() => window.location.href = '/visibility/breakdown'}
              />
            </div>

            {/* A2: Quick Insights */}
            <div className="col-span-12 lg:col-span-4 space-y-3">
              {MOCK_MINI_KPIS.map((kpi, index) => (
                <MiniKpiRow
                  key={index}
                  label={kpi.label}
                  value={kpi.value}
                  unit={kpi.unit}
                  progress={kpi.progress}
                  onClick={() => window.location.href = `/analytics/${kpi.label.toLowerCase().replace(/\s+/g, '-')}`}
                />
              ))}
            </div>
          </div>

          {/* Row B: Actions & Operations */}
          <div className="col-span-12 grid grid-cols-12 gap-6">
            {/* B1: Next-Best Actions */}
            <div className="col-span-12 xl:col-span-8">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Next-Best Actions</h2>
                  
                  {/* Auto-apply toggle (UI only) */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-foreground/60">Auto-apply ≥85%</span>
                    <button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-foreground/10 transition-colors"
                      disabled
                      title="UI preview only"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-panel translate-x-1" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {MOCK_NEXT_BEST_ACTIONS.map((action) => (
                    <NextBestActionRow key={action.id} {...action} />
                  ))}
                </div>
              </div>
            </div>

            {/* B2: Ops Right Rail */}
            <div className="col-span-12 xl:col-span-4 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Operations</h2>
              
              <RightRailTile
                icon={Wallet}
                title="Wallet"
                value={MOCK_OPS_DATA.wallet.value}
                subtitle={MOCK_OPS_DATA.wallet.subtitle}
                progress={MOCK_OPS_DATA.wallet.progress}
                href="/billing"
              />
              
              <RightRailTile
                icon={FileText}
                title="PR Queue"
                value={MOCK_OPS_DATA.prQueue.value}
                subtitle={MOCK_OPS_DATA.prQueue.subtitle}
                href="/pr-queue"
              />
              
              <RightRailTile
                icon={AlertTriangle}
                title="Alerts"
                value={MOCK_OPS_DATA.alerts.value}
                subtitle={MOCK_OPS_DATA.alerts.subtitle}
                status={MOCK_OPS_DATA.alerts.status}
                href="/alerts"
              />
              
              <RightRailTile
                icon={Activity}
                title="Agent Health"
                value={MOCK_OPS_DATA.agentHealth.value}
                subtitle={MOCK_OPS_DATA.agentHealth.subtitle}
                progress={MOCK_OPS_DATA.agentHealth.progress}
                href="/agents"
              />
            </div>
          </div>

          {/* Row C: Quick Actions & Metrics */}
          <div className="col-span-12 grid grid-cols-12 gap-6">
            {/* C1: Quick Actions */}
            <div className="col-span-12 xl:col-span-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickActionCard
                  icon={FileText}
                  label="New Content"
                  description="Create blog or article"
                  href="/content/new"
                  accentColor="teal"
                />
                <QuickActionCard
                  icon={Megaphone}
                  label="New PR"
                  description="Draft press release"
                  href="/pr/new"
                  accentColor="gold"
                />
                <QuickActionCard
                  icon={Link2}
                  label="Analyze URL"
                  description="CiteMind analysis"
                  href="/citemind"
                  accentColor="teal"
                />
                <QuickActionCard
                  icon={Download}
                  label="Export Analytics"
                  description="Download reports"
                  href="/analytics/export"
                  accentColor="gold"
                />
              </div>
            </div>

            {/* C2: Performance Metrics */}
            <div className="col-span-12 xl:col-span-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">Performance</h2>
              <div className="space-y-4">
                <KpiTile
                  title="Content Velocity"
                  value="12 posts/week"
                  delta={{ value: "8%", positive: true }}
                  trend="up"
                  icon={FileText}
                  variant="mini"
                  accentColor="teal"
                />
                <KpiTile
                  title="Lead Quality"
                  value="87"
                  delta={{ value: "5%", positive: true }}
                  trend="up"
                  icon={Activity}
                  variant="mini"
                  accentColor="gold"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}