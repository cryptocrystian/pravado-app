import { Wallet, FileText, AlertTriangle, Activity, ArrowUpRight } from 'lucide-react'
import { trackFlow } from '../../services/analyticsService'

interface OpsCenterData {
  wallet: {
    credits: number
    spend: number
    monthlyLimit: number
  }
  prQueue: {
    pending: number
    inReview: number
    total: number
  }
  alerts: {
    failures: number
    anomalies: number
    total: number
  }
  agentHealth: {
    runs24h: number
    errors: number
    successRate: number
  }
}

interface OpsCenterProps {
  data: OpsCenterData
}

export function OpsCenter({ data }: OpsCenterProps) {
  const handleWalletClick = () => {
    trackFlow.start('wallet_manage', 'ops_center', {
      credits: data.wallet.credits,
      spend: data.wallet.spend
    })
    window.location.href = '/billing'
  }

  const handlePRQueueClick = () => {
    trackFlow.start('pr_queue_view', 'ops_center', {
      pending_count: data.prQueue.pending,
      total_count: data.prQueue.total
    })
    window.location.href = '/pr-queue'
  }

  const handleAlertsClick = () => {
    trackFlow.start('alerts_view', 'ops_center', {
      failure_count: data.alerts.failures,
      anomaly_count: data.alerts.anomalies
    })
    window.location.href = '/alerts'
  }

  const handleHealthClick = () => {
    trackFlow.start('agent_health_view', 'ops_center', {
      runs_24h: data.agentHealth.runs24h,
      error_count: data.agentHealth.errors,
      success_rate: data.agentHealth.successRate
    })
    window.location.href = '/agents'
  }

  const walletUsagePercent = (data.wallet.spend / data.wallet.monthlyLimit) * 100

  return (
    <div className="space-y-4" data-testid="ops-center">
      {/* Wallet */}
      <div className="glass-card p-4" data-testid="wallet">
        <button
          onClick={handleWalletClick}
          className="w-full text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-ai" />
              <h3 className="font-medium text-foreground">Wallet</h3>
            </div>
            <ArrowUpRight className="h-4 w-4 text-foreground/40 group-hover:text-ai transition-colors" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold text-ai">{data.wallet.credits}</span>
              <span className="text-xs text-foreground/50">credits</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-foreground/60">Spent this month</span>
                <span className="text-foreground">${data.wallet.spend}</span>
              </div>
              <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-ai transition-all duration-500"
                  style={{ width: `${Math.min(walletUsagePercent, 100)}%` }}
                />
              </div>
              <div className="text-xs text-foreground/50 text-right">
                of ${data.wallet.monthlyLimit} limit
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* PR Queue */}
      <div className="glass-card p-4">
        <button
          onClick={handlePRQueueClick}
          className="w-full text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-ai" />
              <h3 className="font-medium text-foreground">PR Queue</h3>
            </div>
            <ArrowUpRight className="h-4 w-4 text-foreground/40 group-hover:text-ai transition-colors" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold text-foreground">{data.prQueue.pending}</span>
              <span className="text-xs text-foreground/50">pending</span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-foreground/60">In review</span>
              <span className="text-premium">{data.prQueue.inReview}</span>
            </div>
            
            <div className="text-xs text-foreground/50">
              {data.prQueue.total} total this month
            </div>
          </div>
        </button>
      </div>

      {/* Alerts */}
      <div className="glass-card p-4">
        <button
          onClick={handleAlertsClick}
          className="w-full text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-premium" />
              <h3 className="font-medium text-foreground">Alerts</h3>
            </div>
            <ArrowUpRight className="h-4 w-4 text-foreground/40 group-hover:text-ai transition-colors" />
          </div>
          
          <div className="space-y-2">
            {data.alerts.total > 0 ? (
              <>
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold text-premium">{data.alerts.total}</span>
                  <span className="text-xs text-foreground/50">active</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground/60">Failures</span>
                    <span className="text-foreground">{data.alerts.failures}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground/60">Anomalies</span>
                    <span className="text-foreground">{data.alerts.anomalies}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <div className="text-lg font-medium text-ai">All Clear</div>
                <div className="text-xs text-foreground/50">No active alerts</div>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Agent Health */}
      <div className="glass-card p-4">
        <button
          onClick={handleHealthClick}
          className="w-full text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-ai" />
              <h3 className="font-medium text-foreground">Agent Health</h3>
            </div>
            <ArrowUpRight className="h-4 w-4 text-foreground/40 group-hover:text-ai transition-colors" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold text-foreground">{data.agentHealth.runs24h}</span>
              <span className="text-xs text-foreground/50">runs 24h</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-foreground/60">Success rate</span>
                <span className="text-ai">{data.agentHealth.successRate}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground/60">Errors</span>
                <span className={data.agentHealth.errors > 0 ? 'text-premium' : 'text-foreground'}>
                  {data.agentHealth.errors}
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}