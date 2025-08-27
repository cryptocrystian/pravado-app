# SEO Tabs Live Documentation

**Feature**: SEO Tabs with Live Data (C4)  
**Version**: 1.0.0  
**Date**: August 24, 2025

## Overview

The SEO Tabs Live feature provides real-time tracking and analysis of SEO performance across three key areas: Keywords, Competitors, and Backlinks. This system enables data-driven SEO decisions with comprehensive sorting, filtering, and analytics capabilities.

## Features

### 🎯 Keywords Tab
- **Keyword Tracking**: Monitor search rankings and difficulty scores
- **Position Analysis**: Track SERP positions with color-coded badges
- **Difficulty Assessment**: Visual difficulty indicators (0-100 scale)
- **Top 10 Tracking**: Special highlighting for top 10 rankings

### 🏆 Competitors Tab
- **Domain Analysis**: Track competitor performance metrics
- **Share of Voice**: Visual progress bars showing competitive landscape
- **Market Position**: Identify top competitors automatically
- **Direct Links**: Quick access to competitor websites

### 🔗 Backlinks Tab
- **Link Profile**: Comprehensive backlink tracking
- **Domain Authority**: DA scores with color-coded quality indicators
- **Source Analysis**: Detailed source URL breakdown
- **Discovery Tracking**: Timeline of link discovery

## Database Schema

### SEO Keywords Table
```sql
CREATE TABLE seo_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    keyword VARCHAR(255) NOT NULL,
    difficulty_0_100 INTEGER CHECK (difficulty_0_100 >= 0 AND difficulty_0_100 <= 100),
    position INTEGER CHECK (position > 0),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_org_keyword UNIQUE (org_id, keyword)
);
```

### SEO Competitors Table
```sql
CREATE TABLE seo_competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    domain VARCHAR(255) NOT NULL,
    share_of_voice_0_100 INTEGER CHECK (share_of_voice_0_100 >= 0 AND share_of_voice_0_100 <= 100),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_org_domain UNIQUE (org_id, domain)
);
```

### SEO Backlinks Table
```sql
CREATE TABLE seo_backlinks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    source_url VARCHAR(2048) NOT NULL,
    target_path VARCHAR(1024) NOT NULL,
    da_0_100 INTEGER CHECK (da_0_100 >= 0 AND da_0_100 <= 100),
    discovered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_org_backlink UNIQUE (org_id, source_url, target_path)
);
```

## API Endpoints

### Keywords Endpoint
```http
GET /seo/keywords?sort=difficulty&order=desc&page=1&limit=20
```

**Query Parameters:**
- `sort`: `keyword | difficulty | position | last_seen`
- `order`: `asc | desc` (default: desc)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "keyword": "ai content writing",
      "difficulty_0_100": 85,
      "position": 3,
      "last_seen": "2025-08-24T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  },
  "aggregates": {
    "total_count": 50,
    "avg_difficulty": 78,
    "avg_position": 12,
    "top_10_count": 15,
    "last_updated": "2025-08-24T10:00:00Z"
  }
}
```

### Competitors Endpoint
```http
GET /seo/competitors?sort=share_of_voice&order=desc&page=1&limit=20
```

**Query Parameters:**
- `sort`: `domain | share_of_voice | last_seen`
- `order`: `asc | desc` (default: desc)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "domain": "semrush.com",
      "share_of_voice_0_100": 95,
      "last_seen": "2025-08-24T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "pages": 1
  },
  "aggregates": {
    "total_count": 10,
    "avg_share_of_voice": 82,
    "top_competitor": "semrush.com",
    "last_updated": "2025-08-24T10:00:00Z"
  }
}
```

### Backlinks Endpoint
```http
GET /seo/backlinks?sort=da&order=desc&page=1&limit=20
```

**Query Parameters:**
- `sort`: `source_url | da | discovered_at`
- `order`: `asc | desc` (default: desc)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "source_url": "https://techcrunch.com/2024/01/15/ai-content-revolution/",
      "target_path": "/features/content-ai",
      "da_0_100": 94,
      "discovered_at": "2025-08-10T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  },
  "aggregates": {
    "total_count": 25,
    "avg_da": 87,
    "high_da_count": 18,
    "recent_count": 5,
    "last_discovered": "2025-08-24T08:00:00Z"
  }
}
```

## Frontend Components

### SEOTabs Component Structure
```
SEO.tsx
├── Tab Navigation (Keywords, Competitors, Backlinks)
├── Aggregate Metrics Cards
├── Search & Filter Controls
├── Data Table with Sorting
├── Pagination Controls
└── Loading/Error/Empty States
```

### Key Features

#### Tab Header Aggregates
Each tab displays real-time metrics:

**Keywords Tab:**
- Total keyword count
- Average difficulty score
- Average position
- Top 10 rankings count

**Competitors Tab:**
- Total competitor count
- Average share of voice
- Top competitor identification
- Last update timestamp

**Backlinks Tab:**
- Total backlink count
- Average domain authority
- High DA links (80+)
- Recent discoveries (7 days)

#### Interactive Data Table
- **Sortable Columns**: Click headers to sort by any column
- **Visual Indicators**: Color-coded difficulty, position, and DA scores
- **Action Buttons**: Direct links to external resources
- **Responsive Design**: Mobile-friendly table layout

#### Search & Filtering
- **Real-time Search**: Filter results as you type
- **Tab-specific Placeholders**: Context-aware search hints
- **Query Persistence**: Maintains search state during tab switches

## User Experience Flow

### 1. Initial Load
1. Page loads with Keywords tab active
2. API fetches keywords data with default sorting (last_seen DESC)
3. Tab header shows aggregate metrics
4. Table displays paginated results

### 2. Tab Navigation
1. User clicks Competitors or Backlinks tab
2. Active tab styling updates
3. API fetches respective data
4. Table headers and content update
5. Search placeholder updates

### 3. Sorting Interaction
1. User clicks sortable column header
2. Sort icon updates (up/down arrow)
3. API request sent with sort parameters
4. Table data refreshes with new order
5. Analytics event tracked

### 4. Search Flow
1. User types in search input
2. Search query tracked for analytics
3. Results filtered (client-side or server-side)
4. Pagination resets to page 1
5. Result count updates

## Analytics & Telemetry

### PostHog Events

#### seo_tab_viewed
```javascript
analytics.track('seo_tab_viewed', {
  tab: 'keywords',
  sort_field: 'difficulty',
  sort_order: 'desc',
  page: 1
})
```

#### seo_sorted
```javascript
analytics.track('seo_sorted', {
  tab: 'keywords',
  field: 'difficulty',
  order: 'asc'
})
```

#### seo_filtered
```javascript
analytics.track('seo_filtered', {
  tab: 'keywords',
  query: true // boolean indicating if query is present
})
```

## Performance Optimizations

### Database Indexes
```sql
-- Performance indexes for common queries
CREATE INDEX idx_seo_keywords_org_last_seen ON seo_keywords(org_id, last_seen DESC);
CREATE INDEX idx_seo_keywords_difficulty ON seo_keywords(org_id, difficulty_0_100 DESC);
CREATE INDEX idx_seo_keywords_position ON seo_keywords(org_id, position ASC);

CREATE INDEX idx_seo_competitors_org_last_seen ON seo_competitors(org_id, last_seen DESC);
CREATE INDEX idx_seo_competitors_share_voice ON seo_competitors(org_id, share_of_voice_0_100 DESC);

CREATE INDEX idx_seo_backlinks_org_discovered ON seo_backlinks(org_id, discovered_at DESC);
CREATE INDEX idx_seo_backlinks_da ON seo_backlinks(org_id, da_0_100 DESC);
```

### Frontend Optimizations
- **Data Caching**: Tab data cached to avoid refetching
- **Debounced Search**: Search queries debounced to reduce API calls
- **Lazy Loading**: Large datasets loaded on demand
- **Optimistic Updates**: UI updates immediately for better UX

## Testing Strategy

### Unit Tests
- API endpoint validation
- Data transformation functions
- Sorting and filtering logic
- Aggregate calculation helpers

### E2E Tests (Playwright)
```javascript
// Key test scenarios
test('SEO tabs switch correctly', async ({ page }) => {
  // Test tab navigation and data loading
})

test('Sorting functionality works', async ({ page }) => {
  // Test column sorting with API calls
})

test('Search filters results', async ({ page }) => {
  // Test search functionality
})

test('Analytics events track correctly', async ({ page }) => {
  // Test PostHog event tracking
})
```

## Error Handling

### API Errors
```json
{
  "success": false,
  "error": "Failed to fetch keywords",
  "status": 500
}
```

### Frontend Error States
- **Network Errors**: "Unable to connect to server"
- **Empty Data**: "No [tab] data available"
- **Loading Timeout**: "Request timed out, please try again"

### Graceful Degradation
- Show cached data when API fails
- Maintain UI functionality during errors
- Provide retry mechanisms

## Security Considerations

### Row Level Security (RLS)
```sql
-- Users can only access their organization's data
CREATE POLICY seo_keywords_org_policy ON seo_keywords
    FOR ALL USING (
        org_id IN (
            SELECT organization_id 
            FROM organization_memberships 
            WHERE user_id = auth.uid()
        )
    );
```

### Input Validation
- Server-side parameter validation with Zod
- SQL injection prevention through parameterized queries
- XSS protection via React's built-in escaping

## Future Enhancements

### Phase 2 Features
- **Historical Tracking**: Chart keyword position changes over time
- **Competitor Alerts**: Notifications when competitors gain/lose rankings
- **Backlink Quality Score**: Advanced scoring beyond DA
- **Export Functionality**: CSV/PDF export of SEO data

### Advanced Analytics
- **Trend Analysis**: Identify rising/falling keywords
- **Opportunity Detection**: Suggest new keywords based on competitor gaps
- **ROI Tracking**: Connect SEO metrics to business outcomes

## Troubleshooting

### Common Issues

#### Data Not Loading
1. Check API endpoint availability
2. Verify organization membership
3. Check browser network tab for errors
4. Clear browser cache and refresh

#### Sorting Not Working
1. Verify sort parameters in API call
2. Check column header click events
3. Ensure proper sort field mapping
4. Test with different browsers

#### Search Not Filtering
1. Check search input value binding
2. Verify API query parameters
3. Test server-side filtering logic
4. Check for JavaScript errors

### Debug Commands
```javascript
// Check current SEO data state
console.log(window.seoState)

// Track analytics events
window.analytics.track('debug_event', { test: true })

// Force API refresh
window.location.reload()
```

## Deployment Checklist

### Pre-deployment
- [ ] Database migration executed
- [ ] API endpoints tested in staging
- [ ] E2E tests passing
- [ ] Analytics tracking verified
- [ ] Performance benchmarks met

### Post-deployment
- [ ] Monitor API response times
- [ ] Check error rates in monitoring
- [ ] Verify analytics events flowing
- [ ] Test with real user data
- [ ] Update team on new features

---

**Generated by**: PRAVADO Development Team  
**Last Updated**: August 24, 2025  
**Next Review**: September 24, 2025