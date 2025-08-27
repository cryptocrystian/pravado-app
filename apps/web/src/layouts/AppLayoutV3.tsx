import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Search, Brain, Bell, User } from 'lucide-react'
import { AppSidebarV3 } from '../components/v3'
import { CommandPalette } from '../components/CommandPalette'
import { trackFlow } from '../services/analyticsService'
import { useRouteTheme } from '../theme/routeTheme'

export function AppLayoutV3({ children }: { children?: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false)
  
  // Route-based theme toggle (dark shell + light islands)
  useRouteTheme()

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
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-dark)' }}>
      {/* Sidebar - stays on dark shell */}
      <AppSidebarV3 />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <header className="h-16 border-b flex items-center justify-between px-6" style={{ borderBottomColor: 'rgba(43, 58, 103, 0.2)' }}>
          <div className="flex items-center gap-4">
            {/* Page title dynamically set by page components */}
            <div id="page-header" />
          </div>

          <div className="flex items-center gap-4">
            {/* Search/Command */}
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-3 py-1.5 bg-surface-dark/20 border border-surface-dark/30 rounded-lg text-sm text-text-dark/70 hover:text-text-dark hover:bg-surface-dark/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
              <kbd className="text-xs bg-surface-dark/20 px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>

            {/* AI Copilot - use tokens, not gradient */}
            <button
              onClick={handleCopilot}
              className="flex items-center gap-2 px-3 py-1.5 bg-ai border border-ai rounded-lg text-sm font-medium text-white hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2"
            >
              <Brain className="h-4 w-4" />
              AI Copilot
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-surface-dark/30 rounded-lg transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2">
              <Bell className="h-5 w-5 text-text-dark/70" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-premium rounded-full"></span>
            </button>

            {/* Profile */}
            <button className="p-2 hover:bg-surface-dark/30 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2">
              <User className="h-5 w-5 text-text-dark/70" />
            </button>
          </div>
        </header>

        {/* Page content - Light islands on dark shell */}
        <main className="flex-1 overflow-y-auto p-6">
          <div data-surface="content" className="min-h-full bg-bg rounded-xl border border-surface/20 p-6 overflow-y-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Command palette */}
      <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  )
}