import { TrendingUp, Calendar, CreditCard, Target, Brain, ArrowRight } from 'lucide-react'
import { cn } from '../lib/utils'

const mockData = {
  visibilityScore: 74,
  trend: '+12',
  activeCampaigns: 8,
  prCredits: 12,
  seoMovers: 23,
  contentQueue: 5,
  aiRecommendations: 7
}

// Simple sparkline component
function Sparkline({ data, className }: { data: number[], className?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min

  return (
    <svg className={cn("w-16 h-8", className)} viewBox="0 0 64 32">
      <polyline
        points={data
          .map((value, index) => {
            const x = (index / (data.length - 1)) * 60 + 2
            const y = 30 - ((value - min) / range) * 26
            return `${x},${y}`
          })
          .join(' ')}
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}

function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  subtitle,
  onClick 
}: {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend?: string
  subtitle?: string
  onClick?: () => void
}) {
  return (
    <div 
      className={cn(
        "bg-panel shadow-card rounded-2xl p-6 text-foreground cursor-pointer transition-all duration-200 hover:shadow-pop hover:-translate-y-0.5",
        onClick && "hover:border-brand/20"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="h-6 w-6 text-brand" />
        {trend && (
          <span className="text-xs font-medium text-success flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm font-medium text-foreground/80">{title}</p>
        {subtitle && (
          <p className="text-xs text-foreground/60">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

export function Dashboard() {
  const sparklineData = [65, 68, 72, 69, 74, 71, 74]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Marketing Command Center</h1>
        <p className="text-foreground/60 mt-2">Monitor your visibility and manage campaigns from your central dashboard</p>
      </div>

      {/* Hero KPI - Visibility Score */}
      <div className="bg-panel shadow-card rounded-2xl p-6 md:p-8 text-foreground" data-surface="content">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-lg font-semibold text-foreground/80">Visibility Score</h2>
              <span className="ai-badge">AI Powered</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-metric text-brand">{mockData.visibilityScore}</span>
              <div className="flex items-center gap-2">
                <span className="text-success font-medium">{mockData.trend}</span>
                <div className="bg-panel-elevated p-1 rounded">
                  <Sparkline 
                    data={sparklineData} 
                    className="text-success" 
                  />
                </div>
              </div>
            </div>
            <p className="text-foreground/60 mt-2">Cross-pillar marketing performance index</p>
          </div>
          <div className="text-right">
            <button className="bg-brand text-brand-foreground px-6 py-2 rounded-lg hover:bg-brand/90 transition-colors">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-surface="content">
        <KPICard
          title="Active Campaigns"
          value={mockData.activeCampaigns}
          icon={Target}
          trend="+2"
          subtitle="3 launching this week"
          onClick={() => console.log('Navigate to campaigns')}
        />
        
        <KPICard
          title="PR Credits"
          value={mockData.prCredits}
          icon={CreditCard}
          subtitle="Premium tier • Expires Dec 31"
          onClick={() => console.log('Navigate to PR credits')}
        />
        
        <KPICard
          title="SEO Movers"
          value={mockData.seoMovers}
          icon={TrendingUp}
          trend="+15"
          subtitle="Keywords improved this week"
          onClick={() => console.log('Navigate to SEO')}
        />
        
        <KPICard
          title="Content Queue"
          value={mockData.contentQueue}
          icon={Calendar}
          subtitle="Ready for review"
          onClick={() => console.log('Navigate to content')}
        />
      </div>

      {/* AI Recommendations */}
      <div className="bg-panel shadow-card rounded-2xl p-6 text-foreground" data-surface="content">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-brand" />
            <h3 className="text-lg font-semibold">AI Recommendations</h3>
            <span className="ai-badge">Live Insights</span>
          </div>
          <button className="text-sm text-brand hover:underline">View All</button>
        </div>
        
        <div className="space-y-4">
          {[
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
          ].map((rec, index) => (
            <div key={index} className="border border-border rounded-lg p-4 hover:border-brand/20 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-brand bg-brand/10 px-2 py-1 rounded">
                      {rec.type}
                    </span>
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded",
                      rec.confidence === 'High' 
                        ? "text-success bg-success/10" 
                        : "text-warning bg-warning/10"
                    )}>
                      {rec.confidence} Confidence
                    </span>
                  </div>
                  <p className="font-medium mb-1">{rec.title}</p>
                  <p className="text-sm text-foreground/60">{rec.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="bg-panel-elevated text-foreground border border-border text-sm py-1 px-3 rounded hover:bg-panel-elevated/80 transition-colors">Dismiss</button>
                  <button className="bg-brand text-brand-foreground text-sm py-1 px-3 rounded hover:bg-brand/90 transition-colors">Apply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-panel shadow-card rounded-2xl p-6 text-foreground" data-surface="content">
        <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { time: '2 hours ago', event: 'Campaign "Q4 Launch" approved and scheduled', type: 'campaign' },
            { time: '4 hours ago', event: 'PR pitch sent to 12 journalists in enterprise beat', type: 'pr' },
            { time: '6 hours ago', event: 'Content piece "Marketing Trends 2024" published', type: 'content' },
            { time: '1 day ago', event: 'SEO ranking improved for "marketing automation" (+3 positions)', type: 'seo' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full mt-2",
                activity.type === 'campaign' && "bg-brand",
                activity.type === 'pr' && "bg-success",
                activity.type === 'content' && "bg-warning",
                activity.type === 'seo' && "bg-brand"
              )} />
              <div className="flex-1">
                <p className="text-sm">{activity.event}</p>
                <p className="text-xs text-foreground/60">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}