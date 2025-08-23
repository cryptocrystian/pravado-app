import type { ApiResponse, CiteMindAnalytics, KPIMetric } from '@/types'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pravado-api.workers.dev'
const API_VERSION = ''

class ApiClient {
  private baseURL: string
  private defaultHeaders: HeadersInit

  constructor() {
    this.baseURL = API_VERSION ? `${API_BASE_URL}/${API_VERSION}` : API_BASE_URL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'PRAVADO-Web/1.0.0',
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    }

    // Add authentication if available
    const token = this.getAuthToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('API Request failed:', error)
      
      return {
        success: false,
        data: null as unknown as T,
        error: error instanceof Error ? error.message : 'Unknown API error',
        timestamp: new Date().toISOString(),
      }
    }
  }

  private getAuthToken(): string | null {
    // TODO: Implement proper authentication
    return localStorage.getItem('auth_token')
  }

  // Dashboard API methods
  async getDashboardMetrics(): Promise<ApiResponse<KPIMetric[]>> {
    // Mock data for development
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate network delay
      
      const mockMetrics: KPIMetric[] = [
        {
          id: 'total_users',
          label: 'Total Users',
          value: 12847,
          change: { value: 234, percentage: 1.86, direction: 'up' },
          format: 'number',
          icon: 'users',
        },
        {
          id: 'revenue',
          label: 'Monthly Revenue',
          value: 45678,
          change: { value: 5432, percentage: 13.5, direction: 'up' },
          format: 'currency',
          icon: 'dollar-sign',
        },
        {
          id: 'conversion_rate',
          label: 'Conversion Rate',
          value: 3.24,
          change: { value: -0.12, percentage: -3.6, direction: 'down' },
          format: 'percentage',
          icon: 'trending-up',
        },
        {
          id: 'avg_session',
          label: 'Avg. Session Duration',
          value: '4m 32s',
          change: { value: 0.23, percentage: 5.1, direction: 'up' },
          format: 'duration',
          icon: 'clock',
        },
        {
          id: 'bounce_rate',
          label: 'Bounce Rate',
          value: 24.8,
          change: { value: -2.1, percentage: -7.8, direction: 'down' },
          format: 'percentage',
          icon: 'activity',
        },
        {
          id: 'api_calls',
          label: 'API Calls Today',
          value: 98765,
          change: { value: 12345, percentage: 14.3, direction: 'up' },
          format: 'number',
          icon: 'zap',
        },
      ]

      return {
        success: true,
        data: mockMetrics,
        timestamp: new Date().toISOString(),
      }
    }

    return this.request<KPIMetric[]>('/dashboard/metrics')
  }

  // CiteMind Analytics API methods
  async getCiteMindSummary(range: string = '30d', format: string = 'json'): Promise<ApiResponse<any>> {
    return this.request(`/analytics/citemind/summary?range=${range}&format=${format}`)
  }

  async getCiteMindPlatforms(range: string = '30d', format: string = 'json'): Promise<ApiResponse<any>> {
    return this.request(`/analytics/citemind/platforms?range=${range}&format=${format}`)
  }

  async getCiteMindTTC(range: string = '30d', format: string = 'json'): Promise<ApiResponse<any>> {
    return this.request(`/analytics/citemind/ttc?range=${range}&format=${format}`)
  }

  async getCiteMindVisibilityMix(range: string = '30d', format: string = 'json'): Promise<ApiResponse<any>> {
    return this.request(`/analytics/citemind/visibility-mix?range=${range}&format=${format}`)
  }

  // Legacy method for backward compatibility
  async getCiteMindAnalytics(timeRange: string = '30d'): Promise<ApiResponse<CiteMindAnalytics>> {
    // For development, return mock data
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockData: CiteMindAnalytics = {
        totalCitations: 3847,
        averageRelevance: 8.4,
        topSources: [
          { source: 'ChatGPT', citations: 1234, relevanceScore: 9.2 },
          { source: 'Claude', citations: 987, relevanceScore: 8.8 },
          { source: 'Perplexity', citations: 756, relevanceScore: 8.1 },
          { source: 'Gemini', citations: 543, relevanceScore: 7.9 },
        ],
        timeSeriesData: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'Citation Probability',
              data: [0.72, 0.76, 0.71, 0.74],
              borderColor: '#0ea5e9',
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              fill: true,
            },
            {
              label: 'Authority Index',
              data: [82, 86, 81, 84],
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: false,
            },
          ],
        },
        categoryBreakdown: [
          { category: 'ChatGPT', count: 1523, percentage: 39.6 },
          { category: 'Claude', count: 1154, percentage: 30.0 },
          { category: 'Perplexity', count: 692, percentage: 18.0 },
          { category: 'Gemini', count: 478, percentage: 12.4 },
        ],
      }

      return {
        success: true,
        data: mockData,
        timestamp: new Date().toISOString(),
      }
    }

    // In production, use the summary endpoint
    return this.getCiteMindSummary(timeRange)
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; version: string }>> {
    return this.request('/health')
  }

  // Error simulation for testing
  async simulateError(): Promise<ApiResponse<never>> {
    throw new Error('Simulated API error for testing')
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Named exports for specific API calls
export const getDashboardMetrics = () => apiClient.getDashboardMetrics()
export const getCiteMindAnalytics = (timeRange?: string) => 
  apiClient.getCiteMindAnalytics(timeRange)

// CiteMind Analytics exports
export const getCiteMindSummary = (range?: string, format?: string) => 
  apiClient.getCiteMindSummary(range, format)
export const getCiteMindPlatforms = (range?: string, format?: string) => 
  apiClient.getCiteMindPlatforms(range, format)
export const getCiteMindTTC = (range?: string, format?: string) => 
  apiClient.getCiteMindTTC(range, format)
export const getCiteMindVisibilityMix = (range?: string, format?: string) => 
  apiClient.getCiteMindVisibilityMix(range, format)

export const healthCheck = () => apiClient.healthCheck()