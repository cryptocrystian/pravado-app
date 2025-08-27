import { 
  FileText, 
  Send, 
  Search, 
  Bot, 
  Clock,
  ExternalLink 
} from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'content',
    icon: FileText,
    title: 'Published "AI Marketing Trends 2024"',
    description: 'Blog post went live on company blog',
    timestamp: '2 hours ago',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/20'
  },
  {
    id: 2,
    type: 'pr',
    icon: Send,
    title: 'PR pitch sent to TechCrunch',
    description: 'Pitched Series A announcement to Sarah Perez',
    timestamp: '4 hours ago',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/20'
  },
  {
    id: 3,
    type: 'seo',
    icon: Search,
    title: 'Keyword rankings updated',
    description: '15 keywords improved, 3 declined',
    timestamp: '6 hours ago',
    color: 'text-green-400',
    bgColor: 'bg-green-400/20'
  },
  {
    id: 4,
    type: 'ai',
    icon: Bot,
    title: 'CiteMind job completed',
    description: 'Analyzed 50 new mentions across AI engines',
    timestamp: '8 hours ago',
    color: 'text-ai-teal-300',
    bgColor: 'bg-ai-teal-500/20'
  },
  {
    id: 5,
    type: 'agent',
    icon: Clock,
    title: 'Automation agent run',
    description: 'Processed 12 recommendations, 3 approved',
    timestamp: '12 hours ago',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/20'
  },
  {
    id: 6,
    type: 'content',
    icon: FileText,
    title: 'Content brief generated',
    description: 'AI created brief for "Customer Retention Strategies"',
    timestamp: '1 day ago',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/20'
  }
]

export function ActivityTimeline() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Activity Timeline</h3>
        <button className="text-ai-teal-300 hover:text-ai-teal-500 text-sm flex items-center gap-1">
          View All
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                {index < activities.length - 1 && (
                  <div className="w-px h-8 bg-white/10 mt-2" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">{activity.title}</h4>
                    <p className="text-sm text-gray-400 mb-2">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
                
                {/* Type-specific additional info */}
                {activity.type === 'seo' && (
                  <div className="flex gap-2 mt-2">
                    <span className="chip-delta-up text-xs px-2 py-1 bg-success-500/20 rounded-full">
                      +15 improved
                    </span>
                    <span className="chip-delta-down text-xs px-2 py-1 bg-danger-500/20 rounded-full">
                      -3 declined
                    </span>
                  </div>
                )}
                
                {activity.type === 'pr' && (
                  <div className="flex gap-2 mt-2">
                    <span className="chip-confidence text-xs px-2 py-1 rounded-full">
                      85% confidence
                    </span>
                    <span className="chip-impact text-xs px-2 py-1 rounded-full">
                      High impact
                    </span>
                  </div>
                )}
                
                {activity.type === 'ai' && (
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300">
                      23 SGE mentions
                    </span>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300">
                      15 Perplexity citations
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More */}
        <div className="pt-4 border-t border-white/10">
          <button className="w-full py-3 text-sm text-ai-teal-300 hover:text-ai-teal-500 transition-colors">
            Load more activities
          </button>
        </div>
      </div>
    </div>
  )
}