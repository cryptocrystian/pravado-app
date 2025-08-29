# CLAUDE-CORE.md
## Technical Foundation & Design System for PRAVADO Platform

---

## TECH STACK & CONVENTIONS

**Repository Layout (Monorepo):**
- `/apps/web` - React + Vite frontend
- `/apps/mobile` - Future Expo/React Native companion
- `/packages/ui` - Shared component library
- `/packages/types` - TypeScript definitions
- `/packages/workers` - CloudFlare Workers

**Core Technologies:**
- **Frontend:** React + Vite, Tailwind CSS, Radix UI/ShadCN
- **State:** Zustand (client) + TanStack Query (server state)
- **Backend:** Supabase (Postgres/Auth/Storage/Edge Functions)
- **Deployment:** CloudFlare Pages + Workers + Cron Triggers
- **Testing:** Playwright (E2E), Vitest (unit), MCP visual validation
- **Type Safety:** Zod runtime validation, comprehensive TypeScript

---

## DESIGN SYSTEM (LOCKED)

### Color Palette
```css
:root {
  /* Primary Brand Colors */
  --primary: #2B3A67;      /* Slate Blue - professional authority */
  --ai: #00A8A8;           /* AI Teal - intelligence indicators */
  --premium: #D4A017;      /* Gold - premium features */
  
  /* Semantic Colors */
  --success: #22C55E;      /* Green - positive metrics */
  --warning: #F59E0B;      /* Amber - attention needed */
  --danger: #DC2626;       /* Red - critical alerts */
  
  /* Light Theme (Content Creation) */
  --bg: #F8F6F2;           /* Soft beige background */
  --surface: #E7ECEF;      /* Elevated cards */
  --text: #1A1A1A;         /* Primary text */
  
  /* Dark Theme (Analytics/Dashboards) */
  --bg-dark: #1E2A4A;      /* Deep slate */
  --surface-dark: #2B3A67; /* Dark cards */
  --text-dark: #FFFFFF;    /* Light text */
}
```

### Typography & Spacing
- **Font:** Inter (professional, readable)
- **Scales:** display-32/40, h1-28, h2-22, body-16, meta-12/14
- **Line Heights:** 1.2 (titles), 1.5 (body)
- **Spacing Grid:** 8px base, 44px minimum touch targets

### Component Patterns
- **Buttons:** Primary (primary), Secondary (outline), Ghost, Premium (gold), Danger
- **Cards:** Metric (KPIs), Chart, List, Editor Canvas
- **Navigation:** Collapsible sidebar, breadcrumbs, tabs
- **AI Elements:** Teal badges with `bg-ai/10 text-ai border-ai/30`

### Theme Strategy
- **Dark Theme:** Default for dashboards, analytics, strategic interfaces
- **Light Theme:** Content creation, editing workflows
- **Contextual Switching:** Users can override per-view

---

## AUTOMATION-FIRST UI PRINCIPLES

### CRITICAL CONSTRAINTS
**NEVER create these traditional patterns:**
- "AI Assistant" sidebar panels
- "Ask AI" chat modal dialogs  
- Separate recommendation widgets
- Generic dashboard cards with "AI insights"
- Manual form-heavy interfaces when AI can provide defaults

**ALWAYS implement these automation-first patterns:**
- AI suggestions as primary interface content
- User actions that respond to AI recommendations
- Proactive intelligence at decision points
- Contextual automation that appears when relevant
- Workflows where AI drives interaction, user approves/modifies

### Visual Hierarchy for AI-First Design
- **Primary (70% visual weight):** AI-generated recommendations and insights
- **Secondary (20% visual weight):** Supporting data and context
- **Tertiary (10% visual weight):** Manual override options

---

## COMPONENT SPECIFICATIONS

### AI-First Dashboard Cards
```typescript
// Automation-first pattern
interface AIRecommendationCard {
  primaryAction: "AI-generated suggestion with specific recommendation"
  secondaryContext: "Supporting data that justifies AI suggestion"
  userActions: ["One-click approval", "Modify suggestion", "View details"]
  visualHierarchy: "AI suggestion dominates 70% of card space"
}

// FORBIDDEN traditional pattern
interface TraditionalDashboardCard {
  title: "Generic metric name"
  value: "Raw number without context"
  aiSidebar: "Separate AI recommendations panel" // NEVER DO THIS
}
```

### Intelligent Form Patterns
```typescript
// Automation-first approach
interface SmartCampaignCreation {
  aiPrePopulation: "AI analyzes company → suggests campaign strategy"
  userRole: "Review and approve AI suggestions"
  manualOverride: "Available but de-emphasized visually"
}

// Traditional form pattern - AVOID
interface ManualCampaignForm {
  emptyFields: "User fills out everything manually"
  aiHelp: "AI suggestions in sidebar" // WRONG APPROACH
}
```

---

## QUALITY STANDARDS

### Performance Requirements
- **Page Load:** <2s on P50, <3s on P95
- **AI Responses:** <3s for suggestions, <5s for complex analysis
- **Interactive Response:** <100ms for UI updates
- **Lighthouse Scores:** >90 performance, >95 accessibility

### Accessibility Compliance
- **WCAG 2.1 AA minimum** for all interfaces
- **Color Contrast:** 4.5:1 minimum for normal text
- **Keyboard Navigation:** All features accessible via keyboard
- **Screen Readers:** Proper ARIA labels and semantic markup

### Enterprise Standards
- **Multi-tenant Security:** All data properly scoped by tenant_id
- **Error Handling:** Graceful degradation with informative messages
- **Loading States:** Clear feedback during AI processing
- **Responsive Design:** Professional appearance across all devices

---

## DEVELOPMENT WORKFLOW

### Context Loading Strategy
- **Core Always Loaded:** This file provides foundation for all development
- **Phase-Specific Files:** Load additional context based on current development focus
- **Token Management:** Keep combined context under 10K tokens for optimal performance

### MCP Visual Validation
- **Required:** All UI components must pass MCP automation-first pattern tests
- **Screenshot Validation:** Visual confirmation that AI elements are primary content
- **Anti-Pattern Detection:** Automated checks prevent traditional dashboard patterns

### Git Workflow
- **Feature Branches:** All development in feature branches
- **MCP Gate:** All PRs must pass MCP visual validation tests
- **Performance Gate:** Lighthouse scores must meet enterprise standards

---

## INTEGRATION POINTS

### Supabase Backend
- **Authentication:** Row-Level Security enforced on all tables
- **Real-time:** Live updates for collaboration features
- **Edge Functions:** AI orchestration and background processing
- **Type Safety:** Database types auto-generated and validated

### AI Orchestration
- **Cost-Controlled:** GPT-4o-mini for trials (~$0.005 per user)
- **Premium Models:** Claude 3.5 Sonnet, GPT-4o for paid tiers
- **Guardrails:** Token budgets, content filtering, approval gates
- **Context Awareness:** AI recommendations based on user role and current workflow

### CloudFlare Deployment
- **Pages:** Static asset serving with branch previews
- **Workers:** API proxies and background jobs
- **Cron Triggers:** Automated maintenance and data processing

---

## CRITICAL SUCCESS FACTORS

### Automation-First Validation
1. **Primary Content Test:** AI suggestions must be visually dominant
2. **Workflow Integration Test:** AI appears at natural decision points
3. **User Action Test:** Users respond to AI rather than query AI
4. **Traditional Pattern Check:** No forbidden dashboard patterns

### Enterprise Quality Validation
1. **Performance:** All pages load under 2 seconds
2. **Security:** Multi-tenant isolation properly implemented
3. **Accessibility:** WCAG 2.1 AA compliance verified
4. **Mobile:** Professional appearance on all device sizes

This foundation ensures every component built supports automation-first workflows while maintaining enterprise-grade quality and performance standards.
