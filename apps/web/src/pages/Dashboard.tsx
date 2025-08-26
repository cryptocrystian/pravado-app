import { Brain, Calendar, Activity, TrendingUp } from 'lucide-react'
import { 
  KPIHero,
  QuickActionsRow,
  RightRailTile
} from '../components/v2'
import { cn } from '../lib/utils'

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

          {/* Row 2: Quick Actions (12 columns) */}
          <div className="col-span-12">
            <QuickActionsRow onAction={(action) => console.log(`Quick action: ${action}`)} />
          </div>

          {/* Row 3: AI Recommendations (6 columns) */}
          <div className="col-span-12 lg:col-span-6">
            <RightRailTile
              title="AI Recommendations"
              subtitle="Live insights powered by your data"
              icon={Brain}
              badge="7 Active"
              action={
                <a href="#" className="text-sm font-medium text-ai-teal-300 hover:text-ai-teal-500">
                  View All
                </a>
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
                          <span className="text-xs font-medium text-ai-teal-300 bg-ai-teal-300/10 border border-ai-teal-300/30 px-2 py-1 rounded">
                            {rec.type}
                          </span>
                          <span className={cn(
                            "text-xs font-medium px-2 py-1 rounded",
                            rec.confidence === 'High' 
                              ? 'text-ai-teal-300 bg-ai-teal-300/10 border border-ai-teal-300/30'
                              : 'text-ai-gold-500 bg-ai-gold-500/10 border border-ai-gold-500/30'
                          )}>
                            {rec.confidence} Confidence
                          </span>
                        </div>
                        <h4 className="font-medium text-foreground mb-1">{rec.title}</h4>
                        <p className="text-sm text-foreground/60">{rec.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button className="px-3 py-1.5 text-sm text-foreground/80 hover:text-foreground hover:bg-white/5 rounded transition-all focus:outline-2 focus:outline-ai-teal-500">Dismiss</button>
                        <button className="px-3 py-1.5 text-sm bg-[var(--brand-grad)] text-white rounded hover:opacity-95 transition-opacity focus:outline-2 focus:outline-ai-teal-500">Apply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RightRailTile>
          </div>

          {/* Row 3: Recent Activity (6 columns) */}
          <div className="col-span-12 lg:col-span-6">
            <RightRailTile
              title="Recent Activity"
              subtitle="Latest updates across all channels"
              icon={Activity}
              action={
                <a href="#" className="text-sm font-medium text-ai-teal-300 hover:text-ai-teal-500">
                  View Timeline
                </a>
              }
            >
              <div className="space-y-4">
                {mockData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'campaign' ? 'bg-ai-teal-500' :
                      activity.type === 'pr' ? 'bg-success' :
                      activity.type === 'content' ? 'bg-ai-gold-500' :
                      'bg-ai-teal-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.event}</p>
                      <p className="text-xs text-foreground/60 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RightRailTile>
          </div>

          {/* Row 4: SEO Summary (12 columns) */}
          <div className="col-span-12">
            <RightRailTile
              title="SEO Performance Overview"
              subtitle="Keywords, rankings, and optimization opportunities"
              icon={TrendingUp}
              action={
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm border border-border rounded-lg text-foreground hover:bg-white/5 transition-all focus:outline-2 focus:outline-ai-teal-500">
                    Full Report
                  </button>
                  <button className="px-4 py-2 text-sm bg-[var(--brand-grad)] text-white rounded-lg hover:opacity-95 transition-opacity focus:outline-2 focus:outline-ai-teal-500">
                    Optimize Now
                  </button>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-ai-teal-300">142</div>
                  <div className="text-sm text-foreground/60">Tracked Keywords</div>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-ai-teal-300" />
                    <span className="text-ai-teal-300 bg-ai-teal-300/10 border border-ai-teal-300/30 px-2 py-1 rounded text-xs">+8 this week</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-ai-teal-300">23</div>
                  <div className="text-sm text-foreground/60">Top 10 Rankings</div>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-ai-teal-300" />
                    <span className="text-ai-teal-300 bg-ai-teal-300/10 border border-ai-teal-300/30 px-2 py-1 rounded text-xs">+3 improved</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-ai-gold-500">67</div>
                  <div className="text-sm text-foreground/60">Backlinks</div>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-ai-gold-500" />
                    <span className="text-ai-gold-500 bg-ai-gold-500/10 border border-ai-gold-500/30 px-2 py-1 rounded text-xs">+12 acquired</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-warning">18</div>
                  <div className="text-sm text-foreground/60">Opportunities</div>
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3 text-warning" />
                    <span className="text-warning bg-warning/10 border border-warning/30 px-2 py-1 rounded text-xs">High priority</span>
                  </div>
                </div>
              </div>
            </RightRailTile>
          </div>

        </div>
    </div>
  )
}