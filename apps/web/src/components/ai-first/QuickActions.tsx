import { Plus, FileText, Search, Download } from 'lucide-react'
import { trackFlow } from '../../services/analyticsService'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  color: 'teal' | 'gold'
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'new_content',
    title: 'New Content',
    description: 'Create blog post or article',
    icon: Plus,
    path: '/content/new',
    color: 'teal'
  },
  {
    id: 'new_pr',
    title: 'New PR',
    description: 'Submit press release',
    icon: FileText,
    path: '/pr/new',
    color: 'teal'
  },
  {
    id: 'analyze_url',
    title: 'Analyze URL',
    description: 'SEO & competitor analysis',
    icon: Search,
    path: '/analyze',
    color: 'gold'
  },
  {
    id: 'export_analytics',
    title: 'Export Analytics',
    description: 'Download reports & data',
    icon: Download,
    path: '/analytics/export',
    color: 'gold'
  }
]

export function QuickActions() {
  const handleQuickAction = (action: QuickAction) => {
    trackFlow.start('quick_action_clicked', 'quick_actions', {
      action_id: action.id,
      action_title: action.title,
      target_path: action.path
    })
    
    window.location.href = action.path
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="quick-actions">
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon
        const colorClasses = action.color === 'teal' 
          ? 'from-ai-teal-500/10 to-ai-teal-700/5 border-ai-teal-500/20 group-hover:border-ai-teal-500/40'
          : 'from-ai-gold-500/10 to-ai-gold-700/5 border-ai-gold-500/20 group-hover:border-ai-gold-500/40'
        
        const iconColor = action.color === 'teal' ? 'text-ai-teal-300' : 'text-ai-gold-300'

        return (
          <div key={action.id} className="glass-card p-6 group quick-action-card">
            <button
              onClick={() => handleQuickAction(action)}
              className="w-full text-left space-y-4"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses} flex items-center justify-center border transition-colors`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground group-hover:text-ai-teal-300 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-foreground/60 line-clamp-2">
                  {action.description}
                </p>
              </div>

              {/* CTA */}
              <div className="pt-2">
                <div className="btn-primary w-full py-2 px-4 rounded-lg font-medium text-center">
                  Start
                </div>
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}