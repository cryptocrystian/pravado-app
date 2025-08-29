interface ExecutiveActionsProps {
  actions?: any[];
  onApproveAction?: (actionId: string) => void;
  onRequestMoreInfo?: (actionId: string) => void;
}

export function ExecutiveActions({ actions, onApproveAction, onRequestMoreInfo }: ExecutiveActionsProps) {
  return (
    <div className="bg-surface rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-text-primary">Executive Actions</h3>
      <p className="text-text-secondary">Approval queue with impact assessments.</p>
      
      {actions && actions.length > 0 && (
        <div className="mt-4 space-y-3">
          {actions.map((action, index) => (
            <div key={action.id || index} className="p-4 bg-ai-teal/10 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-ai-teal">{action.title}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  action.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                  action.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {action.urgency}
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-2">{action.impact}</p>
              <div className="flex gap-2">
                {onApproveAction && (
                  <button 
                    onClick={() => onApproveAction(action.id)}
                    className="px-3 py-1 bg-ai-teal text-white rounded text-xs hover:bg-ai-teal/80"
                  >
                    Approve
                  </button>
                )}
                {onRequestMoreInfo && (
                  <button 
                    onClick={() => onRequestMoreInfo(action.id)}
                    className="px-3 py-1 border border-ai-teal text-ai-teal rounded text-xs hover:bg-ai-teal/10"
                  >
                    More Info
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}