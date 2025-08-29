# Agentic Development Workflow

> **Safe, Repeatable, Autonomous**: A comprehensive testing and validation system for PRAVADO UI changes.

## Overview

The Agentic Development Workflow provides automated guardrails and validation for UI changes, ensuring that future modifications are safe, consistent, and maintain the design system integrity. This system combines MCP (Model Contract Protocol) testing, UI auditing, and comprehensive CI/CD validation.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Server    │    │   UI Auditing    │    │  CI Pipeline    │
│   (Playwright)  │    │   (Color/Style)  │    │   (GitHub)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────────┐
                    │  Agentic Foundation │
                    │  Contract Testing   │
                    └─────────────────────┘
```

## Components

### 1. MCP Server + Test Runner

**Location**: `scripts/mcp/`

The MCP (Model Contract Protocol) server provides automated testing for UI contracts using Playwright. It validates:

- **Data surface markers**: All dashboard sections must have `[data-surface="content"]`
- **Sticky positioning**: Operations rail maintains `position: sticky` at `lg` breakpoint
- **Responsive grids**: AI recommendations become 2-column at ≥1024px
- **Content validation**: No blank islands (each band has ≥1 visible row/card)

#### Key Files:

- `scripts/mcp/playwright.config.ts` - MCP-optimized Playwright configuration
- `scripts/mcp/assertions.spec.ts` - Contract validation tests
- `scripts/mcp/global-setup.ts` - Pre-test environment setup

### 2. UI Audit System

**Location**: `scripts/ui/`

Automated style and color compliance checking with strict enforcement of:

#### Forbidden Patterns:
- ❌ **Gradients**: No `linear-gradient`, `radial-gradient`, or Tailwind gradient classes
- ❌ **Raw colors**: No hex (`#fff`) or RGB values in source code
- ❌ **Dashboard white**: No `bg-white` on dashboard routes (dark theme only)
- ❌ **Generic blues**: No `text-blue-*` classes (use semantic tokens)

#### Key Files:

- `scripts/ui/audit-colors.mjs` - Color compliance scanner
- `.github/workflows/ui-audit.yml` - Dedicated UI audit pipeline

### 3. Comprehensive CI Pipeline

**Location**: `.github/workflows/ci.yml`

Multi-stage validation with intelligent caching:

```yaml
install-and-cache → [typecheck, unit-tests, ui-audit] → playwright-e2e → mcp-assertions → build → summary
```

#### Features:
- **Smart caching**: Node modules and Playwright browsers
- **Parallel execution**: Independent test suites run concurrently
- **Artifact collection**: Screenshots, reports, and build outputs
- **Matrix testing**: Cross-browser validation (Chromium, Firefox, WebKit)
- **Failure isolation**: Individual test failures don't block other suites

## Local Development

### Prerequisites

```bash
# Install dependencies
cd apps/web
npm install

# Install Playwright browsers (if not cached)
npx playwright install
```

### Running Tests Locally

#### 1. UI Audit
```bash
# Run color and style compliance check
npm run ui:audit

# Output: scripts/ui/audit-results.json
```

#### 2. End-to-End Tests
```bash
# Run full E2E test suite
npm run test:e2e

# Run specific browser
npm run test:e2e -- --project=chromium

# Run in headed mode (see browser)
npm run test:e2e -- --headed
```

#### 3. MCP Contract Tests
```bash
# Run MCP assertions only
npm run mcp:run

# Debug mode with trace
npm run mcp:run -- --trace=on
```

#### 4. Development Server
```bash
# Start dev server (required for E2E tests)
npm run dev
# Server runs on http://localhost:5173
```

### Debugging Failed Tests

#### Screenshots and Videos
Failed tests automatically generate:
- **Screenshots**: `scripts/mcp/test-results/*.png`
- **Videos**: `scripts/mcp/test-results/*.webm` 
- **Traces**: `scripts/mcp/test-results/*.zip`

#### Viewing Reports
```bash
# Open HTML report
npx playwright show-report scripts/mcp/playwright-report/

# View trace files
npx playwright show-trace scripts/mcp/test-results/trace.zip
```

#### Common Issues

**1. Port conflicts**
```bash
# Kill existing dev servers
pkill -f "vite|npm run dev"
npm run dev
```

**2. Stale browser cache**
```bash
# Clear Playwright cache
npx playwright install --force
```

**3. Viewport issues**
```bash
# Test specific viewport
npm run test:e2e -- --project="Mobile Chrome"
```

## CI Pipeline Details

### Triggers
- **Push**: `main`, `feat/*` branches
- **Pull Request**: Against `main`
- **Paths**: UI files (`apps/web/src/**`, `tailwind.config.ts`)

### Jobs Overview

| Job | Purpose | Artifacts |
|-----|---------|-----------|
| `install-and-cache` | Dependency management & caching | Node modules, Playwright browsers |
| `typecheck` | TypeScript validation | None |
| `unit-tests` | Component testing | Coverage reports |
| `ui-audit` | Color/style compliance | Audit results JSON |
| `playwright-e2e` | Cross-browser testing | Screenshots, videos, traces |
| `mcp-assertions` | Contract validation | MCP test results |
| `build` | Production build verification | Build artifacts |
| `summary` | Results aggregation | GitHub summary |

### Cache Strategy

**Node Modules**: `~/.cache/node-modules/${{ hashFiles('package-lock.json') }}`
**Playwright**: `~/.cache/ms-playwright/${{ hashFiles('package-lock.json') }}`

Cache invalidation happens automatically when dependencies change.

### Artifact Retention

- **Screenshots/Videos**: 7 days
- **Test Reports**: 7 days  
- **Coverage**: 7 days
- **Build Assets**: 7 days
- **UI Audit**: 30 days

## Writing Agentic Tests

### MCP Assertion Patterns

```typescript
// Contract: Data surface validation
test('Dashboard sections have data-surface="content" markers', async ({ page }) => {
  const contentSurfaces = page.locator('[data-surface="content"]')
  await expect(contentSurfaces).toHaveCount(4, { timeout: 15000 })
  
  // Verify each surface is visible
  const surfaces = await contentSurfaces.all()
  for (const surface of surfaces) {
    await expect(surface).toBeVisible()
  }
})

// Contract: Responsive behavior
test('AI recommendations grid becomes 2 columns at ≥1024px', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 800 })
  
  const gridColumns = await aiRecsGrid.evaluate((el) => {
    return window.getComputedStyle(el).gridTemplateColumns
  })
  
  expect(gridColumns).toMatch(/(repeat\(2|1fr 1fr)/)
})
```

### Best Practices

#### 1. Use Data Test IDs
```tsx
// Good: Semantic, stable identifiers
<div data-testid="ai-recommendations">
<button data-testid="approve-recommendation">

// Avoid: Class-based selectors (brittle)
<div className="recommendations-grid">
```

#### 2. Wait for Stability
```typescript
// Wait for network idle before assertions
await page.waitForLoadState('networkidle')

// Use explicit waits
await expect(element).toBeVisible({ timeout: 10000 })
```

#### 3. Capture Context
```typescript
// Take screenshots for verification
await page.screenshot({ 
  path: 'test-results/feature-validation.png',
  fullPage: true 
})

// Add console logs for debugging
console.log(`Found ${count} elements matching criteria`)
```

### Adding New Contracts

1. **Identify the contract**: What UI behavior must be preserved?
2. **Write the test**: Add to `scripts/mcp/assertions.spec.ts`
3. **Add data attributes**: Update components with `data-testid` or `data-surface`
4. **Validate locally**: Run `npm run mcp:run`
5. **Commit with tests**: Include both test and implementation

## Color System Compliance

### Semantic Color Tokens

```css
/* Use these instead of raw colors */
:root {
  --ai-teal: hsl(180, 100%, 33%);      /* #00A8A8 */
  --premium-gold: hsl(43, 87%, 45%);   /* #D4A017 */
  --success: hsl(120, 61%, 34%);       /* #22C55E */
  --warning: hsl(38, 92%, 50%);        /* #F59E0B */
  --danger: hsl(0, 84%, 60%);          /* #EF4444 */
}
```

### Allowed vs Forbidden

✅ **Allowed**:
```css
/* Semantic tokens */
color: hsl(var(--ai-teal));
background: hsl(var(--premium-gold));

/* Tailwind semantic classes */
.text-ai-teal
.bg-premium-gold
.border-success
```

❌ **Forbidden**:
```css
/* Raw hex values */
color: #00A8A8;
background: #D4A017;

/* Raw RGB */
color: rgb(0, 168, 168);

/* Gradients */
background: linear-gradient(to right, #00A8A8, #D4A017);

/* Generic blue classes */
.text-blue-500
```

### Dashboard-Specific Rules

On dashboard routes (`/dashboard`, `/analytics`, etc.):
- ❌ No `bg-white` (breaks dark theme)
- ✅ Use `bg-slate-900`, `bg-gray-900`, or theme-aware backgrounds
- ✅ Ensure proper contrast ratios

## Performance Targets

### Test Execution Times

| Test Suite | Target | Actual |
|------------|---------|---------|
| UI Audit | < 30s | ~15s |
| MCP Assertions | < 2min | ~90s |
| E2E Suite (single browser) | < 5min | ~3min |
| Full CI Pipeline | < 10min | ~8min |

### Page Load Targets

- **Dashboard**: < 3s (tested in MCP)
- **Content routes**: < 2s  
- **Time to Interactive**: < 2s

## Monitoring and Alerts

### CI Notifications

Failed tests generate:
- **GitHub PR comments** with violation details
- **Artifact uploads** with screenshots and traces
- **Status checks** that block PR merging

### Local Notifications

```bash
# UI audit violations
npm run ui:audit
# Exit code 1 if violations found

# Test failures  
npm run test:e2e
# Generates html report automatically
```

## Troubleshooting

### Common Issues

**Issue**: MCP tests fail with timeout
```bash
# Solution: Check dev server is running
npm run dev
# Then run tests in another terminal
```

**Issue**: UI audit false positives
```bash
# Solution: Add to allowed legacy files
# Edit scripts/ui/audit-colors.mjs
const ALLOWED_LEGACY_FILES = [
  'your-file.tsx' // Add here
]
```

**Issue**: Playwright browser issues
```bash
# Solution: Reinstall browsers
npx playwright install --with-deps
```

**Issue**: Port conflicts in CI
```bash
# Solution: CI uses different ports automatically
# Check webServer config in playwright.config.ts
```

### Getting Help

1. **Check logs**: CI job logs contain detailed error information
2. **Download artifacts**: Screenshots and traces from failed runs
3. **Run locally**: Reproduce issues with same commands as CI
4. **Trace mode**: Use `--trace=on` for detailed debugging

## Future Enhancements

### Planned Features

- [ ] **Visual regression testing** with screenshot comparison
- [ ] **Performance budgets** with lighthouse CI integration  
- [ ] **A11y testing** with axe-core automation
- [ ] **Component contract testing** for design system compliance
- [ ] **API contract testing** for backend integration validation

### Extensibility

The agentic foundation is designed to be extensible:

```typescript
// Add new contract types
interface UIContract {
  name: string
  validator: (page: Page) => Promise<boolean>
  errorMessage: string
}

// Register new audits
const customAudits = [
  new PerformanceAudit(),
  new AccessibilityAudit(),
  new SecurityAudit()
]
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run ui:audit` | Color compliance check |
| `npm run test:e2e` | Full E2E test suite |
| `npm run mcp:run` | Contract assertions only |
| `npm run dev` | Start development server |

**CI Status**: Check `.github/workflows/ci.yml` for latest pipeline configuration.

**Artifacts**: Download from GitHub Actions UI for failed test debugging.

**Documentation**: This file (`docs/Agentic-Dev.md`) is the canonical reference.

---

*Last updated: $(date) - Agentic Foundation v1.0*