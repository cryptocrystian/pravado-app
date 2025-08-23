import { cn } from '@/lib/utils'
import type { LoadingSkeletonProps } from '@/types'

export default function LoadingSkeleton({ 
  className, 
  count = 1 
}: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'loading-skeleton h-4 w-full',
            className
          )}
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
    </>
  )
}

// Specialized skeleton components
export function MetricCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card animate-pulse', className)}>
      <div className="card-body space-y-3">
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-5 w-24" />
          <LoadingSkeleton className="h-5 w-5 rounded" />
        </div>
        <LoadingSkeleton className="h-8 w-20" />
        <div className="flex items-center space-x-2">
          <LoadingSkeleton className="h-4 w-4 rounded" />
          <LoadingSkeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card animate-pulse', className)}>
      <div className="card-header">
        <LoadingSkeleton className="h-6 w-32" />
      </div>
      <div className="card-body">
        <div className="h-64 bg-gray-100 rounded-lg flex items-end justify-between p-4 space-x-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-8 bg-gray-200 animate-pulse rounded"
              style={{ height: `${Math.random() * 60 + 20}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  className 
}: { 
  rows?: number
  columns?: number
  className?: string 
}) {
  return (
    <div className={cn('card animate-pulse', className)}>
      <div className="card-body p-0">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-4 w-20" />
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-6 border-b border-gray-100 last:border-b-0">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex} 
                  className="h-4 animate-pulse bg-gray-200 rounded"
                  style={{ width: `${80 + Math.random() * 40}px` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}