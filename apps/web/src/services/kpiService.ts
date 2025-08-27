// KPI Data Service Layer
// Abstracts API calls and provides clean interfaces for KPI data

import type { 
  DashboardData, 
  HeroKPI, 
  MiniKPI, 
  SecondaryKPI, 
  WalletData, 
  PRQueueItem, 
  AlertItem, 
  AgentHealth,
  KPIResponse,
  KPIServiceConfig,
  TimeSeriesData
} from '../types/kpi';
import { calculateDelta, generateMockSparklineData } from '../lib/deltaCalculator';
import { mockDataService } from './mockDataService';

/**
 * KPI Service Configuration
 */
const DEFAULT_CONFIG: KPIServiceConfig = {
  baseURL: process.env.VITE_API_BASE_URL || '/api',
  timeout: 1000, // Reduce timeout to 1 second for fast fallback to mock data
  retryAttempts: 1, // Reduce retries to prevent delays
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  pollingInterval: 30000, // 30 seconds
  endpoints: {
    dashboard: '/dashboard/metrics',
    analytics: '/analytics/overview',
    wallet: '/billing/wallet',
    prQueue: '/pr/queue',
    alerts: '/alerts/active',
    health: '/system/health'
  }
};

/**
 * In-memory cache for API responses
 */
class KPICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set<T>(key: string, data: T, ttl: number = DEFAULT_CONFIG.cacheTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  invalidate(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

const cache = new KPICache();

/**
 * HTTP Client with retry logic
 */
class APIClient {
  private config: KPIServiceConfig;
  
  constructor(config: KPIServiceConfig = DEFAULT_CONFIG) {
    this.config = config;
  }
  
  async request<T>(
    endpoint: string, 
    options: RequestInit = {},
    retryCount = 0
  ): Promise<KPIResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const controller = new AbortController();
    
    // Set timeout
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: KPIResponse<T> = await response.json();
      return data;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Retry logic
      if (retryCount < this.config.retryAttempts && !(error as Error).name.includes('AbortError')) {
        await this.delay(Math.pow(2, retryCount) * 1000); // Exponential backoff
        return this.request<T>(endpoint, options, retryCount + 1);
      }
      
      throw error;
    }
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const apiClient = new APIClient();

/**
 * KPI Service Class
 */
export class KPIService {
  private static instance: KPIService;
  private config: KPIServiceConfig;
  
  private constructor(config: KPIServiceConfig = DEFAULT_CONFIG) {
    this.config = config;
  }
  
  static getInstance(config?: KPIServiceConfig): KPIService {
    if (!KPIService.instance) {
      KPIService.instance = new KPIService(config);
    }
    return KPIService.instance;
  }
  
  /**
   * Fetch complete dashboard data
   */
  async getDashboardData(useCache: boolean = true): Promise<DashboardData> {
    const cacheKey = 'dashboard-data';
    
    if (useCache) {
      const cached = cache.get<DashboardData>(cacheKey);
      if (cached) return cached;
    }
    
    try {
      // In real implementation, this would be a single API call
      // For now, we'll simulate by calling individual endpoints
      const [hero, miniKPIs, secondaryKPIs, wallet, prQueue, alerts, agentHealth] = await Promise.all([
        this.getHeroKPI(),
        this.getMiniKPIs(),
        this.getSecondaryKPIs(),
        this.getWalletData(),
        this.getPRQueue(),
        this.getAlerts(),
        this.getAgentHealth()
      ]);
      
      const dashboardData: DashboardData = {
        hero,
        miniKPIs,
        secondaryKPIs,
        wallet,
        prQueue,
        alerts,
        agentHealth,
        lastRefresh: new Date().toISOString()
      };
      
      if (useCache) {
        cache.set(cacheKey, dashboardData);
      }
      
      return dashboardData;
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Return enhanced mock data as fallback
      return mockDataService.generateDashboardData();
    }
  }
  
  /**
   * Fetch hero KPI data
   */
  async getHeroKPI(): Promise<HeroKPI> {
    // Temporarily bypass API calls and use mock data for fast loading
    return mockDataService.generateHeroKPI();
    
    /* Original API implementation - restored when backend is ready
    try {
      const response = await apiClient.request<any>(this.config.endpoints.analytics);
      
      // Transform API response to HeroKPI format
      return this.transformToHeroKPI(response.data);
      
    } catch (error) {
      console.error('Failed to fetch hero KPI:', error);
      return mockDataService.generateHeroKPI();
    }
    */
  }
  
  /**
   * Fetch mini KPIs data
   */
  async getMiniKPIs(): Promise<MiniKPI[]> {
    // Temporarily bypass API calls and use mock data for fast loading
    return mockDataService.generateMiniKPIs();
  }
  
  /**
   * Fetch secondary KPIs data
   */
  async getSecondaryKPIs(): Promise<SecondaryKPI[]> {
    // Temporarily bypass API calls and use mock data for fast loading
    return mockDataService.generateSecondaryKPIs();
  }
  
  /**
   * Fetch wallet data
   */
  async getWalletData(): Promise<WalletData> {
    // Temporarily bypass API calls and use mock data for fast loading
    return mockDataService.generateWalletData();
  }
  
  /**
   * Fetch PR queue data
   */
  async getPRQueue(): Promise<PRQueueItem[]> {
    // Temporarily bypass API calls and use mock data for fast loading
    return mockDataService.generatePRQueue();
  }
  
  /**
   * Fetch alerts data
   */
  async getAlerts(): Promise<AlertItem[]> {
    // Temporarily bypass API calls and use mock data for fast loading
    return mockDataService.generateAlerts();
  }
  
  /**
   * Fetch agent health data
   */
  async getAgentHealth(): Promise<AgentHealth> {
    // Temporarily bypass API calls and use mock data for fast loading
    return mockDataService.generateAgentHealth();
  }
  
  /**
   * Get time series data for sparklines
   */
  async getTimeSeriesData(metric: string, period: string = '24h'): Promise<TimeSeriesData> {
    try {
      const response = await apiClient.request<any>(
        `${this.config.endpoints.analytics}/timeseries?metric=${metric}&period=${period}`
      );
      
      return response.data;
      
    } catch (error) {
      console.error('Failed to fetch time series data:', error);
      // Return mock sparkline data
      const timeSeriesData = mockDataService.generateTimeSeriesData(74, 20);
      return {
        metric,
        period,
        data: timeSeriesData,
        aggregation: 'avg'
      };
    }
  }
  
  /**
   * Clear cache
   */
  clearCache(): void {
    cache.clear();
  }
  
  /**
   * Invalidate specific cache entry
   */
  invalidateCache(key: string): void {
    cache.invalidate(key);
  }
  
  // Data transformation methods (map API responses to our types)
  
  // @ts-ignore - temporarily unused while API calls are bypassed
  private transformToHeroKPI(data: any): HeroKPI {
    // Map existing dashboard endpoint data to HeroKPI structure
    return {
      id: 'hero-visibility-score',
      score: data?.visibilityScore || 74,
      value: data?.visibilityScore || 74,
      label: 'Cross-pillar marketing performance index',
      confidence: data?.confidence || 85,
      delta: calculateDelta({
        current: data?.visibilityScore || 74,
        previous: data?.previousScore || 66,
        period: 'week'
      }),
      lastUpdated: new Date().toISOString(),
      sparkline: generateMockSparklineData(data?.visibilityScore || 74),
      breakdown: {
        factors: [
          { name: 'Content Performance', weight: 0.3, score: 78, trend: 'up' },
          { name: 'Audience Engagement', weight: 0.25, score: 82, trend: 'up' },
          { name: 'Brand Authority', weight: 0.25, score: 71, trend: 'stable' },
          { name: 'Market Reach', weight: 0.2, score: 69, trend: 'down' }
        ]
      }
    };
  }
  
  // @ts-ignore - temporarily unused while API calls are bypassed
  private transformToMiniKPIs(_data: any): MiniKPI[] {
    return [
      {
        id: 'coverage',
        type: 'coverage',
        label: 'Coverage Score',
        value: '76%',
        numericValue: 76,
        unit: '%',
        progress: 76,
        color: 'teal',
        target: 80
      },
      {
        id: 'authority',
        type: 'authority',
        label: 'Authority Index',
        value: '84%',
        numericValue: 84,
        unit: '%',
        progress: 84,
        color: 'gold',
        target: 90
      },
      {
        id: 'time-',
        type: 'time-',
        label: 'Time-',
        value: '2.4 days',
        numericValue: 2.4,
        unit: 'days',
        progress: 70,
        color: 'neutral',
        target: 2.0
      },
      {
        id: 'cadence',
        type: 'cadence',
        label: 'Publishing Cadence',
        value: '3.2/week',
        numericValue: 3.2,
        unit: '/week',
        progress: 85,
        color: 'teal',
        target: 4.0
      }
    ];
  }
  
  // @ts-ignore - temporarily unused while API calls are bypassed
  private transformToSecondaryKPIs(_data: any): SecondaryKPI[] {
    const baseKPIs = [
      {
        id: 'content-velocity',
        type: 'content-velocity' as const,
        label: 'Content Velocity',
        value: '12.4',
        subtitle: 'pieces/week',
        icon: 'FileText',
        color: 'teal' as const,
        unit: 'pieces/week'
      },
      {
        id: 'audience-growth',
        type: 'audience-growth' as const,
        label: 'Audience Growth',
        value: '2.1K',
        subtitle: 'new followers',
        icon: 'Users',
        color: 'gold' as const,
        unit: 'followers'
      },
      {
        id: 'engagement-rate',
        type: 'engagement-rate' as const,
        label: 'Engagement Rate',
        value: '4.2%',
        subtitle: 'avg interaction',
        icon: 'Target',
        color: 'warning' as const,
        unit: '%'
      },
      {
        id: 'lead-quality',
        type: 'lead-quality' as const,
        label: 'Lead Quality',
        value: '87%',
        subtitle: 'qualified leads',
        icon: 'BarChart3',
        color: 'success' as const,
        unit: '%'
      }
    ];
    
    return baseKPIs.map(kpi => ({
      ...kpi,
      delta: calculateDelta({
        current: parseFloat(kpi.value),
        previous: parseFloat(kpi.value) * 0.95, // Mock previous value
        period: 'week'
      }),
      lastUpdated: new Date().toISOString(),
      sparkline: generateMockSparklineData(parseFloat(kpi.value) || 50)
    }));
  }
  
  // @ts-ignore - temporarily unused while API calls are bypassed
  private transformToWalletData(data: any): WalletData {
    return {
      balance: data?.balance || 2847,
      currency: 'USD',
      formatted: `$${(data?.balance || 2847).toLocaleString()}`,
      transactions: data?.transactions || [
        {
          id: '1',
          type: 'credit',
          amount: 150,
          description: 'Content performance bonus',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          category: 'performance'
        },
        {
          id: '2',
          type: 'debit',
          amount: 45,
          description: 'AI analysis credits',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          category: 'usage'
        },
        {
          id: '3',
          type: 'credit',
          amount: 280,
          description: 'PR placement bonus',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          category: 'performance'
        }
      ],
      monthlyEarnings: data?.monthlyEarnings || 1250,
      projectedEarnings: data?.projectedEarnings || 1800
    };
  }
  
  // @ts-ignore - temporarily unused while API calls are bypassed
  private transformToPRQueue(data: any): PRQueueItem[] {
    return data || [
      {
        id: '1',
        title: 'Enterprise AI Story',
        outlet: 'TechCrunch',
        status: 'pending',
        priority: 'high',
        assignee: 'John Doe',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedReach: 50000,
        category: 'tech'
      },
      {
        id: '2',
        title: 'Startup Funding News',
        outlet: 'VentureBeat',
        status: 'approved',
        priority: 'medium',
        assignee: 'Jane Smith',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedReach: 25000,
        category: 'business'
      },
      {
        id: '3',
        title: 'Industry Trends Report',
        outlet: 'Forbes',
        status: 'draft',
        priority: 'low',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedReach: 75000,
        category: 'industry'
      }
    ];
  }
  
  // @ts-ignore - temporarily unused while API calls are bypassed
  private transformToAlerts(data: any): AlertItem[] {
    return data || [
      {
        id: '1',
        type: 'opportunity',
        severity: 'medium',
        message: 'Trending topic match: "AI Marketing"',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        source: 'trend-monitor',
        actionRequired: true,
        actionUrl: '/campaigns/new?topic=ai-marketing'
      },
      {
        id: '2',
        type: 'warning',
        severity: 'high',
        message: 'Competitor mentioned in Reuters',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        source: 'competitor-monitor',
        actionRequired: false
      },
      {
        id: '3',
        type: 'success',
        severity: 'low',
        message: 'Article featured in newsletter',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        source: 'content-monitor',
        actionRequired: false
      }
    ];
  }
  
  // @ts-ignore - temporarily unused while API calls are bypassed
  private transformToAgentHealth(data: any): AgentHealth {
    return {
      uptime: data?.uptime || 98.5,
      responseTime: data?.responseTime || 24,
      accuracy: data?.accuracy || 94,
      requestsToday: data?.requestsToday || 1247,
      errorsToday: data?.errorsToday || 3,
      lastHealthCheck: new Date().toISOString(),
      services: data?.services || [
        {
          name: 'Content Analysis API',
          status: 'operational',
          responseTime: 18,
          lastCheck: new Date().toISOString()
        },
        {
          name: 'PR Matching Service',
          status: 'operational',
          responseTime: 32,
          lastCheck: new Date().toISOString()
        },
        {
          name: 'Trend Detection',
          status: 'operational',
          responseTime: 45,
          lastCheck: new Date().toISOString()
        }
      ]
    };
  }
  
}

// Export singleton instance
export const kpiService = KPIService.getInstance();

// Export individual service functions for convenience
export const getDashboardData = (useCache = true) => kpiService.getDashboardData(useCache);
export const getHeroKPI = () => kpiService.getHeroKPI();
export const getMiniKPIs = () => kpiService.getMiniKPIs();
export const getSecondaryKPIs = () => kpiService.getSecondaryKPIs();
export const getWalletData = () => kpiService.getWalletData();
export const getPRQueue = () => kpiService.getPRQueue();
export const getAlerts = () => kpiService.getAlerts();
export const getAgentHealth = () => kpiService.getAgentHealth();
export const getTimeSeriesData = (metric: string, period?: string) => kpiService.getTimeSeriesData(metric, period);
