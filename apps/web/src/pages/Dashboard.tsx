import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react'
import { KPIHero } from '../components/dashboard/KPIHero'
import { AIRecommendations } from '../components/dashboard/AIRecommendations'
import { Operations } from '../components/dashboard/Operations'
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline'
import { QuickActions } from '../components/dashboard/QuickActions'

export function Dashboard() {
  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Main Dashboard Grid */}
      <div data-surface="content" className="p-6 md:p-8">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
          {/* Band A - Executive Summary */}
          <div className="col-span-12">
            <div className="grid grid-cols-12 gap-6">
              {/* KPI Hero - Left */}
              <div className="col-span-12 lg:col-span-7">
                <KPIHero />
              </div>
              
              {/* Mini KPIs - Right */}
              <div className="col-span-12 lg:col-span-5">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <MiniKPI
                    label="Coverage"
                    value="87%"
                    trend="+5%"
                    isPositive={true}
                  />
                  <MiniKPI
                    label="Authority Index"
                    value="72"
                    trend="+3"
                    isPositive={true}
                  />
                  <MiniKPI
                    label="Time-to-Citation"
                    value="4.2d"
                    trend="-0.8d"
                    isPositive={true}
                    subtitle="median"
                  />
                  <MiniKPI
                    label="Publishing Cadence"
                    value="12/mo"
                    trend="+2"
                    isPositive={true}
                    subtitle="30d avg"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Band B - AI Recommendations */}
          <div className="col-span-12">
            <AIRecommendations />
          </div>
          
          {/* Band C - Operations */}
          <div className="col-span-12">
            <Operations />
          </div>
          
          {/* Band D - Activity Timeline */}
          <div className="col-span-12">
            <ActivityTimeline />
          </div>
        </div>
      </div>
      
      {/* Quick Actions Bar */}
      <QuickActions />
    </div>
  )
}

// Mini KPI Component
function MiniKPI({ 
  label, 
  value, 
  trend, 
  isPositive, 
  subtitle 
}: {
  label: string
  value: string
  trend: string
  isPositive: boolean
  subtitle?: string
}) {
  return (
    <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left group">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm text-gray-400">{label}</p>
        <MoreHorizontal className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-white">{value}</span>
        {subtitle && (
          <span className="text-xs text-gray-500">{subtitle}</span>
        )}
      </div>
      <div className={`flex items-center gap-1 mt-1 text-sm ${isPositive ? 'chip-delta-up' : 'chip-delta-down'}`}>
        {isPositive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        {trend}
      </div>
    </button>
  )
}