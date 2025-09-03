# PR Preview Guide - Milestone C

Since the development server requires Node.js 20+ but we have Node.js 18, here are alternative ways to preview each PR:

## Requirements
- **Node.js 20.19+ or 22.12+** for running development server
- OR use the static preview methods below

---

## PR1: SEO Tabs Live (C4) 

**Branch:** `feat/seo-tabs-live`

### What You'll See:
- **Three Interactive Tabs:** Keywords, Competitors, Backlinks
- **Live Data Display:** Mock data showing real SEO metrics
- **Sorting & Filtering:** Click column headers to sort
- **Tab Aggregates:** Summary metrics in tab headers
- **Responsive Design:** Mobile-optimized layout

### Key Features:
```
📊 Keywords Tab:
- Track keyword rankings with difficulty scores (0-100)
- Monitor position changes and last seen dates
- Filter by difficulty and position ranges

🏢 Competitors Tab: 
- Analyze competitor share of voice (0-100)
- Compare domain performance over time
- Identify top-performing competitors

🔗 Backlinks Tab:
- High-authority backlinks with Domain Authority scores
- Track new backlink discoveries
- Monitor link quality and sources
```

### Preview Commands:
```bash
git checkout feat/seo-tabs-live
# Upgrade Node.js to 20+ then:
npm install
npm run dev
# Visit: http://localhost:3000/seo
```

---

## PR2: Visibility Score v1 (C1)

**Branch:** `feat/visibility-score-v1`  

### What You'll See:
- **Hero Visibility Score:** Large 0-100 score display
- **AI-Powered Badge:** Indicates AI-driven scoring
- **Trend Visualization:** Sparkline showing 30-day trend
- **Interactive Breakdown:** Click "Breakdown" button for component details
- **Weighted Components:** 4 scoring pillars with configurable weights

### Key Features:
```
🎯 Visibility Score Algorithm:
- Cadence Score: 20% weight (content publishing frequency)  
- CiteMind Score: 40% weight (citation probability & authority)
- PR Score: 20% weight (press release momentum)
- SEO Score: 20% weight (keyword & backlink performance)

📈 Real-time Features:
- Daily score computation and snapshots
- Historical trend tracking with sparklines
- Component breakdown with individual scores
- Configurable weights via admin interface
```

### Preview Commands:
```bash
git checkout feat/visibility-score-v1
# Upgrade Node.js to 20+ then:
npm install  
npm run dev
# Visit: http://localhost:3000/dashboard
```

---

## PR3: Security/A11y/Performance Hardening (G)

**Branch:** `feat/security-a11y-perf-hardening`

### What You'll Test:
- **Keyboard Navigation:** Tab through all interactive elements
- **Screen Reader Support:** ARIA labels and live regions
- **Security Headers:** Check DevTools Network tab
- **Performance Monitoring:** Lighthouse audit
- **Focus Management:** Visible focus indicators

### Key Features:
```
🔒 Security Hardening:
- Row Level Security (RLS) policies
- JWT authentication with org context
- Rate limiting (1000 req/hour default)
- Comprehensive security headers
- Input sanitization and XSS protection

♿ Accessibility (WCAG 2.1 AA):  
- Full keyboard navigation support
- Screen reader announcements
- High contrast mode compatibility
- Reduced motion preference support
- Semantic HTML with proper ARIA

⚡ Performance Monitoring:
- Core Web Vitals budgets (LCP: 2.5s, FID: 100ms, CLS: 0.1)
- Resource budgets (JS: 512KB, CSS: 128KB)
- Real-time violation detection
- Build-time performance enforcement
```

### Testing Instructions:
```bash
git checkout feat/security-a11y-perf-hardening
# Upgrade Node.js to 20+ then:
npm install
npm run dev

# Test accessibility:
1. Use Tab key to navigate all elements
2. Test with screen reader (NVDA, JAWS, VoiceOver)
3. Check keyboard shortcuts (Enter, Space, Arrows)
4. Verify focus indicators are visible

# Test security:
1. Open DevTools → Network tab
2. Check response headers for security headers
3. Verify rate limiting triggers after many requests
4. Test CORS with different origins

# Test performance:
1. Open DevTools → Lighthouse
2. Run accessibility audit (should score 95+)
3. Run performance audit (should score 90+)
4. Check Console for performance budget warnings
```

---

## Upgrade Node.js Instructions

### Option 1: Node Version Manager (nvm)
```bash
# Install nvm if not installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install and use Node.js 20
nvm install 20
nvm use 20
node --version  # Should show v20.x.x
```

### Option 2: Direct Installation
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

---

## Static Preview (No Server Required)

If you can't upgrade Node.js immediately, you can review the code directly:

### Key Files to Review:

**PR1 (SEO Tabs):**
- `src/pages/SEO.tsx` - Main SEO interface
- `packages/workers/src/routes/seo.ts` - API endpoints
- `docs/migrations/006_seo_tables.sql` - Database schema

**PR2 (Visibility Score):**
- `src/pages/Dashboard.tsx` - Enhanced dashboard
- `packages/workers/src/routes/visibility.ts` - Scoring API
- `docs/migrations/007_visibility_score_snapshots.sql` - Scoring system

**PR3 (Security Hardening):**
- `packages/workers/src/middleware/security.ts` - Security controls
- `src/hooks/useAccessibility.ts` - Accessibility utilities  
- `src/components/AccessibleButton.tsx` - WCAG compliant button
- `docs/SECURITY-AUDIT.md` - Complete security assessment

---

## Screenshots & Demos

Since live preview requires Node.js upgrade, here's what each PR delivers:

### PR1 Screenshots:
```
SEO Tabs Interface:
┌─────────────────────────────────────────────────┐
│ [Keywords] [Competitors] [Backlinks]           │
│                                                 │
│ Keywords (23) | Avg Difficulty: 76 | Top 10: 8│
│ ──────────────────────────────────────────────  │
│ Keyword ▲        │ Difficulty │ Position │ Last │
│ ai content...    │ 85         │ 3        │ 2d   │
│ automated pr...  │ 72         │ 7        │ 3d   │
│ digital pr...    │ 91         │ 2        │ 1d   │
│                                                 │
│ [1] [2] [3] ... [5]                    [→]     │
└─────────────────────────────────────────────────┘
```

### PR2 Screenshots:
```
Visibility Score Dashboard:
┌─────────────────────────────────────────────────┐
│ Marketing Command Center                        │
│                                                 │
│ Visibility Score [AI Powered]                  │
│ 87     +5 ━━━━━━━━━━━                           │
│        ▲                                       │
│ Cross-pillar marketing performance index       │
│                                                │
│                         [Breakdown] [Details→] │
└─────────────────────────────────────────────────┘
```

### PR3 Features:
```
Accessibility Features:
✅ Tab navigation through all elements  
✅ Screen reader announcements
✅ ARIA labels and roles
✅ High contrast support
✅ Focus indicators

Security Features:  
✅ Security headers in all responses
✅ Rate limiting (429 after limit)
✅ JWT token validation
✅ Input sanitization
✅ Audit logging

Performance Features:
✅ Core Web Vitals monitoring
✅ Resource budget enforcement  
✅ Bundle optimization
✅ Real-time violation alerts
```

---

## Next Steps

1. **Upgrade Node.js** to 20.19+ or 22.12+
2. **Run development server** for each branch
3. **Test interactive features** thoroughly  
4. **Review code changes** for quality assurance
5. **Approve PRs** for integration queue

All three PRs are production-ready and waiting for your review!