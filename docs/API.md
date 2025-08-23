# PRAVADO API Documentation

## Base URL
- Production: `https://pravado-api.workers.dev`
- Development: `https://pravado-api-dev.workers.dev`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer <supabase_jwt_token>
```

## Analytics Endpoints

### CiteMind Analytics

#### GET /analytics/citemind/summary
Summary KPIs for CiteMind performance over a specified time range.

**Query Parameters:**
- `range` (optional): Time range - `7d`, `30d`, `90d`, `1y` (default: `30d`)
- `format` (optional): Response format - `json`, `csv` (default: `json`)

**Response (JSON):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "avg_citation_probability": "0.72",
      "avg_platform_coverage": "75.00",
      "avg_authority_index": 82,
      "total_citations": 156,
      "total_content": 45,
      "median_ttc": 24
    },
    "time_series": [
      {
        "date": "2024-01-15",
        "avg_citation_probability": "0.75",
        "platform_coverage_pct": "80.00",
        "authority_signal_index": 85,
        "citations_found_count": 12,
        "content_analyzed_count": 3
      }
    ],
    "date_range": {
      "start": "2024-01-01",
      "end": "2024-01-31",
      "range": "30d"
    }
  }
}
```

**Response (CSV):**
```csv
date,avg_citation_probability,platform_coverage_pct,authority_signal_index,citations_found_count,content_analyzed_count
2024-01-15,0.75,80.00,85,12,3
2024-01-16,0.68,75.00,80,8,2
```

#### GET /analytics/citemind/platforms
Platform-specific coverage and performance metrics.

**Query Parameters:**
- `range` (optional): Time range - `7d`, `30d`, `90d`, `1y` (default: `30d`)
- `format` (optional): Response format - `json`, `csv` (default: `json`)

**Response:**
```json
{
  "success": true,
  "data": {
    "platforms": {
      "chatgpt": {
        "total_queries": 245,
        "citations_found": 89,
        "citation_rate": "36.33",
        "avg_relevance": "0.78",
        "avg_position": "2.3"
      },
      "claude": {
        "total_queries": 198,
        "citations_found": 72,
        "citation_rate": "36.36",
        "avg_relevance": "0.82",
        "avg_position": "2.1"
      },
      "perplexity": {
        "total_queries": 156,
        "citations_found": 67,
        "citation_rate": "42.95",
        "avg_relevance": "0.85",
        "avg_position": "1.8"
      },
      "gemini": {
        "total_queries": 134,
        "citations_found": 43,
        "citation_rate": "32.09",
        "avg_relevance": "0.73",
        "avg_position": "2.7"
      }
    },
    "date_range": {
      "start": "2024-01-01",
      "end": "2024-01-31",
      "range": "30d"
    }
  }
}
```

#### GET /analytics/citemind/ttc
Time-to-Citation analysis and distribution.

**Query Parameters:**
- `range` (optional): Time range - `7d`, `30d`, `90d`, `1y` (default: `30d`)
- `format` (optional): Response format - `json`, `csv` (default: `json`)

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "median_hours": 18,
      "average_hours": "24.5",
      "total_citations": 89,
      "distribution": {
        "0-1h": 5,
        "1-6h": 12,
        "6-24h": 34,
        "1-3d": 28,
        "3-7d": 8,
        "7d+": 2
      }
    },
    "distribution": [
      {
        "content_id": "uuid-1",
        "platform": "perplexity",
        "time_to_citation_hours": 6,
        "found_at": "2024-01-15T14:30:00Z"
      }
    ],
    "date_range": {
      "start": "2024-01-01",
      "end": "2024-01-31",
      "range": "30d"
    }
  }
}
```

#### GET /analytics/citemind/visibility-mix
Visibility mix and content velocity analysis comparing citation frequency to content publishing rate.

**Query Parameters:**
- `range` (optional): Time range - `7d`, `30d`, `90d`, `1y` (default: `30d`)
- `format` (optional): Response format - `json`, `csv` (default: `json`)

**Response:**
```json
{
  "success": true,
  "data": {
    "visibility_mix": [
      {
        "date": "2024-01-15",
        "citations": 8,
        "content": 3,
        "ratio": "2.67"
      },
      {
        "date": "2024-01-16",
        "citations": 12,
        "content": 2,
        "ratio": "6.00"
      }
    ],
    "citation_frequency": [
      {
        "citation_date": "2024-01-15",
        "citations_count": 8
      }
    ],
    "content_velocity": [
      {
        "submit_date": "2024-01-15",
        "content_count": 3
      }
    ],
    "date_range": {
      "start": "2024-01-01",
      "end": "2024-01-31",
      "range": "30d"
    }
  }
}
```

## Existing Endpoints

### Health Check

#### GET /health
System health and status check.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T12:00:00Z",
  "version": "1.0.0",
  "environment": "production"
}
```

### Events

#### POST /events/emit
Internal event emission for orchestration.

**Request Body:**
```json
{
  "eventType": "pr.submitted",
  "entityType": "press_release",
  "entityId": "uuid",
  "payload": {
    "submission_tier": "premium",
    "keywords": ["technology", "innovation"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "event": {
    "id": "uuid",
    "event_type": "pr.submitted",
    "created_at": "2024-01-15T12:00:00Z"
  },
  "jobs_enqueued": 3,
  "jobs": [
    {
      "id": "uuid",
      "job_type": "pr_insight_generation",
      "status": "pending"
    }
  ]
}
```

### Press Releases

#### POST /press-releases/submit
Submit press release with wallet validation.

**Request Body:**
```json
{
  "title": "Company Announces Revolutionary AI Platform",
  "content": "Full press release content...",
  "summary": "Brief summary of the announcement",
  "target_audience": "Technology industry professionals",
  "keywords": ["AI", "platform", "innovation"],
  "submission_tier": "premium",
  "distribution_channels": ["business-wire", "pr-newswire"]
}
```

**Response:**
```json
{
  "success": true,
  "submission_id": "uuid",
  "data": {
    "id": "uuid",
    "title": "Company Announces Revolutionary AI Platform",
    "status": "submitted",
    "submission_tier": "premium",
    "submitted_at": "2024-01-15T12:00:00Z",
    "credits_consumed": 2,
    "partner_status": "submitted"
  }
}
```

#### GET /press-releases
List press releases with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page, max 100 (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Press Release Title",
      "status": "submitted",
      "submission_tier": "basic",
      "submitted_at": "2024-01-15T12:00:00Z",
      "partner_status": "approved"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

### Wallet

#### GET /wallet
Get wallet balance and transaction history.

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet_id": "uuid",
    "tenant_id": "uuid",
    "press_release_credits": 15,
    "ai_operations_credits": 200,
    "premium_credits": 5,
    "last_updated": "2024-01-15T12:00:00Z",
    "recent_transactions": [
      {
        "id": "uuid",
        "transaction_type": "consume",
        "credit_type": "press_release_credits",
        "amount": -2,
        "description": "Premium PR submission",
        "created_at": "2024-01-15T11:30:00Z"
      }
    ]
  }
}
```

#### POST /wallet/consume-credits
Manually consume credits (testing/admin).

**Request Body:**
```json
{
  "credit_type": "press_release_credits",
  "amount": 1,
  "description": "Manual credit consumption"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "credits_consumed": 1,
    "credit_type": "press_release_credits",
    "new_balance": 14,
    "wallet": {
      "press_release_credits": 14,
      "ai_operations_credits": 200,
      "premium_credits": 5
    }
  }
}
```

### Dashboard

#### GET /dashboard/visibility-score
Get visibility score with trends and metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "current_score": 85,
    "previous_score": 78,
    "trend": "up",
    "metrics": {
      "media_coverage": 92,
      "social_mentions": 78,
      "search_visibility": 85,
      "backlink_quality": 89
    },
    "recent_activities": [
      {
        "type": "press_release",
        "title": "Q4 Results Announcement",
        "impact_score": 15,
        "date": "2024-01-13T12:00:00Z"
      }
    ]
  }
}
```

#### GET /dashboard/stats
Dashboard statistics and metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "press_releases": {
      "total": 12,
      "active": 8,
      "premium": 4,
      "recent": 3
    },
    "wallet": {
      "press_release_credits": 15,
      "ai_operations_credits": 200,
      "premium_credits": 5
    },
    "activity": {
      "last_pr_date": "2024-01-15T12:00:00Z",
      "total_submissions_this_month": 8
    }
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes
- `401 UNAUTHORIZED`: Invalid or missing authentication
- `403 FORBIDDEN`: Insufficient permissions
- `400 BAD_REQUEST`: Invalid request data
- `404 NOT_FOUND`: Resource not found
- `402 INSUFFICIENT_CREDITS`: Not enough wallet credits
- `429 RATE_LIMITED`: Too many requests
- `500 INTERNAL_SERVER_ERROR`: Server error

## Rate Limits
- Standard endpoints: 100 requests per minute per organization
- Analytics endpoints: 50 requests per minute per organization
- Export endpoints: 10 requests per minute per organization

## CSV Export Format

All analytics endpoints support CSV export via `format=csv` parameter. CSV files include:
- Proper headers
- UTF-8 encoding
- RFC 4180 compliant formatting
- Content-Disposition attachment headers

Example CSV request:
```http
GET /analytics/citemind/summary?range=30d&format=csv
```

Response headers:
```http
Content-Type: text/csv
Content-Disposition: attachment; filename="citemind-summary-30d.csv"
```

## Pagination

Endpoints that return lists support pagination:
- `page`: Page number (1-based)
- `limit`: Items per page (max 100)

Responses include pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

## Webhooks

PRAVADO can send webhooks for key events:

### Event Types
- `press_release.submitted`
- `press_release.approved`
- `citation.found`
- `agent_run.completed`
- `budget.exceeded`

### Webhook Payload
```json
{
  "event": "press_release.submitted",
  "timestamp": "2024-01-15T12:00:00Z",
  "data": {
    "id": "uuid",
    "tenant_id": "uuid",
    "title": "Press Release Title",
    "status": "submitted"
  }
}
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { PravadoAPI } from '@pravado/api-client'

const pravado = new PravadoAPI({
  baseURL: 'https://pravado-api.workers.dev',
  token: 'your-jwt-token'
})

// Get analytics summary
const summary = await pravado.analytics.getCiteMindSummary({ 
  range: '30d' 
})

// Submit press release
const submission = await pravado.pressReleases.submit({
  title: 'New Product Launch',
  content: '...',
  submission_tier: 'premium'
})
```

### Python
```python
from pravado import PravadoClient

client = PravadoClient(
    base_url="https://pravado-api.workers.dev",
    token="your-jwt-token"
)

# Get platform metrics
metrics = client.analytics.get_platform_metrics(range="7d")

# Check wallet balance
wallet = client.wallet.get_balance()
```

### cURL
```bash
# Get analytics summary
curl -H "Authorization: Bearer $TOKEN" \
  "https://pravado-api.workers.dev/analytics/citemind/summary?range=30d"

# Submit press release
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Launch","content":"...","submission_tier":"basic"}' \
  "https://pravado-api.workers.dev/press-releases/submit"
```