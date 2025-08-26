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
    <div className="min-h-screen bg-background text-foreground">
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
        <header className="h-16 bg-panel border-b border-border flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-foreground hover:bg-panel-elevated rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            {/* Command/Search */}
            <button
              onClick={() => setCopilotOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-ai-teal-500/10 to-ai-gold-500/10 border border-ai-teal-500/30 rounded-lg text-sm hover:border-ai-teal-500/50 transition-all group focus:outline-2 focus:outline-ai-teal-500 focus:outline-offset-2"
            >
              <Search className="h-4 w-4 text-ai-teal-300" />
              <span className="text-ai-teal-300 font-medium">AI Copilot</span>
              <kbd className="ml-4 text-xs font-medium text-ai-teal-300/70 bg-ai-teal-500/20 px-1.5 py-0.5 rounded group-hover:text-ai-teal-300">
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
            <button className="p-2 text-foreground hover:bg-panel-elevated rounded-lg relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>

            {/* Profile */}
            <button className="p-2 text-foreground hover:bg-panel-elevated rounded-lg">
              <User className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main>
          {children}
        </main>
      </div>

      {/* Mobile sidebar close button */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed top-4 right-4 z-50 p-2 bg-panel text-foreground rounded-lg lg:hidden"
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