import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { 
  Menu,
  X,
  Bell,
  User,
  Moon,
  Sun,
  Search
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useTheme } from '../hooks/useTheme'
import { useRouteTheme } from '../theme/routeTheme'
import { CompactSidebar } from '../components/ai-first/CompactSidebar'
import { CommandPalette } from '../components/CommandPalette'
import { CopilotDrawer } from '../components/ai-first/CopilotDrawer'

interface AppLayoutProps {
  children: ReactNode
}


export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  
  // Route-based theme toggle (dark shell + light islands)
  useRouteTheme()

  // Handle keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCopilotOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-bg-dark text-text-dark">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 ease-in-out lg:translate-x-0 p-4",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <CompactSidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-60">
        {/* Top bar */}
        <header className="h-16 bg-bg-dark border-b border-surface-dark/20 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-text-dark hover:bg-surface-dark/50 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            {/* Command/Search */}
            <button
              onClick={() => setCopilotOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-ai border border-ai rounded-lg text-sm hover:border-ai transition-all group focus:outline-2 focus:outline-ai-teal-500 focus:outline-offset-2"
            >
              <Search className="h-4 w-4 text-ai" />
              <span className="text-ai font-medium">AI Copilot</span>
              <kbd className="ml-4 text-xs font-medium text-ai/70 bg-ai px-1.5 py-0.5 rounded group-hover:text-ai">
                ⌘K
              </kbd>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground hover:bg-panel-elevated rounded-lg transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 text-text-dark hover:bg-surface-dark/50 rounded-lg relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-ai rounded-full"></span>
            </button>

            {/* Profile */}
            <button className="p-2 text-text-dark hover:bg-surface-dark/50 rounded-lg">
              <User className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page content - Light islands on dark shell */}
        <main className="p-6">
          <div data-surface="content" className="min-h-screen bg-bg rounded-xl border border-surface/20 p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar close button */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed top-4 right-4 z-50 p-2 bg-surface-dark text-text-dark rounded-lg lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />

      {/* AI Copilot Drawer */}
      <CopilotDrawer 
        isOpen={copilotOpen} 
        onClose={() => setCopilotOpen(false)} 
      />
    </div>
  )
}