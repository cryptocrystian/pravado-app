# CLAUDE-DATA-CONTRACTS.md  
## Database Schemas, API Contracts & Backend Integration Specifications

---

## DATABASE ARCHITECTURE

### **Multi-Tenant Core Tables**

#### **Tenant Management**
```sql
-- Primary tenant structure
CREATE TABLE tenants(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  branding JSONB,
  subscription_tier TEXT CHECK (subscription_tier IN ('starter', 'professional', 'business', 'enterprise')),
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced user profiles with role-based permissions
CREATE TABLE user_profiles(
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('marketing_director', 'content_manager', 'pr_manager', 'seo_specialist', 'business_owner', 'marketing_manager', 'team_member')),
  tier TEXT CHECK (tier IN ('starter', 'professional', 'business', 'enterprise')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  feature_discovery JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Row-Level Security (RLS)**
```sql
-- All tenant-scoped tables enforce this policy:
CREATE POLICY "tenant_isolation" ON [table_name]
  FOR ALL USING (tenant_id = auth.jwt().tenant_id);

-- Service role bypass for automated operations
CREATE POLICY "service_role_access" ON [table_name]
  FOR ALL USING (auth.role() = 'service_role');
```

### **Campaign & Content Management**

#### **Cross-Pillar Campaign System**
```sql
-- Unified campaign tracking
CREATE TABLE campaigns(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  goals JSONB, -- ["traffic", "leads", "authority", "launch"]
  pillar_weights JSONB DEFAULT '{"pr": 0.35, "seo": 0.35, "content": 0.20, "social": 0.10}',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('draft', 'active', 'completed', 'paused', 'cancelled')) DEFAULT 'draft',
  budget_allocated DECIMAL,
  roi_tracking JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content pieces with enhanced metadata
CREATE TABLE content_pieces(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id),
  title TEXT NOT NULL,
  content_body TEXT,
  content_type TEXT CHECK (content_type IN ('blog_post', 'whitepaper', 'social_post', 'email', 'press_release')),
  status TEXT CHECK (status IN ('draft', 'review', 'approved', 'published', 'archived')) DEFAULT 'draft',
  seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
  engagement_rate DECIMAL,
  ai_generated BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Media Database & PR System**

#### **500K+ Media Database Architecture**
```sql
-- Journalist contacts with relationship intelligence
CREATE TABLE journalist_contacts(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  outlet TEXT NOT NULL,
  beat TEXT, -- Technology, Healthcare, Finance, etc.
  relationship_score INTEGER CHECK (relationship_score >= 0 AND relationship_score <= 100),
  ai_compatibility_score INTEGER CHECK (ai_compatibility_score >= 0 AND ai_compatibility_score <= 100),
  response_rate DECIMAL,
  last_article_urls TEXT[],
  social_handles JSONB,
  notes TEXT,
  verification_status TEXT CHECK (verification_status IN ('verified', 'pending', 'unverified')) DEFAULT 'pending',
  last_contacted TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media outlets with authority scoring
CREATE TABLE media_outlets(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL,
  authority_score INTEGER CHECK (authority_score >= 0 AND authority_score <= 100),
  monthly_traffic BIGINT,
  category TEXT,
  tier TEXT CHECK (tier IN ('tier1', 'tier2', 'tier3', 'niche')) DEFAULT 'tier3'
);

-- PR outreach tracking with AI insights
CREATE TABLE journalist_outreach(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  journalist_id UUID REFERENCES journalist_contacts(id),
  campaign_id UUID REFERENCES campaigns(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  ai_personalization_used BOOLEAN DEFAULT TRUE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT CHECK (status IN ('sent', 'opened', 'replied', 'declined', 'bounced')) DEFAULT 'sent',
  replied_at TIMESTAMP WITH TIME ZONE,
  reply_sentiment TEXT CHECK (reply_sentiment IN ('positive', 'neutral', 'negative'))
);
```

### **SEO & AI Intelligence**

#### **Keyword & Performance Tracking**
```sql
-- SEO keyword management with AI clustering
CREATE TABLE seo_keywords(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id),
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  ranking_position INTEGER,
  competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high')),
  target_url TEXT,
  ai_cluster_group TEXT, -- AI-generated keyword groupings
  opportunity_score INTEGER CHECK (opportunity_score >= 0 AND opportunity_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI platform presence tracking (GEO)
CREATE TABLE ai_answers_index(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  engine TEXT CHECK (engine IN ('chatgpt', 'claude', 'perplexity', 'gemini', 'gpt4')) NOT NULL,
  query TEXT NOT NULL,
  position INTEGER, -- Position in AI response
  snippet TEXT,
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **AI & Automation Backend**

#### **CiteMind™ Engine Tables**
```sql
-- AI citation tracking across platforms
CREATE TABLE ai_platform_citations(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  platform TEXT CHECK (platform IN ('chatgpt', 'claude', 'perplexity', 'gemini', 'gpt4')) NOT NULL,
  content_id UUID REFERENCES content_pieces(id),
  query_matched TEXT NOT NULL,
  citation_position INTEGER,
  citation_context TEXT,
  authority_contribution DECIMAL, -- How much this citation improves domain authority
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Podcast syndication tracking (34+ platforms)
CREATE TABLE podcast_syndications(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content_pieces(id),
  platform TEXT NOT NULL, -- Apple, Spotify, Google, etc.
  syndication_status TEXT CHECK (syndication_status IN ('queued', 'processing', 'published', 'failed')) DEFAULT 'queued',
  platform_url TEXT,
  listen_count INTEGER DEFAULT 0,
  engagement_metrics JSONB,
  published_at TIMESTAMP WITH TIME ZONE
);
```

#### **AI Conversation & Cost Tracking**
```sql
-- AI usage monitoring with cost controls
CREATE TABLE ai_conversations(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id),
  conversation_type TEXT CHECK (conversation_type IN ('onboarding', 'content_generation', 'analysis', 'recommendation')) NOT NULL,
  model_used TEXT NOT NULL, -- 'gpt-4o-mini', 'claude-3.5-sonnet', etc.
  tokens_used INTEGER NOT NULL,
  cost_cents INTEGER NOT NULL,
  completion_status TEXT CHECK (completion_status IN ('completed', 'partial', 'failed')) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trial usage limits and conversion tracking
CREATE TABLE trial_usage(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id),
  tier TEXT CHECK (tier IN ('starter', 'professional', 'business', 'enterprise')) NOT NULL,
  ai_operations_used INTEGER DEFAULT 0,
  campaigns_created INTEGER DEFAULT 0,
  media_contacts_accessed INTEGER DEFAULT 0,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  conversion_triggered_at TIMESTAMP WITH TIME ZONE
);
```

### **Analytics & Performance**

#### **Unified Visibility Scoring**
```sql
-- Cross-pillar performance snapshots
CREATE TABLE visibility_snapshots(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 0 AND score <= 100) NOT NULL,
  pr_weight DECIMAL DEFAULT 0.35,
  seo_weight DECIMAL DEFAULT 0.35,
  content_weight DECIMAL DEFAULT 0.20,
  social_weight DECIMAL DEFAULT 0.10,
  calculated_components JSONB, -- Detailed breakdown
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PR Credits system with hybrid model
CREATE TABLE pr_credits(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  period TEXT CHECK (period IN ('monthly', 'quarterly')) NOT NULL,
  credits_basic INTEGER DEFAULT 0,
  credits_premium INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
  rollover_window_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## API CONTRACTS (Edge Functions)

### **Response Format Standard**
```typescript
interface APIResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### **Core API Endpoints**

#### **1. AI Orchestration**
```typescript
// POST /edge/ai/generate-content
interface ContentGenerationRequest {
  tenantId: string;
  contentType: 'blog_post' | 'press_release' | 'social_post';
  topic: string;
  targetAudience: string;
  tone: 'professional' | 'casual' | 'technical';
  seoKeywords?: string[];
}

// POST /edge/ai/analyze-campaign
interface CampaignAnalysisRequest {
  tenantId: string;
  campaignId: string;
  analysisType: 'performance' | 'optimization' | 'prediction';
}
```

#### **2. Media Database Intelligence**
```typescript
// GET /edge/media/journalist-match
interface JournalistMatchRequest {
  tenantId: string;
  topic: string;
  industry: string;
  urgency: 'low' | 'medium' | 'high';
  limit?: number;
}

// POST /edge/media/personalized-pitch
interface PersonalizedPitchRequest {
  tenantId: string;
  journalistId: string;
  campaignId: string;
  pitchContext: string;
  customization?: string;
}
```

#### **3. Cross-Pillar Analytics**
```typescript
// GET /edge/analytics/visibility-score
interface VisibilityScoreRequest {
  tenantId: string;
  from: string; // ISO date
  to: string;   // ISO date
  pillarWeights?: {
    pr: number;
    seo: number;
    content: number;
    social: number;
  };
}

// GET /edge/analytics/attribution
interface AttributionAnalysisRequest {
  tenantId: string;
  campaignId?: string;
  timeWindow: number; // days
  includeProjections: boolean;
}
```

#### **4. Trial & Onboarding**
```typescript
// POST /edge/onboarding/generate-blueprint
interface OnboardingBlueprintRequest {
  tenantId: string;
  companyInfo: {
    name: string;
    website: string;
    industry: string;
    competitors: string[];
  };
  goals: string[];
  pillarPriorities: {
    pr: number;
    content: number;
    seo: number;
  };
}

// GET /edge/trial/usage-status
interface TrialUsageResponse {
  tenantId: string;
  tier: string;
  usage: {
    aiOperations: { used: number; limit: number };
    campaigns: { used: number; limit: number };
    mediaContacts: { used: number; limit: number };
  };
  trialEndsAt: string;
  upgradeRecommendations: string[];
}
```

---

## TYPE DEFINITIONS

### **Core Business Types**
```typescript
// User and tenant types
type UserRole = 'marketing_director' | 'content_manager' | 'pr_manager' | 'seo_specialist' | 'business_owner' | 'marketing_manager' | 'team_member';
type SubscriptionTier = 'starter' | 'professional' | 'business' | 'enterprise';

// Campaign and content types
type CampaignStatus = 'draft' | 'active' | 'completed' | 'paused' | 'cancelled';
type ContentType = 'blog_post' | 'whitepaper' | 'social_post' | 'email' | 'press_release';
type ContentStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';

// AI and automation types
type AIModel = 'gpt-4o-mini' | 'gpt-4o' | 'claude-3.5-sonnet' | 'claude-3-opus';
type AIPlatform = 'chatgpt' | 'claude' | 'perplexity' | 'gemini' | 'gpt4';
type ConversationType = 'onboarding' | 'content_generation' | 'analysis' | 'recommendation';

// Performance and analytics types
interface VisibilityScore {
  score: number;
  pr: number;
  seo: number;
  content: number;
  social: number;
  trend?: 'up' | 'down' | 'stable';
  breakdown?: {
    components: Record<string, number>;
    recommendations: string[];
  };
}
```

### **Advanced Feature Types**
```typescript
// CiteMind™ specific types
interface CitationTracking {
  platform: AIPlatform;
  query: string;
  position: number;
  context: string;
  authorityScore: number;
  trackingDate: string;
}

// Media database types
interface JournalistProfile {
  id: string;
  name: string;
  outlet: string;
  beat: string;
  relationshipScore: number;
  aiCompatibilityScore: number;
  responseRate: number;
  recentArticles: string[];
  socialHandles: Record<string, string>;
  bestContactTime?: string;
}

// Automation workflow types
interface WorkflowAutomation {
  triggerId: string;
  conditions: Record<string, any>;
  actions: Array<{
    type: 'ai_generation' | 'email_send' | 'database_update' | 'notification';
    parameters: Record<string, any>;
  }>;
  approvalRequired: boolean;
}
```

---

## INTEGRATION SPECIFICATIONS

### **Supabase Configuration**
```typescript
// Environment variables
const supabaseConfig = {
  url: process.env.PUBLIC_SUPABASE_URL,
  anonKey: process.env.PUBLIC_SUPABASE_ANON_KEY,
  serviceKey: process.env.SUPABASE_SERVICE_KEY, // Server-side only
};

// Real-time subscriptions for collaboration
const realtimeChannels = [
  'campaigns', 'content_pieces', 'journalist_outreach',
  'team_notifications', 'ai_conversations'
];
```

### **AI Model Integration**
```typescript
// Cost-controlled AI usage
const aiModelConfig = {
  trial: {
    model: 'gpt-4o-mini',
    maxTokensPerUser: 10000, // ~$0.05 per trial user
    maxRequestsPerHour: 20
  },
  paid: {
    starter: { model: 'gpt-4o-mini', maxTokensPerMonth: 200000 },
    professional: { model: 'claude-3.5-sonnet', maxTokensPerMonth: 1000000 },
    business: { model: 'gpt-4o', maxTokensPerMonth: 3000000 },
    enterprise: { model: 'custom', unlimited: true }
  }
};
```

### **CloudFlare Workers Integration**
```typescript
// Scheduled jobs for automation
const cronJobs = [
  { schedule: '0 2 * * *', job: 'visibility:compute' },    // 2 AM daily
  { schedule: '0 3 * * *', job: 'seo:refresh-geo' },      // 3 AM daily
  { schedule: '0 0 * * 1', job: 'credits:issue' },        // Weekly credits
  { schedule: '*/15 * * * *', job: 'media:scrape' },      // 15-min media updates
];
```

This comprehensive data architecture supports both the current implementation requirements and the advanced "holy shit" features that provide impossible-to-replicate competitive advantages.
