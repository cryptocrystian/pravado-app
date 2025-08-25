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
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}

interface SidebarItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}

function SidebarItem({ icon: Icon, label, active = false, onClick, count }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all relative",
        "text-foreground/80 hover:text-foreground hover:bg-white/5",
        active && "text-ai-teal-300"
      )}
    >
      {active && (
        <div className="absolute inset-0 rounded-xl ring-2 ring-inset ring-ai-teal-500/30 bg-gradient-to-r from-ai-teal-600/10 to-ai-gold-600/5" />
      )}
      <Icon className={cn(
        "h-5 w-5 relative z-10",
        active && "fill-ai-teal-300/20"
      )} />
      <span className="relative z-10 flex-1 text-left">{label}</span>
      {count !== undefined && (
        <span className="relative z-10 px-2 py-0.5 text-xs font-medium bg-ai-gold-600/15 text-ai-gold-300 rounded-full">
          {count}
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
    <div className={cn("flex h-full", className)}>
      {/* Brand gradient rail - 4px */}
      <div className="w-1 bg-[linear-gradient(180deg,hsl(var(--ai-teal-600)),hsl(var(--ai-gold-600)))] rounded-r-full" />
      
      {/* Main sidebar - glass container */}
      <div className="flex-1 ml-2">
        <div className="h-full bg-[hsl(var(--glass-fill))] backdrop-blur-md border border-[hsl(var(--glass-stroke))] rounded-2xl shadow-glass p-4">
          <div className="flex flex-col h-full">
            {/* Logo/Brand area */}
            <div className="mb-8">
              <div className="flex items-center gap-3 px-3">
                <div className="w-9 h-9 bg-gradient-to-br from-ai-teal-600 to-ai-gold-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm font-semibold text-foreground tracking-wide">PRAVADO</div>
              </div>
            </div>

            {/* Navigation - compact glass list */}
            <nav className="flex-1 space-y-0.5">
              <SidebarItem icon={Home} label="Dashboard" active />
              <SidebarItem icon={BarChart3} label="Analytics" count={3} />
              <SidebarItem icon={TrendingUp} label="Performance" />
              <SidebarItem icon={Brain} label="AI Insights" count={12} />
              <SidebarItem icon={BookOpen} label="Content" />
              <SidebarItem icon={Users} label="Audience" />
              <SidebarItem icon={Shield} label="Security" />
              <SidebarItem icon={Settings} label="Settings" />
            </nav>

            {/* Organization card - glass style */}
            <div className="mt-6 p-4 bg-white/3 border border-[hsl(var(--glass-stroke-strong))] rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 bg-gradient-to-br from-ai-teal-600/20 to-ai-gold-600/20 rounded-lg flex items-center justify-center text-sm text-ai-teal-300 font-semibold border border-ai-teal-600/20">
                  O
                </div>
                <div className="text-xs font-medium text-foreground/80">Organization</div>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs text-foreground/60">Monthly usage</div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-ai-teal-500 to-ai-teal-600 h-1.5 rounded-full transition-all duration-500 relative overflow-hidden"
                    style={{ width: '68%' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>
                </div>
                <div className="text-xs text-foreground/60 font-mono">68% of limit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}