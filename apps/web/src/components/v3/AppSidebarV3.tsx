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
  count?: number;
  path: string;
}

function SidebarItem({ icon: Icon, label, active = false, count, path }: SidebarItemProps) {
  const handleClick = () => {
    trackFlow.start(FLOWS.NAVIGATION, 'sidebar_v3', {
      destination: label,
      active_before_click: active,
      has_count: !!count,
      path
    })
    window.location.href = path
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2 text-sm font-medium transition-all relative group",
        "hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai/70 focus-visible:ring-offset-2",
        active ? "text-ai" : "text-foreground/70 hover:text-foreground"
      )}
    >
      {/* Active indicator - 3px teal bar */}
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-ai rounded-r-full" />
      )}

      <Icon className={cn(
        "h-4 w-4 flex-shrink-0 transition-colors ml-2",
        active ? "text-ai" : "text-foreground/60"
      )} />
      
      <span className="flex-1 text-left">{label}</span>
      
      {/* Count badge - gold accent, no pill */}
      {count !== undefined && count > 0 && (
        <div className="px-1.5 py-0.5 bg-premium text-premium text-xs font-medium rounded min-w-[1.25rem] text-center">
          {count > 99 ? '99+' : count}
        </div>
      )}
    </button>
  )
}

export function AppSidebarV3() {
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
      icon: BarChart3,
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
    <nav 
      className="w-[264px] h-full glass-card rounded-none rounded-r-2xl p-4" 
      data-testid="sidebar-v3"
    >
      <div className="space-y-8">
        {/* Logo - no gradient, use teal token */}
        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="w-8 h-8 bg-ai rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div className="text-lg font-semibold text-foreground">PRAVADO</div>
        </div>

        {/* Navigation - compact glass list */}
        <div className="space-y-0.5">
          {sidebarItems.map((item) => (
            <SidebarItem key={item.path} {...item} />
          ))}
        </div>

        {/* AI Status Indicator */}
        <div className="px-3 pt-4 border-t border-foreground/10">
          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <div className="w-2 h-2 bg-ai rounded-full animate-pulse"></div>
            <span>AI Systems Active</span>
          </div>
        </div>
      </div>
    </nav>
  )
}