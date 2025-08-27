import { Search, Bell, ChevronDown } from 'lucide-react'

export function Topbar() {
  return (
    <header className="h-16 border-b border-white/10 bg-gray-900/30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Global Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search campaigns, content, contacts..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ai-teal-500/50 focus:border-ai-teal-500"
            />
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
          </button>
          
          {/* Tenant Switcher */}
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors">
            <span>Acme Corp</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {/* Profile */}
          <button className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ai-teal-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}