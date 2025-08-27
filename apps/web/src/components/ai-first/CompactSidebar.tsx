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
  path: string;
}

function CompactSidebarItem({ icon: Icon, label, active = false, onClick, count, path }: SidebarItemProps) {
  return (
    <button
      onClick={() => {
        // Track sidebar navigation
        trackFlow.start(FLOWS.NAVIGATION, 'compact_sidebar', {
          destination: label,
          active_before_click: active,
          has_count: !!count,
          path
        })
        
        onClick?.()
        window.location.href = path
      }}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2 text-sm font-medium transition-all relative group",
        "hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2",
        active 
          ? "text-ai" 
          : "text-foreground/70 hover:text-foreground"
      )}
    >
      {/* Active indicator bar */}
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-ai rounded-r-full" />
      )}

      <Icon className={cn(
        "h-4 w-4 flex-shrink-0 transition-colors",
        active ? "text-ai" : "text-foreground/60"
      )} />
      
      <span className="flex-1 text-left">{label}</span>
      
      {/* Count badge - gold accent */}
      {count !== undefined && count > 0 && (
        <div className="px-2 py-0.5 bg-premium/20 text-premium text-xs font-medium rounded-full min-w-[1.25rem] text-center">
          {count > 99 ? '99+' : count}
        </div>
      )}
    </button>
  )
}

export function CompactSidebar() {
  // Get current path for active state
  const currentPath = window.location.pathname

  const sidebarItems: (SidebarItemProps & { path: string })[] = [
    {
      icon: Home,
      label: 'Dashboard',
      active: currentPath === '/' || currentPath === '/dashboard',
      path: '/dashboard'
    },
    {
      icon: TrendingUp,
      label: 'Campaigns',
      active: currentPath.startsWith('/campaigns'),
      path: '/campaigns',
      count: 3
    },
    {
      icon: Users,
      label: 'Media DB',
      active: currentPath.startsWith('/media'),
      path: '/media'
    },
    {
      icon: BookOpen,
      label: 'Content Studio',
      active: currentPath.startsWith('/content'),
      path: '/content',
      count: 2
    },
    {
      icon: Shield,
      label: 'SEO',
      active: currentPath.startsWith('/seo'),
      path: '/seo'
    },
    {
      icon: TrendingUp,
      label: 'PR',
      active: currentPath.startsWith('/pr'),
      path: '/pr',
      count: 1
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      active: currentPath.startsWith('/analytics'),
      path: '/analytics'
    },
    {
      icon: Brain,
      label: 'AI Copilot',
      active: currentPath.startsWith('/copilot'),
      path: '/copilot'
    },
    {
      icon: Settings,
      label: 'Settings',
      active: currentPath.startsWith('/settings'),
      path: '/settings'
    }
  ]

  return (
    <nav className="h-full glass-card p-4" data-testid="compact-sidebar">
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-2 px-3">
          <div className="w-8 h-8 bg-ai rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div className="text-lg font-semibold text-foreground">PRAVADO</div>
        </div>

        {/* Navigation */}
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <CompactSidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              active={item.active}
              count={item.count}
              path={item.path}
            />
          ))}
        </div>

        {/* AI Status Indicator */}
        <div className="px-3 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <div className="w-2 h-2 bg-ai rounded-full animate-pulse"></div>
            <span>AI Systems Active</span>
          </div>
        </div>
      </div>
    </nav>
  )
}