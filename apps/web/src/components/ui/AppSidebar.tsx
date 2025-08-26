import { 
  Home, 
  BarChart3, 
  TrendingUp, 
  Brain, 
  BookOpen, 
  Users, 
  Shield, 
  Settings
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface SidebarItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  badge?: number
  onClick?: () => void
}

function SidebarItem({ icon: Icon, label, active = false, badge, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-xl text-foreground/80 hover:text-foreground hover:bg-white/5 transition-all w-full text-left relative",
        active && "relative ring-1 ring-inset ring-white/10 text-ai-teal-300"
      )}
    >
      {/* Active indicator - 1px teal line on left edge */}
      {active && (
        <div className="absolute left-0 w-1 h-6 rounded-r bg-ai-teal-500" />
      )}
      
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1">{label}</span>
      
      {/* Small count badges with gold accent */}
      {badge !== undefined && badge > 0 && (
        <span className="bg-ai-gold-700/20 text-ai-gold-300 text-xs px-2 py-0.5 rounded">
          {badge}
        </span>
      )}
    </button>
  )
}

interface AppSidebarProps {
  className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
  return (
    <div className={cn("h-full flex", className)}>
      {/* Left gradient rail (4px) */}
      <div className="w-1 bg-[var(--brand-grad)] rounded-l-2xl" />
      
      {/* Main sidebar container */}
      <div className="flex-1 bg-[hsl(var(--glass-fill))] backdrop-blur-md border border-[hsl(var(--glass-stroke))] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,.35)] p-4 ml-1">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 px-3 mb-8">
            <div className="w-8 h-8 bg-[var(--brand-grad)] rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div className="font-semibold text-foreground tracking-wide">PRAVADO</div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1">
            <SidebarItem 
              icon={Home} 
              label="Dashboard" 
              active 
            />
            <SidebarItem 
              icon={BarChart3} 
              label="Analytics" 
              badge={3}
            />
            <SidebarItem 
              icon={TrendingUp} 
              label="Performance" 
            />
            <SidebarItem 
              icon={Brain} 
              label="AI Insights" 
              badge={12}
            />
            <SidebarItem 
              icon={BookOpen} 
              label="Content" 
            />
            <SidebarItem 
              icon={Users} 
              label="Audience" 
            />
            <SidebarItem 
              icon={Shield} 
              label="Security" 
              badge={2}
            />
            <SidebarItem 
              icon={Settings} 
              label="Settings" 
            />
          </nav>

          {/* Organization Usage */}
          <div className="mt-6 p-4 bg-white/5 border border-[hsl(var(--glass-stroke))] rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 bg-[var(--brand-grad)] rounded flex items-center justify-center text-xs font-semibold text-white">
                P
              </div>
              <div className="text-xs font-medium text-foreground/80">Organization</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-foreground/60">Usage this month</div>
              <div className="w-full bg-foreground/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-[var(--brand-grad)] rounded-full transition-all duration-500"
                  style={{ width: '68%' }}
                />
              </div>
              <div className="text-xs text-foreground/60">68% of limit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}