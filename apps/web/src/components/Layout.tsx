import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-bg-app-light dark:bg-bg-app-dark">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="island-surface min-h-full p-6">
          {children}
        </div>
      </main>
    </div>
  )
}