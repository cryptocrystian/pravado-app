import { CheckCircle, Clock, DollarSign, FileText, Calendar } from 'lucide-react'

interface ExecutiveAction {
  id: string
  title: string
  type: 'approval' | 'budget' | 'strategic'
  urgency: 'high' | 'medium' | 'low'
  context: string
  impact: string
  deadline: string
}

interface ExecutiveActionsProps {
  actions: ExecutiveAction[]
  onApproveAction: (actionId: string) => void
  onRequestMoreInfo: (actionId: string) => void
}

export function ExecutiveActions({ actions, onApproveAction, onRequestMoreInfo }: ExecutiveActionsProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle className="w-5 h-5 text-ai" />
      case 'budget': return <DollarSign className="w-5 h-5 text-success" />
      case 'strategic': return <FileText className="w-5 h-5 text-primary" />
      default: return <Clock className="w-5 h-5 text-text-dark/60" />
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-l-danger bg-danger/5'
      case 'medium': return 'border-l-warning bg-warning/5'
      case 'low': return 'border-l-success bg-success/5'
      default: return 'border-l-text-dark/20 bg-text-dark/5'
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-danger/10 text-danger border-danger/30'
      case 'medium': return 'bg-warning/10 text-warning border-warning/30'
      case 'low': return 'bg-success/10 text-success border-success/30'
      default: return 'bg-text-dark/10 text-text-dark/60 border-text-dark/30'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 0) return 'Overdue'
    return `${diffDays} days`
  }

  return (
    <div 
      className="bg-surface-dark rounded-2xl p-6 border border-primary/20" 
      data-testid=\"executive-actions\"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-text-dark">Executive Actions</h3>
            <p className="text-sm text-text-dark/60">Pending approvals & decisions</p>
          </div>
        </div>

        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {actions.length} pending
        </div>
      </div>

      {/* Actions List */}
      <div className="space-y-4">
        {actions.map((action) => (
          <div 
            key={action.id}
            className={`border-l-4 rounded-r-xl p-4 ${getUrgencyColor(action.urgency)} border border-text-dark/10`}
          >
            {/* Action Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">
                  {getTypeIcon(action.type)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-text-dark mb-1">
                    {action.title}
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getUrgencyBadge(action.urgency)}`}>
                      {action.urgency.toUpperCase()} PRIORITY
                    </div>
                    <div className="flex items-center gap-1 text-text-dark/60">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs">
                        Due: {formatDate(action.deadline)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Context */}
            <div className="mb-4">
              <p className="text-sm text-text-dark/80 leading-relaxed">
                {action.context}
              </p>
            </div>

            {/* Impact */}
            <div className="bg-bg-dark/50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-success">PROJECTED IMPACT:</span>
              </div>
              <p className="text-sm text-success font-medium">
                {action.impact}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => onApproveAction(action.id)}
                className="flex-1 bg-success hover:bg-success/90 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                data-testid={`approve-action-${action.id}`}
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              
              <button
                onClick={() => onRequestMoreInfo(action.id)}
                className="px-4 py-2 border border-primary/30 text-primary hover:bg-primary/10 rounded-lg font-medium transition-colors duration-200"
                data-testid={`request-info-${action.id}`}
              >
                More Info
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-text-dark/10">
        <div className="flex items-center justify-between text-sm text-text-dark/60">
          <span>
            {actions.filter(a => a.urgency === 'high').length} high priority, 
            {actions.filter(a => a.urgency === 'medium').length} medium priority
          </span>
          <span>Average approval time: 2.3 hours</span>
        </div>
      </div>
    </div>
  )
}
