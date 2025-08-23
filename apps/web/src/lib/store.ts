import { create } from 'zustand'
import type { DashboardStore, AnalyticsStore, KPIMetric } from '@/types'
import { getDashboardMetrics, getCiteMindAnalytics } from './api'
import { trackErrorOccurred } from './analytics'

// Dashboard Store
export const useDashboardStore = create<DashboardStore>((set, get) => ({
  metrics: [],
  lastUpdated: null,
  isLoading: false,
  error: null,

  fetchMetrics: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await getDashboardMetrics()
      
      if (response.success) {
        set({ 
          metrics: response.data, 
          lastUpdated: response.timestamp,
          isLoading: false 
        })
      } else {
        const error = response.error || 'Failed to fetch metrics'
        set({ error, isLoading: false })
        trackErrorOccurred(error, 'dashboard_metrics_fetch')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      set({ error: errorMessage, isLoading: false })
      trackErrorOccurred(errorMessage, 'dashboard_metrics_fetch_exception')
    }
  },

  updateMetric: (id: string, updates: Partial<KPIMetric>) => {
    const { metrics } = get()
    const updatedMetrics = metrics.map(metric =>
      metric.id === id ? { ...metric, ...updates } : metric
    )
    set({ metrics: updatedMetrics, lastUpdated: new Date().toISOString() })
  },
}))

// Analytics Store
export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  citeMindData: null,
  selectedTimeRange: '30d',
  isLoading: false,
  error: null,

  fetchCiteMindData: async () => {
    const { selectedTimeRange } = get()
    set({ isLoading: true, error: null })
    
    try {
      const response = await getCiteMindAnalytics(selectedTimeRange)
      
      if (response.success) {
        set({ 
          citeMindData: response.data,
          isLoading: false 
        })
      } else {
        const error = response.error || 'Failed to fetch CiteMind data'
        set({ error, isLoading: false })
        trackErrorOccurred(error, 'citemind_data_fetch')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      set({ error: errorMessage, isLoading: false })
      trackErrorOccurred(errorMessage, 'citemind_data_fetch_exception')
    }
  },

  setTimeRange: (range: '7d' | '30d' | '90d' | '1y') => {
    set({ selectedTimeRange: range })
    // Automatically refetch data when time range changes
    get().fetchCiteMindData()
  },
}))

// Global App Store (for shared state)
interface AppStore {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  notifications: Array<{
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    message: string
    timestamp: string
  }>
  toggleTheme: () => void
  toggleSidebar: () => void
  addNotification: (notification: Omit<AppStore['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  theme: 'light',
  sidebarOpen: true,
  notifications: [],

  toggleTheme: () => {
    const { theme } = get()
    set({ theme: theme === 'light' ? 'dark' : 'light' })
  },

  toggleSidebar: () => {
    set({ sidebarOpen: !get().sidebarOpen })
  },

  addNotification: (notification) => {
    const newNotification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }
    
    set({ 
      notifications: [...get().notifications, newNotification] 
    })

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      get().removeNotification(newNotification.id)
    }, 5000)
  },

  removeNotification: (id: string) => {
    set({ 
      notifications: get().notifications.filter(n => n.id !== id) 
    })
  },

  clearNotifications: () => {
    set({ notifications: [] })
  },
}))

// Selector hooks for performance optimization
export const useDashboardMetrics = () => useDashboardStore(state => state.metrics)
export const useDashboardLoading = () => useDashboardStore(state => state.isLoading)
export const useDashboardError = () => useDashboardStore(state => state.error)

export const useCiteMindData = () => useAnalyticsStore(state => state.citeMindData)
export const useAnalyticsLoading = () => useAnalyticsStore(state => state.isLoading)
export const useAnalyticsError = () => useAnalyticsStore(state => state.error)
export const useSelectedTimeRange = () => useAnalyticsStore(state => state.selectedTimeRange)

export const useNotifications = () => useAppStore(state => state.notifications)
export const useSidebarOpen = () => useAppStore(state => state.sidebarOpen)