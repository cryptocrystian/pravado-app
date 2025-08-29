import { useState } from 'react'
import { Menu, X } from 'lucide-react'
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

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      {/* Menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-surface rounded-lg shadow-md"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-40 transform transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-16">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-border">
            <div className="text-xl font-bold text-text-primary">
              PRAVADO
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
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
        </div>
      </div>
    </div>
  )
}