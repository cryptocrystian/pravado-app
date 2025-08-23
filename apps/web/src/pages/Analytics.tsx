import { useEffect, useState } from 'react'
import TimeRangeSelector from '@/components/Analytics/TimeRangeSelector'
import CiteMindDashboard from '@/components/Analytics/CiteMindDashboard'
import Tabs from '@/components/common/Tabs'
import { ComingSoonState } from '@/components/common/EmptyState'
import { useSelectedTimeRange, useAnalyticsStore } from '@/lib/store'
import { trackAnalyticsViewed, trackTimeRangeChanged, trackFeatureUsed } from '@/lib/analytics'
import type { TabConfig } from '@/types'

export default function Analytics() {
  const selectedTimeRange = useSelectedTimeRange()
  const { setTimeRange } = useAnalyticsStore()
  const [activeTab, setActiveTab] = useState('citemind')

  useEffect(() => {
    trackAnalyticsViewed(activeTab)
  }, [activeTab])

  const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | '1y') => {
    trackTimeRangeChanged(range, 'analytics')
    setTimeRange(range)
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    trackAnalyticsViewed(tabId)
  }

  const tabs: TabConfig[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <ComingSoonState
          feature="Analytics Overview"
          description="Get a comprehensive view of all your analytics in one place. This section will include key insights, trends, and summaries from all data sources."
        />
      ),
    },
    {
      id: 'citemind',
      label: 'CiteMind',
      content: <CiteMindDashboard />,
    },
    {
      id: 'performance',
      label: 'Performance',
      content: (
        <ComingSoonState
          feature="Performance Analytics"
          description="Track system performance metrics, API response times, and resource utilization. Monitor the health and efficiency of your PRAVADO platform."
        />
      ),
    },
    {
      id: 'insights',
      label: 'AI Insights',
      content: (
        <ComingSoonState
          feature="AI-Powered Insights"
          description="Discover automated insights and recommendations powered by machine learning. Get actionable intelligence from your data patterns."
        />
      ),
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights and data visualization
          </p>
        </div>

        <TimeRangeSelector
          value={selectedTimeRange}
          onChange={handleTimeRangeChange}
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs
        tabs={tabs}
        defaultTab="citemind"
        onChange={handleTabChange}
      />

      {/* Additional Tools */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Analytics Tools
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => trackFeatureUsed('analytics_tool_export')}>
            <div className="card-body text-center">
              <h4 className="font-medium text-gray-900 mb-2">Data Export</h4>
              <p className="text-sm text-gray-600">
                Export analytics data in various formats (CSV, JSON, PDF)
              </p>
            </div>
          </div>

          <div className="card hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => trackFeatureUsed('analytics_tool_scheduled')}>
            <div className="card-body text-center">
              <h4 className="font-medium text-gray-900 mb-2">Scheduled Reports</h4>
              <p className="text-sm text-gray-600">
                Set up automated reports delivered to your inbox
              </p>
            </div>
          </div>

          <div className="card hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => trackFeatureUsed('analytics_tool_alerts')}>
            <div className="card-body text-center">
              <h4 className="font-medium text-gray-900 mb-2">Smart Alerts</h4>
              <p className="text-sm text-gray-600">
                Configure alerts for important metric changes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}