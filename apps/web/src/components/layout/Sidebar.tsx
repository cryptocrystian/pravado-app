import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Target, 
  Database, 
  FileEdit,
  Search,
  BarChart3,
  Bot,
  Settings
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/campaigns', icon: Target, badge: 3 },
  { name: 'Media DB', href: '/media', icon: Database },
  { name: 'Content Studio', href: '/content', icon: FileEdit },
  { name: 'SEO/GEO', href: '/seo', icon: Search },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Copilot', href: '/copilot', icon: Bot },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-900/50 border-r border-white/10">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold text-white">Pravado</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative
                    ${
                      isActive
                        ? 'bg-white/10 text-white before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-ai-teal-300 before:rounded-r'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-premium-gold-500/20 text-premium-gold-300">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}