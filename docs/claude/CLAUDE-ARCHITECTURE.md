# PRAVADO PLATFORM ARCHITECTURE
## Claude Code Technical Implementation Guide

---

## 🏗️ PLATFORM OVERVIEW

**PRAVADO** is an automation-first marketing intelligence platform combining Content Marketing + Public Relations + SEO Intelligence with revolutionary AI platform citation tracking (GEO).

### Core Technical Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth with RLS
- **AI Services**: OpenAI, Anthropic Claude, Perplexity, Gemini
- **Deployment**: Lovable.dev platform

---

## 📊 DATABASE ARCHITECTURE

### Multi-Tenant Schema with Row Level Security

#### Core Tables (Currently Deployed)
```sql
-- Tenant management
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- User profiles with role-based access
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  tenant_id UUID REFERENCES tenants(id),
  role TEXT CHECK (role IN ('agency_owner', 'agency_admin', 'account_manager', 'marketing_director', 'content_manager', 'pr_manager', 'seo_specialist', 'team_member', 'enterprise_admin', 'department_head', 'specialist', 'business_owner', 'marketing_manager', 'freelancer')),
  tier TEXT CHECK (tier IN ('starter', 'professional', 'business', 'enterprise')),
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  permissions JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Media contacts with AI intelligence
CREATE TABLE journalist_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  outlet TEXT,
  title TEXT,
  beat TEXT[],
  location TEXT,
  twitter_handle TEXT,
  linkedin_url TEXT,
  relationship_score INTEGER DEFAULT 0,
  interaction_count INTEGER DEFAULT 0,
  last_interaction TIMESTAMP,
  ai_match_score FLOAT DEFAULT 0.0,
  ai_insights JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Unified campaign management
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('content', 'pr', 'seo', 'integrated')),
  status TEXT CHECK (status IN ('draft', 'active', 'completed', 'archived')) DEFAULT 'draft',
  target_audience TEXT,
  goals JSONB DEFAULT '{}',
  budget DECIMAL,
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content pieces across all pillars
CREATE TABLE content_pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  campaign_id UUID REFERENCES campaigns(id),
  title TEXT NOT NULL,
  content TEXT,
  content_type TEXT CHECK (content_type IN ('blog_post', 'press_release', 'social_media', 'email', 'video_script')),
  status TEXT CHECK (status IN ('draft', 'review', 'approved', 'published', 'archived')) DEFAULT 'draft',
  seo_data JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  ai_generated BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### AI Platform Citation Tracking (GEO Intelligence)
```sql
-- Revolutionary AI citation tracking
CREATE TABLE ai_citation_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  query_text TEXT NOT NULL,
  ai_platform TEXT CHECK (ai_platform IN ('chatgpt', 'claude', 'perplexity', 'gemini', 'copilot')),
  cited_content_id UUID REFERENCES content_pieces(id),
  citation_context TEXT,
  ranking_position INTEGER,
  citation_quality_score FLOAT,
  tracked_at TIMESTAMP DEFAULT NOW()
);

-- Competitive citation analysis
CREATE TABLE competitor_citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  competitor_domain TEXT NOT NULL,
  ai_platform TEXT,
  citation_count INTEGER DEFAULT 0,
  trending_topics TEXT[],
  analysis_date DATE DEFAULT CURRENT_DATE
);
```

---

## 🔐 SECURITY & PERMISSIONS

### Row Level Security Policies
```sql
-- Tenant isolation for all tables
CREATE POLICY "Users can only access their tenant data" ON journalist_contacts
FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Users can only access their tenant campaigns" ON campaigns
FOR ALL USING (tenant_id = get_current_tenant_id());

-- Role-based permissions
CREATE POLICY "Role-based access to user profiles" ON user_profiles
FOR SELECT USING (
  tenant_id = get_current_tenant_id() AND
  (role = get_current_user_role() OR 
   get_current_user_role() IN ('marketing_director', 'agency_owner'))
);
```

### Helper Functions
```sql
-- Get current user's tenant
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT tenant_id 
    FROM user_profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get current user's role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM user_profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🚀 SUPABASE EDGE FUNCTIONS

### AI Content Generation
```typescript
// supabase/functions/generate-content/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import OpenAI from 'https://esm.sh/openai@4.20.1';

serve(async (req) => {
  const { prompt, contentType, targetAudience } = await req.json();
  
  const openai = new OpenAI({
    apiKey: Deno.env.get('OPENAI_API_KEY'),
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `Generate ${contentType} content for ${targetAudience}. Follow PRAVADO brand guidelines.`
      },
      {
        role: "user", 
        content: prompt
      }
    ],
  });

  return new Response(
    JSON.stringify({ content: completion.choices[0].message.content }),
    { headers: { "Content-Type": "application/json" } }
  );
});
```

### AI Citation Tracking
```typescript
// supabase/functions/track-citations/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const { query, platforms } = await req.json();
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const results = [];
  
  for (const platform of platforms) {
    const citations = await checkPlatformCitations(platform, query);
    
    // Store results in database
    await supabase.from('ai_citation_queries').insert({
      query_text: query,
      ai_platform: platform,
      citation_context: citations.context,
      ranking_position: citations.position,
      citation_quality_score: citations.quality
    });
    
    results.push({ platform, citations });
  }

  return new Response(JSON.stringify({ results }));
});
```

---

## ⚙️ FRONTEND ARCHITECTURE

### Component Structure
```
src/
├── components/
│   ├── ai/                      # AI-powered components
│   │   ├── AIRecommendationCard.tsx
│   │   ├── ProactiveIntelligencePanel.tsx
│   │   └── ConfidenceIndicator.tsx
│   ├── approvals/               # Human-in-loop patterns
│   │   ├── HoldToConfirmButton.tsx
│   │   ├── ApprovalConfirmModal.tsx
│   │   └── BatchApprovalControls.tsx
│   ├── content/                 # Content Marketing pillar
│   │   ├── ContentCalendar.tsx
│   │   ├── ContentEditor.tsx
│   │   └── ContentPerformance.tsx
│   ├── pr/                      # Public Relations pillar
│   │   ├── MediaDatabase.tsx
│   │   ├── JournalistProfile.tsx
│   │   └── OutreachCampaigns.tsx
│   ├── seo/                     # SEO Intelligence pillar
│   │   ├── CitationTracking.tsx
│   │   ├── KeywordResearch.tsx
│   │   └── CompetitorAnalysis.tsx
│   └── layout/
│       ├── AppShell.tsx
│       ├── RoleBasedSidebar.tsx
│       └── CommandCenter.tsx
├── hooks/                       # Custom React hooks
│   ├── useJournalists.ts
│   ├── useCampaigns.ts
│   ├── useAIRecommendations.ts
│   └── useUserRole.ts
├── services/                    # API integration
│   ├── aiService.ts
│   ├── mediaService.ts
│   └── analyticsService.ts
└── types/                       # TypeScript definitions
    ├── database.ts
    ├── ai.ts
    └── user.ts
```

### Custom Hooks Pattern
```typescript
// hooks/useAIRecommendations.ts
export const useAIRecommendations = (userId: string, pillar?: string) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const { data } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', userId)
        .eq('pillar', pillar || '%')
        .order('confidence', { ascending: false });
        
      setRecommendations(data || []);
      setLoading(false);
    };

    fetchRecommendations();
  }, [userId, pillar]);

  return { recommendations, loading };
};
```

---

## 🎯 ROLE-BASED ARCHITECTURE

### User Role Hierarchy
```typescript
type UserRole = 
  | 'agency_owner'        // Full platform access + client management
  | 'agency_admin'        // Client management + team oversight
  | 'account_manager'     // Client-specific access + reporting
  | 'marketing_director'  // Strategic oversight + team management  
  | 'content_manager'     // Content creation + editorial workflows
  | 'pr_manager'          // Media relations + journalist database
  | 'seo_specialist'      // Technical SEO + GEO intelligence
  | 'team_member'         // Task execution + collaboration
  | 'enterprise_admin'    // Security + compliance + audit
  | 'department_head'     // Cross-functional coordination
  | 'specialist'          // Subject matter expertise
  | 'business_owner'      // Strategic + ROI optimization (SMB)
  | 'marketing_manager'   // Campaign execution + optimization
  | 'freelancer';         // Project delivery + portfolio

type UserTier = 'starter' | 'professional' | 'business' | 'enterprise';
```

### Permission System
```typescript
interface PermissionMatrix {
  [role: string]: {
    content: ('read' | 'write' | 'approve' | 'publish')[];
    pr: ('read' | 'write' | 'contact' | 'outreach')[];
    seo: ('read' | 'write' | 'audit' | 'optimize')[];
    campaigns: ('read' | 'write' | 'approve' | 'launch')[];
    team: ('read' | 'write' | 'invite' | 'manage')[];
    analytics: ('read' | 'export' | 'advanced')[];
  };
}
```

---

## 📱 MOBILE-FIRST RESPONSIVE PATTERNS

### Breakpoint System
```typescript
const breakpoints = {
  mobile: '320px',
  tablet: '768px', 
  desktop: '1024px',
  wide: '1440px'
};
```

### Touch-Optimized Components
```typescript
// Mobile executive approval interface
const MobileApprovalCard = ({ recommendation }: { recommendation: AIRecommendation }) => (
  <div className="card p-4 min-h-[120px] flex flex-col">
    <div className="flex-1">
      <h3 className="text-lg font-semibold mb-2">{recommendation.title}</h3>
      <p className="text-sm text-textc-300 mb-3">{recommendation.summary}</p>
    </div>
    <div className="flex gap-2">
      <button className="flex-1 btn-primary py-3 text-sm">
        Approve ({Math.round(recommendation.confidence * 100)}%)
      </button>
      <button className="w-12 h-12 border rounded-md flex items-center justify-center">
        <Edit2 size={16} />
      </button>
    </div>
  </div>
);
```

---

## 🤖 AI INTEGRATION PATTERNS

### AI Service Abstraction
```typescript
interface AIService {
  generateContent(prompt: string, type: ContentType): Promise<string>;
  analyzeSentiment(text: string): Promise<SentimentAnalysis>;
  suggestOptimizations(content: string): Promise<Optimization[]>;
  trackCitations(query: string): Promise<Citation[]>;
}

class OpenAIService implements AIService {
  async generateContent(prompt: string, type: ContentType): Promise<string> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: getSystemPrompt(type) },
        { role: "user", content: prompt }
      ]
    });
    return response.choices[0].message.content;
  }
}
```

### Proactive AI Agent Architecture
```typescript
interface AIAgent {
  name: string;
  schedule: string;           // Cron expression
  triggers: AITrigger[];
  action: (context: AgentContext) => Promise<AIRecommendation[]>;
}

const morningIntelligenceAgent: AIAgent = {
  name: 'Morning Intelligence',
  schedule: '0 8 * * *',      // Daily at 8 AM
  triggers: ['daily_schedule'],
  action: async (context) => {
    const overnightData = await getOvernightPerformance(context.userId);
    const marketTrends = await getMarketIntelligence(context.industry);
    const opportunities = await identifyOpportunities(overnightData, marketTrends);
    
    return opportunities.map(opp => ({
      type: 'strategic_opportunity',
      confidence: opp.confidence,
      impact: opp.impact,
      title: opp.title,
      description: opp.description,
      suggestedAction: opp.action
    }));
  }
};
```

---

## 🔄 WORKFLOW AUTOMATION

### Campaign Lifecycle Management
```typescript
interface CampaignWorkflow {
  id: string;
  stages: WorkflowStage[];
  approvals: ApprovalGate[];
  automations: AutomationRule[];
}

interface ApprovalGate {
  stage: string;
  requiredRole: UserRole[];
  approvalType: 'single' | 'majority' | 'unanimous';
  timeout?: number;        // Auto-approve after timeout
}
```

### Cross-Pillar Integration
```typescript
const integratedCampaignFlow = async (campaignId: string) => {
  // Stage 1: Content Creation
  const content = await generateContent(campaign.brief);
  await requestApproval(content, 'content_manager');
  
  // Stage 2: SEO Optimization  
  const optimizedContent = await optimizeForSEO(content);
  await requestApproval(optimizedContent, 'seo_specialist');
  
  // Stage 3: PR Amplification
  const prStrategy = await generatePRStrategy(optimizedContent);
  const targetJournalists = await findTargetJournalists(prStrategy);
  await requestApproval(prStrategy, 'pr_manager');
  
  // Stage 4: Coordinated Launch
  await Promise.all([
    publishContent(optimizedContent),
    executePROutreach(targetJournalists, prStrategy),
    trackSEOPerformance(optimizedContent)
  ]);
};
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### Database Query Optimization
```sql
-- Efficient journalist search with full-text search
CREATE INDEX idx_journalist_search ON journalist_contacts 
USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || outlet || ' ' || beat));

-- Campaign performance tracking
CREATE INDEX idx_campaign_performance ON campaigns (tenant_id, status, created_at);

-- Citation tracking optimization
CREATE INDEX idx_citation_tracking ON ai_citation_queries (tenant_id, ai_platform, tracked_at);
```

### Frontend Performance
```typescript
// Lazy loading for pillar components
const ContentMarketing = lazy(() => import('./components/content/ContentMarketing'));
const PublicRelations = lazy(() => import('./components/pr/PublicRelations'));
const SEOIntelligence = lazy(() => import('./components/seo/SEOIntelligence'));

// Memoized expensive computations
const memoizedAIAnalysis = useMemo(() => 
  analyzeContentPerformance(content, metrics), 
  [content, metrics]
);
```

---

## 🔧 DEVELOPMENT WORKFLOW

### Environment Configuration
```bash
# Required environment variables
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
PERPLEXITY_API_KEY=your-perplexity-key
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/hooks/*": ["hooks/*"],
      "@/services/*": ["services/*"],
      "@/types/*": ["types/*"]
    }
  }
}
```

---

This architecture provides a robust, scalable foundation for PRAVADO's automation-first marketing intelligence platform with enterprise-grade security, performance, and user experience.