import { AlertTriangle, Bell, X } from 'lucide-react'

interface Alert {
  id: string
  title: string
  message: string
  type: 'warning' | 'info' | 'error'
  timestamp: string
}

interface AlertsProps {
  alerts: Alert[]
  onDismiss?: (id: string) => void
}

const typeConfig = {
  warning: { color: 'bg-warning/10 text-warning border-warning/20', icon: AlertTriangle },
  info: { color: 'bg-ai-teal/10 text-ai-teal border-ai-teal/20', icon: Bell },
  error: { color: 'bg-danger/10 text-danger border-danger/20', icon: AlertTriangle },
}

export function Alerts({ alerts, onDismiss }: AlertsProps) {
  const criticalAlerts = alerts.filter(a => a.type === 'error' || a.type === 'warning')
  
  return (
    <div className="bg-white dark:bg-surface-dark rounded-lg p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Alerts
        </h3>
        {criticalAlerts.length > 0 && (
          <span className="bg-danger text-white text-xs rounded-full px-2 py-1 font-medium">
            {criticalAlerts.length}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">All clear! No alerts.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const config = typeConfig[alert.type]
            const Icon = config.icon
            
            return (
              <div key={alert.id} className={`p-3 rounded border ${config.color}`}>
                <div className="flex items-start space-x-2">
                  <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs mt-1 opacity-90">{alert.message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {onDismiss && (
                    <button
                      onClick={() => onDismiss(alert.id)}
                      className="p-1 hover:bg-black/10 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}