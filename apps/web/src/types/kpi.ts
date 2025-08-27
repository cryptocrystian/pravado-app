// KPI Data Types and Interfaces
// This defines the structure for all KPI-related data flows

export interface SparklineDataPoint {
  timestamp: string;
  value: number;
}

export interface DeltaValue {
  value: string;
  percentage: number;
  positive: boolean;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export interface BaseKPI {
  id: string;
  value: number | string;
  label: string;
  delta: DeltaValue;
  lastUpdated: string;
  sparkline?: SparklineDataPoint[];
}

// Main Hero KPI
export interface HeroKPI extends BaseKPI {
  score: number;
  confidence: number;
  breakdown: {
    factors: Array<{
      name: string;
      weight: number;
      score: number;
      trend: 'up' | 'down' | 'stable';
    }>;
  };
}

// Mini KPIs in Hero section
export interface MiniKPI {
  id: string;
  type: 'coverage' | 'authority' | 'time-' | 'cadence';
  label: string;
  value: string;
  numericValue: number;
  unit: string;
  progress: number;
  target?: number;
  color: 'teal' | 'gold' | 'neutral';
}

// Secondary KPI Tiles
export interface SecondaryKPI extends BaseKPI {
  type: 'content-velocity' | 'audience-growth' | 'engagement-rate' | 'lead-quality';
  subtitle: string;
  icon: string;
  color: 'teal' | 'gold' | 'warning' | 'success';
  target?: number;
  unit: string;
}

// Right Rail Tiles
export interface WalletData {
  balance: number;
  currency: string;
  formatted: string;
  transactions: Array<{
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    timestamp: string;
    category: string;
  }>;
  monthlyEarnings: number;
  projectedEarnings: number;
}

export interface PRQueueItem {
  id: string;
  title: string;
  outlet: string;
  status: 'draft' | 'pending' | 'approved' | 'published' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  deadline: string;
  estimatedReach: number;
  category: string;
}

export interface AlertItem {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  source: string;
  actionRequired: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface AgentHealth {
  uptime: number;
  responseTime: number;
  accuracy: number;
  requestsToday: number;
  errorsToday: number;
  lastHealthCheck: string;
  services: Array<{
    name: string;
    status: 'operational' | 'degraded' | 'down';
    responseTime: number;
    lastCheck: string;
  }>;
}

// Main Dashboard Data Structure
export interface DashboardData {
  hero: HeroKPI;
  miniKPIs: MiniKPI[];
  secondaryKPIs: SecondaryKPI[];
  wallet: WalletData;
  prQueue: PRQueueItem[];
  alerts: AlertItem[];
  agentHealth: AgentHealth;
  lastRefresh: string;
}

// API Response Types
export interface KPIResponse<T = any> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    version: string;
    cacheTTL: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Service Configuration
export interface KPIServiceConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  cacheTTL: number;
  pollingInterval: number;
  endpoints: {
    dashboard: string;
    analytics: string;
    wallet: string;
    prQueue: string;
    alerts: string;
    health: string;
  };
}

// Hook States
export interface KPIHookState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  lastFetch: string | null;
  refetch: () => Promise<void>;
  refresh: () => void;
}

export interface DashboardHookState extends KPIHookState<DashboardData> {
  refetchHero: () => Promise<void>;
  refetchSecondary: () => Promise<void>;
  refetchRightRail: () => Promise<void>;
}

// Cache Entry
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

// Delta Calculation Types
export interface DeltaCalculationInput {
  current: number;
  previous: number;
  period: 'hour' | 'day' | 'week' | 'month';
  format?: 'percentage' | 'absolute' | 'smart';
}

export interface DeltaCalculationResult extends DeltaValue {
  rawChange: number;
  significanceLevel: 'low' | 'medium' | 'high';
  trend: 'improving' | 'declining' | 'stable';
}

// Time Series Data
export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface TimeSeriesData {
  metric: string;
  period: string;
  data: TimeSeriesDataPoint[];
  aggregation: 'sum' | 'avg' | 'max' | 'min' | 'count';
}
