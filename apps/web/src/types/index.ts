export interface VisibilityScore {
  score: number
  pr: number
  seo: number
  content: number
  social: number
  delta?: number
  period?: string
}

export interface AIRecommendation {
  id: string
  title: string
  description: string
  confidence: 'high' | 'medium' | 'low'
  impact: 'high' | 'medium' | 'low'
  type: 'pr' | 'content' | 'seo' | 'social'
  actions: ('approve' | 'ask_copilot' | 'queue')[]
  createdAt: string
}

export interface ContentQueueItem {
  id: string
  title: string
  type: 'blog' | 'press_release' | 'social' | 'email'
  status: 'draft' | 'review' | 'scheduled' | 'published'
  dueDate: string
}

export interface SEOMover {
  id: string
  keyword: string
  currentRank: number
  previousRank: number
  change: number
  searchVolume: number
  url: string
}

export interface PRCredit {
  id: string
  type: 'basic' | 'premium'
  remaining: number
  total: number
  expiresAt: string
}

export interface ActivityEvent {
  id: string
  type: 'content_published' | 'pr_sent' | 'seo_rank_change' | 'coverage_received'
  title: string
  description: string
  timestamp: string
  pillar: 'pr' | 'content' | 'seo' | 'social'
}

export interface TelemetryEvent {
  event: string
  properties?: Record<string, unknown>
  timestamp?: string
}