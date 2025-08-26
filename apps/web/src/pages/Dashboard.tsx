import { Activity, BarChart3, Users, Target, FileText } from 'lucide-react'
import { KPIHero } from '../components/v2/KPIHero'
import { QuickActionsRow } from '../components/v2/QuickActionsRow'
import { KpiTile } from '../components/v2/KpiTile'
import { RightRailTile } from '../components/v2/RightRailTile'
import { useDashboardData, useKPINotifications } from '../hooks/useKPIData'
import { trackFlow, FLOWS } from '../services/analyticsService'
import { useEffect } from 'react'

// Icon mapping for secondary KPIs
const ICON_MAP = {
  'content-velocity': FileText,
  'audience-growth': Users,
  'engagement-rate': Target,
  'lead-quality': BarChart3
};


export function Dashboard() {
  // Fetch dashboard data using our KPI service
  const { 
    data: dashboardData, 
    loading, 
    error, 
    refresh 
  } = useDashboardData({
    // Temporarily disable polling to fix infinite render loop
    // pollInterval: 30000, // Poll every 30 seconds
    onError: (error) => {
      console.error('Dashboard data error:', error);
      // Could show a toast notification here
    }
  });
  
  // Handle notifications/alerts
  const { 
    notifications, 
    unreadCount 
  } = useKPINotifications();

  // Track page view and engagement for Phase 3
  useEffect(() => {
    const pageStartTime = Date.now();
    
    // Track dashboard page view
    trackFlow.engagement('page_view', {
      page: 'dashboard',
      has_data: !!dashboardData,
      loading_state: loading,
      error_state: !!error
    });

    // Track time on page when component unmounts
    return () => {
      const timeOnPage = Date.now() - pageStartTime;
      trackFlow.engagement('time_on_page', {
        page: 'dashboard',
        duration_ms: timeOnPage,
        duration_seconds: Math.round(timeOnPage / 1000)
      });
    };
  }, [dashboardData, loading, error]);
  
  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="dashboard-loading">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ai-teal-500 mx-auto"></div>
          <p className="text-foreground/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="dashboard-error">
        <div className="text-center space-y-4">
          <div className="text-danger text-lg">Failed to load dashboard</div>
          <p className="text-foreground/60">{error.message}</p>
          <button 
            onClick={refresh}
            className="px-4 py-2 bg-ai-teal-500 text-white rounded-lg hover:bg-ai-teal-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen" data-testid="dashboard">
      {/* Main grid container */}
      <div className="grid grid-cols-12 gap-6 p-6" data-testid="dashboard-grid">
        
        {/* Loading overlay */}
        {loading && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-background/80 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ai-teal-500"></div>
              <span className="text-sm text-foreground/80">Refreshing...</span>
            </div>
          </div>
        )}
        
        {/* Left Content Area (8 columns) */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Marketing Command Center</h1>
            <p className="text-foreground/60">Monitor your visibility and manage campaigns from your central dashboard</p>
          </div>

          {/* Row 1: KPI Hero (full width) */}
          {dashboardData?.hero && (
            <KPIHero
              score={dashboardData.hero.score}
              label={dashboardData.hero.label}
              delta={dashboardData.hero.delta}
              sparklineData={dashboardData.hero.sparkline?.map(p => p.value) || []}
              miniStats={{
                coverage: dashboardData.miniKPIs.find(k => k.type === 'coverage')?.numericValue || 76,
                authority: dashboardData.miniKPIs.find(k => k.type === 'authority')?.numericValue || 84,
                timeToCitation: dashboardData.miniKPIs.find(k => k.type === 'time-to-convert')?.value || '2.4 days',
                cadence: dashboardData.miniKPIs.find(k => k.type === 'cadence')?.value || '3.2/week'
              }}
              onViewDetails={() => {
                console.log('View details clicked');
                // Could navigate to detailed analytics page
              }}
              onBreakdown={() => {
                console.log('Breakdown clicked');
                // Could show breakdown modal or navigate to breakdown page
              }}
            />
          )}

          {/* Row 2: Quick Actions (full width) */}
          <QuickActionsRow onAction={(action, route) => {
            console.log(`Quick action: ${action}${route ? ` -> ${route}` : ''}`);
            
            // Track completion of quick action flow
            setTimeout(() => {
              trackFlow.complete('success', {
                action,
                route,
                steps_to_action: 1 // Quick actions are 1-step flows
              });
            }, 100);
          }} />

          {/* Row 3: Secondary KPI Tiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData?.secondaryKPIs?.map((kpi) => {
              const IconComponent = ICON_MAP[kpi.type as keyof typeof ICON_MAP] || Activity;
              return (
                <KpiTile
                  key={kpi.id}
                  title={kpi.label}
                  value={kpi.value}
                  delta={kpi.delta}
                  trend={kpi.delta.positive ? 'up' : 'down'}
                  variant="expanded"
                  accentColor={kpi.color === 'success' ? 'teal' : kpi.color === 'warning' ? 'gold' : 'neutral'}
                  icon={IconComponent}
                />
              );
            })}
          </div>

        </div>

        {/* Right Rail (4 columns) */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          
          {/* Wallet Tile */}
          {dashboardData?.wallet && (
            <RightRailTile
              title="Wallet Balance"
              insight={`Your current balance is ${dashboardData.wallet.formatted}. Recent transactions show ${dashboardData.wallet.transactions.length > 0 ? 'active' : 'no'} account activity.`}
              confidence={95}
              category="insight"
              actions={[{
                label: "Manage",
                onClick: () => console.log('Manage wallet clicked'),
                variant: 'secondary'
              }]}
            />
          )}

          {/* PR Queue Tile */}
          {dashboardData?.prQueue && (
            <RightRailTile
              title="PR Queue Status"
              insight={`You have ${dashboardData.prQueue.length} active PR opportunities. Most recent placements showing strong engagement and reach potential.`}
              confidence={88}
              category="trending"
              isPremium={true}
              actions={[{
                label: "View All",
                onClick: () => console.log('View all PR clicked'),
                variant: 'primary'
              }]}
            />
          )}

          {/* Alerts Tile */}
          {notifications && notifications.length > 0 && (
            <RightRailTile
              title="Real-time Alerts"
              insight={`You have ${notifications.length} total alerts with ${unreadCount} requiring immediate attention. Recent activity shows strong engagement opportunities.`}
              confidence={unreadCount > 0 ? 95 : 75}
              category={unreadCount > 0 ? 'alert' : 'insight'}
              actions={[{
                label: "Settings",
                onClick: () => console.log('Alert settings clicked'),
                variant: 'secondary'
              }]}
            />
          )}

          {/* Agent Health Tile */}
          {dashboardData?.agentHealth && (
            <RightRailTile
              title="Agent Health"
              insight={`AI system running at ${dashboardData.agentHealth.uptime.toFixed(1)}% uptime with ${dashboardData.agentHealth.responseTime}ms response time and ${dashboardData.agentHealth.accuracy}% accuracy.`}
              confidence={dashboardData.agentHealth.uptime > 95 ? 98 : 75}
              category="optimization"
              actions={[{
                label: "Diagnostics",
                onClick: () => console.log('Diagnostics clicked'),
                variant: 'secondary'
              }]}
            />
          )}

        </div>
      </div>
    </div>
  );
}