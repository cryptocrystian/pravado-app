import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { TabConfig } from '@/types'

interface TabsProps {
  tabs: TabConfig[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  className?: string
}

export default function Tabs({ 
  tabs, 
  defaultTab, 
  onChange, 
  className 
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'tab-button whitespace-nowrap py-2 px-1 font-medium text-sm',
                activeTab === tab.id ? 'active' : ''
              )}
              data-testid={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTabContent}
      </div>
    </div>
  )
}

// Specialized tab components are now handled directly in the Analytics page
// This keeps the Tabs component generic and reusable