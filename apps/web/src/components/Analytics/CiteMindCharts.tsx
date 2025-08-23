/**
 * CiteMind Analytics Charts Component
 * Displays charts for CiteMind KPIs using real backend endpoints
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { 
  getCiteMindSummary, 
  getCiteMindPlatforms, 
  getCiteMindTTC, 
  getCiteMindVisibilityMix 
} from '@/lib/api'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import { Button } from '@/components/common/Button'
import { analytics } from '@/lib/analytics'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface CiteMindChartsProps {
  timeRange: string
  onExport?: (endpoint: string, range: string) => void
}

interface ChartData {
  summary: any
  platforms: any
  ttc: any
  visibilityMix: any
}

export const CiteMindCharts: React.FC<CiteMindChartsProps> = ({ 
  timeRange,
  onExport
}) => {
  const [data, setData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [summaryRes, platformsRes, ttcRes, visibilityRes] = await Promise.all([
        getCiteMindSummary(timeRange),
        getCiteMindPlatforms(timeRange),
        getCiteMindTTC(timeRange),
        getCiteMindVisibilityMix(timeRange)
      ])

      if (!summaryRes.success || !platformsRes.success || !ttcRes.success || !visibilityRes.success) {
        throw new Error('Failed to fetch analytics data')
      }

      setData({
        summary: summaryRes.data,
        platforms: platformsRes.data,
        ttc: ttcRes.data,
        visibilityMix: visibilityRes.data
      })

      // Track analytics view
      analytics.track('analytics_viewed', {
        tab: 'citemind',
        time_range: timeRange,
        charts_loaded: 4
      })

    } catch (err) {
      console.error('Failed to fetch CiteMind analytics:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleExport = (endpoint: string) => {
    analytics.track('analytics_export', {
      endpoint,
      time_range: timeRange,
      format: 'csv'
    })
    onExport?.(endpoint, timeRange)
  }

  const handleRetry = () => {
    fetchData()
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        message={error || 'Failed to load analytics'}
        onRetry={handleRetry}
      />
    )
  }

  if (!data) {
    return (
      <EmptyState
        title="No analytics data available"
        description="No CiteMind analytics data found for the selected time range"
      />
    )
  }

  // Prepare chart data
  const summaryTimeSeriesData = {
    labels: data.summary.time_series?.map((item: any) => 
      new Date(item.date).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'Citation Probability',
        data: data.summary.time_series?.map((item: any) => 
          parseFloat(item.avg_citation_probability) || 0
        ) || [],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Authority Index',
        data: data.summary.time_series?.map((item: any) => 
          item.authority_signal_index || 0
        ) || [],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: false,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  }

  const platformsData = {
    labels: Object.keys(data.platforms.platforms || {}),
    datasets: [{
      label: 'Platform Coverage %',
      data: Object.values(data.platforms.platforms || {}).map((platform: any) => 
        parseFloat(platform.citation_rate) || 0
      ),
      backgroundColor: [
        '#0ea5e9',
        '#22c55e', 
        '#f59e0b',
        '#ef4444'
      ],
      borderWidth: 1
    }]
  }

  const ttcData = {
    labels: Object.keys(data.ttc.metrics?.distribution || {}),
    datasets: [{
      label: 'Citations',
      data: Object.values(data.ttc.metrics?.distribution || {}),
      backgroundColor: '#6366f1',
      borderColor: '#4f46e5',
      borderWidth: 1
    }]
  }

  const visibilityData = {
    labels: data.visibilityMix.visibility_mix?.map((item: any) => 
      new Date(item.date).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'Citation Frequency',
        data: data.visibilityMix.visibility_mix?.map((item: any) => 
          item.citations || 0
        ) || [],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Content Velocity',
        data: data.visibilityMix.visibility_mix?.map((item: any) => 
          item.content || 0
        ) || [],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  }

  const singleAxisOptions = {
    ...chartOptions,
    scales: {
      x: chartOptions.scales.x,
      y: chartOptions.scales.y
    }
  }

  return (
    <div className="space-y-8" data-testid="charts-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Citation Probability & Authority Index Over Time */}
        <div className="bg-white rounded-lg shadow p-6" data-testid="chart-summary">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Citation Probability & Authority Index Over Time
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('summary')}
            >
              Export CSV
            </Button>
          </div>
          <div className="h-64">
            <Line data={summaryTimeSeriesData} options={chartOptions} />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Source: GET /analytics/citemind/summary
          </p>
        </div>

        {/* Platform Coverage */}
        <div className="bg-white rounded-lg shadow p-6" data-testid="chart-platforms">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Platform Coverage by Platform
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('platforms')}
            >
              Export CSV
            </Button>
          </div>
          <div className="h-64">
            <Bar data={platformsData} options={singleAxisOptions} />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Source: GET /analytics/citemind/platforms
          </p>
        </div>

        {/* Time-to-Citation Histogram */}
        <div className="bg-white rounded-lg shadow p-6" data-testid="chart-ttc">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Time-to-Citation Distribution
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('ttc')}
            >
              Export CSV
            </Button>
          </div>
          <div className="h-64">
            <Bar data={ttcData} options={singleAxisOptions} />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Source: GET /analytics/citemind/ttc
          </p>
        </div>

        {/* Citation Frequency vs Content Velocity */}
        <div className="bg-white rounded-lg shadow p-6" data-testid="chart-visibility-mix">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Citation Frequency vs Content Velocity
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('visibility-mix')}
            >
              Export CSV
            </Button>
          </div>
          <div className="h-64">
            <Line data={visibilityData} options={chartOptions} />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Source: GET /analytics/citemind/visibility-mix
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      {data.summary.summary && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Summary Metrics ({timeRange})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(parseFloat(data.summary.summary.avg_citation_probability) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Avg Citation Probability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {data.summary.summary.avg_platform_coverage}%
              </div>
              <div className="text-sm text-gray-600">Platform Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {data.summary.summary.avg_authority_index}
              </div>
              <div className="text-sm text-gray-600">Authority Index</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {data.ttc.metrics?.median_hours || 0}h
              </div>
              <div className="text-sm text-gray-600">Median TTC</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {data.summary.summary.total_citations || 0}
              </div>
              <div className="text-sm text-gray-600">Total Citations</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}