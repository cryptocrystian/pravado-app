import { FileText, Send, TrendingUp, Share2, Clock } from 'lucide-react'
import { ActivityEvent } from '../types'

interface ActivityTimelineProps {
  events: ActivityEvent[]
}

const eventConfig = {
  content_published: { 
    icon: FileText, 
    color: 'text-ai-teal', 
    bgColor: 'bg-ai-teal/10',
    pillarColor: 'bg-ai-teal'
  },
  pr_sent: { 
    icon: Send, 
    color: 'text-premium-gold', 
    bgColor: 'bg-premium-gold/10',
    pillarColor: 'bg-premium-gold'
  },
  seo_rank_change: { 
    icon: TrendingUp, 
    color: 'text-success', 
    bgColor: 'bg-success/10',
    pillarColor: 'bg-success'
  },
  coverage_received: { 
    icon: Share2, 
    color: 'text-premium-gold', 
    bgColor: 'bg-premium-gold/10',
    pillarColor: 'bg-premium-gold'
  },
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <div className="bg-white dark:bg-surface-dark rounded-lg p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-ai-teal" />
          <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
            Activity Timeline
          </h3>
        </div>
        <button className="text-sm text-ai-teal hover:text-ai-teal/80 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          sortedEvents.map((event, index) => {
            const config = eventConfig[event.type]
            const Icon = config.icon
            const timeAgo = formatTimeAgo(event.timestamp)
            
            return (
              <div key={event.id} className="relative">
                {/* Timeline line */}
                {index < sortedEvents.length - 1 && (
                  <div className="absolute left-6 top-8 w-0.5 h-6 bg-gray-200 dark:bg-gray-700" />
                )}
                
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className={`p-2 rounded-full ${config.bgColor} flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                        {event.title}
                      </p>
                      <div className={`w-2 h-2 rounded-full ${config.pillarColor}`} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {timeAgo}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const eventTime = new Date(timestamp)
  const diffMs = now.getTime() - eventTime.getTime()
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return eventTime.toLocaleDateString()
}