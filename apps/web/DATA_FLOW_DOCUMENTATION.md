# KPI Data Flow Documentation

## Overview

This document outlines the comprehensive data integration architecture for KPI hero and tiles, mapping them to existing backend endpoints without requiring schema changes or new API endpoints.

## Architecture Components

### 1. Service Layer (`src/services/kpiService.ts`)
- **Purpose**: Abstracts API calls and provides clean interfaces for KPI data
- **Features**: 
  - HTTP client with retry logic and exponential backoff
  - In-memory caching with configurable TTL
  - Error handling and fallback to mock data
  - Singleton pattern for consistent instance management

### 2. Data Types (`src/types/kpi.ts`)
- **Purpose**: TypeScript interfaces for all KPI-related data flows
- **Includes**: 
  - Base KPI interfaces with delta values and sparkline data
  - Specific types for Hero, Mini, Secondary, and Right Rail components
  - API response types with error handling
  - Hook state interfaces for React integration

### 3. Delta Calculator (`src/lib/deltaCalculator.ts`)
- **Purpose**: Client-side computation for trends, deltas, and sparkline data
- **Features**:
  - Percentage and absolute change calculations
  - Trend direction analysis (up/down/stable)
  - Sparkline data generation from time series
  - Anomaly detection and confidence intervals
  - Number formatting with K/M/B suffixes

### 4. React Hooks (`src/hooks/useKPIData.ts`)
- **Purpose**: React hooks for KPI data management with loading states
- **Features**:
  - Base hook with polling and retry logic
  - Specialized hooks for each KPI type
  - Real-time updates via WebSocket/SSE
  - Optimistic updates for UI responsiveness
  - Notification management for alerts

### 5. Mock Data Service (`src/services/mockDataService.ts`)
- **Purpose**: Enhanced mock data for development and testing
- **Features**:
  - Time-based realistic data variations
  - Consistent but evolving values
  - Realistic transaction and alert generation
  - Sparkline data with proper trends

## Endpoint Mappings

### Main KPI Hero Score
```typescript
// Maps to existing dashboard endpoint
GET /api/dashboard/metrics
{
  "data": {
    "visibilityScore": 74,
    "previousScore": 66,
    "confidence": 85,
    "timeSeries": [...] // For sparkline generation
  }
}

// Transformed to:
const heroKPI = {
  score: response.data.visibilityScore,
  delta: calculateDelta({
    current: response.data.visibilityScore,
    previous: response.data.previousScore,
    period: 'weekly'
  }),
  sparklineData: generateSparklineData(response.data.timeSeries)
}
```

### Mini KPIs (4 tiles in hero section)

#### 1. Coverage Score
```typescript
GET /api/analytics/coverage
// Transform: response.data.coverageMetrics.overall.percentage -> Coverage KPI
```

#### 2. Authority Index
```typescript
GET /api/analytics/authority
// Transform: response.data.authorityIndex.score -> Authority KPI
```

#### 3. Time-to-Citation
```typescript
GET /api/analytics/conversion
// Transform: response.data.conversionMetrics.averageTime -> Time-to-Convert KPI
```

#### 4. Publishing Cadence
```typescript
GET /api/content/publishing-stats
// Transform: response.data.cadence.weekly -> Cadence KPI
```

### Secondary KPI Tiles

#### 1. Content Velocity
```typescript
GET /api/content/velocity
// Transform: response.data.velocity.weekly -> Content Velocity KPI
// Delta: Client-side calculation using previous week's data
```

#### 2. Audience Growth
```typescript
GET /api/analytics/audience
// Transform: response.data.growth.newFollowers -> Audience Growth KPI
// Format: Use formatNumber() for K/M notation
```

#### 3. Engagement Rate
```typescript
GET /api/analytics/engagement
// Transform: response.data.engagement.averageRate -> Engagement Rate KPI
// Color: Dynamic based on trend direction
```

#### 4. Lead Quality
```typescript
GET /api/analytics/leads
// Transform: response.data.leads.qualityScore -> Lead Quality KPI
```

### Right Rail Tiles

#### 1. Wallet Balance
```typescript
GET /api/billing/wallet
// Transform: Full wallet object with transactions
// Real-time: Supports WebSocket updates for new transactions
```

#### 2. PR Queue
```typescript
GET /api/pr/queue
// Transform: response.data.activeItems -> PR Queue items
// Includes: Status, priority, estimated reach
```

#### 3. Real-time Alerts
```typescript
GET /api/alerts/active
// Transform: response.data.alerts -> Alert items
// Features: Action required flags, severity levels
```

#### 4. Agent Health
```typescript
GET /api/system/health
// Transform: response.data.systemHealth -> Health metrics
// Includes: Service status, uptime, performance metrics
```

## Client-Side Delta Computation Strategy

### Time-Based Comparison
```typescript
// Fetch current and historical data
const current = await fetch('/api/analytics/coverage');
const previous = await fetch('/api/analytics/coverage?period=1w&offset=1w');

// Calculate delta
const delta = calculateDelta({
  current: current.data.coverageMetrics.overall.percentage,
  previous: previous.data.coverageMetrics.overall.percentage,
  period: 'weekly'
});
```

### Cached Comparison
```typescript
// Use localStorage for previous values
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

// Update cache for next comparison
localStorage.setItem(cacheKey, JSON.stringify({
  value: currentValue,
  timestamp: Date.now()
}));
```

## Performance Optimization

### Caching Strategy
```typescript
const CACHE_TTL = {
  hero: 5 * 60 * 1000,      // 5 minutes
  miniKPIs: 10 * 60 * 1000, // 10 minutes
  secondary: 5 * 60 * 1000,  // 5 minutes
  wallet: 2 * 60 * 1000,     // 2 minutes
  prQueue: 30 * 1000,        // 30 seconds
  alerts: 0,                 // No cache (real-time)
  health: 30 * 1000          // 30 seconds
};
```

### Polling Intervals
```typescript
const POLL_INTERVALS = {
  dashboard: 30000,    // 30 seconds
  alerts: 15000,       // 15 seconds
  health: 10000,       // 10 seconds
  wallet: 60000        // 60 seconds
};
```

### Batch Requests
Instead of 8 individual API calls, combine related requests:
```typescript
// Single dashboard endpoint that returns all KPI data
GET /api/dashboard/metrics
{
  "hero": { ... },
  "miniKPIs": { ... },
  "secondaryKPIs": { ... },
  "wallet": { ... },
  "prQueue": { ... },
  "alerts": { ... },
  "agentHealth": { ... }
}
```

## Real-Time Updates

### WebSocket Integration
```typescript
// Connect to real-time stream
const ws = new WebSocket('ws://api.domain.com/kpi/stream');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  switch(update.type) {
    case 'hero-updated':
      updateHeroKPI(update.data);
      break;
    case 'alerts-new':
      addAlert(update.data);
      break;
    case 'wallet-transaction':
      updateWalletTransaction(update.data);
      break;
    case 'health-status':
      updateAgentHealth(update.data);
      break;
  }
};
```

### Server-Sent Events
```typescript
// Alternative real-time implementation
const eventSource = new EventSource('/api/kpi/stream');

eventSource.addEventListener('kpi-update', (event) => {
  const data = JSON.parse(event.data);
  updateKPIData(data);
});
```

## Error Handling & Fallbacks

### Graceful Degradation
1. **Primary**: Use existing endpoint with error handling
2. **Fallback**: Return mock data that matches expected interface
3. **UI State**: Show loading states and retry mechanisms
4. **Caching**: Use cached data during outages

### Retry Strategy
```typescript
// Exponential backoff for failed requests
const retryWithBackoff = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(Math.pow(2, i) * 1000); // 1s, 2s, 4s
    }
  }
};
```

## Usage Examples

### Dashboard Component Integration
```tsx
export function Dashboard() {
  const { 
    data: dashboardData, 
    loading, 
    error, 
    refresh 
  } = useDashboardData({
    pollInterval: 30000,
    onError: (error) => showErrorToast(error.message)
  });

  if (loading && !dashboardData) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <KPIHero
        score={dashboardData.hero.score}
        delta={dashboardData.hero.delta}
        sparklineData={dashboardData.hero.sparkline.map(p => p.value)}
        onViewDetails={() => navigate('/analytics')}
      />
      
      <div className="grid grid-cols-4 gap-4">
        {dashboardData.secondaryKPIs.map(kpi => (
          <KpiTile
            key={kpi.id}
            title={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            sparkline={kpi.sparkline.map(p => p.value)}
          />
        ))}
      </div>
    </div>
  );
}
```

### Individual KPI Hook Usage
```tsx
// For components that only need specific KPI data
export function WalletWidget() {
  const { data: wallet, loading, error } = useWalletData({
    pollInterval: 60000 // Poll every minute
  });

  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h3>Wallet Balance: {wallet.formatted}</h3>
      <ul>
        {wallet.transactions.map(tx => (
          <li key={tx.id}>
            {tx.description}: {tx.type === 'credit' ? '+' : '-'}${tx.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Real-Time Notifications
```tsx
export function AlertNotifications() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useKPINotifications();

  return (
    <div>
      <NotificationBell count={unreadCount} />
      <NotificationList
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
      />
    </div>
  );
}
```

## Testing & Development

### Mock Data Usage
```typescript
// Service automatically falls back to mock data when APIs are unavailable
// Mock data provides realistic, time-based variations for development

// Force mock data for testing
process.env.VITE_USE_MOCK_DATA = 'true';

// Test specific scenarios
mockDataService.setVariation('visibility-score', 0.15); // +15% variation
const heroKPI = mockDataService.generateHeroKPI();
```

### Development Workflow
1. **Local Development**: Uses mock data service with realistic variations
2. **Integration Testing**: Points to staging APIs with fallback to mock
3. **Production**: Uses live APIs with robust error handling and fallbacks

## Migration Path

### Phase 1: Service Layer Setup
1. Deploy service layer with mock data fallbacks
2. Test error handling and caching
3. Verify UI components work with service layer

### Phase 2: API Integration
1. Map first KPI (Hero) to existing endpoint
2. Implement client-side delta calculation
3. Test real-time updates and caching

### Phase 3: Complete Integration
1. Map all remaining KPIs to endpoints
2. Implement batch request optimization
3. Add real-time WebSocket/SSE support
4. Performance monitoring and optimization

### Phase 4: Enhancement
1. Add advanced analytics and comparisons
2. Implement predictive trending
3. Add customization and personalization
4. Optimize for mobile and offline usage

## File Structure

```
src/
├── types/
│   └── kpi.ts                    # All KPI type definitions
├── services/
│   ├── kpiService.ts            # Main KPI service with API integration
│   └── mockDataService.ts       # Enhanced mock data for development
├── hooks/
│   └── useKPIData.ts            # React hooks for KPI data management
├── lib/
│   ├── deltaCalculator.ts       # Client-side delta computation utilities
│   └── endpointMapping.ts       # Endpoint mapping documentation
├── components/v2/
│   ├── KPIHero.tsx             # Updated hero component
│   ├── KpiTile.tsx             # Updated secondary KPI tiles
│   └── RightRailTile.tsx       # Updated right rail components
└── pages/
    └── Dashboard.tsx            # Updated dashboard using new service layer
```

## Summary

This comprehensive data flow architecture provides:

1. **No Breaking Changes**: Uses existing endpoints without schema modifications
2. **Type Safety**: Full TypeScript support with strict typing
3. **Performance**: Intelligent caching and batch requests
4. **Reliability**: Robust error handling with fallbacks
5. **Real-Time**: WebSocket/SSE support for live updates
6. **Developer Experience**: Enhanced mock data for development
7. **Scalability**: Service layer ready for future enhancements

The system is designed to be immediately deployable while providing a foundation for future KPI enhancements and optimizations.