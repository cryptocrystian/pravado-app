# PRAVADO Design System V3

## Overview

The V3 Design System establishes an AI-first, enterprise-grade visual language that enforces strict brand compliance while enabling rapid development. This system uses a dark shell with light content islands pattern, ensuring optimal readability and visual hierarchy.

## Typography Scale

### Headers
- **Display**: 64px/72px (font-weight: 700, metric) - KPI numbers only
- **H1**: 32px/36px (font-weight: 600) - Page titles
- **H2**: 24px/28px (font-weight: 600) - Section headers  
- **H3**: 20px/28px (font-weight: 500) - Card headers

### Body
- **Body**: 16px/24px (font-weight: 400) - Standard text
- **Small**: 14px/20px (font-weight: 400) - Secondary text
- **Meta**: 12px/16px (font-weight: 500) - Labels, badges

### Font Stack
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

## Spacing Scale

- **Base unit**: 8px
- **Scale**: 8 / 12 / 16 / 24 / 32 / 48 / 64
- **Card padding**: 20px (mobile) / 24px (desktop)
- **Section margin**: 24px (mobile) / 32px (desktop)
- **Grid gap**: 24px

## Color Usage Map

### Primary Actions & Links
- **Links**: `ai-teal-300` → hover: `ai-teal-500`
- **CTAs**: `var(--brand-grad)` (teal→gold gradient)
- **Active states**: Left border 3px `ai-teal-500`

### Feedback & Status
- **Positive/Success**: `chip-positive` (teal background)
- **Attention/Impact**: `chip-attention` (gold background)  
- **Error**: `text-danger` (semantic red)
- **Neutral**: `text-foreground/60`

### Charts & Data Viz
- **Series 0**: `ai-teal-300`
- **Series 1**: `ai-gold-500`
- **Axes**: `--fg` (foreground)
- **Grid**: `--border` (muted)

### UI Elements
- **Sidebar**: Dark shell, no pills, compact glass list
- **Content areas**: Light islands with `data-surface="content"`
- **Cards**: `.glass-card` with micro-stroke gradient
- **Badges**: Small gold accents for counts

## Card Anatomy

```
┌─────────────────────────────────┐
│ Header (20px)                   │
│ ┌─────────────────────────────┐ │
│ │ Icon + Title    Actions →   │ │
│ └─────────────────────────────┘ │
│                                 │
│ Body (24px padding)             │
│ ┌─────────────────────────────┐ │
│ │ Content area                │ │
│ │ Can contain nested cards    │ │
│ └─────────────────────────────┘ │
│                                 │
│ Footer (20px) - optional        │
│ ┌─────────────────────────────┐ │
│ │ Actions or metadata         │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘

Glass effect: 
- Background blur 12px
- Border: 1px solid glass-stroke
- Gradient hairline at .18 opacity
- Shadow: 0 10px 30px rgba(0,0,0,.35)
```

## Dashboard V3 Layout

```
┌──────────────────────────────────────────────────────┐
│ Header Bar                                           │
│ ┌──────────────────────────────────────────────────┐│
│ │ Page Title         Search | AI Copilot | Profile ││
│ └──────────────────────────────────────────────────┘│
├────────┬─────────────────────────────────────────────┤
│Sidebar │ Main Content (data-surface="content")      │
│ 264px  │ ┌─────────────────────────────────────────┐│
│ Glass  │ │ Row A: Hero Section                     ││
│ Dark   │ │ ┌─────────────────┬─────────────────┐  ││
│ Shell  │ │ │ A1: AI Briefing │ A2: Quick       │  ││
│        │ │ │ (span 8)        │ Insights (4)    │  ││
│        │ │ │ min-h: 280px    │ 4 mini KPIs     │  ││
│        │ │ └─────────────────┴─────────────────┘  ││
│        │ │                                         ││
│        │ │ Row B: Actions & Operations            ││
│        │ │ ┌─────────────────┬─────────────────┐  ││
│        │ │ │ B1: Next-Best   │ B2: Ops Rail    │  ││
│        │ │ │ Actions (span 8)│ (span 4)        │  ││
│        │ │ └─────────────────┴─────────────────┘  ││
│        │ │                                         ││
│        │ │ Row C: Quick Actions & Metrics         ││
│        │ │ ┌─────────────────────────────────────┐││
│        │ │ │ C1: Quick Actions (span 8)          │││
│        │ │ │ C2: Performance Metrics (span 4/12) │││
│        │ │ └─────────────────────────────────────┘││
│        │ └─────────────────────────────────────────┘│
└────────┴─────────────────────────────────────────────┘

Container: max-w-[1400px] mx-auto px-6 md:px-8
Grid: grid-cols-12 gap-6
```

## Component Specifications

### AppSidebarV3
- **Width**: 264px fixed
- **Style**: Glass card on dark shell
- **Active state**: 3px left teal indicator
- **Badges**: Gold background for counts
- **No pills**: Compact list items only

### KPIHeroV3  
- **Height**: min-h-280px
- **Left section**: Big score (64px), delta chip, CTAs
- **Right section**: Sparkline in elevated panel
- **Grid**: col-span-8

### NextBestActionRow
- **Layout**: Horizontal card with gradient CTA
- **Chips**: Confidence (teal), Impact (gold)
- **Auto-apply**: Toggle at 85% threshold (UI only)

### GlassCard
- **Class**: `.glass-card`
- **Effect**: backdrop-blur(12px)
- **Border**: 1px solid glass-stroke
- **Gradient**: Micro-stroke at 18% opacity

### Focus States
- **Global**: `outline-2 outline-ai-teal-500/70 outline-offset-2`
- **Interactive**: All buttons, links, inputs
- **Keyboard nav**: Clear visual indicators

## Brand Compliance Rules

### Forbidden Patterns
- ❌ `bg-white` → Use `bg-panel` or `bg-island`
- ❌ `text-blue-*` → Use semantic tokens
- ❌ `#hex` or `rgb()` → Use HSL variables only
- ❌ Default blue links → Enforced teal globally
- ❌ White pills in sidebar → Compact glass list

### Required Patterns  
- ✅ CTAs: `var(--brand-grad)` only
- ✅ Links: `ai-teal-300` with hover state
- ✅ Content areas: `data-surface="content"`
- ✅ Dark shell + light islands
- ✅ Glass cards with gradient hairline

### CI Enforcement
All PRs must pass:
- `scripts/ui/audit-colors.ts`
- No hex/rgb colors in source
- Content islands properly marked
- Visual regression tests stable