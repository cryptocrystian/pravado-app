// KPI to Existing Endpoint Mapping Documentation
// This file documents how each KPI component maps to existing backend endpoints

/**
 * COMPREHENSIVE DATA FLOW MAPPING
 * 
 * This document outlines how KPI hero and tiles wire to existing endpoints
 * without requiring schema changes or new API endpoints.
 * 
 * IMPORTANT: All mappings use existing dashboard/analytics endpoints
 * and perform client-side delta computation where needed.
 */

export interface EndpointMapping {
  component: string;
  kpiType: string;
  existingEndpoint: string;
  dataPath: string;
  transformation: string;
  deltaCalculation: 'client-side' | 'server-provided';
  cacheable: boolean;
  realTimeCapable: boolean;
}

/**
 * MAIN KPI HERO SCORE MAPPING
 * Maps to primary metric from existing dashboard endpoint
 */
export const HERO_KPI_MAPPING: EndpointMapping = {
  component: 'KPIHero',
  kpiType: 'Primary Visibility Score',
  existingEndpoint: '/api/dashboard/metrics',
  dataPath: 'data.visibilityScore',
  transformation: `
    // Transform dashboard response to Hero KPI
    const heroKPI = {
      score: response.data.visibilityScore,
      label: 'Cross-pillar marketing performance index',
      delta: calculateDelta({
        current: response.data.visibilityScore,
        previous: response.data.previousScore || historicalData.lastWeek,
        period: 'weekly'
      }),
      sparklineData: generateSparklineData(response.data.timeSeries),
      confidence: response.data.confidence || 85
    }
  `,
  deltaCalculation: 'client-side',
  cacheable: true,
  realTimeCapable: true
};

/**
 * MINI KPIs MAPPING (4 tiles in hero section)
 * Coverage, Authority, Time-, Cadence
 */
export const MINI_KPIS_MAPPING: EndpointMapping[] = [
  {
    component: 'MiniKPI - Coverage',
    kpiType: 'Coverage Score',
    existingEndpoint: '/api/analytics/coverage',
    dataPath: 'data.coverageMetrics.overall',
    transformation: `
      // Map coverage data to mini KPI format
      {
        id: 'coverage',
        type: 'coverage',
        label: 'Coverage Score',
        value: response.data.coverageMetrics.overall.percentage + '%',
        numericValue: response.data.coverageMetrics.overall.percentage,
        progress: response.data.coverageMetrics.overall.percentage,
        target: response.data.coverageMetrics.target,
        color: 'teal'
      }
    `,
    deltaCalculation: 'client-side',
    cacheable: true,
    realTimeCapable: false
  },
  {
    component: 'MiniKPI - Authority',
    kpiType: 'Authority Index',
    existingEndpoint: '/api/analytics/authority',
    dataPath: 'data.authorityIndex',
    transformation: `
      // Map authority data to mini KPI format
      {
        id: 'authority',
        type: 'authority',
        label: 'Authority Index',
        value: response.data.authorityIndex.score + '%',
        numericValue: response.data.authorityIndex.score,
        progress: response.data.authorityIndex.score,
        target: 90,
        color: 'gold'
      }
    `,
    deltaCalculation: 'client-side',
    cacheable: true,
    realTimeCapable: false
  },
  {
    component: 'MiniKPI - Time to Convert',
    kpiType: 'Time-',
    existingEndpoint: '/api/analytics/conversion',
    dataPath: 'data.conversionMetrics.averageTime',
    transformation: `
      // Map conversion time to mini KPI format
      const avgDays = response.data.conversionMetrics.averageTime / (24 * 60 * 60 * 1000);
      {
        id: 'time-',
        type: 'time-',
        label: 'Time-',
        value: avgDays.toFixed(1) + ' days',
        numericValue: avgDays,
        progress: Math.max(0, 100 - (avgDays / 5) * 100), // Invert for progress
        target: 2.0,
        color: 'neutral'
      }
    `,
    deltaCalculation: 'client-side',
    cacheable: true,
    realTimeCapable: false
  },
  {
    component: 'MiniKPI - Cadence',
    kpiType: 'Publishing Cadence',
    existingEndpoint: '/api/content/publishing-stats',
    dataPath: 'data.cadence.weekly',
    transformation: `
      // Map publishing cadence to mini KPI format
      {
        id: 'cadence',
        type: 'cadence',
        label: 'Publishing Cadence',
        value: response.data.cadence.weekly.toFixed(1) + '/week',
        numericValue: response.data.cadence.weekly,
        progress: (response.data.cadence.weekly / 4) * 100, // Target 4/week
        target: 4.0,
        color: 'teal'
      }
    `,
    deltaCalculation: 'client-side',
    cacheable: true,
    realTimeCapable: false
  }
];

/**
 * SECONDARY KPI TILES MAPPING
 * Content Velocity, Audience Growth, Engagement Rate, Lead Quality
 */
export const SECONDARY_KPIS_MAPPING: EndpointMapping[] = [
  {
    component: 'SecondaryKPI - Content Velocity',
    kpiType: 'Content Velocity',
    existingEndpoint: '/api/content/velocity',
    dataPath: 'data.velocity.weekly',
    transformation: `
      // Map content velocity to secondary KPI
      {
        id: 'content-velocity',
        type: 'content-velocity',
        label: 'Content Velocity',
        value: response.data.velocity.weekly.toFixed(1),
        subtitle: 'pieces/week',
        delta: calculateDelta({
          current: response.data.velocity.weekly,
          previous: response.data.velocity.previousWeek,
          period: 'weekly'
        }),
        sparkline: generateSparklineData(response.data.timeSeries),
        color: 'teal'
      }
    `,
    deltaCalculation: 'client-side',
    cacheable: true,
    realTimeCapable: true
  },
  {
    component: 'SecondaryKPI - Audience Growth',
    kpiType: 'Audience Growth',
    existingEndpoint: '/api/analytics/audience',
    dataPath: 'data.growth.newFollowers',
    transformation: `
      // Map audience growth to secondary KPI
      const growth = response.data.growth.newFollowers;
      {
        id: 'audience-growth',
        type: 'audience-growth',
        label: 'Audience Growth',
        value: formatNumber(growth),
        subtitle: 'new followers',
        delta: calculateDelta({
          current: growth,
          previous: response.data.growth.previousPeriod,
          period: 'weekly'
        }),
        sparkline: generateSparklineData(response.data.timeSeries),
        color: 'gold'
      }
    `,
    deltaCalculation: 'client-side',
    cacheable: true,
    realTimeCapable: true
  },
  {
    component: 'SecondaryKPI - Engagement Rate',
    kpiType: 'Engagement Rate',
    existingEndpoint: '/api/analytics/engagement',
    dataPath: 'data.engagement.averageRate',
    transformation: `
      // Map engagement rate to secondary KPI
      {
        id: 'engagement-rate',
        type: 'engagement-rate',
        label: 'Engagement Rate',
        value: (response.data.engagement.averageRate * 100).toFixed(1) + '%',
        subtitle: 'avg interaction',
        delta: calculateDelta({
          current: response.data.engagement.averageRate,
          previous: response.data.engagement.previousRate,
          period: 'weekly'
        }),
        sparkline: generateSparklineData(response.data.timeSeries),
        color: response.data.engagement.trend === 'up' ? 'success' : 'warning'
      }
    `,
    deltaCalculation: 'client-side',
    cacheable: true,
    realTimeCapable: true
  },
  {
    component: 'SecondaryKPI - Lead Quality',
    kpiType: 'Lead Quality',
    existingEndpoint: '/api/analytics/leads',
    dataPath: 'data.leads.qualityScore',
    transformation: `
      // Map lead quality to secondary KPI
      {
        id: 'lead-quality',
        type: 'lead-quality',
        label: 'Lead Quality',
        value: (response.data.leads.qualityScore * 100).toFixed(0) + '%',
        subtitle: 'qualified leads',
        delta: calculateDelta({
          current: response.data.leads.qualityScore,
          previous: response.data.leads.previousQualityScore,
          period: 'weekly'
        }),
        sparkline: generateSparklineData(response.data.timeSeries),
        color: 'success'
      }
    `,
    deltaCalculation: 'client-side',
    cacheable: true,
    realTimeCapable: false
  }
];

/**
 * RIGHT RAIL TILES MAPPING
 * Wallet, PR Queue, Real-time Alerts, Agent Health
 */
export const RIGHT_RAIL_MAPPING: EndpointMapping[] = [
  {
    component: 'RightRailTile - Wallet',
    kpiType: 'Wallet Balance',
    existingEndpoint: '/api/billing/wallet',
    dataPath: 'data.balance',
    transformation: `
      // Map wallet data to right rail tile
      {
        balance: response.data.balance.current,
        currency: 'USD',
        formatted: '$' + response.data.balance.current.toLocaleString(),
        transactions: response.data.transactions.map(tx => ({
          id: tx.id,
          type: tx.type,
          amount: tx.amount,
          description: tx.description,
          timestamp: tx.createdAt,
          category: tx.category
        })),
        monthlyEarnings: response.data.monthlyEarnings,
        projectedEarnings: response.data.projectedEarnings
      }
    `,
    deltaCalculation: 'server-provided',
    cacheable: true,
    realTimeCapable: true
  },
  {
    component: 'RightRailTile - PR Queue',
    kpiType: 'PR Queue Status',
    existingEndpoint: '/api/pr/queue',
    dataPath: 'data.activeItems',
    transformation: `
      // Map PR queue data to right rail tile
      response.data.activeItems.map(item => ({
        id: item.id,
        title: item.title,
        outlet: item.outlet.name,
        status: item.status,
        priority: item.priority,
        assignee: item.assignedTo?.name,
        deadline: item.deadline,
        estimatedReach: item.outlet.estimatedReach,
        category: item.category
      }))
    `,
    deltaCalculation: 'server-provided',
    cacheable: true,
    realTimeCapable: true
  },
  {
    component: 'RightRailTile - Alerts',
    kpiType: 'Real-time Alerts',
    existingEndpoint: '/api/alerts/active',
    dataPath: 'data.alerts',
    transformation: `
      // Map alerts data to right rail tile
      response.data.alerts.map(alert => ({
        id: alert.id,
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
        timestamp: alert.createdAt,
        source: alert.source,
        actionRequired: alert.requiresAction,
        actionUrl: alert.actionUrl,
        metadata: alert.metadata
      }))
    `,
    deltaCalculation: 'server-provided',
    cacheable: false, // Real-time data
    realTimeCapable: true
  },
  {
    component: 'RightRailTile - Agent Health',
    kpiType: 'Agent Health',
    existingEndpoint: '/api/system/health',
    dataPath: 'data.systemHealth',
    transformation: `
      // Map system health data to right rail tile
      {
        uptime: response.data.systemHealth.uptime,
        responseTime: response.data.systemHealth.averageResponseTime,
        accuracy: response.data.systemHealth.accuracy,
        requestsToday: response.data.systemHealth.todayRequests,
        errorsToday: response.data.systemHealth.todayErrors,
        lastHealthCheck: response.data.systemHealth.lastCheck,
        services: response.data.services.map(service => ({
          name: service.name,
          status: service.status,
          responseTime: service.responseTime,
          lastCheck: service.lastCheck
        }))
      }
    `,
    deltaCalculation: 'server-provided',
    cacheable: false, // Real-time health data
    realTimeCapable: true
  }
];

/**
 * CLIENT-SIDE DELTA COMPUTATION STRATEGY
 * 
 * For endpoints that don't provide delta/trend data, we compute it client-side:
 */
export const DELTA_COMPUTATION_STRATEGY = {
  /**
   * Time-based comparison using historical data
   * 1. Fetch current data from primary endpoint
   * 2. Fetch historical data from same endpoint with time parameter
   * 3. Compute delta using deltaCalculator utility
   */
  timeBased: {
    example: `
      const current = await fetch('/api/analytics/coverage');
      const previous = await fetch('/api/analytics/coverage?period=1w&offset=1w');
      
      const delta = calculateDelta({
        current: current.data.coverageMetrics.overall.percentage,
        previous: previous.data.coverageMetrics.overall.percentage,
        period: 'weekly'
      });
    `
  },
  
  /**
   * Cached comparison using localStorage/indexedDB
   * 1. Store previous values in local cache with timestamps
   * 2. Compare current values with cached values
   * 3. Update cache after each fetch
   */
  cached: {
    example: `
      const cacheKey = 'kpi-coverage-previous';
      const cached = localStorage.getItem(cacheKey);
      const previous = cached ? JSON.parse(cached) : null;
      
      if (previous && isWithinTimeWindow(previous.timestamp, '1w')) {
        const delta = calculateDelta({
          current: currentValue,
          previous: previous.value,
          period: 'weekly'
        });
      }
      
      // Update cache
      localStorage.setItem(cacheKey, JSON.stringify({
        value: currentValue,
        timestamp: Date.now()
      }));
    `
  },
  
  /**
   * Time series analysis for sparklines
   * 1. Fetch time series data from existing endpoints
   * 2. Generate sparkline data points
   * 3. Calculate trend direction and anomalies
   */
  timeSeries: {
    example: `
      const timeSeries = await fetch('/api/analytics/coverage/timeseries?period=30d');
      const sparklineData = generateSparklineData(timeSeries.data.points);
      const trendDirection = calculateTrendDirection(
        timeSeries.data.points.map(p => p.value)
      );
    `
  }
};

/**
 * API ENDPOINT FALLBACK STRATEGY
 * 
 * When existing endpoints are unavailable, we use mock data:
 */
export const FALLBACK_STRATEGY = {
  primary: 'Use existing endpoint with error handling',
  fallback: 'Return mock data that matches expected interface',
  gracefulDegradation: 'Show loading states and retry mechanisms',
  caching: 'Use cached data when available during outages'
};

/**
 * PERFORMANCE OPTIMIZATION MAPPING
 */
export const PERFORMANCE_MAPPING = {
  caching: {
    hero: '5 minutes TTL',
    miniKPIs: '10 minutes TTL',
    secondary: '5 minutes TTL',
    wallet: '2 minutes TTL',
    prQueue: '30 seconds TTL',
    alerts: 'No cache (real-time)',
    health: '30 seconds TTL'
  },
  
  polling: {
    dashboard: '30 seconds',
    alerts: '15 seconds',
    health: '10 seconds',
    wallet: '60 seconds'
  },
  
  batchRequests: {
    strategy: 'Combine related KPI requests into single dashboard call',
    endpoint: '/api/dashboard/metrics',
    benefits: 'Reduces API calls from 8 individual requests to 1 batch request'
  }
};

/**
 * REAL-TIME UPDATES MAPPING
 * 
 * For components that support real-time updates:
 */
export const REAL_TIME_MAPPING = {
  websocket: {
    endpoint: 'ws://api.domain.com/kpi/stream',
    events: ['hero-updated', 'alerts-new', 'wallet-transaction', 'health-status']
  },
  
  serverSentEvents: {
    endpoint: '/api/kpi/stream',
    eventTypes: ['kpi-update', 'alert', 'health-check']
  },
  
  polling: {
    intervals: {
      critical: '10 seconds', // Health, alerts
      normal: '30 seconds',   // Hero, secondary KPIs
      background: '60 seconds' // Wallet, less critical data
    }
  }
};

/**
 * EXPORT ALL MAPPINGS FOR SERVICE LAYER
 */
export const KPI_ENDPOINT_MAPPINGS = {
  hero: HERO_KPI_MAPPING,
  miniKPIs: MINI_KPIS_MAPPING,
  secondaryKPIs: SECONDARY_KPIS_MAPPING,
  rightRail: RIGHT_RAIL_MAPPING,
  deltaStrategy: DELTA_COMPUTATION_STRATEGY,
  fallback: FALLBACK_STRATEGY,
  performance: PERFORMANCE_MAPPING,
  realTime: REAL_TIME_MAPPING
};

// Export utility functions for service layer
export function getEndpointForKPI(kpiId: string): string | null {
  const allMappings = [
    HERO_KPI_MAPPING,
    ...MINI_KPIS_MAPPING,
    ...SECONDARY_KPIS_MAPPING,
    ...RIGHT_RAIL_MAPPING
  ];
  
  const mapping = allMappings.find(m => m.kpiType.toLowerCase().includes(kpiId.toLowerCase()));
  return mapping?.existingEndpoint || null;
}

export function shouldUseClientSideDelta(kpiId: string): boolean {
  const allMappings = [
    HERO_KPI_MAPPING,
    ...MINI_KPIS_MAPPING,
    ...SECONDARY_KPIS_MAPPING,
    ...RIGHT_RAIL_MAPPING
  ];
  
  const mapping = allMappings.find(m => m.kpiType.toLowerCase().includes(kpiId.toLowerCase()));
  return mapping?.deltaCalculation === 'client-side';
}

export function getCacheTTLForKPI(kpiId: string): number {
  // Return cache TTL in milliseconds based on KPI type
  const cacheTTLMap: { [key: string]: number } = {
    hero: 5 * 60 * 1000,      // 5 minutes
    mini: 10 * 60 * 1000,     // 10 minutes
    secondary: 5 * 60 * 1000,  // 5 minutes
    wallet: 2 * 60 * 1000,     // 2 minutes
    prQueue: 30 * 1000,        // 30 seconds
    alerts: 0,                 // No cache
    health: 30 * 1000          // 30 seconds
  };
  
  for (const [key, ttl] of Object.entries(cacheTTLMap)) {
    if (kpiId.toLowerCase().includes(key)) {
      return ttl;
    }
  }
  
  return 5 * 60 * 1000; // Default 5 minutes
}
