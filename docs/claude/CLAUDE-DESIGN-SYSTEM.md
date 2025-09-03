# PRAVADO DESIGN SYSTEM v1.3a HANDOFF INTEGRATION
## Claude Code Implementation Guide - OFFICIAL HANDOFF SPECIFICATIONS

---

## 🎯 **HANDOFF INTEGRATION PRIORITY**

**CRITICAL**: This file integrates the official v1.3a handoff specifications with existing PRAVADO strategic context. All implementation must follow v1.3a specifications exactly.

**Source**: `C:\Users\cdibr\Downloads\PRAVADO_Handoff_v1_3a\`

---

## 🎨 **OFFICIAL v1.3a DESIGN TOKENS (MANDATORY)**

### **Exact CSS Variables from Handoff**
```css
/* PRAVADO v1.3a Official Color System - DO NOT MODIFY */
:root {
  --color-brand: #2B3A67;           /* Handoff specification */
  --color-aiAccent: #00A8A8;        /* Handoff specification */
  --color-bg-900: #0B1020;          /* Deepest background */
  --color-bg-800: #0E1530;          /* Secondary background */  
  --color-surface-700: #121933;     /* Card backgrounds */
  --color-surface-600: #151B30;     /* Island/form backgrounds */
  --color-text-100: #E7ECEF;        /* Primary text */
  --color-text-300: #B9C2D0;        /* Secondary/muted text */
  --color-border: #2B3A67;          /* Border color */
  --color-ok: #10B981;              /* Success green */
  --color-warn: #F59E0B;            /* Warning amber */
  --color-danger: #EF4444;          /* Error red */
}
```

### **Required CSS Import**
```css
/* Import from handoff package - MANDATORY */
@import '@/ui/css/theme.dark.ink.css';

/* Global body styles from handoff */
body {
  background: var(--color-bg-900);
  color: var(--color-text-100);
  font-family: Inter, ui-sans-serif, system-ui;
}
```

---

## 🧩 **OFFICIAL v1.3a COMPONENT SPECIFICATIONS**

### **Core Components from Handoff (EXACT NAMES)**

#### **ProposalCard (Primary Component)**
```tsx
interface ProposalCardProps {
  id: string;
  pillar: 'content' | 'pr' | 'seo';
  title: string;
  summary?: string;
  confidence: number;        // 0..1
  impact: number;            // 0..1 (expected lift)
  diffUrl?: string;          // link to DiffViewer
  risk: 'internal' | 'external';
  gate: 'auto' | 'confirm';
  onApprove?: () => void;
  onSnooze?: () => void;
  onEdit?: () => void;
}

// Usage from handoff documentation
<ProposalCard 
  id="p1"
  pillar="content"
  title="Refresh cornerstone article"
  confidence={0.92}
  impact={0.18}
  gate="confirm"
  risk="external"
  diffUrl="#"
/>
```

#### **ApprovalConfirmModal + HoldToConfirmButton**
```tsx
interface ApprovalConfirmModalProps {
  open: boolean;
  actionTitle: string;
  diffUrl?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface HoldToConfirmButtonProps {
  onConfirm: () => void;
  duration?: number; // Default 1200ms from handoff
}

// MANDATORY: Hold-to-confirm for all sensitive actions
<HoldToConfirmButton 
  onConfirm={handleConfirm}
  duration={1200}
/>
```

#### **Complete Component Set from Handoff**
- ✅ `ProposalCard` (primary interface component)
- ✅ `ApprovalConfirmModal` (sensitive action confirmation)
- ✅ `HoldToConfirmButton` (1.2 second hold requirement)
- ✅ `KbdHints` (A/S/E/D/B keyboard shortcuts)
- ✅ `AdjustPlanPanel` (plan modification interface)
- ✅ `BatchQueueTable` (bulk operations)
- ✅ `DiffViewer` (change visualization)
- ✅ `PublishingCalendar` (content scheduling)

---

## 📄 **OFFICIAL v1.3a PAGE COMPOSITIONS**

### **Page Structure from Handoff**
```typescript
// Exact page exports from handoff package
export { default as DailyBrief } from '@/ui/react/src/pages/DailyBrief';             
export { default as Queue } from '@/ui/react/src/pages/Queue';                  
export { default as ContentEditor } from '@/ui/react/src/pages/ContentEditor';          
export { default as BriefBuilderPage } from '@/ui/react/src/pages/BriefBuilderPage';       
export { default as PublishingCalendarPage } from '@/ui/react/src/pages/PublishingCalendarPage'; 
export { default as MediaIntelligenceCenter } from '@/ui/react/src/pages/MediaIntelligenceCenter';
export { default as PitchComposerPage } from '@/ui/react/src/pages/PitchComposerPage';      
export { default as OutreachSchedulePage } from '@/ui/react/src/pages/OutreachSchedulePage';   
export { default as PitchTrackerPage } from '@/ui/react/src/pages/PitchTrackerPage';
```

### **DailyBrief Page (Primary Landing)**
```tsx
// From handoff specifications
const DailyBrief = () => (
  <AppShell>
    <div className="space-y-6">
      <KpiRibbon /> {/* 4-column metrics from handoff */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ProposalCard impact="high" confidence={0.92} />
          <ProposalCard impact="medium" confidence={0.86} />
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

---

## 🔧 **STATE MANAGEMENT FROM HANDOFF**

### **Zustand Store Pattern**
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

---

## 🎯 **STRATEGIC INTEGRATION WITH EXISTING CONTEXT**

### **Enhanced ProposalCard for Marketing Intelligence**

#### **PRAVADO-Specific Props Extension**
```tsx
// Extend handoff ProposalCard with PRAVADO business logic
interface PRAVADOProposalProps extends ProposalCardProps {
  // Marketing Intelligence Enhancements
  pillar: 'content' | 'pr' | 'seo' | 'integrated'; // Add integrated campaigns
  marketingContext?: {
    audienceMatch: number;        // AI audience compatibility score
    competitiveAdvantage: number; // Market positioning advantage
    trendAlignment: number;       // Industry trend alignment
    crossPillarImpact: number;    // Multi-pillar campaign potential
  };
  
  // Cross-Pillar Integration Data
  citationOpportunities?: number;     // GEO platform citation potential
  journalistTargets?: JournalistMatch[]; // PR database matches
  seoKeywords?: KeywordOpportunity[];    // SEO optimization opportunities
  
  // Business Context
  revenueImpact?: number;         // Projected revenue impact
  executionComplexity?: 'low' | 'medium' | 'high';
  timeToValue?: number;           // Days to measurable results
}
```

### **MediaIntelligenceCenter → 34K+ Journalist Database**
```tsx
// Enhance handoff MediaIntelligenceCenter with PRAVADO's journalist database
const MediaIntelligenceCenter = () => (
  <div className="space-y-6">
    <JournalistSearch database={journalist34K} />
    <div className="grid grid-cols-4 gap-4">
      {journalists.map(j => (
        <MediaMatchCard 
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
```

---

## ✅ **IMPLEMENTATION CHECKLIST**

### **Phase 1: Handoff Foundation (MANDATORY)**
- [ ] Import theme.dark.ink.css from handoff package
- [ ] Implement exact component names from handoff (ProposalCard, ApprovalConfirmModal, etc.)
- [ ] Create page structure matching handoff compositions
- [ ] Implement Zustand state management pattern from handoff
- [ ] Add keyboard shortcuts (A/S/E/D/B) from handoff specifications

### **Phase 2: PRAVADO Strategic Integration**
- [ ] Enhance ProposalCard with marketing intelligence data
- [ ] Connect MediaIntelligenceCenter to 34K+ journalist database
- [ ] Add cross-pillar attribution to all components
- [ ] Integrate GEO citation tracking
- [ ] Implement role-based adaptive interfaces

### **Phase 3: Enterprise Quality Polish**
- [ ] Ensure all components use handoff color tokens only
- [ ] Implement hold-to-confirm for all sensitive actions
- [ ] Add proper ARIA attributes and accessibility
- [ ] Optimize for mobile executive approval workflows
- [ ] Add comprehensive error boundaries

---

## 🚨 **CRITICAL SUCCESS FACTORS**

### **Non-Negotiables:**
1. **Use EXACT handoff component names** - No custom component names
2. **Import theme.dark.ink.css** - No custom color systems
3. **Follow handoff page compositions** - DailyBrief, Queue, ContentEditor structure
4. **Implement Zustand state management** - As specified in handoff
5. **Include keyboard shortcuts** - A/S/E/D/B functionality mandatory

### **Strategic Enhancements:**
1. **34K+ journalist database integration** - Real data from Supabase
2. **Cross-pillar attribution** - Content + PR + SEO unified campaigns
3. **GEO citation tracking** - AI platform dominance monitoring
4. **Role-based adaptation** - 11 user types with contextual interfaces
5. **Mobile executive experience** - Touch-optimized approval workflows

---

**This design system serves as the authoritative integration guide between the official v1.3a handoff specifications and PRAVADO's strategic marketing intelligence platform requirements. All implementation must follow handoff specifications exactly while enhancing with PRAVADO-specific business logic and data integration.**