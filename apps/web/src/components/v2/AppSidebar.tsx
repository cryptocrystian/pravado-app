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
        "text-foreground/80 hover:text-foreground hover:bg-surface/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2",
        active && "text-ai bg-ai"
      )}
    >
      {/* Active teal indicator - 1px vertical line */}
      {active && (
        <div className="absolute left-0 w-0.5 h-6 rounded-r bg-ai" />
      )}
      
      <Icon className={cn(
        "h-5 w-5 relative z-10 transition-colors",
        active && "text-ai"
      )} />
      <span className="relative z-10 flex-1 text-left">{label}</span>
      
      {/* Notification badge with gold accent */}
      {count !== undefined && count > 0 && (
        <span className="relative z-10 px-2 py-0.5 text-xs font-medium bg-premium text-premium rounded-full border border-premium">
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
      {/* Brand gradient rail - 1px vertical teal- gradient */}
      <div className="w-0.5 bg-ai rounded-r-full" />
      
      {/* Main sidebar - glass container with fixed 240px width */}
      <div className="flex-1 ml-3">
        <div className="h-full glass-card p-6">
          <div className="flex flex-col h-full">
            {/* Logo/Brand area */}
            <div className="mb-8">
              <div className="flex items-center gap-3 px-3">
                <div className="w-9 h-9 bg-ai rounded-lg flex items-center justify-center shadow-lg">
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
            <div className="mt-6 p-4 bg-surface/3 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 bg-ai rounded-lg flex items-center justify-center text-sm text-ai font-semibold border border-ai">
                  P
                </div>
                <div className="text-xs font-medium text-foreground/80">Organization</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-foreground/60">Monthly usage</div>
                <div className="w-full bg-surface/5 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-ai h-1.5 rounded-full transition-all duration-500 relative"
                    style={{ width: '68%' }}
                  >
                    <div className="absolute inset-0 bg-surface/20 animate-pulse" />
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