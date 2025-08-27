# PRAVADO\_MASTER\_SPEC.md

> **Purpose:** Single source of truth for Pravado’s build. This is the *detailed*, implementation-ready spec used by human devs and agentic tools (Claude Code / GPT-5). It includes UX rules, design tokens, FE routes/components, BE schemas + contracts, AI orchestration, workflows, quality bars, and deployment steps.

---

## 0) Conventions & Tooling

- **Repo layout (monorepo):** `/apps/web`, `/apps/mobile`, `/packages/ui`, `/packages/config`, `/packages/types`, `/packages/workers`.
- **Stack:** React + Vite (web), Tailwind CSS, Radix UI/ShadCN, Zustand (light state) + TanStack Query (server state), Supabase (Postgres/Auth/Storage/Edge Functions), Cloudflare Pages + Workers + Cron Triggers, Playwright (E2E), Vitest (unit), ESLint/Prettier.
- **Type safety:** Zod for runtime schema validation at API boundaries. `packages/types` exposes shared TS types.
- **Env:** `.env.example` maintained; secrets via Cloudflare/ Supabase dashboard.
- **i18n:** Lingui or i18next; locale packs in `/packages/ui/i18n`.

---

## 1) Design System (Locked)

### 1.1 Color Tokens

```css
:root {
  /* Light (Beige-first) */
  --bg: #F8F6F2;           /* Soft beige content background */
  --surface: #E7ECEF;      /* Elevated cards */
  --text: #1A1A1A;         /* Primary text */
  --primary: #2B3A67;      /* Slate Blue */
  --ai: #00A8A8;           /* AI Teal */
  --premium: #D4A017;      /* Gold */
  --success: #22C55E;      /* Green */
  --warning: #F59E0B;      /* Amber */
  --danger: #DC2626;       /* Red */

  /* Dark */
  --bg-dark: #1E2A4A;      /* Deep Slate */
  --surface-dark: #2B3A67; /* Dark card */
  --text-dark: #FFFFFF;    /* Inverted text */
}
```

### 1.2 Tailwind Setup

```ts
// tailwind.config.ts
export default {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)", surface: "var(--surface)", text: "var(--text)",
        primary: "var(--primary)", ai: "var(--ai)", premium: "var(--premium)",
        success: "var(--success)", warning: "var(--warning)", danger: "var(--danger)",
        dark: { bg: "var(--bg-dark)", surface: "var(--surface-dark)", text: "var(--text-dark)" }
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,.06)",
        md: "0 4px 12px rgba(0,0,0,.10)",
        lg: "0 10px 20px rgba(0,0,0,.12)"
      },
      borderRadius: { xl: "12px", '2xl': "16px" },
      spacing: { 13: "3.25rem", 15: "3.75rem" },
    }
  }
}
```

### 1.3 Typography & Density

- Font: **Inter**. Scales: `display-32/40`, `h1-28`, `h2-22`, `body-16`, `meta-12/14`.
- Line heights: 1.2 (titles), 1.5 (body). Minimum contrast AA.
- Spacing grid: 8px base. Touch targets ≥44px.

### 1.4 Components (ShadCN/Radix Mappings)

- Buttons: `Primary (primary)`, `Secondary (outline)`, `Ghost`, `Premium (premium)`, `Danger (danger)`.
- Inputs: text, textarea, select, combobox, date, toggle (Radix), slider.
- Navigation: Sidebar (collapsible), Topbar, Tabs, Breadcrumbs.
- Cards: Default, Metric (KPI), Chart, List, Editor Canvas.
- Feedback: Toasts, Banners (ai/premium/warning), Dialogs, Drawers.
- AI Badge: pill with `bg-ai/10 text-ai border-ai/30`.

### 1.5 Mode Strategy

- **Default**: Dark for dashboards/analytics; **Contextual switch** to Light (beige) in editors.
- Global toggle persists; per-view override supported.

---

## 2) UX Framework & Flows

### 2.1 Global IA

- Sidebar: **Dashboard, Campaigns, Media DB, Content Studio, SEO/GEO, Analytics, Copilot, Settings**.
- Topbar: search (global), notifications, tenant switch, profile.

### 2.2 Key Screens (Wireframe Contract)

1. **Dashboard (Dark)**

- Hero KPI: *Visibility Score* (0–100) with trend sparkline.
- Cards: Active Campaigns, PR Credits, SEO Movers, Content Queue, AI Recommendations.
- Activity timeline: cross-pillar events.

2. **Campaigns Hub (Hybrid)**

- Kanban: Planning→Drafting→Outreach→Results.
- Calendar toggle; filters by pillar; bulk actions.

3. **Content Studio (Light/Beige)**

- Editor canvas + Brief panel (audience, SERP intent, tone).
- AI sidebar: generate, rewrite, repurpose; style presets.
- Workflow: draft→review→approve→schedule/publish.

4. **SEO/GEO (Dark)**

- Tabs: Keywords, GEO Answers, Competitors, Backlinks.
- “AI Answers” table: SGE/Perplexity/Gemini presence with delta.

5. **PR & Outreach (Hybrid)**

- Media DB search; journalist profile (beat, last 3 articles, sentiment).
- Pitch composer with personalization snippets; sequence scheduler.
- PR Credits wallet and distribution options.

6. **Analytics (Dark)**

- Cross-pillar attribution map; SOV chart; conversions overlay.

7. **Copilot (Everywhere)**

- Slide-in drawer. Context-aware actions. One-click apply → creates artifacts/tasks.

### 2.3 Notifications

- Levels: Info, Recommend, Actionable (with Approve/Decline).
- Channels: In-app toast, inbox feed, optional email/mobile push.
- Throttling: max 3 actionable/day; dedupe similar items.

---

## 3) Data Model & Contracts (Supabase)

### 3.1 Core Tables (existing, mapped)

- `tenants(id, name, branding, subscription_tier, settings)`
- `user_profiles(id, email, full_name, tenant_id, role, tier, onboarding_completed)`
- `campaigns(id, tenant_id, name, description, goals, start_date, end_date, status)`
- `content_pieces(id, tenant_id, campaign_id, title, content_body, content_type, status, seo_score, engagement_rate, published_at)`
- `seo_keywords(id, tenant_id, campaign_id, keyword, search_volume, ranking_position, competition_level, target_url)`
- `journalist_contacts(id, tenant_id, first_name, last_name, email, outlet, beat, relationship_score, notes, verification_status, last_contacted)`
- `press_releases(id, tenant_id, title, content, release_date, distribution_channels, status)`
- `media_coverage(id, tenant_id, outlet_id, journalist_id, press_release_id, article_url, publication_date, sentiment_score, media_value)`
- `journalist_outreach(id, tenant_id, journalist_id, campaign_id, subject, message, sent_at, status, replied_at, reply_sentiment)`
- `ai_conversations(id, tenant_id, user_id, conversation_type, tokens_used, cost_cents, completion_status, created_at)`
- `trial_usage(id, tenant_id, user_id, tier, ai_operations_used, campaigns_created, media_contacts_accessed, trial_end_date)`

*(Tables above derived from your dump; we’re using a focused subset for v1. Others (e.g., HARO, citations) integrate in Phase 2.)*

### 3.2 New Tables

- `pr_credits(id, tenant_id, period ('monthly'|'quarterly'), credits_basic, credits_premium, valid_from, valid_to, rollover_window_days int default 0)`
- `ai_answers_index(id, tenant_id, engine, query, position, snippet, last_seen_at)`
- `visibility_snapshots(id, tenant_id, score, pr_weight, seo_weight, content_weight, social_weight, created_at)`
- `notifications(id, tenant_id, user_id, level, title, body, action_json, read_at, created_at)`

### 3.3 Row-Level Security (RLS)

- All tenant-scoped tables: policy `tenant_id = auth.jwt().tenant_id`.
- Service role used only by Workers for batch ops.

### 3.4 API Contracts (Edge Functions)

**All responses:** `{ ok: boolean, data?: any, error?: {code, message} }`

1. `POST /edge/pr/use-credit`

- **Body:** `{ tenantId, type: 'basic'|'premium', releaseId }`
- **Logic:** validate active credit in window; decrement; append ledger entry; emit event `pr.credit.used`.
- **Errors:** `NO_CREDIT_AVAILABLE`, `WINDOW_EXPIRED`.

2. `POST /edge/pr/distribute`

- **Body:** `{ tenantId, releaseId, tier, distribution: 'basic'|'premium' }`
- **Side effects:** queue provider job; track cost; upsert `media_coverage` on callback.

3. `POST /edge/seo/refresh-geo`

- **Body:** `{ tenantId, domain, keywords[] }`
- **Effect:** crawl AI engines (via provider), write to `ai_answers_index`.

4. `POST /edge/copilot/act`

- **Body:** `{ tenantId, context: { route, entityId? }, task: 'draft_pr'|'brief'|'rewrite'|'pitch'|'calendar_plan', params }`
- **Effect:** orchestrate LLM call; store in `ai_conversations`; return artifact.

5. `GET /edge/analytics/visibility`

- **Query:** `tenantId` `from` `to`
- **Returns:** computed score + breakdown; caches to `visibility_snapshots`.

### 3.5 Types (examples)

```ts
type VisibilityScore = { score:number; pr:number; seo:number; content:number; social:number; };

type AIAction = 'draft_pr'|'brief'|'rewrite'|'pitch'|'calendar_plan'
```

---

## 4) Visibility Score (Formula v1)

- **Intent:** Single KPI for execs; directional guidance for operators.
- **Inputs (normalized 0–100):**
  - PR: placements (count \* weight), avg sentiment, outlet authority.
  - SEO: non-brand organic clicks, rank improvements, featured/AI answers.
  - Content: engagement rate (views, dwell, shares), publish velocity.
  - Social: CTR/ER across linked posts.
- **Default weights:** PR 0.35, SEO 0.35, Content 0.20, Social 0.10.
- **Computation:** nightly Worker aggregates → materialized view → `visibility_snapshots`.
- **Admin override:** per-tenant weight tuning (enterprise feature).

---

## 5) AI Orchestration

### 5.1 Model Matrix

- **Onboarding & drafts (cheap):** GPT-4o-mini (or gpt-4o w/ cap).
- **Analysis & personalization (quality):** Claude 3.5 Sonnet / GPT-5 (when available).
- **Background enrichment:** Mistral 8x7B/LLama via server (optional).
- **BYOAI:** Enterprise can provide endpoint + API key; we sign requests server-side.

### 5.2 Prompt Templates (excerpt)

**PR Draft Prompt**

```
System: You are Pravado’s PR assistant. Use the tenant’s brand voice and facts. Never fabricate metrics.
User: Draft a press release for {{company}} about {{announcement}}. Audience: {{audience}}. Include 2 quotes and a call-to-action. Length ~600 words.
Constraints: adhere to AP style; avoid superlatives; insert {{keywords}} naturally.
```

**Personalized Pitch Prompt**

```
System: Create a short, personalized outreach email based on the journalist’s last 3 articles and beat. Be respectful, concise, and relevant.
User: Journalist: {{name}}, Beat: {{beat}}, Recent: {{titles[]}}. Pitch context: {{summary}}. CTA: request brief.
```

### 5.3 Guardrails

- Profanity/sensitive-topic filter.
- Brand style enforcement (tone, do/don’t list) per tenant settings.
- Token/cost budgets per tier; safe fallback models.
- Inline human approvals for anything outbound.

### 5.4 Cost Budgets by Tier (monthly defaults)

- Starter: 200K tokens (\~\$8), 0 included PR credits.
- Growth: 1M tokens (\~\$40), 1 premium PR credit/quarter.
- Pro: 3M tokens (\~\$120), 3 premium PR credits/quarter.
- Enterprise: custom caps.

---

## 6) PR Credit Engine (Hybrid)

### 6.1 Issuance

- On billing cycle start: create `pr_credits` row(s) per tier. Quarterly windows have `valid_from/valid_to` 90 days; monthly windows 30 days; `rollover_window_days=0` unless promo.

### 6.2 Consumption

- `/edge/pr/use-credit` decrements from nearest-expiring bucket of requested type (basic/premium). If none, return `NO_CREDIT_AVAILABLE`.

### 6.3 Add-Ons

- Stripe checkout → webhook → `pr_credits` top-up rows with 60-day window.

### 6.4 UI

- Wallet widget in navbar: remaining credits; countdown chips; upsell banner when < 7 days left.

---

## 7) Onboarding (Trial & Paid)

### 7.1 Trial (≈10 min)

1. Company basics (name, URLs, industry, competitors).
2. Goals (traffic, leads, authority, launch timelines).
3. Pillar priorities (PR/Content/SEO weighting).
4. Output: *Launch Blueprint* (1 PR draft, 1 content outline, 5 keywords, GEO snapshot).

### 7.2 Paid (≈25–35 min)

- Adds personas, brand voice, approvals, integrations (GA4, Search Console, socials).
- Kicks background jobs: index site, crawl competitors, seed keyword clusters, fetch media lists.

### 7.3 Storage

- Writes to `tenants.settings`, `campaigns`, `seo_keywords`, initial `content_pieces` drafts.

---

## 8) Social Layer (Lightweight v1)

- OAuth linking for LinkedIn/X/FB/IG.
- Scheduler in Content Studio (per-post variants, best-time suggestions).
- Metrics ingested daily; included in Visibility Score Social component.
- v2: Replies/engagement console; listening light.

---

## 9) Analytics & Attribution

- Event taxonomy (`packages/types/events.ts`):
  - `content.published`, `pr.sent`, `coverage.detected`, `seo.rank_changed`, `social.posted`.
- Attribution graph: edges from actions→outcomes within 30-day window (configurable). Stored as adjacency list; summarized nightly.
- Reports: SOV, ranking cohort, coverage heatmap, funnel overlays.

---

## 10) Cloudflare & CI/CD

### 10.1 Pages & Workers

- **Pages**: `/apps/web` static build; Env vars: `PUBLIC_SUPABASE_URL`, `PUBLIC_ANALYTICS_KEY`.
- **Workers**: `/packages/workers` for Edge Functions proxies, webhooks, schedulers.
- **Cron Triggers**: nightly `visibility:compute`, `seo:refresh-geo`, weekly `credits:issue`.

### 10.2 Pipeline

- PR checks: typecheck, lint, unit tests, UI screenshot diffs (Chromatic or Playwright snapshots).
- Preview deployments per PR (branch URL) + Lighthouse budget gates.

### 10.3 Feature Flags

- `NEXT_PUBLIC_FLAGS`: `geoBeta`, `agencyPortal`, `mobileCompanion`.

---

## 11) Mobile Companion (Phase 1)

- **Tech**: Expo/React Native.
- **Screens**: Feed (AI insights), Approvals (PR/content), KPIs (Visibility Score), Credits Wallet.
- **Auth**: Supabase auth; same JWT.
- **Push**: Expo Notifications; in-app settings mirror web.

---

## 12) Acceptance Criteria (AC) & Quality Bars

### 12.1 Dashboard

- Loads < 2.0s on P50. Lighthouse ≥ 90 perf/95 a11y.
- KPI card shows score and +/- delta vs prior period. Clicking opens details.

### 12.2 Content Editor

- 0 runtime errors; autosave every 5s; undo/redo; AI suggest ≤ 3s P95.
- Approve → schedule must create `content_pieces.published_at` and event `content.published`.

### 12.3 PR Credits

- Attempting to distribute without credit shows upsell and Stripe link; with valid credit, succeeds and decrements bucket.

### 12.4 GEO Index

- `seo/refresh-geo` populates at least 70% of tracked keywords with engine presence or explicit ‘not found’ state.

### 12.5 Internationalization

- All user-facing strings come from i18n files; locale switch persists.

### 12.6 Security

- RLS enforced; no cross-tenant data; secrets not exposed to client.

---

## 13) Rollout Plan

- **Milestone A (4–6 weeks):** Design tokens, shell, Dashboard, Content Editor (MVP), PR credits wallet (UI), basic SEO tab, GEO fetch worker stub.
- **Milestone B (6–10 weeks):** PR outreach flows, calendar, analytics v1, onboarding trial, Stripe integration, notifications.
- **Milestone C (10–14 weeks):** Attribution map, GEO productionization, agency prep (read-only reports), mobile companion MVP.

---

## 14) Risks & Mitigations

- **Model costs:** hard caps per tier + fallbacks.
- **PR provider SLAs:** queue + retries; show progress UI.
- **Tailwind/Theme regressions:** visual regression tests; tokenized CSS vars.
- **Data accuracy (GEO/attribution):** disclose beta label; provide feedback loop.

---

## 15) Appendix

- **Env Vars (non-secret):** `PUBLIC_SUPABASE_URL`, `PUBLIC_CF_ANALYTICS`.
- **Secrets (server):** `SUPABASE_SERVICE_KEY`, `LLM_KEYS`, `SERP_API_KEY`, `PR_PROVIDER_KEYS`, `STRIPE_SECRET`.
- **Iconography:** Lucide; stroke 1.5px; sizes 16/20/24.
- **Copy Guidelines:** Declarative, concise, no hype. AI messages use teal badge.

