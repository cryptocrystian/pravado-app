import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })

    // In preview/dev environments, also send to diagnostic banner
    if (import.meta.env.DEV || window.location.hostname.includes('preview')) {
      window.dispatchEvent(new CustomEvent('app-error', { 
        detail: { message: error.message, stack: error.stack } 
      }))
    }
  }

  handleRefresh = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold">Something went wrong</h1>
                <p className="text-foreground/60">
                  We encountered an unexpected error. Please try refreshing the page.
                </p>
              </div>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="text-left bg-red-500/5 border border-red-500/20 rounded-lg p-4 text-sm">
                <p className="font-medium text-red-400 mb-2">Error Details:</p>
                <pre className="text-red-300 whitespace-pre-wrap break-all">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRefresh}
                className="inline-flex items-center gap-2 px-4 py-2 bg-ai-teal-600 hover:bg-ai-teal-500 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-4 py-2 bg-panel hover:bg-panel-elevated border border-border text-foreground rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}