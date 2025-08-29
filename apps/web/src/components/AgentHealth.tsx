import { Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface Agent {
  id: string
  name: string
  status: 'healthy' | 'warning' | 'error' | 'offline'
  lastActive: string
  uptime: number
}

interface AgentHealthProps {
  agents: Agent[]
}

const statusConfig = {
  healthy: { color: 'text-success', bgColor: 'bg-success/10', icon: CheckCircle },
  warning: { color: 'text-warning', bgColor: 'bg-warning/10', icon: AlertTriangle },
  error: { color: 'text-danger', bgColor: 'bg-danger/10', icon: XCircle },
  offline: { color: 'text-gray-400', bgColor: 'bg-gray-100', icon: XCircle },
}

export function AgentHealth({ agents }: AgentHealthProps) {
  const healthyCount = agents.filter(a => a.status === 'healthy').length
  const warningCount = agents.filter(a => a.status === 'warning').length
  const errorCount = agents.filter(a => a.status === 'error' || a.status === 'offline').length

  return (
    <div className="bg-white dark:bg-surface-dark rounded-lg p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-ai-teal" />
          <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
            Agent Health
          </h3>
        </div>
      </div>
      
      {/* Overview */}
      <div className="flex space-x-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
        <div className="text-center">
          <div className="text-lg font-bold text-success">{healthyCount}</div>
          <div className="text-xs text-gray-500">Healthy</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-warning">{warningCount}</div>
          <div className="text-xs text-gray-500">Warning</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-danger">{errorCount}</div>
          <div className="text-xs text-gray-500">Issues</div>
        </div>
      </div>
      
      {/* Agent List */}
      <div className="space-y-2">
        {agents.map((agent) => {
          const config = statusConfig[agent.status]
          const Icon = config.icon
          
          return (
            <div key={agent.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className={`p-1 rounded ${config.bgColor}`}>
                <Icon className={`w-3 h-3 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  {agent.name}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>Uptime: {agent.uptime}%</span>
                  <span>•</span>
                  <span>Last: {new Date(agent.lastActive).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}