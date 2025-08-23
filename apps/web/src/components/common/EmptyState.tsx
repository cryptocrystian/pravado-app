import { FileX, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EmptyStateProps } from '@/types'

export default function EmptyState({
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-6 text-center',
      className
    )}>
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <FileX className="w-6 h-6 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {action.label}
        </button>
      )}
    </div>
  )
}

// Specialized empty state components
export function NoDataState({
  title = "No data available",
  description = "There's no data to display at the moment. Try adjusting your filters or check back later.",
  onRefresh
}: {
  title?: string
  description?: string
  onRefresh?: () => void
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={onRefresh ? {
        label: "Refresh Data",
        onClick: onRefresh
      } : undefined}
    />
  )
}

export function NoSearchResultsState({
  query,
  onClearSearch
}: {
  query: string
  onClearSearch?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Search className="w-6 h-6 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No results found
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        We couldn't find any results for "{query}". Try adjusting your search terms.
      </p>
      
      {onClearSearch && (
        <button
          onClick={onClearSearch}
          className="btn btn-secondary"
        >
          Clear Search
        </button>
      )}
    </div>
  )
}

export function ComingSoonState({
  feature = "This feature",
  description = "We're working hard to bring you this feature. Stay tuned for updates!"
}: {
  feature?: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-6">
        <div className="w-8 h-8 rounded-full bg-primary-600 animate-pulse" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {feature} is coming soon
      </h3>
      
      <p className="text-gray-600 max-w-md">
        {description}
      </p>
    </div>
  )
}