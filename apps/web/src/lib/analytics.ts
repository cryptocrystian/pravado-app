import posthog from 'posthog-js'

// PostHog configuration
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || 'phc_demo_key'
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'

export const initAnalytics = () => {
  if (typeof window !== 'undefined' && POSTHOG_KEY !== 'phc_demo_key') {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      loaded: () => {
        if (import.meta.env.DEV) {
          console.log('PostHog initialized in development mode')
        }
      },
      capture_pageview: true,
      capture_pageleave: true,
    })
  } else {
    console.warn('PostHog not initialized - missing API key or running in SSR')
  }
}

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    if (POSTHOG_KEY === 'phc_demo_key') {
      // Development logging
      console.log('📊 Analytics Event:', event, properties)
      return
    }
    
    posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
      platform: 'web',
    })
  }
}

export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined') {
    if (POSTHOG_KEY === 'phc_demo_key') {
      console.log('📄 Page View:', path)
      return
    }
    
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      path,
    })
  }
}

// Specific event tracking functions
export const trackDashboardViewed = () => {
  trackEvent('dashboard_viewed', {
    page: 'dashboard',
  })
}

export const trackAnalyticsViewed = (tab?: string) => {
  trackEvent('analytics_viewed', {
    page: 'analytics',
    tab: tab || 'default',
  })
}

export const trackMetricClicked = (metricId: string, metricLabel: string) => {
  trackEvent('metric_clicked', {
    metric_id: metricId,
    metric_label: metricLabel,
  })
}

export const trackChartInteraction = (chartType: string, action: string) => {
  trackEvent('chart_interaction', {
    chart_type: chartType,
    action,
  })
}

export const trackCiteMindAccessed = () => {
  trackEvent('citemind_accessed', {
    feature: 'citemind_analytics',
  })
}

export const trackTimeRangeChanged = (timeRange: string, page: string) => {
  trackEvent('time_range_changed', {
    time_range: timeRange,
    page,
  })
}

export const trackErrorOccurred = (error: string, context: string) => {
  trackEvent('error_occurred', {
    error_message: error,
    error_context: context,
    user_agent: navigator.userAgent,
  })
}

export const trackFeatureUsed = (feature: string, details?: Record<string, any>) => {
  trackEvent('feature_used', {
    feature_name: feature,
    ...details,
  })
}

// CiteMind-specific analytics events
export const trackAnalyticsExport = (endpoint: string, timeRange: string, format: string = 'csv') => {
  trackEvent('analytics_export', {
    endpoint,
    time_range: timeRange,
    format,
    feature: 'citemind'
  })
}

export const trackDashboardTileClicked = (tileId: string, drillDownPath: string) => {
  trackEvent('dashboard_tile_clicked', {
    tile_id: tileId,
    drill_down_path: drillDownPath,
    feature: 'citemind_tiles'
  })
}

export const trackCiteMindChartInteraction = (chartType: string, action: string, timeRange: string) => {
  trackEvent('citemind_chart_interaction', {
    chart_type: chartType,
    action,
    time_range: timeRange
  })
}

// User identification
export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (typeof window !== 'undefined' && POSTHOG_KEY !== 'phc_demo_key') {
    posthog.identify(userId, traits)
  } else {
    console.log('👤 User Identified:', userId, traits)
  }
}

// Group analytics (for organizations/teams)
export const identifyGroup = (groupId: string, groupType: string = 'organization') => {
  if (typeof window !== 'undefined' && POSTHOG_KEY !== 'phc_demo_key') {
    posthog.group(groupType, groupId)
  } else {
    console.log('👥 Group Identified:', groupType, groupId)
  }
}

// Export analytics object for component usage
export const analytics = {
  track: trackEvent,
  page: trackPageView,
  identify: identifyUser,
  group: identifyGroup,
  init: initAnalytics
}