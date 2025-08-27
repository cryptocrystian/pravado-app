import { Check, MessageSquare, Clock, Pause } from 'lucide-react'
import { AIRecommendation } from '../types'

interface AIRecommendationCardProps {
  recommendation: AIRecommendation
  onApprove?: (id: string) => void
  onAskCopilot?: (id: string) => void
  onQueue?: (id: string) => void
}

export function AIRecommendationCard({ 
  recommendation, 
  onApprove, 
  onAskCopilot, 
  onQueue 
}: AIRecommendationCardProps) {
  const { id, title, description, confidence, impact } = recommendation

  return (
    <div className="bg-white dark:bg-surface-dark rounded-lg p-4 shadow-sm border border-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>

      {/* Confidence and Impact chips */}
      <div className="flex space-x-2 mb-4">
        <span className="chip-confidence">
          Confidence: {confidence}
        </span>
        <span className="chip-impact">
          Impact: {impact}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onApprove?.(id)}
          className="flex items-center px-3 py-1.5 bg-ai-teal text-white rounded text-sm font-medium hover:bg-ai-teal/90 transition-colors"
        >
          <Check className="w-4 h-4 mr-1" />
          Approve
        </button>
        
        <button 
          onClick={() => onAskCopilot?.(id)}
          className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          Ask Copilot
        </button>
        
        <button 
          onClick={() => onQueue?.(id)}
          className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          <Clock className="w-4 h-4 mr-1" />
          Queue
        </button>
      </div>
    </div>
  )
}

interface AutomationBarProps {
  confidenceThreshold: number
  isPaused: boolean
  queueCount: number
  onThresholdChange?: (value: number) => void
  onPauseToggle?: () => void
  onViewQueue?: () => void
}

export function AutomationBar({
  confidenceThreshold,
  isPaused,
  queueCount,
  onPauseToggle,
  onViewQueue
}: AutomationBarProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Confidence gate ≥{confidenceThreshold}% (approval required)
          </div>
          
          <button
            onClick={onPauseToggle}
            className={`flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
              isPaused 
                ? 'bg-warning/10 text-warning' 
                : 'bg-success/10 text-success'
            }`}
          >
            <Pause className="w-4 h-4 mr-1" />
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>

        <button
          onClick={onViewQueue}
          className="flex items-center px-3 py-1.5 bg-ai-teal text-white rounded text-sm font-medium hover:bg-ai-teal/90 transition-colors"
        >
          View Queue
          {queueCount > 0 && (
            <span className="ml-2 bg-white text-ai-teal px-2 py-0.5 rounded-full text-xs font-bold">
              {queueCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}