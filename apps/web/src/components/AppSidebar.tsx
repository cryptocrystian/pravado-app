import { 
  BarChart3, 
  BookOpen, 
  Brain, 
  Home, 
  Settings, 
  Shield,
  TrendingUp,
  Users 
} from 'lucide-react'
import { cn } from '../lib/utils'

interface SidebarItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  onClick?: () => void
}

function SidebarItem({ icon: Icon, label, active = false, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
        "hover:bg-glass-bg hover:backdrop-blur-md hover:border-glass-border",
        active 
          ? "bg-gradient-to-r from-ai-teal/20 to-ai-gold/10 text-ai-teal border border-ai-teal/30" 
          : "text-foreground/70 hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  )
}

interface AppSidebarProps {
  className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
  return (
    <div className={cn("flex h-full", className)}>
      {/* Brand gradient rail */}
      <div className="w-1 bg-[linear-gradient(180deg,hsl(var(--ai-teal)),hsl(var(--ai-gold)))] rounded-r-full" />
      
      {/* Main sidebar */}
      <div className="flex-1 bg-glass-bg backdrop-blur-md border border-glass-border shadow-glass rounded-2xl ml-2 p-4">
        <div className="flex flex-col h-full">
          {/* Logo/Brand area */}
          <div className="mb-8">
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 bg-gradient-to-br from-ai-teal to-ai-gold rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div className="text-sm font-semibold text-foreground">PRAVADO</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            <SidebarItem icon={Home} label="Dashboard" active />
            <SidebarItem icon={BarChart3} label="Analytics" />
            <SidebarItem icon={TrendingUp} label="Performance" />
            <SidebarItem icon={Brain} label="AI Insights" />
            <SidebarItem icon={BookOpen} label="Content" />
            <SidebarItem icon={Users} label="Audience" />
            <SidebarItem icon={Shield} label="Security" />
            <SidebarItem icon={Settings} label="Settings" />
          </nav>

          {/* Organization card */}
          <div className="mt-6 p-3 bg-panel/50 border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-ai-teal to-ai-gold rounded flex items-center justify-center text-xs text-white font-semibold">
                O
              </div>
              <div className="text-xs text-foreground/80">Organization</div>
            </div>
            <div className="text-xs text-foreground/60 mb-2">Usage this month</div>
            <div className="w-full bg-border rounded-full h-1.5">
              <div 
                className="bg-ai-teal h-1.5 rounded-full transition-all duration-300" 
                style={{ width: '68%' }}
              />
            </div>
            <div className="text-xs text-foreground/60 mt-1">68% of limit</div>
          </div>
        </div>
      </div>
    </div>
  )
}