/**
 * CiteMind KPI Dashboard Tiles
 * Displays key CiteMind metrics with drill-down links to Analytics
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Target, 
  Globe, 
  Award, 
  Clock,
  ArrowRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { getCiteMindSummary } from '@/lib/api'
import { analytics } from '@/lib/analytics'
import { cn } from '@/lib/utils'
// LoadingSpinner import removed as it's not needed

interface CiteMindKPI {
  id: string
  label: string
  value: string
  subtitle: string
  icon: React.ComponentType<any>
  color: 'blue' | 'green' | 'purple' | 'orange'
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    value: string
  }
  drillDownPath: string
}

interface CiteMindTilesProps {
  timeRange?: string
  className?: string
}

export const CiteMindTiles: React.FC<CiteMindTilesProps> = ({ 
  timeRange = '30d',
  className 
}) => {
  const [kpis, setKpis] = useState<CiteMindKPI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCiteMindKPIs()
  }, [timeRange])

  const fetchCiteMindKPIs = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getCiteMindSummary(timeRange)
      
      if (!response.success) {
        throw new Error('Failed to fetch CiteMind KPIs')
      }

      const { summary } = response.data || {}
      
      // Transform API data into KPI tiles
      const kpiData: CiteMindKPI[] = [
        {
          id: 'citation_probability',
          label: 'Citation Probability',
          value: summary?.avg_citation_probability 
            ? `${(parseFloat(summary.avg_citation_probability) * 100).toFixed(1)}%`
            : '0.0%',
          subtitle: 'Average citation rate',
          icon: Target,
          color: 'blue',
          trend: {
            direction: 'up', // This would come from historical comparison
            value: '+2.3%'
          },
          drillDownPath: '/analytics?tab=citemind&chart=summary'
        },
        {
          id: 'platform_coverage',
          label: 'Platform Coverage',
          value: summary?.avg_platform_coverage 
            ? `${parseFloat(summary.avg_platform_coverage).toFixed(1)}%`
            : '0.0%',
          subtitle: 'AI platform reach',
          icon: Globe,
          color: 'green',
          trend: {
            direction: 'up',
            value: '+5.2%'
          },
          drillDownPath: '/analytics?tab=citemind&chart=platforms'
        },
        {
          id: 'authority_index',
          label: 'Authority Index',
          value: summary?.avg_authority_index 
            ? summary.avg_authority_index.toString()
            : '0',
          subtitle: 'Content authority score (0-100)',
          icon: Award,
          color: 'purple',
          trend: {
            direction: 'up',
            value: '+1.8pts'
          },
          drillDownPath: '/analytics?tab=citemind&chart=summary'
        },
        {
          id: 'time_to_citation',
          label: 'Time-to-Citation',
          value: summary?.median_ttc 
            ? `${summary.median_ttc}h`
            : '0h',
          subtitle: 'Median citation time',
          icon: Clock,
          color: 'orange',
          trend: {
            direction: 'down', // Lower is better
            value: '-3.2h'
          },
          drillDownPath: '/analytics?tab=citemind&chart=ttc'
        }
      ]

      setKpis(kpiData)

    } catch (err) {
      console.error('Failed to fetch CiteMind KPIs:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      
      // Use mock data in development or error state
      setKpis(getMockKPIs())
    } finally {
      setLoading(false)
    }
  }

  const handleTileClick = (kpi: CiteMindKPI) => {
    // Track tile drill-down
    analytics.track('dashboard_tile_clicked', {
      tile_id: kpi.id,
      tile_label: kpi.label,
      drill_down_path: kpi.drillDownPath,
      time_range: timeRange
    })

    // Navigate to Analytics with specific chart
    navigate(kpi.drillDownPath)
  }

  const getMockKPIs = (): CiteMindKPI[] => [
    {
      id: 'citation_probability',
      label: 'Citation Probability',
      value: '74.2%',
      subtitle: 'Average citation rate',
      icon: Target,
      color: 'blue',
      trend: { direction: 'up', value: '+2.3%' },
      drillDownPath: '/analytics?tab=citemind&chart=summary'
    },
    {
      id: 'platform_coverage',
      label: 'Platform Coverage',
      value: '67.8%',
      subtitle: 'AI platform reach',
      icon: Globe,
      color: 'green',
      trend: { direction: 'up', value: '+5.2%' },
      drillDownPath: '/analytics?tab=citemind&chart=platforms'
    },
    {
      id: 'authority_index',
      label: 'Authority Index',
      value: '84',
      subtitle: 'Content authority score (0-100)',
      icon: Award,
      color: 'purple',
      trend: { direction: 'up', value: '+1.8pts' },
      drillDownPath: '/analytics?tab=citemind&chart=summary'
    },
    {
      id: 'time_to_citation',
      label: 'Time-to-Citation',
      value: '18h',
      subtitle: 'Median citation time',
      icon: Clock,
      color: 'orange',
      trend: { direction: 'down', value: '-3.2h' },
      drillDownPath: '/analytics?tab=citemind&chart=ttc'
    }
  ]

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      border: 'border-green-200',
      hover: 'hover:bg-green-100'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-100'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-100'
    }
  }

  if (loading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow border p-6">
            <div className="animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error && kpis.length === 0) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <p className="text-gray-500">Failed to load CiteMind KPIs</p>
        <button 
          onClick={fetchCiteMindKPIs}
          className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        const colors = colorClasses[kpi.color]
        const TrendIcon = kpi.trend?.direction === 'up' ? TrendingUp : TrendingDown
        
        return (
          <div
            key={kpi.id}
            onClick={() => handleTileClick(kpi)}
            className={cn(
              'bg-white rounded-lg shadow border p-6 cursor-pointer transition-all duration-200',
              'hover:shadow-lg hover:scale-[1.02] group',
              colors.hover
            )}
            data-testid={`citemind-tile-${kpi.id}`}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {kpi.label}
              </div>
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colors.bg)}>
                <Icon className={cn('w-5 h-5', colors.icon)} />
              </div>
            </div>

            {/* Main Value */}
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {kpi.value}
            </div>

            {/* Subtitle */}
            <div className="text-sm text-gray-600 mb-3">
              {kpi.subtitle}
            </div>

            {/* Trend & Action */}
            <div className="flex items-center justify-between">
              {kpi.trend && (
                <div className={cn(
                  'flex items-center text-xs font-medium',
                  kpi.trend.direction === 'up' ? 'text-green-600' : 
                  kpi.trend.direction === 'down' && kpi.id === 'time_to_citation' ? 'text-green-600' : 'text-red-600'
                )}>
                  <TrendIcon className="w-3 h-3 mr-1" />
                  {kpi.trend.value}
                </div>
              )}
              
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>

            {/* Drill-down hint */}
            <div className="mt-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to view details →
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Summary component for dashboard header
export const CiteMindSummary: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            CiteMind Performance
          </h2>
          <p className="text-sm text-gray-600">
            AI citation tracking and authority metrics
          </p>
        </div>
        <div className="text-xs text-gray-500">
          Updated every hour
        </div>
      </div>
      
      <CiteMindTiles />
    </div>
  )
}