import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, X } from 'lucide-react'
import { env, validateEnvironment } from '../lib/env'

interface DiagnosticBannerProps {
  className?: string;
}

export function DiagnosticBanner({ className }: DiagnosticBannerProps) {
  const [error, setError] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    setIsPreview(env.IS_PREVIEW || env.IS_DEV)
    
    if (!env.IS_PREVIEW && !env.IS_DEV) return

    // Listen for runtime errors
    const handleError = (event: ErrorEvent) => {
      if (!dismissed) {
        setError(`Runtime Error: ${event.message}`)
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (!dismissed) {
        setError(`Unhandled Promise: ${event.reason}`)
      }
    }

    // Listen for environment warnings from our env utility
    const handleEnvWarning = (event: CustomEvent) => {
      if (!dismissed && event.detail?.missing) {
        setError(`Missing env var: ${event.detail.missing}`)
      }
    }

    // Check environment configuration
    const checkEnvironment = () => {
      const validation = validateEnvironment()
      if (!validation.isValid && !dismissed) {
        setError(`Config issues: ${validation.errors.join(', ')}`)
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('env-warning', handleEnvWarning as EventListener)
    
    // Check environment after a brief delay
    setTimeout(checkEnvironment, 500)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('env-warning', handleEnvWarning as EventListener)
    }
  }, [dismissed])

  // Don't show banner in production or if dismissed
  if (!isPreview || dismissed) return null

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-[999] pointer-events-none ${className || ''}`}
    >
      <div className={`
        m-2 p-3 rounded-lg backdrop-blur-sm border pointer-events-auto
        ${error 
          ? 'bg-red-500/10 border-red-500/30 text-red-200' 
          : 'bg-green-500/10 border-green-500/30 text-green-200'
        }
      `}>
        <div className="flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            {error ? (
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            ) : (
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
            )}
            <span className="font-medium">
              {error || 'Preview Environment - All systems healthy'}
            </span>
          </div>
          
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}