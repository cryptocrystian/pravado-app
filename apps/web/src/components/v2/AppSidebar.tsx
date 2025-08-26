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
import { cn } from '../../lib/utils'
import { trackFlow, FLOWS } from '../../services/analyticsService'

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
      onClick={() => {
        // Track sidebar navigation with Phase 3 analytics
        trackFlow.start(FLOWS.NAVIGATION, 'sidebar_v2', {
          destination: label,
          active_before_click: active,
          has_count: !!count
        });
        
        trackFlow.critical('navigation', {
          component: 'sidebar_v2',
          destination: label,
          navigation_type: 'sidebar_click'
        });

        trackFlow.phase3('sidebar', 'navigation_click', {
          label,
          active,
          count
        });

        onClick?.();
      }}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group",
        "text-foreground/80 hover:text-foreground hover:bg-white/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai-teal-500 focus-visible:ring-offset-2",
        active && "text-ai-teal-300 bg-gradient-to-r from-ai-teal-600/10 to-ai-gold-600/5"
      )}
    >
      {/* Active teal indicator - 1px vertical line */}
      {active && (
        <div className="absolute left-0 w-0.5 h-6 rounded-r bg-ai-teal-500" />
      )}
      
      <Icon className={cn(
        "h-5 w-5 relative z-10 transition-colors",
        active && "text-ai-teal-300"
      )} />
      <span className="relative z-10 flex-1 text-left">{label}</span>
      
      {/* Notification badge with gold accent */}
      {count !== undefined && count > 0 && (
        <span className="relative z-10 px-2 py-0.5 text-xs font-medium bg-ai-gold-500/15 text-ai-gold-300 rounded-full border border-ai-gold-500/20">
          {count}
        </span>
      )}
    </button>
  )
}

interface AppSidebarProps {
  className?: string;
  onNavigate?: (path: string) => void;
}

export function AppSidebar({ className, onNavigate }: AppSidebarProps) {
  const handleNavigation = (path: string) => {
    onNavigate?.(path);
  };

  return (
    <div className={cn("flex h-full w-60", className)}>
      {/* Brand gradient rail - 1px vertical teal-to-gold gradient */}
      <div className="w-0.5 bg-gradient-to-b from-ai-teal-500 to-ai-gold-500 rounded-r-full" />
      
      {/* Main sidebar - glass container with fixed 240px width */}
      <div className="flex-1 ml-3">
        <div className="h-full glass-card p-6">
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

            {/* Iconized navigation items */}
            <nav className="flex-1 space-y-1" role="navigation" aria-label="Main navigation">
              <SidebarItem 
                icon={Home} 
                label="Dashboard" 
                active 
                onClick={() => handleNavigation('/dashboard')}
              />
              <SidebarItem 
                icon={BarChart3} 
                label="Analytics" 
                count={3}
                onClick={() => handleNavigation('/analytics')}
              />
              <SidebarItem 
                icon={TrendingUp} 
                label="Performance" 
                onClick={() => handleNavigation('/performance')}
              />
              <SidebarItem 
                icon={Brain} 
                label="AI Insights" 
                count={12}
                onClick={() => handleNavigation('/insights')}
              />
              <SidebarItem 
                icon={BookOpen} 
                label="Content" 
                onClick={() => handleNavigation('/content')}
              />
              <SidebarItem 
                icon={Users} 
                label="Audience" 
                onClick={() => handleNavigation('/audience')}
              />
              <SidebarItem 
                icon={Shield} 
                label="Security" 
                onClick={() => handleNavigation('/security')}
              />
              <SidebarItem 
                icon={Settings} 
                label="Settings" 
                onClick={() => handleNavigation('/settings')}
              />
            </nav>

            {/* Organization card - glass style with usage indicator */}
            <div className="mt-6 p-4 bg-white/3 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 bg-gradient-to-br from-ai-teal-600/20 to-ai-gold-600/20 rounded-lg flex items-center justify-center text-sm text-ai-teal-300 font-semibold border border-ai-teal-600/20">
                  P
                </div>
                <div className="text-xs font-medium text-foreground/80">Organization</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-foreground/60">Monthly usage</div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-ai-teal-500 to-ai-teal-600 h-1.5 rounded-full transition-all duration-500 relative"
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