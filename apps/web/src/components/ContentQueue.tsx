import { Calendar, FileText, Mail, Share2 } from 'lucide-react'
import { ContentQueueItem } from '../types'

interface ContentQueueProps {
  items: ContentQueueItem[]
}

const typeIcons = {
  blog: FileText,
  press_release: FileText,
  social: Share2,
  email: Mail,
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-warning/10 text-warning',
  scheduled: 'bg-ai-teal/10 text-ai-teal',
  published: 'bg-success/10 text-success',
}

export function ContentQueue({ items }: ContentQueueProps) {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-lg p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Content Queue
        </h3>
        <span className="count-badge">{items.length}</span>
      </div>
      
      <div className="space-y-3">
        {items.map((item) => {
          const Icon = typeIcons[item.type]
          return (
            <div key={item.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Icon className="w-4 h-4 text-gray-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark truncate">
                  {item.title}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[item.status]}`}>
                    {item.status}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(item.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}