import { Outlet } from 'react-router-dom'
import { useRouteTheme } from '../../hooks/useRouteTheme'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  // Apply route-based theme
  useRouteTheme()
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar />
        
        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}