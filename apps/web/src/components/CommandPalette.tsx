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
      id: 'new-content',
      label: 'Start Press Release',
      shortcut: '⌘P',
      icon: Megaphone,
      action: () => {
        navigate('/press-releases/new')
        onClose()
        if (window.posthog) {
          window.posthog.capture('flow_path_len', { flow: 'press_release', steps: 1 })
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
          window.posthog.capture('flow_path_len', { flow: 'export_analytics', steps: 1 })
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="fixed top-[20%] left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50">
        <div className="glass-card mx-4 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-border/50">
            <Search className="h-5 w-5 text-foreground/60" />
            <input
              ref={input => input?.focus()}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent text-foreground placeholder:text-foreground/60 focus:outline-none"
            />
            <kbd className="text-xs font-medium text-foreground/60 bg-white/5 px-2 py-1 rounded">
              ESC
            </kbd>
          </div>

          {/* Command List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length > 0 ? (
              <div className="p-2">
                {filteredCommands.map((command, index) => {
                  const Icon = command.icon
                  return (
                    <button
                      key={command.id}
                      onClick={command.action}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                        "hover:bg-white/5",
                        selectedIndex === index && "bg-ai-teal-500/10 ring-1 ring-inset ring-ai-teal-500/30"
                      )}
                    >
                      <Icon className="h-5 w-5 text-ai-teal-500" />
                      <span className="flex-1 text-sm font-medium">{command.label}</span>
                      {command.shortcut && (
                        <kbd className="text-xs font-medium text-foreground/60 bg-white/5 px-2 py-1 rounded">
                          {command.shortcut}
                        </kbd>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-foreground/60 text-sm">
                No commands found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border/50 flex items-center justify-between text-xs text-foreground/60">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="bg-white/5 px-1.5 py-0.5 rounded">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-white/5 px-1.5 py-0.5 rounded">↵</kbd>
                Select
              </span>
            </div>
            <span>Copilot Ready</span>
          </div>
        </div>
      </div>
    </>
  )
}