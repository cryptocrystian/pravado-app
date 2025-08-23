import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { useSelectedTimeRange } from '@/lib/store'
import { analytics } from '@/lib/analytics'
import { CiteMindCharts } from './CiteMindCharts'
import { Button } from '@/components/common/Button'

// CiteMind Analytics endpoints mapping
const ENDPOINT_MAPPING = {
  'summary': 'summary',
  'platforms': 'platforms', 
  'ttc': 'ttc',
  'visibility-mix': 'visibility-mix'
}

export default function CiteMindDashboard() {
  const selectedTimeRange = useSelectedTimeRange()
  const [isExporting, setIsExporting] = useState<string | null>(null)

  useEffect(() => {
    // Track CiteMind tab access
    analytics.track('analytics_viewed', {
      tab: 'citemind',
      time_range: selectedTimeRange
    })
  }, [selectedTimeRange])

  const handleExport = async (endpoint: string, range: string) => {
    try {
      setIsExporting(endpoint)
      
      // Track export event
      analytics.track('analytics_export', {
        endpoint,
        time_range: range,
        format: 'csv'
      })

      // Construct API URL for CSV export
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://pravado-api.workers.dev'
      const csvUrl = `${baseUrl}/analytics/citemind/${ENDPOINT_MAPPING[endpoint as keyof typeof ENDPOINT_MAPPING]}?range=${range}&format=csv`
      
      // Create download link
      const link = document.createElement('a')
      link.href = csvUrl
      link.download = `citemind-${endpoint}-${range}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('Export failed:', error)
      // Could show error toast here
    } finally {
      setIsExporting(null)
    }
  }


  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CiteMind Analytics</h2>
          <p className="text-gray-600 mt-1">
            Citation probability, platform coverage, and authority metrics
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('summary', selectedTimeRange)}
            disabled={isExporting === 'summary'}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isExporting === 'summary' ? 'Exporting...' : 'Export All'}
          </Button>
        </div>
      </div>

      {/* Charts Component */}
      <CiteMindCharts
        timeRange={selectedTimeRange}
        onExport={handleExport}
      />

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              analytics.track('citemind_action', { action: 'view_detailed_report' })
              // Navigate to detailed report
            }}
            className="flex items-center justify-center gap-2 py-3"
          >
            📊 Detailed Report
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              analytics.track('citemind_action', { action: 'schedule_report' })
              // Open schedule modal
            }}
            className="flex items-center justify-center gap-2 py-3"
          >
            ⏰ Schedule Report
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              analytics.track('citemind_action', { action: 'configure_alerts' })
              // Open alerts config
            }}
            className="flex items-center justify-center gap-2 py-3"
          >
            🔔 Configure Alerts
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              analytics.track('citemind_action', { action: 'integration_settings' })
              // Open integration settings
            }}
            className="flex items-center justify-center gap-2 py-3"
          >
            ⚙️ Integration Settings
          </Button>
        </div>
      </div>
    </div>
  )
}


