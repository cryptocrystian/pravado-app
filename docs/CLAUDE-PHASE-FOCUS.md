# CLAUDE-PHASE-FOCUS.md
## Current Phase Priorities & Context Loading Strategy

---

## CURRENT DEVELOPMENT PHASE

**Phase 1: Role-Based Dashboard Implementation with Integrated Onboarding**  
**Timeline:** Next 4 weeks  
**Priority:** Transform current generic interface into automation-first, role-specific experiences

---

## IMMEDIATE PRIORITIES (Week 1)

### **Critical Success Factors**
1. **Automation-First UI Patterns** - AI suggestions must be primary content (70% visual weight)
2. **Role-Based Information Hierarchy** - Each role sees relevant intelligence prominently
3. **Integrated Onboarding Flow** - Trial deliverables seamlessly transition to dashboard experience  
4. **Enterprise Visual Quality** - Professional sophistication justifying $299-$2999 pricing

### **Primary Development Tasks**

#### **1. Marketing Director Strategic Dashboard**
**Layout:** F-Pattern executive scanning with strategic decision focus
**Primary Content:** 
- Budget reallocation opportunities with one-click approval
- Team performance overview with drill-down capability
- Cross-channel ROI analysis with AI optimization suggestions
- Strategic market opportunities with competitive intelligence

**Success Criteria:**
- Strategic decisions completable in under 5 minutes
- AI recommendations visually dominant (70% screen space)
- Executive-level insights without operational clutter
- Mobile-responsive for on-the-go approvals

#### **2. Content Manager Production Interface** 
**Layout:** Z-Pattern production workflow optimization
**Primary Content:**
- Today's review queue with AI SEO scoring
- Content calendar with performance predictions
- Bulk operations for efficient content management
- AI enhancement suggestions at point of creation

**Success Criteria:**
- Production workflow reduces manual steps by 60%
- AI content optimization integrated inline (not sidebar)
- Collaborative review process with approval workflows
- Real-time performance feedback during content creation

#### **3. Trial-to-Dashboard Integration**
**Onboarding Data Flow:**
- Company analysis → Pre-populated competitive intelligence dashboard
- Generated PR draft → Media opportunities and journalist matching
- Content outline → Production calendar with AI optimization
- Keyword research → SEO monitoring and opportunity tracking

**Conversion Integration:**
- Natural upgrade prompts within workflow (not popup interruptions)
- Feature limit demonstrations that show value, not frustration
- Strategic FOMO triggers based on usage patterns and success metrics

---

## AUTOMATION-FIRST VALIDATION CRITERIA

### **Required UI Patterns**
**ALWAYS implement:**
- AI suggestions as primary interface content
- User actions responding to AI recommendations  
- Proactive intelligence appearing at decision points
- Contextual automation surfacing when relevant
- Workflows where AI drives interaction, users approve/modify

**NEVER implement:**
- "AI Assistant" sidebar panels or chat interfaces
- Separate recommendation widgets competing with main content
- Generic dashboard cards with "AI insights" sections
- Traditional form-heavy interfaces when AI can provide defaults
- Manual query interfaces that require users to ask AI questions

### **Role-Specific Success Validation**

#### **Marketing Director Interface**
- [ ] Strategic recommendations appear as primary content
- [ ] Budget optimization suggestions with one-click implementation
- [ ] Team performance insights drive immediate actions
- [ ] Competitive intelligence integrated contextually
- [ ] Executive-level reporting without operational noise

#### **Content Manager Interface**  
- [ ] AI SEO optimization appears inline during content creation
- [ ] Production bottlenecks surfaced proactively with solutions
- [ ] Content performance predictions influence planning decisions
- [ ] Bulk operations reduce repetitive manual tasks
- [ ] Team collaboration workflows streamlined through AI assistance

#### **General Automation Validation**
- [ ] Primary actions respond to AI suggestions (not user queries to AI)
- [ ] Intelligence appears contextually when relevant (not on demand)
- [ ] Manual controls available but visually de-emphasized
- [ ] Workflow progression guided by AI insights
- [ ] User role determines information hierarchy and feature prominence

---

## CONTEXT LOADING STRATEGY

### **Phase 1 Development Context**
**Load For All UI Development:**
```
CLAUDE-CORE.md + CLAUDE-UX-ARCHITECTURE.md + CLAUDE-PHASE-FOCUS.md
Total: ~10K tokens optimal for focused development
```

**Content Focus:**
- Technical foundation and design system constraints
- Role-based dashboard specifications and automation-first patterns
- Current phase priorities and validation criteria
- Onboarding integration requirements

### **Context Loading Rules**

#### **For Dashboard Component Development**
**Required Context:**
- `CLAUDE-CORE.md` - Design system, component patterns, quality standards
- `CLAUDE-UX-ARCHITECTURE.md` - Role-specific layouts, information hierarchy
- `CLAUDE-PHASE-FOCUS.md` - Current priorities and validation criteria

**Optional Addition (if complex):**
- `CLAUDE-DATA-CONTRACTS.md` - When building data-heavy components

#### **For Backend Integration Tasks**
**Required Context:**
- `CLAUDE-CORE.md` - Technical foundation and integration points  
- `CLAUDE-DATA-CONTRACTS.md` - Database schemas and API contracts
- `CLAUDE-PHASE-FOCUS.md` - Current integration priorities

#### **For AI Feature Development**
**Required Context:**
- `CLAUDE-CORE.md` - Technical constraints and quality standards
- `CLAUDE-AI-ORCHESTRATION.md` - AI strategy, prompts, cost controls  
- `CLAUDE-PHASE-FOCUS.md` - Current AI implementation priorities

### **Context Loading Validation**
- **Token Budget:** Keep total context under 12K tokens for optimal performance
- **Relevance Check:** Every loaded file must directly support current development task
- **Phase Alignment:** Context must prioritize current phase objectives

---

## MCP VISUAL VALIDATION REQUIREMENTS

### **Automated Testing Criteria**
All components developed in this phase must pass:

#### **Automation-First Pattern Tests**
```typescript
test('AI suggestions dominate interface visually', async ({ page }) => {
  const aiContent = page.locator('[data-pattern="ai-primary"]');
  const manualContent = page.locator('[data-pattern="manual-secondary"]');
  
  const aiSize = await aiContent.boundingBox();
  const manualSize = await manualContent.boundingBox();
  
  // AI content must occupy 70% or more of interface space
  expect(aiSize.height + aiSize.width).toBeGreaterThan(
    (manualSize.height + manualSize.width) * 2.3
  );
});

test('Role-specific information hierarchy respected', async ({ page }) => {
  // Marketing Director should see strategic content prominently
  const strategicContent = page.locator('[data-tier="critical"]');
  const operationalContent = page.locator('[data-tier="operational"]');
  
  await expect(strategicContent).toBeVisible();
  await expect(strategicContent).toBeInViewport();
  
  // Operational content should be secondary or hidden
  const operationalVisible = await operationalContent.isVisible();
  expect(operationalVisible).toBe(false);
});
```

#### **Quality Gate Requirements**
- [ ] **Performance:** Page loads under 2 seconds on P50
- [ ] **Accessibility:** WCAG 2.1 AA compliance verified
- [ ] **Responsive:** Professional appearance on mobile/tablet
- [ ] **Enterprise Polish:** Visual sophistication justifying premium pricing

---

## PHASE COMPLETION CRITERIA

### **Week 1 Deliverables**
- [ ] Marketing Director dashboard with automation-first patterns
- [ ] Content Manager interface with production workflow optimization
- [ ] Trial onboarding integration with dashboard personalization
- [ ] MCP tests passing for all automation-first pattern requirements

### **Phase 1 Success Metrics**
- [ ] All role-based dashboards implemented with proper information hierarchy
- [ ] AI suggestions appear as primary content across all interfaces
- [ ] Onboarding data flows seamlessly into dashboard personalization
- [ ] Enterprise visual quality achieved (no generic SaaS appearance)
- [ ] Conversion triggers naturally integrated within workflow
- [ ] Performance standards met: <2s load times, WCAG 2.1 AA compliance

---

## PHASE 2 PREVIEW (Weeks 2-4)

### **Advanced Features Integration**
**Priority:** Implement competitive differentiation features

#### **CiteMind™ Engine Integration**
- AI citation tracking across ChatGPT, Claude, Perplexity, Gemini
- Authority building dashboard with E-E-A-T scoring
- Competitive AI presence monitoring
- Content optimization for AI platform discovery

#### **Media Database Intelligence**
- 500K+ journalist database with AI matching algorithms
- Relationship scoring and compatibility analysis
- Personalized pitch generation with success probability
- Advanced HARO intelligence and opportunity detection

#### **Cross-Pillar Attribution**
- Unified performance tracking across Content + PR + SEO
- Predictive analytics for campaign optimization
- Automated budget reallocation recommendations
- Executive-level ROI reporting with competitive benchmarks

### **Phase 2 Context Loading**
```
CLAUDE-CORE.md + CLAUDE-DATA-CONTRACTS.md + CLAUDE-AI-ORCHESTRATION.md
Total: ~12K tokens for advanced feature development
```

---

## DEVELOPMENT WORKFLOW OPTIMIZATION

### **Context Switching Strategy**
**For UI Components:**
1. Load CLAUDE-CORE.md + CLAUDE-UX-ARCHITECTURE.md + CLAUDE-PHASE-FOCUS.md
2. Focus on automation-first patterns and role-specific requirements
3. Validate against enterprise quality standards
4. Ensure mobile responsiveness and accessibility compliance

**For Backend Features:**
1. Load CLAUDE-CORE.md + CLAUDE-DATA-CONTRACTS.md + CLAUDE-PHASE-FOCUS.md
2. Implement database schemas and API endpoints
3. Enforce multi-tenant security and performance requirements
4. Test integration points and error handling

**For AI Integration:**
1. Load CLAUDE-CORE.md + CLAUDE-AI-ORCHESTRATION.md + CLAUDE-PHASE-FOCUS.md
2. Implement cost-controlled AI workflows
3. Test prompt templates and response quality
4. Validate token budgets and fallback mechanisms

### **Quality Assurance Integration**
**Continuous Validation:**
- MCP visual tests run on every component commit
- Performance budgets enforced in CI/CD pipeline
- Accessibility scanning automated for all new interfaces
- Enterprise design review required for customer-facing components

**Manual Review Gates:**
- Automation-first pattern verification by senior developer
- Role-based information hierarchy validated by UX lead
- AI suggestion quality reviewed by product team
- Conversion flow optimization approved by growth team

---

## CRITICAL SUCCESS FACTORS

### **Non-Negotiable Requirements**
1. **AI-First Interface:** Every user interaction must feel powered by intelligence
2. **Role-Based Optimization:** Information hierarchy must match user priorities
3. **Enterprise Quality:** Visual sophistication justifying premium pricing
4. **Conversion Integration:** Upgrade opportunities naturally embedded in workflow
5. **Performance Standards:** Sub-2-second load times with perfect accessibility

### **Competitive Differentiation Validation**
- [ ] **CiteMind™ Integration:** AI citation tracking operational across 4+ platforms
- [ ] **Media Intelligence:** 500K+ database with AI matching and compatibility scoring
- [ ] **Cross-Pillar Attribution:** Unified analytics with predictive optimization
- [ ] **Automation Backend:** AUTOMATE methodology operating invisibly
- [ ] **Strategic FOMO:** Natural upgrade triggers achieving 40%+ conversion rates

### **Market Readiness Criteria**
- [ ] **Professional Polish:** Interface quality matching enterprise expectations
- [ ] **Unique Value Delivery:** Clear competitive advantages impossible to replicate
- [ ] **Conversion Optimization:** Trial-to-paid flow achieving target conversion rates
- [ ] **Scalability Foundation:** Architecture supporting rapid user growth
- [ ] **Cost Control:** AI usage costs within sustainable unit economics

This phase-focused approach ensures development energy concentrates on the highest-impact automation-first interfaces while building toward the advanced competitive features that create an impossible-to-replicate market position.
