/**
 * Mock API responses for E2E tests
 * Provides deterministic data for testing without network dependencies
 */

export class MockAPIResponses {
  
  getCiteMindSummary(range: string = '30d') {
    const mockData = {
      success: true,
      data: {
        summary: {
          avg_citation_probability: "0.742",
          avg_platform_coverage: "67.8",
          avg_authority_index: 84,
          total_citations: 1247,
          total_content: 89,
          median_ttc: 18
        },
        time_series: [
          {
            date: "2024-01-01",
            avg_citation_probability: "0.720",
            authority_signal_index: 82,
            citations_found_count: 45,
            content_analyzed_count: 12
          },
          {
            date: "2024-01-02", 
            avg_citation_probability: "0.735",
            authority_signal_index: 85,
            citations_found_count: 52,
            content_analyzed_count: 14
          },
          {
            date: "2024-01-03",
            avg_citation_probability: "0.751",
            authority_signal_index: 87,
            citations_found_count: 48,
            content_analyzed_count: 11
          },
          {
            date: "2024-01-04",
            avg_citation_probability: "0.760",
            authority_signal_index: 86,
            citations_found_count: 55,
            content_analyzed_count: 15
          }
        ],
        date_range: {
          start: this.getStartDate(range),
          end: this.getEndDate(),
          range
        }
      }
    }

    // Adjust data based on range
    if (range === '7d') {
      mockData.data.time_series = mockData.data.time_series.slice(0, 7)
      mockData.data.summary.total_citations = 456
    } else if (range === '90d') {
      mockData.data.summary.total_citations = 3421
    }

    return mockData
  }

  getCiteMindPlatforms(range: string = '30d') {
    return {
      success: true,
      data: {
        platforms: {
          chatgpt: {
            total_queries: 342,
            citations_found: 234,
            citation_rate: "68.4",
            avg_relevance: "8.7",
            avg_position: "3.2"
          },
          claude: {
            total_queries: 298,
            citations_found: 201,
            citation_rate: "67.4",
            avg_relevance: "8.9",
            avg_position: "2.8"
          },
          perplexity: {
            total_queries: 187,
            citations_found: 132,
            citation_rate: "70.6",
            avg_relevance: "8.5",
            avg_position: "2.1"
          },
          gemini: {
            total_queries: 156,
            citations_found: 94,
            citation_rate: "60.3",
            avg_relevance: "8.2",
            avg_position: "4.1"
          }
        },
        raw_data: [
          {
            platform: "chatgpt",
            citation_found: true,
            relevance_score: 8.7,
            position: 3,
            checked_at: "2024-01-01T10:00:00Z"
          },
          {
            platform: "claude", 
            citation_found: true,
            relevance_score: 8.9,
            position: 2,
            checked_at: "2024-01-01T10:00:00Z"
          }
        ],
        date_range: {
          start: this.getStartDate(range),
          end: this.getEndDate(),
          range
        }
      }
    }
  }

  getCiteMindTTC(range: string = '30d') {
    return {
      success: true,
      data: {
        metrics: {
          median_hours: 18,
          average_hours: "22.5",
          total_citations: 1247,
          distribution: {
            "0-1h": 45,
            "1-6h": 123,
            "6-24h": 456,
            "1-3d": 234,
            "3-7d": 156,
            "7d+": 89
          }
        },
        distribution: [
          {
            content_id: "content_123",
            platform: "chatgpt",
            time_to_citation_hours: 12,
            found_at: "2024-01-01T12:00:00Z",
            created_at: "2024-01-01T00:00:00Z"
          },
          {
            content_id: "content_124",
            platform: "claude",
            time_to_citation_hours: 6,
            found_at: "2024-01-01T18:00:00Z", 
            created_at: "2024-01-01T12:00:00Z"
          }
        ],
        date_range: {
          start: this.getStartDate(range),
          end: this.getEndDate(),
          range
        }
      }
    }
  }

  getCiteMindVisibilityMix(range: string = '30d') {
    return {
      success: true,
      data: {
        visibility_mix: [
          {
            date: "2024-01-01",
            citations: 45,
            content: 12,
            ratio: "3.75"
          },
          {
            date: "2024-01-02",
            citations: 52,
            content: 14,
            ratio: "3.71"
          },
          {
            date: "2024-01-03",
            citations: 48,
            content: 11,
            ratio: "4.36"
          },
          {
            date: "2024-01-04",
            citations: 55,
            content: 15,
            ratio: "3.67"
          }
        ],
        citation_frequency: [
          { citation_date: "2024-01-01", citations_count: 45 },
          { citation_date: "2024-01-02", citations_count: 52 },
          { citation_date: "2024-01-03", citations_count: 48 },
          { citation_date: "2024-01-04", citations_count: 55 }
        ],
        content_velocity: [
          { submit_date: "2024-01-01", content_count: 12 },
          { submit_date: "2024-01-02", content_count: 14 },
          { submit_date: "2024-01-03", content_count: 11 },
          { submit_date: "2024-01-04", content_count: 15 }
        ],
        date_range: {
          start: this.getStartDate(range),
          end: this.getEndDate(),
          range
        }
      }
    }
  }

  getDashboardMetrics() {
    return {
      success: true,
      data: [
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
    }
  }

  // Helper methods for date ranges
  private getStartDate(range: string): string {
    const today = new Date('2024-01-04') // Fixed date for tests
    const start = new Date(today)
    
    switch (range) {
      case '7d':
        start.setDate(today.getDate() - 7)
        break
      case '30d':
        start.setDate(today.getDate() - 30)
        break
      case '90d':
        start.setDate(today.getDate() - 90)
        break
      case '1y':
        start.setFullYear(today.getFullYear() - 1)
        break
    }
    
    return start.toISOString().split('T')[0]
  }

  private getEndDate(): string {
    return '2024-01-04' // Fixed date for tests
  }

  // Generate mock seeded data for different scenarios
  getSeededData(scenario: 'normal' | 'empty' | 'error' | 'high_volume' = 'normal') {
    switch (scenario) {
      case 'empty':
        return {
          summary: null,
          time_series: [],
          platforms: {},
          metrics: { distribution: {} },
          visibility_mix: []
        }
      
      case 'error':
        throw new Error('Mock API Error for testing')
        
      case 'high_volume':
        const summary = this.getCiteMindSummary('90d')
        summary.data.summary.total_citations = 15420
        summary.data.summary.avg_authority_index = 94
        return summary.data
        
      default:
        return this.getCiteMindSummary('30d').data
    }
  }

  // Mock CSV export response
  getCiteMindCSV(endpoint: string, range: string): string {
    switch (endpoint) {
      case 'summary':
        return `date,avg_citation_probability,authority_signal_index,citations_found_count\n2024-01-01,0.720,82,45\n2024-01-02,0.735,85,52\n2024-01-03,0.751,87,48\n2024-01-04,0.760,86,55`
      
      case 'platforms':
        return `platform,citation_found,relevance_score,position\nchatgpt,true,8.7,3\nclaude,true,8.9,2\nperplexity,true,8.5,2\ngemini,false,8.2,4`
      
      case 'ttc':
        return `content_id,platform,time_to_citation_hours,found_at\ncontent_123,chatgpt,12,2024-01-01T12:00:00Z\ncontent_124,claude,6,2024-01-01T18:00:00Z`
      
      case 'visibility-mix':
        return `date,citations,content,ratio\n2024-01-01,45,12,3.75\n2024-01-02,52,14,3.71\n2024-01-03,48,11,4.36\n2024-01-04,55,15,3.67`
      
      default:
        return `error,message\n404,Endpoint not found`
    }
  }
}