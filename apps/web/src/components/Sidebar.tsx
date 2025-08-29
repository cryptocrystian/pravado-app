import { NavLink } from 'react-router-dom'
import { 
  BarChart3, 
  FileText, 
  Image, 
  Edit3, 
  Search, 
  TrendingUp, 
  Bot, 
  Settings 
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Campaigns', href: '/campaigns', icon: FileText, count: 3 },
  { name: 'Media DB', href: '/media', icon: Image },
  { name: 'Content Studio', href: '/content', icon: Edit3, count: 5 },
  { name: 'SEO/GEO', href: '/seo', icon: Search, count: 12 },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Copilot', href: '/copilot', icon: Bot, count: 2 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside 
      data-testid="main-sidebar"
      className="hidden md:block w-64 bg-surface border-r border-border sticky top-0 h-screen">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-border">
          <div className="text-xl font-bold text-text-primary">
            PRAVADO
          </div>
        </div>

        {/* Navigation */}
        <nav data-testid="main-navigation" className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => `
                  group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors relative
                  ${isActive 
                    ? 'sidebar-item-active text-ai-teal bg-ai-teal/10 border-l-[3px] border-ai-teal' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/50 border-l-[3px] border-transparent'
                  }
                `}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.count && (
                  <span className="count-badge">{item.count}</span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-border p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-ai-teal rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-primary">User</p>
              <p className="text-xs text-text-secondary">user@pravado.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}