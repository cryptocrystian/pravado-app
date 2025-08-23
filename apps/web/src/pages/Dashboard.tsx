import { useEffect } from 'react'
import DashboardHeader from '@/components/Dashboard/DashboardHeader'
import { KPIGrid } from '@/components/Dashboard/MetricCard'
import { CiteMindSummary } from '@/components/Dashboard/CiteMindTiles'
import { useDashboardMetrics, useDashboardLoading, useDashboardError, useDashboardStore } from '@/lib/store'
import { trackDashboardViewed, trackMetricClicked, trackFeatureUsed } from '@/lib/analytics'
import ErrorState from '@/components/common/ErrorState'

export default function Dashboard() {
  const metrics = useDashboardMetrics()
  const isLoading = useDashboardLoading()
  const error = useDashboardError()
  const { fetchMetrics } = useDashboardStore()

  useEffect(() => {
    trackDashboardViewed()
    if (!metrics.length && !isLoading) {
      fetchMetrics()
    }
  }, [metrics.length, isLoading, fetchMetrics])

  const handleRefresh = () => {
    trackFeatureUsed('dashboard_refresh')
    fetchMetrics()
  }

  const handleExport = () => {
    trackFeatureUsed('dashboard_export')
    // TODO: Implement export functionality
    console.log('Export dashboard data')
  }

  const handleMetricClick = (metric: any) => {
    trackMetricClicked(metric.id, metric.label)
    // TODO: Navigate to detailed view or open modal
    console.log('Metric clicked:', metric)
  }

  if (error && !metrics.length) {
    return (
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        <ErrorState
          message={error}
          onRetry={fetchMetrics}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardHeader
        lastUpdated={null} // This would come from the store
        isLoading={isLoading}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      {/* CiteMind KPI Tiles */}
      <CiteMindSummary />

      {/* General KPI Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          System Performance
        </h2>
        <KPIGrid
          metrics={metrics}
          onMetricClick={handleMetricClick}
        />
      </div>

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </div>
          <div className="card-body">
            <div className="text-center py-12 text-gray-500">
              <p>Recent activity tracking coming soon...</p>
              <p className="text-sm mt-2">
                This section will show real-time updates and system events.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 gap-3">
              <button 
                className="btn btn-primary text-left justify-start"
                onClick={() => trackFeatureUsed('quick_action_analytics')}
              >
                View Analytics Dashboard
              </button>
              <button 
                className="btn btn-secondary text-left justify-start"
                onClick={() => trackFeatureUsed('quick_action_export')}
              >
                Export Data
              </button>
              <button 
                className="btn btn-secondary text-left justify-start"
                onClick={() => trackFeatureUsed('quick_action_settings')}
              >
                Configure Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">System Status</h3>
          </div>
          <div className="card-body">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success-500 rounded-full mr-3" />
                <span className="text-gray-900">All systems operational</span>
              </div>
              <span className="text-sm text-gray-500">
                Last checked: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}