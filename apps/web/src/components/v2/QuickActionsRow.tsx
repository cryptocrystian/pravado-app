import { FileText, Megaphone, Link2, Download } from 'lucide-react'

interface QuickActionProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  onClick: () => void
}

function QuickAction({ icon: Icon, label, description, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center gap-3 p-4 bg-[var(--brand-grad)] text-white rounded-lg hover:opacity-95 transition-opacity focus:outline-2 focus:outline-ai-teal-500 focus:outline-offset-2 text-left"
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div className="min-w-0">
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-white/80">{description}</div>
      </div>
    </button>
  )
}

interface QuickActionsRowProps {
  onAction?: (action: string) => void
}

export function QuickActionsRow({ onAction }: QuickActionsRowProps) {
  const handleAction = (actionKey: string, route?: string) => {
    // Emit PostHog event
    if (window.posthog) {
      window.posthog.capture('quick_action_clicked', { action: actionKey })
    }
    
    // Navigate or perform action
    if (route) {
      window.location.href = route
    }
    
    // Call callback
    onAction?.(actionKey)
  }

  return (
    <div className="bg-[hsl(var(--glass-fill))] backdrop-blur-md border border-[hsl(var(--glass-stroke))] rounded-2xl shadow-glass p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <QuickAction
          icon={FileText}
          label="New Content"
          description="Start writing"
          onClick={() => handleAction('new_content', '/content/new')}
        />
        <QuickAction
          icon={Megaphone}
          label="New Press Release"
          description="Announce to media"
          onClick={() => handleAction('new_press_release', '/pr/new')}
        />
        <QuickAction
          icon={Link2}
          label="Analyze URL"
          description="CiteMind insights"
          onClick={() => handleAction('analyze_url', '/citemind')}
        />
        <QuickAction
          icon={Download}
          label="Export Analytics"
          description="Download reports"
          onClick={() => handleAction('export_analytics', '/analytics/export')}
        />
      </div>
    </div>
  )
}