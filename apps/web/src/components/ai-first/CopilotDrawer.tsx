import { useState } from 'react'
import { X, Sparkles, FileText, Search, Download, Zap } from 'lucide-react'
import { trackFlow } from '../../services/analyticsService'

interface CopilotDrawerProps {
  isOpen: boolean
  onClose: () => void
}

interface CopilotAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  prompt: string
  action: () => void
}

export function CopilotDrawer({ isOpen, onClose }: CopilotDrawerProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const copilotActions: CopilotAction[] = [
    {
      id: 'draft-pr',
      title: 'Draft PR from high-intent topic',
      description: 'Generate a press release targeting trending keywords and industry insights',
      icon: FileText,
      prompt: 'Create a compelling press release about [topic] targeting journalists in [industry]. Include data points and expert quotes.',
      action: () => {
        trackFlow.start('copilot_draft_pr', 'copilot_drawer', { source: 'drawer' })
        window.location.href = '/pr/new?ai=draft'
      }
    },
    {
      id: 'generate-headlines',
      title: 'Generate 3 headlines',
      description: 'Create multiple headline variations optimized for different channels',
      icon: Sparkles,
      prompt: 'Generate 3 headline variations for [content] optimized for: 1) SEO, 2) Social media engagement, 3) Email newsletters',
      action: () => {
        trackFlow.start('copilot_headlines', 'copilot_drawer', { count: 3 })
        window.location.href = '/content/headlines?ai=generate'
      }
    },
    {
      id: 'analyze-competitor',
      title: 'Analyze competitor URL',
      description: 'Deep dive into competitor content strategy and identify opportunities',
      icon: Search,
      prompt: 'Analyze [competitor URL] for content gaps, keyword opportunities, and messaging positioning compared to our brand.',
      action: () => {
        trackFlow.start('copilot_analyze_competitor', 'copilot_drawer', {})
        window.location.href = '/analyze?ai=competitor'
      }
    },
    {
      id: 'export-report',
      title: 'Export 30-day report',
      description: 'Generate comprehensive analytics report with AI insights',
      icon: Download,
      prompt: 'Create a 30-day performance report including KPI trends, top content, recommendations, and next month strategy.',
      action: () => {
        trackFlow.start('copilot_export_report', 'copilot_drawer', { period: '30d' })
        window.location.href = '/analytics/export?ai=report&period=30d'
      }
    }
  ]

  const handleActionClick = (action: CopilotAction) => {
    setSelectedAction(action.id)
    setTimeout(() => {
      action.action()
      onClose()
      setSelectedAction(null)
    }, 150)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-md bg-background border-l border-border shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-ai-teal-500/20 rounded-lg">
                  <Zap className="h-5 w-5 text-ai-teal-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">AI Copilot</h2>
                  <p className="text-sm text-foreground/60">Intelligent automation at your fingertips</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-foreground/60" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="text-sm text-foreground/70 mb-6">
              Choose an AI-powered action to accelerate your workflow:
            </div>

            {copilotActions.map((action) => {
              const Icon = action.icon
              const isSelected = selectedAction === action.id
              
              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  disabled={isSelected}
                  className={`w-full p-4 text-left rounded-lg transition-all group ${
                    isSelected 
                      ? 'bg-ai-teal-500/20 border-ai-teal-500/40' 
                      : 'bg-foreground/3 border-foreground/5 hover:bg-foreground/5 hover:border-ai-teal-500/30'
                  } border`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      isSelected 
                        ? 'bg-ai-teal-500/30' 
                        : 'bg-ai-teal-500/10 group-hover:bg-ai-teal-500/20'
                    }`}>
                      <Icon className="h-4 w-4 text-ai-teal-300" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium transition-colors ${
                        isSelected 
                          ? 'text-ai-teal-300' 
                          : 'text-foreground group-hover:text-ai-teal-300'
                      }`}>
                        {action.title}
                      </h3>
                      
                      <p className="text-sm text-foreground/60 mt-1 line-clamp-2">
                        {action.description}
                      </p>
                      
                      {/* AI Prompt Preview */}
                      <div className="mt-3 p-2 bg-foreground/5 rounded text-xs text-foreground/50 italic border-l-2 border-ai-gold-500/30">
                        {action.prompt}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="p-1">
                        <div className="w-4 h-4 border-2 border-ai-teal-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between text-xs text-foreground/50">
              <span>Press ⌘K to reopen</span>
              <span>4 AI actions available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}