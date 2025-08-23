import { AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ErrorStateProps } from '@/types'

export default function ErrorState({
  message,
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-6 text-center',
      className
    )}>
      <div className="w-12 h-12 rounded-full bg-error-100 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-error-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}

// Specialized error components
export function ApiErrorState({ 
  error, 
  onRetry,
  context = 'data'
}: { 
  error: string
  onRetry?: () => void
  context?: string
}) {
  const getErrorMessage = (error: string) => {
    if (error.includes('404')) {
      return `The requested ${context} could not be found. It may have been moved or deleted.`
    }
    if (error.includes('500')) {
      return 'Our servers are experiencing issues. Please try again in a few moments.'
    }
    if (error.includes('403')) {
      return 'You do not have permission to access this resource.'
    }
    if (error.includes('401')) {
      return 'Your session has expired. Please log in again.'
    }
    if (error.toLowerCase().includes('network')) {
      return 'Unable to connect to our servers. Please check your internet connection.'
    }
    return error || 'An unexpected error occurred while loading the data.'
  }

  return (
    <ErrorState
      message={getErrorMessage(error)}
      onRetry={onRetry}
    />
  )
}

export function ChartErrorState({ 
  error,
  onRetry 
}: { 
  error: string
  onRetry?: () => void 
}) {
  return (
    <div className="card">
      <div className="card-body py-12">
        <ErrorState
          message={error || 'Failed to load chart data'}
          onRetry={onRetry}
        />
      </div>
    </div>
  )
}