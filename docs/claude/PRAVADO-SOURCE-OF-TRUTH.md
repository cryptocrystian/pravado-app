# PRAVADO IMPLEMENTATION SOURCE OF TRUTH
## Authoritative Reference for All Future Development Sessions

---

## 📋 **DOCUMENT PURPOSE**

This document serves as the **single authoritative reference** for all PRAVADO development decisions, specifications, and requirements. Reference this document in every development session to maintain consistency and avoid conflicts.

**Companion Document**: `PRAVADO-FEATURES-FUNCTIONALITY.md` - Detailed business logic and workflow specifications

**Document Scope**:
- **This Document**: Design system, architecture, quality framework, implementation workflow
- **Features Document**: Business logic, AI algorithms, user workflows, feature specifications

**Last Updated**: January 15, 2025  
**Version**: 1.0 (v1.3a Handoff Integrated)  
**Status**: Active - Primary Reference

---

## 🏗️ **PROJECT OVERVIEW**

### **Mission Statement**
Build PRAVADO as the world's first automation-first marketing intelligence platform combining Content Marketing + Public Relations + SEO Intelligence with revolutionary AI platform citation tracking (GEO).

### **Core Value Propositions**
1. **34K+ Journalist Database** - Most comprehensive media contact intelligence
2. **Cross-Pillar Attribution** - Unified Content + PR + SEO campaign tracking  
3. **GEO Citation Tracking** - AI platform dominance monitoring (ChatGPT, Claude, Perplexity, Gemini)
4. **Automation-First Workflow** - AI drives strategy, humans provide intelligent oversight
5. **Role-Based Intelligence** - 11 user types with adaptive interfaces

---

## 🎨 **DESIGN SYSTEM AUTHORITY**

### **Official Specifications Source**
**Location**: `C:\Users\cdibr\Downloads\PRAVADO_Handoff_v1_3a\`  
**Status**: MANDATORY - No modifications or interpretations allowed

### **Required Assets Integration**
```bash
# Exact file imports required
├── css/theme.dark.ink.css           # Official color system
├── react/src/components/            # Exact component specs
├── react/src/pages/                 # Page compositions  
├── tailwind/tailwind.config.cjs     # Tailwind configuration
└── tokens/                          # Design tokens
```

### **Official Color System (DO NOT MODIFY)**
```css
:root {
  --color-brand: #2B3A67;           /* Primary brand slate blue */
  --color-aiAccent: #00A8A8;        /* AI feature teal accent */
  --color-bg-900: #0B1020;          /* Deepest background */
  --color-bg-800: #0E1530;          /* Secondary background */
  --color-surface-700: #121933;     /* Card backgrounds */
  --color-surface-600: #151B30;     /* Island/form backgrounds */
  --color-text-100: #E7ECEF;        /* Primary text */
  --color-text-300: #B9C2D0;        /* Secondary text */
  --color-border: #2B3A67;          /* Border color */
  --color-ok: #10B981;              /* Success green */
  --color-warn: #F59E0B;            /* Warning amber */
  --color-danger: #EF4444;          /* Error red */
}
```

---

## 🧩 **COMPONENT SPECIFICATIONS**

### **Core Components (EXACT NAMES - NO SUBSTITUTIONS)**

#### **ProposalCard (Primary Interface Component)**
```tsx
interface ProposalCardProps {
  id: string;
  pillar: 'content' | 'pr' | 'seo' | 'integrated';
  title: string;
  summary?: string;
  confidence: number;        // 0.0 to 1.0
  impact: number;            // 0.0 to 1.0
  diffUrl?: string;
  risk: 'internal' | 'external';
  gate: 'auto' | 'confirm';
  onApprove?: () => void;
  onSnooze?: () => void;
  onEdit?: () => void;
}

// CRITICAL: Must dominate 70% of visual hierarchy
```

#### **ApprovalConfirmModal (Mandatory for Sensitive Actions)**
```tsx
interface ApprovalConfirmModalProps {
  open: boolean;
  actionTitle: string;
  diffUrl?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```

#### **HoldToConfirmButton (1.2 Second Hold Required)**
```tsx
interface HoldToConfirmButtonProps {
  onConfirm: () => void;
  duration?: number; // Default 1200ms
}
```

#### **Complete Handoff Component Set**
1. `ProposalCard` - Primary interface component
2. `ApprovalConfirmModal` - Sensitive action confirmation
3. `HoldToConfirmButton` - Hold-to-confirm pattern (1.2s)
4. `KbdHints` - Keyboard shortcuts display (A/S/E/D/B)
5. `AdjustPlanPanel` - Plan modification interface
6. `BatchQueueTable` - Bulk operations management
7. `DiffViewer` - Change visualization
8. `PublishingCalendar` - Content scheduling
9. `AppShell` - Layout container
10. `AppShellSidebar` - Navigation sidebar
11. `AppTopbar` - Top navigation bar

---

## 📄 **PAGE ARCHITECTURE**

### **Official Page Compositions (EXACT STRUCTURE)**

#### **DailyBrief (Primary Landing)**
```tsx
const DailyBrief = () => (
  <AppShell>
    <div className="space-y-6">
      <KpiRibbon /> {/* 4-column metrics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ProposalCard /> {/* Multiple proposals */}
        </div>
        <div>
          <AdjustPlanPanel />
          <KbdHints />
        </div>
      </div>
    </div>
  </AppShell>
);
```

#### **Queue (Batch Operations)**
```tsx
const Queue = () => (
  <AppShell>
    <BatchQueueTable 
      rows={proposals}
      onApprove={handleBatchApprove}
      onSnooze={handleBatchSnooze}
    />
  </AppShell>
);
```

#### **ContentEditor (Light Theme Island)**
```tsx
const ContentEditor = () => (
  <AppShell>
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="island p-3"> {/* Light background */}
          <input className="w-full card p-2 mb-2" />
          <textarea className="w-full h-72 card p-2" />
        </div>
      </div>
      <div>
        <SEOChecksPanel />
        <PublishingOptions />
      </div>
    </div>
  </AppShell>
);
```

#### **Complete Page Set**
1. `DailyBrief` - Primary landing page
2. `Queue` - Batch operations management
3. `ContentEditor` - Content creation with light theme islands
4. `BriefBuilderPage` - Campaign brief creation
5. `PublishingCalendarPage` - Content calendar management
6. `MediaIntelligenceCenter` - 34K+ journalist database
7. `PitchComposerPage` - PR pitch creation
8. `OutreachSchedulePage` - Outreach campaign management
9. `PitchTrackerPage` - PR campaign tracking

---

## 🔧 **STATE MANAGEMENT**

### **Zustand Pattern (MANDATORY)**
```typescript
// From handoff implementation kit
import { create } from 'zustand';

interface BriefStore {
  proposals: AgentProposal[];
  approve: (id: string) => void;
  snooze: (id: string) => void;
  decline: (id: string) => void;
  load: (rows: AgentProposal[]) => void;
}

export const useBrief = create<BriefStore>((set) => ({
  proposals: [],
  approve: (id) => set((s) => ({ 
    proposals: s.proposals.filter(p => p.id !== id) 
  })),
  snooze: (id) => set((s) => ({ 
    proposals: s.proposals.filter(p => p.id !== id) 
  })),
  decline: (id) => set((s) => ({ 
    proposals: s.proposals.filter(p => p.id !== id) 
  })),
  load: (rows) => set({ proposals: rows }),
}));
```

### **Keyboard Shortcuts Hook**
```typescript
export function useShortcuts(map: Partial<Record<'A'|'S'|'E'|'D'|'B', () => void>>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase() as keyof typeof map;
      if (map[k]) { 
        e.preventDefault(); 
        map[k]!(); 
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [map]);
}
```

---

## 🏗️ **TECHNICAL ARCHITECTURE**

### **Technology Stack**
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **State Management**: Zustand (from handoff specifications)
- **Framework**: Next.js App Router
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth with Row Level Security
- **AI Services**: OpenAI, Anthropic Claude, Perplexity, Gemini
- **Deployment**: Lovable.dev platform

### **Database Schema (Core Tables)**
```sql
-- Multi-tenant with Row Level Security
tenants (id, name, domain, settings, created_at)
user_profiles (id, tenant_id, role, tier, full_name, email, permissions, created_at)
journalist_contacts (id, tenant_id, first_name, last_name, email, outlet, ai_match_score, relationship_score)
campaigns (id, tenant_id, name, type, status, goals, budget, created_by, created_at)
content_pieces (id, tenant_id, campaign_id, title, content, content_type, status, seo_data)
ai_citation_queries (id, tenant_id, query_text, ai_platform, citation_context, ranking_position)
```

### **File Structure**
```
src/
├── components/
│   ├── handoff/                    # Exact handoff components
│   │   ├── ProposalCard.tsx
│   │   ├── ApprovalConfirmModal.tsx
│   │   └── HoldToConfirmButton.tsx
│   ├── pravado/                    # PRAVADO enhancements
│   │   ├── MarketingIntelligence.tsx
│   │   └── CrossPillarAttribution.tsx
│   └── layout/
│       ├── AppShell.tsx
│       └── Navigation.tsx
├── pages/                          # Handoff page compositions
│   ├── DailyBrief.tsx
│   ├── Queue.tsx
│   └── ContentEditor.tsx
├── hooks/                          # Custom hooks
│   ├── useBrief.ts                 # Zustand store
│   ├── useShortcuts.ts             # Keyboard shortcuts
│   └── useJournalists.ts           # Supabase integration
├── services/
│   ├── aiService.ts
│   └── mediaService.ts
└── types/
    ├── handoff.ts                  # Handoff component types
    └── pravado.ts                  # PRAVADO enhancements
```

---

## 👥 **USER ROLE SYSTEM**

### **11 User Role Definitions**

#### **Agency Tier**
1. **Agency Owner** - Full platform access + client management
2. **Agency Admin** - Client management + team oversight  
3. **Account Manager** - Client-specific access + reporting

#### **Enterprise Team Tier**
4. **Marketing Director** - Strategic oversight + team management
5. **Content Manager** - Content creation + editorial workflows
6. **PR Manager** - Media relations + journalist database
7. **SEO Specialist** - Technical SEO + GEO intelligence
8. **Team Member** - Task execution + collaboration

#### **Enterprise Client Tier**
9. **Enterprise Admin** - Security + compliance + audit
10. **Department Head** - Cross-functional coordination
11. **Specialist** - Subject matter expertise

#### **Self-Service Tier**
12. **Business Owner** - Strategic + ROI optimization (SMB)
13. **Marketing Manager** - Campaign execution + optimization
14. **Freelancer** - Project delivery + portfolio

### **Role-Based Landing Page Mapping**
- **Marketing Director / Business Owner** → DailyBrief (strategic oversight)
- **Content Manager** → ContentEditor (production focus)
- **PR Manager** → MediaIntelligenceCenter (journalist database)
- **SEO Specialist** → SEO tools + GEO citation tracking
- **Team Members** → Queue (task execution)

---

## 🚀 **PRAVADO STRATEGIC ENHANCEMENTS**

### **Enhanced ProposalCard for Marketing Intelligence**
```tsx
interface PRAVADOProposalProps extends ProposalCardProps {
  // Marketing Intelligence Enhancements
  pillar: 'content' | 'pr' | 'seo' | 'integrated';
  marketingContext?: {
    audienceMatch: number;        // 0.0-1.0
    competitiveAdvantage: number; // 0.0-1.0
    trendAlignment: number;       // 0.0-1.0
    crossPillarImpact: number;    // 0.0-1.0
  };
  
  // Cross-Pillar Integration
  citationOpportunities?: number;     // GEO opportunities
  journalistTargets?: JournalistMatch[]; // PR database matches
  seoKeywords?: KeywordOpportunity[];    // SEO optimization
  
  // Business Context
  revenueImpact?: number;         // Projected revenue
  executionComplexity?: 'low' | 'medium' | 'high';
  timeToValue?: number;           // Days to results
}
```

### **Cross-Pillar Campaign Integration**
```typescript
interface IntegratedCampaign {
  id: string;
  name: string;
  type: 'integrated'; // Content + PR + SEO
  contentPieces: ContentPiece[];
  prContacts: JournalistContact[];
  seoTargets: KeywordTarget[];
  performance: {
    contentMetrics: ContentMetrics;
    prCoverage: PRCoverage;
    seoRankings: SEORankings;
    attribution: CrossPillarAttribution;
  };
}
```

### **34K+ Journalist Database Integration**
```tsx
const MediaIntelligenceCenter = () => {
  const { journalists } = useJournalists(); // 34K+ contacts
  
  return (
    <div className="space-y-6">
      <JournalistSearch database={journalists} />
      <div className="grid grid-cols-4 gap-4">
        {journalists.map(j => (
          <MediaContactCard
            key={j.id}
            name={j.name}
            outlet={j.outlet}
            aiMatchScore={j.ai_match_score}
            relationshipHealth={j.relationship_score}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## 🔒 **NON-NEGOTIABLE REQUIREMENTS**

### **Handoff Compliance (MANDATORY)**
1. **Use EXACT component names** - No substitutions (ProposalCard, not AIRecommendationCard)
2. **Import theme.dark.ink.css** - No custom color systems
3. **Follow page compositions** - DailyBrief, Queue, ContentEditor structure
4. **Implement Zustand state management** - As specified in handoff
5. **Include keyboard shortcuts** - A/S/E/D/B functionality
6. **HoldToConfirmButton for sensitive actions** - Publishing, outreach, campaigns
7. **ARIA compliance** - Proper accessibility attributes

### **PRAVADO Strategic Requirements**
1. **34K+ journalist database** - Real Supabase data integration
2. **Cross-pillar attribution** - Unified Content + PR + SEO tracking
3. **GEO citation tracking** - AI platform dominance monitoring
4. **Role-based adaptations** - 11 user types with contextual interfaces
5. **Mobile executive experience** - Touch-optimized approval workflows
6. **Enterprise quality** - Supporting $299-$2,999 pricing tiers

---

## ✅ **QUALITY VALIDATION FRAMEWORK**

### **Phase 1: Handoff Foundation Validation**
- [ ] theme.dark.ink.css imported globally
- [ ] All handoff components implemented exactly as specified
- [ ] Page compositions match handoff structure
- [ ] Zustand state management functional
- [ ] Keyboard shortcuts (A/S/E/D/B) operational
- [ ] HoldToConfirmButton implemented for sensitive actions
- [ ] ARIA compliance achieved

### **Phase 2: PRAVADO Integration Validation**  
- [ ] 34K+ journalist database accessible through MediaIntelligenceCenter
- [ ] Cross-pillar proposals showing unified campaign data
- [ ] GEO citation tracking integrated with confidence scoring
- [ ] Role-based navigation and content adaptation working
- [ ] Marketing intelligence data enhancing proposals
- [ ] Mobile optimization with touch-friendly interactions

### **Phase 3: Enterprise Quality Validation**
- [ ] Professional appearance supporting premium pricing
- [ ] Zero broken workflows or incomplete features
- [ ] Performance under 2 seconds page load times
- [ ] Comprehensive error handling and offline capabilities
- [ ] Security compliance with multi-tenant isolation
- [ ] Scalability for enterprise team collaboration

---

## 📱 **MOBILE EXPERIENCE SPECIFICATIONS**

### **Executive Approval Interface**
```tsx
<ProposalCard
  // Handoff foundation
  id="mobile-proposal"
  pillar="integrated"
  confidence={0.94}
  impact={0.23}
  gate="confirm"
  
  // Mobile adaptations
  className="touch-optimized" // 44px minimum touch targets
  onSwipeRight={handleApprove}
  onSwipeLeft={handleDecline}
  
  // Executive context
  executiveContext={{
    revenueImpact: 25000,
    timeToValue: 7,
    riskLevel: 'low'
  }}
/>
```

### **Responsive Breakpoints**
```css
/* Mobile-first responsive system */
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet portrait */
--breakpoint-lg: 1024px;  /* Tablet landscape / desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Wide desktop */
```

---

## 🎯 **SUCCESS METRICS**

### **Technical Success Criteria**
- **100% handoff compliance** - No specification violations
- **Zero TypeScript errors** - Clean build process
- **<2 second page loads** - Performance optimization
- **WCAG 2.1 AA compliance** - Full accessibility
- **Mobile optimization** - Touch-friendly interactions

### **Business Success Criteria**
- **34K+ journalist database** - Fully searchable and filterable
- **Cross-pillar attribution** - Unified campaign ROI tracking
- **GEO citation opportunities** - Actionable AI insights
- **Role-based experiences** - Contextual interfaces for 11 user types
- **Premium pricing justification** - Enterprise-grade quality

### **User Experience Success Criteria**
- **Automation-first workflow** - AI drives 70% of interface
- **Human-in-loop approval** - Required for all sensitive actions
- **Keyboard efficiency** - Power users can navigate without mouse
- **Mobile executive experience** - Professional approval interface
- **Cross-team collaboration** - Multi-user workflows and handoffs

---

## 📋 **IMPLEMENTATION CHECKLIST**

### **Pre-Development Setup**
- [ ] Repository cloned and dependencies installed
- [ ] Handoff assets copied from `PRAVADO_Handoff_v1_3a`
- [ ] Environment variables configured
- [ ] Database schema verified in Supabase
- [ ] AI service API keys tested

### **Phase 1: Handoff Foundation (Sessions 1-2)**
- [ ] theme.dark.ink.css imported and applied
- [ ] Core components implemented (ProposalCard, ApprovalConfirmModal, etc.)
- [ ] Page structures created (DailyBrief, Queue, ContentEditor)
- [ ] Zustand state management setup
- [ ] Keyboard shortcuts implemented (A/S/E/D/B)
- [ ] Basic navigation and routing functional

### **Phase 2: PRAVADO Integration (Sessions 3-4)**
- [ ] Supabase data integration with handoff components
- [ ] 34K+ journalist database connected to MediaIntelligenceCenter
- [ ] Cross-pillar attribution system implemented
- [ ] GEO citation tracking integrated
- [ ] Role-based navigation and content adaptation
- [ ] AI services integration for proposal generation

### **Phase 3: Enterprise Polish (Sessions 5-6)**
- [ ] Mobile executive interface optimization
- [ ] Performance optimization and caching
- [ ] Advanced error handling and offline capabilities
- [ ] Team collaboration workflows
- [ ] Security and compliance validation
- [ ] Final quality assurance and testing

---

## 🚨 **CRITICAL WARNINGS**

### **NEVER DO THESE THINGS**
- ❌ **Modify handoff component names** - Use exact specifications
- ❌ **Create custom color systems** - Use theme.dark.ink.css only
- ❌ **Skip HoldToConfirmButton** - Required for sensitive actions
- ❌ **Ignore keyboard shortcuts** - A/S/E/D/B must work
- ❌ **Use mock data** - Connect real Supabase data
- ❌ **Skip ARIA attributes** - Accessibility is mandatory

### **ALWAYS DO THESE THINGS**
- ✅ **Reference this document** - Single source of truth
- ✅ **Follow handoff specifications exactly** - Zero interpretations
- ✅ **Enhance with PRAVADO context** - Don't replace, enhance
- ✅ **Test on mobile devices** - Executive experience critical
- ✅ **Validate quality gates** - Use provided checklists
- ✅ **Document any deviations** - Update this source of truth

---

## 📞 **SUPPORT AND ESCALATION**

### **When to Reference This Document**
- **Every development session** - Start by reviewing current priorities
- **Before making component decisions** - Verify against specifications
- **When encountering conflicts** - This document has authority
- **During quality assurance** - Use validation checklists
- **When planning future features** - Maintain architectural consistency

### **Document Maintenance**
- **Update after significant changes** - Keep source of truth current
- **Version control critical decisions** - Track implementation evolution
- **Document lessons learned** - Improve future development
- **Maintain specification links** - Ensure handoff asset accessibility

### **Escalation Path**
1. **Check this source of truth document** first
2. **Review specific section** (design system, architecture, etc.)  
3. **Validate against handoff specifications** in `PRAVADO_Handoff_v1_3a`
4. **Consult implementation checklist** for current phase
5. **Update document if new decisions** are made

---

## 📝 **VERSION HISTORY**

### **Version 1.0 - January 15, 2025**
- ✅ Initial creation with v1.3a handoff integration
- ✅ Complete consolidation of all specifications
- ✅ Elimination of conflicting documentation
- ✅ Establishment of single source of truth
- ✅ Definition of quality validation framework

### **Future Updates**
- Document all significant implementation decisions
- Track component enhancements and customizations  
- Maintain quality gate evolution
- Record performance optimizations
- Update success metrics based on user feedback

---

**This document serves as the definitive, authoritative reference for all PRAVADO development. Reference this document in every session to maintain consistency, quality, and alignment with specifications. Any conflicts between this document and other sources should be resolved in favor of this source of truth.**

---

*Document maintained by: Development Team*  
*Next Review Date: After Phase 1 completion*  
*Classification: Internal - Development Team Only*