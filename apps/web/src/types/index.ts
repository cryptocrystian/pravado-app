// Core data types
export interface KPIMetric {
  id: string
  label: string
  value: number | string
  change?: {
    value: number
    percentage: number
    direction: 'up' | 'down' | 'neutral'
  }
  format?: 'number' | 'currency' | 'percentage' | 'duration'
  icon?: string
}

export interface ChartDataPoint {
  label: string
  value: number
  timestamp?: string
}

export interface TimeSeriesData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
    fill?: boolean
  }[]
}

export interface CiteMindAnalytics {
  totalCitations: number
  averageRelevance: number
  topSources: Array<{
    source: string
    citations: number
    relevanceScore: number
  }>
  timeSeriesData: TimeSeriesData
  categoryBreakdown: Array<{
    category: string
    count: number
    percentage: number
  }>
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
  timestamp: string
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// UI State types
export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface TabConfig {
  id: string
  label: string
  content: React.ReactNode
}

// Analytics Event types
export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: string
}

// Store types
export interface DashboardStore {
  metrics: KPIMetric[]
  lastUpdated: string | null
  isLoading: boolean
  error: string | null
  fetchMetrics: () => Promise<void>
  updateMetric: (id: string, updates: Partial<KPIMetric>) => void
}

export interface AnalyticsStore {
  citeMindData: CiteMindAnalytics | null
  selectedTimeRange: '7d' | '30d' | '90d' | '1y'
  isLoading: boolean
  error: string | null
  fetchCiteMindData: () => Promise<void>
  setTimeRange: (range: '7d' | '30d' | '90d' | '1y') => void
}

// Component props types
export interface MetricCardProps {
  metric: KPIMetric
  onClick?: () => void
  className?: string
}

export interface ChartProps {
  data: TimeSeriesData
  title?: string
  height?: number
  className?: string
}

export interface LoadingSkeletonProps {
  className?: string
  count?: number
}

export interface ErrorStateProps {
  message: string
  onRetry?: () => void
  className?: string
}

export interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}