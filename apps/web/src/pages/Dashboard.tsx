import { Brain, Calendar, Activity, TrendingUp, FileText, Megaphone, Link2, Download } from 'lucide-react'
import { KPIHero } from '../components/KPIHero'
import { SectionCard } from '../components/SectionCard'
import { useNavigate } from 'react-router-dom'

const mockData = {
  visibilityScore: 74,
  delta: { value: '+12', positive: true },
  sparklineData: [65, 68, 72, 69, 74, 71, 74],
  recommendations: [
    {
      type: 'Campaign',
      title: 'Optimize Q4 product launch timing',
      description: 'Analytics suggest delaying launch by 2 weeks for 34% higher engagement',
      confidence: 'High'
    },
    {
      type: 'Content',
      title: 'Expand "Marketing Automation" content',
      description: 'This topic shows 3x higher conversion rates in your funnel',
      confidence: 'Medium'
    },
    {
      type: 'PR',
      title: 'Target TechCrunch for enterprise story',
      description: 'Perfect timing based on their recent coverage patterns',
      confidence: 'High'
    }
  ],
  recentActivity: [
    { time: '2 hours ago', event: 'Campaign "Q4 Launch" approved and scheduled', type: 'campaign' },
    { time: '4 hours ago', event: 'PR pitch sent to 12 journalists in enterprise beat', type: 'pr' },
    { time: '6 hours ago', event: 'Content piece "Marketing Trends 2024" published', type: 'content' },
    { time: '1 day ago', event: 'SEO ranking improved for "marketing automation" (+3 positions)', type: 'seo' },
  ]
}

export function Dashboard() {
  const navigate = useNavigate()
  
  // Quick action handlers
  const handleQuickAction = (action: string, route?: string) => {
    // Track action in PostHog
    if (window.posthog) {
      window.posthog.capture('quick_action_clicked', { action })
    }
    
    if (route) {
      navigate(route)
    }
  }

  return (
    <div className="min-h-screen p-4 lg:p-6 space-y-10 md:space-y-12">
      {/* Content wrapper with individual content islands per card */}
        
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketing Command Center</h1>
          <p className="text-foreground/60 mt-2">Monitor your visibility and manage campaigns from your central dashboard</p>
        </div>

        {/* 12-column grid layout */}
        <div className="grid grid-cols-12 gap-6 md:gap-8" data-testid="dashboard-grid">
          
          {/* Row 1: KPI Hero (12 columns) */}
          <div className="col-span-12">
            <KPIHero
              score={mockData.visibilityScore}
              label="Cross-pillar marketing performance index"
              delta={mockData.delta}
              sparklineData={mockData.sparklineData}
              onViewDetails={() => console.log('View details clicked')}
              onBreakdown={() => console.log('Breakdown clicked')}
            />
          </div>

          {/* Quick Actions Row (12 columns) */}
          <div className="col-span-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => handleQuickAction('new_content', '/content/new')}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-ai-teal-600/10 to-ai-teal-600/5 border border-ai-teal-600/20 p-4 text-left transition-all hover:border-ai-teal-600/40 hover:shadow-lg hover:shadow-ai-teal-600/10"
              >
                <div className="relative z-10">
                  <FileText className="h-5 w-5 text-ai-teal-500 mb-2" />
                  <h3 className="font-medium text-sm text-foreground mb-1">New Content</h3>
                  <p className="text-xs text-foreground/60">Start writing instantly</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-ai-teal-600/0 to-ai-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => handleQuickAction('new_press_release', '/press-releases/new')}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-ai-gold-600/10 to-ai-gold-600/5 border border-ai-gold-600/20 p-4 text-left transition-all hover:border-ai-gold-600/40 hover:shadow-lg hover:shadow-ai-gold-600/10"
              >
                <div className="relative z-10">
                  <Megaphone className="h-5 w-5 text-ai-gold-500 mb-2" />
                  <h3 className="font-medium text-sm text-foreground mb-1">New Press Release</h3>
                  <p className="text-xs text-foreground/60">Announce to media</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-ai-gold-600/0 to-ai-gold-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => handleQuickAction('analyze_url', '/citemind')}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-ai-teal-600/10 to-ai-teal-600/5 border border-ai-teal-600/20 p-4 text-left transition-all hover:border-ai-teal-600/40 hover:shadow-lg hover:shadow-ai-teal-600/10"
              >
                <div className="relative z-10">
                  <Link2 className="h-5 w-5 text-ai-teal-500 mb-2" />
                  <h3 className="font-medium text-sm text-foreground mb-1">Analyze URL</h3>
                  <p className="text-xs text-foreground/60">CiteMind insights</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-ai-teal-600/0 to-ai-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => handleQuickAction('export_analytics', '/analytics/export')}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/2 border border-foreground/10 p-4 text-left transition-all hover:border-foreground/20 hover:shadow-lg"
              >
                <div className="relative z-10">
                  <Download className="h-5 w-5 text-foreground/70 mb-2" />
                  <h3 className="font-medium text-sm text-foreground mb-1">Export Analytics</h3>
                  <p className="text-xs text-foreground/60">Download reports</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/0 to-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          {/* Row 2: AI Recommendations (6 columns) */}
          <div className="col-span-12 lg:col-span-6">
            <SectionCard
              title="AI Recommendations"
              subtitle="Live insights powered by your data"
              icon={Brain}
              badge="7 Active"
              action={
                <button className="link-brand text-sm font-medium">
                  View All
                </button>
              }
            >
              <div className="space-y-4">
                {mockData.recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className="border border-border rounded-lg p-4 hover:bg-glass-bg hover:backdrop-blur-sm transition-all duration-200 hover:shadow-sm hover:border-ai-teal/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-ai-teal bg-ai-teal/10 border border-ai-teal/30 px-2 py-1 rounded">
                            {rec.type}
                          </span>
                          <span className={
                            rec.confidence === 'High' ? 'chip-success' : 'chip-warning'
                          }>
                            {rec.confidence} Confidence
                          </span>
                        </div>
                        <h4 className="font-medium text-foreground mb-1">{rec.title}</h4>
                        <p className="text-sm text-foreground/60">{rec.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button className="btn-ghost text-sm">Dismiss</button>
                        <button className="btn-primary text-sm">Apply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Row 2: Recent Activity (6 columns) */}
          <div className="col-span-12 lg:col-span-6">
            <SectionCard
              title="Recent Activity"
              subtitle="Latest updates across all channels"
              icon={Activity}
              action={
                <button className="link-brand text-sm font-medium">
                  View Timeline
                </button>
              }
            >
              <div className="space-y-4">
                {mockData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'campaign' ? 'bg-ai-teal' :
                      activity.type === 'pr' ? 'bg-success' :
                      activity.type === 'content' ? 'bg-ai-gold' :
                      'bg-ai-teal'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.event}</p>
                      <p className="text-xs text-foreground/60 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Row 3: SEO Summary (12 columns) */}
          <div className="col-span-12">
            <SectionCard
              title="SEO Performance Overview"
              subtitle="Keywords, rankings, and optimization opportunities"
              icon={TrendingUp}
              action={
                <div className="flex gap-2">
                  <button className="btn-secondary">
                    Full Report
                  </button>
                  <button className="btn-primary">
                    Optimize Now
                  </button>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-ai-teal">142</div>
                  <div className="text-sm text-foreground/60">Tracked Keywords</div>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="chip-success">+8 this week</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-ai-teal">23</div>
                  <div className="text-sm text-foreground/60">Top 10 Rankings</div>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="chip-success">+3 improved</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-ai-gold">67</div>
                  <div className="text-sm text-foreground/60">Backlinks</div>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="chip-success">+12 acquired</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-warning">18</div>
                  <div className="text-sm text-foreground/60">Opportunities</div>
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3 text-warning" />
                    <span className="chip-warning">High priority</span>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

        </div>
    </div>
  )
}