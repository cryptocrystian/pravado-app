import { RefreshCw, Calendar, Download } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface DashboardHeaderProps {
  lastUpdated?: string | null
  isLoading?: boolean
  onRefresh?: () => void
  onExport?: () => void
}

export default function DashboardHeader({
  lastUpdated,
  isLoading = false,
  onRefresh,
  onExport
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        {lastUpdated && (
          <p className="text-gray-600 mt-1 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Last updated {formatDate(lastUpdated, 'long')}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="btn btn-secondary btn-sm inline-flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        )}

        {onExport && (
          <button
            onClick={onExport}
            className="btn btn-primary btn-sm inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        )}
      </div>
    </div>
  )
}