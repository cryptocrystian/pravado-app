# CLAUDE-UX-ARCHITECTURE.md
## Role-Based Interface Architecture & Integrated Onboarding Strategy

---

## STRATEGIC UX APPROACH

**Core Philosophy:** Automation-first interfaces where AI drives workflow and users provide approval/direction. Every role sees AI intelligence as primary content, not supplementary features.

**Information Architecture:** 4-tier system with role-specific prioritization:
- **Tier 1 (Primary):** Critical decisions and today's actions - 70% visual weight
- **Tier 2 (Secondary):** Performance monitoring and trends - 20% visual weight  
- **Tier 3 (Tertiary):** Strategic insights and analysis - 8% visual weight
- **Tier 4 (Contextual):** AI recommendations and opportunities - 2% persistent presence

---

## INTEGRATED ONBOARDING STRATEGY

### Two-Tiered Onboarding System

#### **Trial Onboarding (10 minutes)**
**Goal:** Immediate value delivery with cost control

**Flow Pattern:**
1. **Role Identification (1 min)** - Smart role detection based on job title, company size
2. **Company Intelligence Gathering (2 min)** - AI analyzes website, competitors during setup
3. **Goal-Based Customization (3 min)** - Pillar priorities (PR/Content/SEO weighting)
4. **Launch Blueprint Generation (4 min)** - AI creates concrete deliverables:
   - 1 PR draft tailored to company
   - 1 content outline with SEO optimization
   - 5 keyword opportunities with ranking potential
   - GEO snapshot showing AI platform presence

**Data Storage:** `tenants.settings`, initial `campaigns`, `seo_keywords`, draft `content_pieces`

#### **Paid Onboarding (25-35 minutes)**
**Goal:** Complete platform configuration and team setup

**Extended Configuration:**
- Brand voice modeling and approval workflows
- Team member roles and permissions
- Integrations (GA4, Search Console, social accounts)
- Background job initialization (site indexing, competitor analysis)

**Seamless Transition Pattern:**
Trial deliverables become foundation for paid platform setup, maintaining continuity and demonstrating immediate ROI from trial investment.

---

## ROLE-BASED DASHBOARD SPECIFICATIONS

### **MARKETING DIRECTOR - Strategic Command Center**

#### **Information Hierarchy:**
- **Tier 1 Critical:** Budget reallocation opportunities, team approvals, campaign launches
- **Tier 2 Monitoring:** Cross-channel ROI trends, team productivity, competitive shifts
- **Tier 3 Strategic:** Market opportunities, long-term planning insights
- **Tier 4 AI:** Executive-level recommendations for strategic pivots

#### **Layout Pattern:** F-Pattern (Executive Scanning)
```
┌─ STRATEGIC OVERVIEW ──────────────────┬─ TEAM PERFORMANCE ─────┐
│ "Campaign X budget reallocation:      │ Team Productivity: 87%  │
│ Move $3.2K Social→PR for 28% pipeline │ ↑12% vs last month     │
│ improvement. ROI: +$47K projected"    │                        │
│ [Approve Changes] [View Analysis]     │ [View Team Details]    │
├───────────────────────────────────────┼────────────────────────┤
│ BUDGET TRACKER                        │ AI STRATEGIC INSIGHTS  │
│ Allocated: $125K | Remaining: $38K    │ Market opportunity:     │
│ Top performer: PR (340% ROI)          │ "Tech leadership gap"  │
│ Underperformer: Social (45% ROI)      │ Conference speaking    │
│ [Reallocate Budget]                   │ opportunities ready    │
└───────────────────────────────────────┴────────────────────────┘
```

#### **Automation-First Patterns:**
- **Primary Action:** AI-identified optimization with one-click approval
- **Proactive Alerts:** "Budget reallocation opportunity detected"
- **Strategic Recommendations:** Board-ready insights with competitive intelligence
- **Team Coordination:** Approval queues with context for quick decisions

### **CONTENT MANAGER - Production Command Center**

#### **Information Hierarchy:**
- **Tier 1 Critical:** Content review queue, publishing deadlines, team bottlenecks
- **Tier 2 Monitoring:** Content performance trends, engagement metrics, calendar health
- **Tier 3 Strategic:** Content audit insights, seasonal opportunities
- **Tier 4 AI:** Content optimization and trend-based suggestions

#### **Layout Pattern:** Z-Pattern (Production Workflow)
```
┌─ TODAY'S PRODUCTION QUEUE ────────────────────────────────────────┐
│ URGENT: 3 pieces need review before 2PM deadline                  │
│ • "AI Marketing Trends" - Draft complete, SEO score: 89/100       │
│   [Approve & Schedule] [Request Changes] [Add to Social Queue]    │
│ • "Customer Success Stories" - Images pending                     │
│ • "Q4 Strategy Guide" - Legal review required                     │
├────────────────────────────┬───────────────────────────────────────┤
│ CONTENT CALENDAR           │ PERFORMANCE INSIGHTS                  │
│ This Week: 8 pieces        │ Top Performer: "Scaling Guide"       │
│ ↳ 5 published             │ 2.3K views, 89% engagement           │
│ ↳ 2 in review             │ AI Suggestion: Create 3 similar      │
│ ↳ 1 draft                 │ pieces for scaling series             │
│ Next Week: 6 scheduled     │ [Generate Similar Content]           │
└────────────────────────────┴───────────────────────────────────────┘
```

#### **Automation-First Patterns:**
- **Bulk Operations:** Multi-select for content actions
- **AI Enhancement:** Real-time SEO scoring during content creation
- **Workflow Automation:** Automatic social media variants generation
- **Collaborative Reviews:** Inline commenting with approval workflows

### **PR MANAGER - Relationship Intelligence Center**

#### **Information Hierarchy:**
- **Tier 1 Critical:** Media opportunities, urgent outreach, journalist responses
- **Tier 2 Monitoring:** Coverage tracking, relationship health, campaign performance
- **Tier 3 Strategic:** Journalist intelligence, outlet analysis, competitor coverage
- **Tier 4 AI:** Pitch optimization and timing recommendations

#### **Layout Pattern:** Grid Pattern (Relationship Management)
```
┌─ MEDIA OPPORTUNITIES ─────────────────────────────────────────────┐
│ ⚡ URGENT: TechCrunch seeking AI automation stories (2 hours left) │
│ Match Score: 94% | Journalist: Sarah Miller | Response Rate: 78%  │
│ AI Pitch: "Your recent article on automation trends aligns       │
│ perfectly with our new AI marketing platform launch..."          │
│ [Send Personalized Pitch] [Customize Message] [Add to Queue]     │
├────────────────────────┬──────────────────────────────────────────┤
│ RELATIONSHIP SCORECARD │ COVERAGE TRACKING                        │
│ Top Contacts (This Q): │ This Month: 12 mentions                 │
│ • Sarah Miller (TC)    │ Sentiment: 89% positive                 │
│   Engaged 3x, 100%    │ Media Value: $47K                       │
│   response rate        │                                          │
│ • John Doe (VB)        │ Top Coverage:                            │
│   Last contact: 2 wks  │ "Revolutionary platform" - TechCrunch   │
│ [View All Contacts]    │ [View Coverage Report]                  │
└────────────────────────┴──────────────────────────────────────────┘
```

#### **Automation-First Patterns:**
- **Smart Matching:** AI-powered journalist compatibility scoring
- **Automated Personalization:** Pitch generation based on journalist history
- **Relationship Tracking:** Interaction history with success predictions
- **Opportunity Detection:** Real-time HARO and media request matching

### **SEO SPECIALIST - Technical Optimization Center**

#### **Information Hierarchy:**
- **Tier 1 Critical:** Technical issues, ranking drops, indexation problems
- **Tier 2 Monitoring:** Keyword performance, traffic trends, competitor movement
- **Tier 3 Strategic:** Site health analysis, content gaps, link opportunities
- **Tier 4 AI:** Technical recommendations and optimization suggestions

#### **Layout Pattern:** List Pattern (Task Prioritization)
```
┌─ CRITICAL ISSUES REQUIRING ATTENTION ─────────────────────────────┐
│ 🔴 URGENT: Core Web Vitals failing on 12 pages                    │
│    Impact: Rankings dropped 15% for target keywords              │
│    AI Solution: Identified image optimization + JS minification  │
│    [Implement Fix] [View Technical Details] [Monitor Progress]   │
│                                                                   │
│ 🟡 Page Speed: Homepage LCP increased to 4.2s                    │
│    Recommendation: Lazy load hero video, defer non-critical JS   │
│    [Apply Recommendations] [Custom Solution]                     │
├───────────────────────────────────────────────────────────────────┤
│ KEYWORD PERFORMANCE                    │ GEO TRACKING             │
│ Top Gainers This Week:                │ AI Platform Presence:    │
│ • "marketing automation" +7 positions │ ChatGPT: Featured 67%    │
│ • "content strategy" +12 positions    │ Claude: Mentioned 34%    │
│                                       │ Perplexity: Listed 89%   │
│ Action Items: 8 optimization tasks    │ [Optimize for AI]        │
│ [View Full Report]                    │                          │
└───────────────────────────────────────┴──────────────────────────┘
```

#### **Automation-First Patterns:**
- **Progressive Disclosure:** Technical details available on demand
- **Automated Monitoring:** Real-time alerts for ranking changes
- **AI Optimization:** Automated technical recommendations
- **Performance Tracking:** Visual trend indicators with actionable insights

---

## CROSS-ROLE COLLABORATION INTERFACES

### **Unified Campaign Workspace**
```
┌─ CAMPAIGN: "Product Launch Q4" ───────────────────────────────────┐
│ Status: Active | Timeline: 45 days | Budget: $85K | ROI: +127%    │
├─────────────────┬─────────────────┬─────────────────┬─────────────┤
│ CONTENT (Alex)  │ PR (Maria)      │ SEO (David)     │ AI INSIGHTS │
│ ✅ Blog series  │ ⏳ Press kit    │ 📊 Keyword     │ Campaign is │
│ 5/5 published  │ In review       │ tracking active │ performing  │
│                 │                 │                 │ 23% above   │
│ ⏳ Social       │ ✅ Media list   │ ⏳ Technical    │ projections │
│ 3/8 scheduled   │ 47 contacts     │ SEO audit       │             │
│                 │ ready           │ In progress     │ [View AI    │
│ [View Details]  │ [View Details]  │ [View Details]  │ Analysis]   │
└─────────────────┴─────────────────┴─────────────────┴─────────────┘
```

### **Real-Time Handoff Notifications**
- **Content → PR:** "Blog post published, media angles ready for outreach"
- **PR → SEO:** "Coverage secured, backlink opportunities identified"
- **SEO → Content:** "Ranking improvements, content gap opportunities found"

---

## ONBOARDING INTEGRATION WITH DASHBOARD DESIGN

### **Onboarding Data Flow to Dashboard Personalization**

#### **Trial Data Collection → Role-Specific Defaults**
1. **Company Analysis** → Pre-populated competitive intelligence
2. **Goal Selection** → Customized KPI emphasis per role
3. **Pillar Priorities** → Information hierarchy weighting
4. **Generated Deliverables** → Dashboard preview content

#### **Seamless Transition Patterns**
- **Marketing Director:** Trial budget analysis becomes ongoing budget tracker
- **Content Manager:** Generated content outline populates production calendar
- **PR Manager:** Media analysis feeds relationship scorecard
- **SEO Specialist:** Keyword research becomes monitoring dashboard

### **Conversion Touchpoints**
Embedded naturally within dashboard workflows:
- **Feature Limits:** "Unlock advanced team collaboration in Professional tier"
- **AI Capabilities:** "Premium AI would provide deeper competitive analysis"
- **Database Access:** "Professional tier includes 25K+ verified media contacts"

---

## MOBILE RESPONSIVE PATTERNS

### **Progressive Disclosure for Mobile**
- **Dashboard Summaries:** Key metrics and urgent actions only
- **Drill-Down Navigation:** Tap to expand detailed analysis
- **Touch-Optimized Actions:** Large approval buttons, swipe actions
- **Offline Capability:** Critical functions work without connection

### **Role-Specific Mobile Priorities**
- **Marketing Director:** Executive summary with approval actions
- **Content Manager:** Review queue with quick approve/reject
- **PR Manager:** Media opportunities with one-tap responses
- **SEO Specialist:** Critical issues with immediate fixes

---

## CRITICAL SUCCESS VALIDATION

### **Automation-First Interface Requirements**
1. **AI Primary:** Recommendations dominate 70% of interface space
2. **User Responsive:** Primary actions respond to AI suggestions
3. **Contextual Intelligence:** AI appears at natural decision points
4. **Proactive Insights:** Platform anticipates needs vs. reactive queries

### **Role-Specific Success Criteria**
- **Marketing Director:** Can make strategic decisions in under 5 minutes
- **Content Manager:** Production workflow reduces manual steps by 60%
- **PR Manager:** Media outreach success rate improves by 40%
- **SEO Specialist:** Technical issues identified and resolved 3x faster

This architecture ensures every role experiences AI-driven workflows while maintaining the professional sophistication required for enterprise adoption and premium pricing justification.
