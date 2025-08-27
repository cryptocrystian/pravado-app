import { FileText, Clock, Send } from 'lucide-react'

interface PRQueueItem {
  id: string
  title: string
  status: 'draft' | 'scheduled' | 'sent'
  scheduledFor?: string
  sentAt?: string
}

interface PRQueueProps {
  items: PRQueueItem[]
}

const statusConfig = {
  draft: { color: 'bg-gray-100 text-gray-800', icon: FileText },
  scheduled: { color: 'bg-ai-teal/10 text-ai-teal', icon: Clock },
  sent: { color: 'bg-success/10 text-success', icon: Send },
}

export function PRQueue({ items }: PRQueueProps) {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-lg p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          PR Queue
        </h3>
        <span className="count-badge">{items.length}</span>
      </div>
      
      <div className="space-y-3">
        {items.map((item) => {
          const config = statusConfig[item.status]
          const Icon = config.icon
          
          return (
            <div key={item.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Icon className="w-4 h-4 text-gray-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark truncate">
                  {item.title}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
                    {item.status}
                  </span>
                  {item.scheduledFor && (
                    <span className="text-xs text-gray-500">
                      {new Date(item.scheduledFor).toLocaleDateString()}
                    </span>
                  )}
                  {item.sentAt && (
                    <span className="text-xs text-gray-500">
                      Sent {new Date(item.sentAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}