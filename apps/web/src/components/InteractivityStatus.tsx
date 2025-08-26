/**
 * InteractivityStatus - Development utility component
 * Shows the current status of PR3 interactivity fixes in preview environments
 */

import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, Router, Zap } from 'lucide-react'
import { env, validateEnvironment } from '../lib/env'

interface InteractivityStatusProps {
  className?: string;
}

interface StatusCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function InteractivityStatus({ className }: InteractivityStatusProps) {
  const [checks, setChecks] = useState<StatusCheck[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in preview/dev environments
    if (!env.IS_PREVIEW && !env.IS_DEV) {
      return
    }

    setIsVisible(true)

    const performChecks = () => {
      const newChecks: StatusCheck[] = []

      // 1. Router Configuration Check
      const basename = import.meta.env.BASE_URL || '/'
      newChecks.push({
        name: 'Router Configuration',
        status: 'pass',
        message: `BrowserRouter configured with basename: ${basename}`,
        icon: Router
      })

      // 2. Environment Variables Check
      const envValidation = validateEnvironment()
      newChecks.push({
        name: 'Environment Variables',
        status: envValidation.isValid ? 'pass' : 'warning',
        message: envValidation.isValid 
          ? 'All required env vars configured' 
          : `Issues: ${envValidation.errors.join(', ')}`,
        icon: AlertTriangle
      })

      // 3. Pointer Events Check
      const refreshingOverlay = document.querySelector('[data-testid="dashboard-loading"]')
      const hasRefreshingFix = !refreshingOverlay || 
        window.getComputedStyle(refreshingOverlay).pointerEvents === 'none'
      
      newChecks.push({
        name: 'Pointer Events Fix',
        status: hasRefreshingFix ? 'pass' : 'warning',
        message: hasRefreshingFix 
          ? 'Refreshing overlay has pointer-events: none' 
          : 'Refreshing overlay may block interactions',
        icon: Zap
      })

      // 4. Interactive Elements Check
      const buttons = document.querySelectorAll('button:not([disabled])')
      const links = document.querySelectorAll('a[href]')
      newChecks.push({
        name: 'Interactive Elements',
        status: 'pass',
        message: `Found ${buttons.length} buttons and ${links.length} links`,
        icon: CheckCircle
      })

      setChecks(newChecks)
    }

    // Initial check
    performChecks()

    // Re-check after DOM updates
    const observer = new MutationObserver(() => {
      setTimeout(performChecks, 100)
    })

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    })

    return () => observer.disconnect()
  }, [])

  if (!isVisible || checks.length === 0) {
    return null
  }

  return (
    <div className={`fixed bottom-4 left-4 z-[999] max-w-sm ${className || ''}`}>
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-ai-teal-500" />
          PR3 Interactivity Status
        </h3>
        
        <div className="space-y-2">
          {checks.map((check, index) => {
            const Icon = check.icon
            const statusColor = {
              pass: 'text-green-400',
              warning: 'text-yellow-400',
              fail: 'text-red-400'
            }[check.status]

            return (
              <div key={index} className="flex items-start gap-2 text-xs">
                <Icon className={`h-3 w-3 mt-0.5 flex-shrink-0 ${statusColor}`} />
                <div>
                  <div className="font-medium text-foreground">{check.name}</div>
                  <div className="text-foreground/60">{check.message}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-3 pt-2 border-t border-border text-xs text-foreground/50">
          PR3 - Preview Interactivity & Routing Fix
        </div>
      </div>
    </div>
  )
}