import { Plus, Send, Search, Download } from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      icon: Plus,
      label: 'New Content',
      description: 'Create blog post, social content, or email',
      onClick: () => console.log('New Content')
    },
    {
      icon: Send,
      label: 'New PR',
      description: 'Draft press release or media pitch',
      onClick: () => console.log('New PR')
    },
    {
      icon: Search,
      label: 'Analyze URL',
      description: 'Get SEO insights for any webpage',
      onClick: () => console.log('Analyze URL')
    },
    {
      icon: Download,
      label: 'Export Analytics',
      description: 'Download performance reports',
      onClick: () => console.log('Export Analytics')
    }
  ]

  return (
    <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-xl">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="btn-primary p-4 rounded-xl text-left hover:opacity-90 transition-opacity group"
          >
            <div className="flex items-center gap-3 mb-2">
              <action.icon className="w-5 h-5 text-white" />
              <span className="font-medium text-white">{action.label}</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}