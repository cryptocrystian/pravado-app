import { useState, useEffect } from 'react'
import { Search, FileText, Megaphone, Link2, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../lib/utils'

interface CommandItem {
  id: string
  label: string
  shortcut?: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  const commands: CommandItem[] = [
    {
      id: 'start-pr',
      label: 'Start PR',
      shortcut: '⌘P',
      icon: Megaphone,
      action: () => {
        navigate('/pr/new')
        onClose()
        if (window.posthog) {
          window.posthog.capture('flow_path_len', { flow: 'start_pr', steps: 1 })
        }
      }
    },
    {
      id: 'draft-content',
      label: 'Draft Content',
      shortcut: '⌘D',
      icon: FileText,
      action: () => {
        navigate('/content/new')
        onClose()
        if (window.posthog) {
          window.posthog.capture('flow_path_len', { flow: 'draft_content', steps: 1 })
        }
      }
    },
    {
      id: 'analyze-url',
      label: 'Analyze URL',
      shortcut: '⌘L',
      icon: Link2,
      action: () => {
        navigate('/citemind')
        onClose()
        if (window.posthog) {
          window.posthog.capture('flow_path_len', { flow: 'analyze_url', steps: 1 })
        }
      }
    },
    {
      id: 'export-analytics',
      label: 'Export Analytics',
      shortcut: '⌘E',
      icon: Download,
      action: () => {
        navigate('/analytics/export')
        onClose()
        if (window.posthog) {
          window.posthog.capture('flow_path_len', { flow: 'export_analytics', steps: 2 })
        }
      }
    }
  ]

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (!isOpen) {
      setSearch('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(i => Math.max(i - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action()
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:bg-transparent lg:backdrop-blur-none"
        onClick={onClose}
      />

      {/* Right Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md z-50">
        <div className="h-full glass-card rounded-none lg:rounded-l-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-[hsl(var(--glass-stroke))]">
            <Search className="h-5 w-5 text-ai-teal-300" />
            <h2 className="text-lg font-semibold text-foreground flex-1">Copilot</h2>
            <kbd className="text-xs font-medium text-foreground/60 bg-white/5 px-2 py-1 rounded focus:outline-2 focus:outline-ai-teal-500">
              ⌘K
            </kbd>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b border-[hsl(var(--glass-stroke))]">
            <input
              ref={input => input?.focus()}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commands..."
              className="w-full bg-white/5 border border-[hsl(var(--glass-stroke))] rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground/60 focus:outline-2 focus:outline-ai-teal-500"
            />
          </div>

          {/* Quick Shortcuts Section */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-foreground/80 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((command, index) => {
                  const Icon = command.icon
                  return (
                    <button
                      key={command.id}
                      onClick={command.action}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                        "hover:bg-white/5 focus:outline-2 focus:outline-ai-teal-500",
                        selectedIndex === index && "bg-ai-teal-500/10 ring-1 ring-inset ring-ai-teal-500/30"
                      )}
                    >
                      <Icon className="h-4 w-4 text-ai-teal-300" />
                      <span className="flex-1 text-sm font-medium text-foreground">{command.label}</span>
                      {command.shortcut && (
                        <kbd className="text-xs font-medium text-foreground/60 bg-white/5 px-1.5 py-0.5 rounded">
                          {command.shortcut}
                        </kbd>
                      )}
                    </button>
                  )
                })
              ) : (
                <div className="p-4 text-center text-foreground/60 text-sm">
                  No commands found
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="p-4 border-t border-[hsl(var(--glass-stroke))] mt-auto">
            <h3 className="text-sm font-semibold text-foreground/80 mb-3">Tips</h3>
            <div className="space-y-2 text-xs text-foreground/60">
              <div className="flex items-center gap-2">
                <kbd className="bg-white/5 px-1.5 py-0.5 rounded text-xs">⌘K</kbd>
                <span>Open this panel</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="bg-white/5 px-1.5 py-0.5 rounded text-xs">↵</kbd>
                <span>Execute selected action</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="bg-white/5 px-1.5 py-0.5 rounded text-xs">ESC</kbd>
                <span>Close panel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}