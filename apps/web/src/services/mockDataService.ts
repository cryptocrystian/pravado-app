// Enhanced Mock Data Service
// Provides realistic data for development and testing

import type { 
  DashboardData, 
  HeroKPI, 
  MiniKPI, 
  SecondaryKPI, 
  WalletData, 
  PRQueueItem, 
  AlertItem, 
  AgentHealth,
  TimeSeriesDataPoint
} from '../types/kpi';
import { 
  calculateDelta, 
  generateMockSparklineData,
  formatNumber 
} from '../lib/deltaCalculator';

/**
 * Enhanced Mock Data Generator
 * Provides realistic, time-based data for development
 */
export class MockDataService {
  private static instance: MockDataService;
  private baselineTimestamp: number;
  private dataVariations: Map<string, number> = new Map();
  
  private constructor() {
    this.baselineTimestamp = Date.now() - (7 * 24 * 60 * 60 * 1000); // 1 week ago
    this.initializeVariations();
  }
  
  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }
  
  private initializeVariations(): void {
    // Initialize random variations for consistent but changing data
    const keys = [
      'visibility-score', 'coverage', 'authority', 'time-', 'cadence',
      'content-velocity', 'audience-growth', 'engagement-rate', 'lead-quality',
      'wallet-balance', 'response-time', 'accuracy'
    ];
    
    keys.forEach(key => {
      this.dataVariations.set(key, Math.random() * 0.2 - 0.1); // ±10% variation
    });
  }
  
  private getVariation(key: string): number {
    return this.dataVariations.get(key) || 0;
  }
  
  private simulateTimeBasedValue(
    baseValue: number, 
    key: string, 
    trend: number = 0.02
  ): number {
    const variation = this.getVariation(key);
    const timeFactor = (Date.now() - this.baselineTimestamp) / (24 * 60 * 60 * 1000);
    const trendValue = baseValue * trend * Math.sin(timeFactor * 0.1); // Cyclical trend
    const randomNoise = baseValue * 0.05 * (Math.random() - 0.5);
    
    return Math.max(0, baseValue + (baseValue * variation) + trendValue + randomNoise);
  }
  
  /**
   * Generate Hero KPI data
   */
  generateHeroKPI(): HeroKPI {
    const currentScore = Math.round(this.simulateTimeBasedValue(74, 'visibility-score'));
    const previousScore = Math.round(currentScore * 0.92); // Simulate growth
    
    return {
      id: 'hero-visibility-score',
      score: currentScore,
      value: currentScore,
      label: 'Cross-pillar marketing performance index',
      confidence: Math.round(this.simulateTimeBasedValue(85, 'confidence')),
      delta: calculateDelta({
        current: currentScore,
        previous: previousScore,
        period: 'week'
      }),
      lastUpdated: new Date().toISOString(),
      sparkline: generateMockSparklineData(currentScore, 20, 0.08, 0.02),
      breakdown: {
        factors: [
          {
            name: 'Content Performance',
            weight: 0.3,
            score: Math.round(this.simulateTimeBasedValue(78, 'content-perf')),
            trend: Math.random() > 0.3 ? 'up' : 'stable'
          },
          {
            name: 'Audience Engagement',
            weight: 0.25,
            score: Math.round(this.simulateTimeBasedValue(82, 'engagement')),
            trend: Math.random() > 0.4 ? 'up' : 'stable'
          },
          {
            name: 'Brand Authority',
            weight: 0.25,
            score: Math.round(this.simulateTimeBasedValue(71, 'authority')),
            trend: Math.random() > 0.6 ? 'down' : 'stable'
          },
          {
            name: 'Market Reach',
            weight: 0.2,
            score: Math.round(this.simulateTimeBasedValue(69, 'reach')),
            trend: Math.random() > 0.7 ? 'down' : 'up'
          }
        ]
      }
    };
  }
  
  /**
   * Generate Mini KPIs data
   */
  generateMiniKPIs(): MiniKPI[] {
    const coverage = Math.round(this.simulateTimeBasedValue(76, 'coverage'));
    const authority = Math.round(this.simulateTimeBasedValue(84, 'authority'));
    const timeToConvert = this.simulateTimeBasedValue(2.4, 'time-');
    const cadence = this.simulateTimeBasedValue(3.2, 'cadence');
    
    return [
      {
        id: 'coverage',
        type: 'coverage',
        label: 'Coverage Score',
        value: `${coverage}%`,
        numericValue: coverage,
        unit: '%',
        progress: coverage,
        target: 80,
        color: 'teal'
      },
      {
        id: 'authority',
        type: 'authority',
        label: 'Authority Index',
        value: `${authority}%`,
        numericValue: authority,
        unit: '%',
        progress: authority,
        target: 90,
        color: 'gold'
      },
      {
        id: 'time-',
        type: 'time-',
        label: 'Time-',
        value: `${timeToConvert.toFixed(1)} days`,
        numericValue: timeToConvert,
        unit: 'days',
        progress: Math.max(0, 100 - (timeToConvert / 5) * 100),
        target: 2.0,
        color: 'neutral'
      },
      {
        id: 'cadence',
        type: 'cadence',
        label: 'Publishing Cadence',
        value: `${cadence.toFixed(1)}/week`,
        numericValue: cadence,
        unit: '/week',
        progress: (cadence / 4) * 100,
        target: 4.0,
        color: 'teal'
      }
    ];
  }
  
  /**
   * Generate Secondary KPIs data
   */
  generateSecondaryKPIs(): SecondaryKPI[] {
    const contentVelocity = this.simulateTimeBasedValue(12.4, 'content-velocity');
    const audienceGrowth = Math.round(this.simulateTimeBasedValue(2100, 'audience-growth'));
    const engagementRate = this.simulateTimeBasedValue(4.2, 'engagement-rate');
    const leadQuality = this.simulateTimeBasedValue(87, 'lead-quality');
    
    const baseKPIs = [
      {
        id: 'content-velocity',
        type: 'content-velocity' as const,
        label: 'Content Velocity',
        value: contentVelocity.toFixed(1),
        subtitle: 'pieces/week',
        icon: 'FileText',
        color: 'teal' as const,
        unit: 'pieces/week',
        numericValue: contentVelocity
      },
      {
        id: 'audience-growth',
        type: 'audience-growth' as const,
        label: 'Audience Growth',
        value: formatNumber(audienceGrowth),
        subtitle: 'new followers',
        icon: 'Users',
        color: 'gold' as const,
        unit: 'followers',
        numericValue: audienceGrowth
      },
      {
        id: 'engagement-rate',
        type: 'engagement-rate' as const,
        label: 'Engagement Rate',
        value: `${engagementRate.toFixed(1)}%`,
        subtitle: 'avg interaction',
        icon: 'Target',
        color: engagementRate > 4 ? 'success' as const : 'warning' as const,
        unit: '%',
        numericValue: engagementRate
      },
      {
        id: 'lead-quality',
        type: 'lead-quality' as const,
        label: 'Lead Quality',
        value: `${Math.round(leadQuality)}%`,
        subtitle: 'qualified leads',
        icon: 'BarChart3',
        color: 'success' as const,
        unit: '%',
        numericValue: leadQuality
      }
    ];
    
    return baseKPIs.map(kpi => ({
      ...kpi,
      delta: calculateDelta({
        current: kpi.numericValue,
        previous: kpi.numericValue * (0.95 + Math.random() * 0.1), // ±5% variation
        period: 'week'
      }),
      lastUpdated: new Date().toISOString(),
      sparkline: generateMockSparklineData(kpi.numericValue, 15, 0.1, 0.015),
      target: kpi.id === 'content-velocity' ? 15 :
              kpi.id === 'audience-growth' ? 2500 :
              kpi.id === 'engagement-rate' ? 5 :
              90
    }));
  }
  
  /**
   * Generate Wallet data
   */
  generateWalletData(): WalletData {
    const baseBalance = 2847;
    const currentBalance = Math.round(this.simulateTimeBasedValue(baseBalance, 'wallet-balance', 0.01));
    
    // Generate realistic transactions
    const transactionTypes = [
      { type: 'credit', descriptions: ['Content performance bonus', 'PR placement bonus', 'Engagement reward', 'Monthly bonus'], amounts: [150, 280, 95, 450] },
      { type: 'debit', descriptions: ['AI analysis credits', 'Premium features', 'API usage', 'Data export'], amounts: [45, 29, 18, 35] }
    ];
    
    const transactions = [];
    for (let i = 0; i < 5; i++) {
      const typeData = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const description = typeData.descriptions[Math.floor(Math.random() * typeData.descriptions.length)];
      const amount = typeData.amounts[Math.floor(Math.random() * typeData.amounts.length)];
      
      transactions.push({
        id: `tx-${i}`,
        type: typeData.type as 'credit' | 'debit',
        amount,
        description,
        timestamp: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString(), // Every 3 hours
        category: typeData.type === 'credit' ? 'performance' : 'usage'
      });
    }
    
    return {
      balance: currentBalance,
      currency: 'USD',
      formatted: `$${currentBalance.toLocaleString()}`,
      transactions,
      monthlyEarnings: Math.round(this.simulateTimeBasedValue(1250, 'monthly-earnings')),
      projectedEarnings: Math.round(this.simulateTimeBasedValue(1800, 'projected-earnings'))
    };
  }
  
  /**
   * Generate PR Queue data
   */
  generatePRQueue(): PRQueueItem[] {
    const outlets = [
      { name: 'TechCrunch', reach: 50000 },
      { name: 'VentureBeat', reach: 25000 },
      { name: 'Forbes', reach: 75000 },
      { name: 'Reuters', reach: 100000 },
      { name: 'Wired', reach: 35000 },
      { name: 'Fast Company', reach: 40000 }
    ];
    
    const titles = [
      'Enterprise AI Story',
      'Startup Funding News',
      'Industry Trends Report',
      'Tech Innovation Spotlight',
      'Market Analysis Deep Dive',
      'Executive Interview Feature'
    ];
    
    const statuses: Array<'draft' | 'pending' | 'approved' | 'published' | 'rejected'> = 
      ['draft', 'pending', 'approved', 'published', 'rejected'];
    
    const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    
    const assignees = ['John Doe', 'Jane Smith', 'Alex Chen', 'Sarah Wilson', 'Mike Johnson'];
    
    const categories = ['tech', 'business', 'industry', 'startup', 'enterprise'];
    
    return Array.from({ length: 4 }, (_, i) => {
      const outlet = outlets[Math.floor(Math.random() * outlets.length)];
      return {
        id: `pr-${i}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        outlet: outlet.name,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        assignee: assignees[Math.floor(Math.random() * assignees.length)],
        deadline: new Date(Date.now() + (Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString(),
        estimatedReach: outlet.reach,
        category: categories[Math.floor(Math.random() * categories.length)]
      };
    });
  }
  
  /**
   * Generate Alerts data
   */
  generateAlerts(): AlertItem[] {
    const alertTemplates = [
      {
        type: 'opportunity' as const,
        severities: ['medium', 'high'] as const,
        messages: [
          'Trending topic match: "AI Marketing"',
          'Competitor gap identified in "Data Analytics"',
          'High-impact journalist available for interview',
          'Breaking news opportunity in your sector'
        ]
      },
      {
        type: 'warning' as const,
        severities: ['medium', 'high'] as const,
        messages: [
          'Competitor mentioned in Reuters',
          'Negative sentiment detected in social media',
          'Brand mention without proper attribution',
          'Unusual decrease in engagement rates'
        ]
      },
      {
        type: 'success' as const,
        severities: ['low', 'medium'] as const,
        messages: [
          'Article featured in newsletter',
          'Content reached viral threshold',
          'New high-quality backlink acquired',
          'Positive review from industry leader'
        ]
      },
      {
        type: 'info' as const,
        severities: ['low'] as const,
        messages: [
          'Weekly analytics report ready',
          'New content suggestion available',
          'Competitor analysis updated',
          'System maintenance scheduled'
        ]
      }
    ];
    
    const sources = ['trend-monitor', 'competitor-monitor', 'content-monitor', 'social-monitor', 'system'];
    
    return Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, i) => {
      const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
      const severity = template.severities[Math.floor(Math.random() * template.severities.length)];
      const message = template.messages[Math.floor(Math.random() * template.messages.length)];
      
      return {
        id: `alert-${i}`,
        type: template.type,
        severity,
        message,
        timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000).toISOString(), // Last 6 hours
        source: sources[Math.floor(Math.random() * sources.length)],
        actionRequired: template.type === 'opportunity' || (template.type === 'warning' && severity === 'high'),
        actionUrl: template.type === 'opportunity' ? '/campaigns/new' : undefined,
        metadata: {
          category: template.type,
          autoGenerated: true
        }
      };
    });
  }
  
  /**
   * Generate Agent Health data
   */
  generateAgentHealth(): AgentHealth {
    const uptime = this.simulateTimeBasedValue(98.5, 'uptime', 0.001);
    const responseTime = Math.round(this.simulateTimeBasedValue(24, 'response-time', -0.01));
    const accuracy = Math.round(this.simulateTimeBasedValue(94, 'accuracy', 0.005));
    
    const services = [
      'Content Analysis API',
      'PR Matching Service',
      'Trend Detection',
      'Sentiment Analysis',
      'Data Processing Engine'
    ].map(name => {
      const serviceUptime = this.simulateTimeBasedValue(99, `service-${name}`, 0.001);
      return {
        name,
        status: serviceUptime > 95 ? 'operational' as const : serviceUptime > 90 ? 'degraded' as const : 'down' as const,
        responseTime: Math.round(this.simulateTimeBasedValue(30, `${name}-response`)),
        lastCheck: new Date(Date.now() - Math.random() * 5 * 60 * 1000).toISOString() // Last 5 minutes
      };
    });
    
    return {
      uptime: Math.min(100, uptime),
      responseTime: Math.max(10, responseTime),
      accuracy: Math.min(100, Math.max(80, accuracy)),
      requestsToday: Math.round(this.simulateTimeBasedValue(1247, 'requests')),
      errorsToday: Math.round(this.simulateTimeBasedValue(3, 'errors', 0.1)),
      lastHealthCheck: new Date().toISOString(),
      services
    };
  }
  
  /**
   * Generate complete dashboard data
   */
  generateDashboardData(): DashboardData {
    return {
      hero: this.generateHeroKPI(),
      miniKPIs: this.generateMiniKPIs(),
      secondaryKPIs: this.generateSecondaryKPIs(),
      wallet: this.generateWalletData(),
      prQueue: this.generatePRQueue(),
      alerts: this.generateAlerts(),
      agentHealth: this.generateAgentHealth(),
      lastRefresh: new Date().toISOString()
    };
  }
  
  /**
   * Generate time series data for sparklines
   */
  generateTimeSeriesData(baseValue: number, points: number = 20): TimeSeriesDataPoint[] {
    const data: TimeSeriesDataPoint[] = [];
    const now = new Date();
    
    for (let i = 0; i < points; i++) {
      const timestamp = new Date(now.getTime() - (points - i - 1) * 60 * 60 * 1000);
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const trendFactor = Math.sin((i / points) * Math.PI) * 0.1; // Slight upward trend
      const value = baseValue * (1 + variation + trendFactor);
      
      data.push({
        timestamp: timestamp.toISOString(),
        value: Math.max(0, value),
        metadata: {
          index: i,
          baseValue,
          variation,
          trendFactor
        }
      });
    }
    
    return data;
  }
  
  /**
   * Reset variations (useful for testing)
   */
  resetVariations(): void {
    this.initializeVariations();
  }
  
  /**
   * Set specific variation for testing
   */
  setVariation(key: string, variation: number): void {
    this.dataVariations.set(key, variation);
  }
}

// Export singleton instance
export const mockDataService = MockDataService.getInstance();

// Export convenience functions
export const generateMockDashboardData = () => mockDataService.generateDashboardData();
export const generateMockHeroKPI = () => mockDataService.generateHeroKPI();
export const generateMockMiniKPIs = () => mockDataService.generateMiniKPIs();
export const generateMockSecondaryKPIs = () => mockDataService.generateSecondaryKPIs();
export const generateMockWalletData = () => mockDataService.generateWalletData();
export const generateMockPRQueue = () => mockDataService.generatePRQueue();
export const generateMockAlerts = () => mockDataService.generateAlerts();
export const generateMockAgentHealth = () => mockDataService.generateAgentHealth();
export const generateMockTimeSeriesData = (baseValue: number, points?: number) => 
  mockDataService.generateTimeSeriesData(baseValue, points);
