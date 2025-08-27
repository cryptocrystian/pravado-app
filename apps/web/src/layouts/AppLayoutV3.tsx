import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Search, Brain, Bell, User } from 'lucide-react'
import { AppSidebarV3 } from '../components/v3'
import { CommandPalette } from '../components/CommandPalette'
import { trackFlow } from '../services/analyticsService'

export function AppLayoutV3({ children }: { children?: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false)

  const handleSearch = () => {
    trackFlow.engagement('search_opened', {
      source: 'header',
      method: 'click'
    })
    setCommandOpen(true)
  }

  const handleCopilot = () => {
    trackFlow.start('copilot_activated', 'header', {
      method: 'button_click'
    })
    window.location.href = '/copilot'
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - stays on dark shell */}
      <AppSidebarV3 />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Page title dynamically set by page components */}
            <div id="page-header" />
          </div>

          <div className="flex items-center gap-4">
            {/* Search/Command */}
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-3 py-1.5 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai/70 focus-visible:ring-offset-2"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
              <kbd className="text-xs bg-foreground/10 px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>

            {/* AI Copilot - use tokens, not gradient */}
            <button
              onClick={handleCopilot}
              className="flex items-center gap-2 px-3 py-1.5 bg-ai border border-ai rounded-lg text-sm font-medium text-ai hover:bg-ai transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai/70 focus-visible:ring-offset-2"
            >
              <Brain className="h-4 w-4" />
              AI Copilot
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-foreground/5 rounded-lg transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai/70 focus-visible:ring-offset-2">
              <Bell className="h-5 w-5 text-foreground/70" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-premium rounded-full"></span>
            </button>

            {/* Profile */}
            <button className="p-2 hover:bg-foreground/5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai/70 focus-visible:ring-offset-2">
              <User className="h-5 w-5 text-foreground/70" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>

      {/* Command palette */}
      <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  )
}