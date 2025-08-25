# UI Patterns - Enterprise Dashboard P4

## Overview

This document outlines the UI patterns and components used in PRAVADO's enterprise dashboard system, following the P4 brand system with dark foundation, light content islands, and AI teal/gold accents for an enterprise look & flow.

## Dashboard Layout

### Grid System
- **12-column CSS Grid** for consistent layout structure
- **Responsive breakpoints**: Mobile-first approach with `lg:` variants
- **Spacing tiers**: `mt-10 md:mt-12` for sections, `p-6 md:p-8` for inner padding

### Layout Structure
```typescript
// Standard dashboard layout pattern
<section data-surface="content" className="p-4 lg:p-6 space-y-10 md:space-y-12">
  <div className="grid grid-cols-12 gap-6 md:gap-8">
    {/* Row 1: KPI Hero (12 columns) */}
    <div className="col-span-12">
      <KPIHero />
    </div>
    
    {/* Row 2: Two section cards (6 columns each) */}
    <div className="col-span-12 lg:col-span-6">
      <SectionCard />
    </div>
    
    {/* Row 3: Full-width section (12 columns) */}
    <div className="col-span-12">
      <SectionCard />
    </div>
  </div>
</section>
```

## P4 Sidebar V2 Anatomy

### Structure
- **4px gradient rail**: `bg-[linear-gradient(180deg,hsl(var(--ai-teal-600)),hsl(var(--ai-gold-600)))]`
- **Glass container**: Uses `.glass-card` utility with full brand styling
- **Compact list**: No white pills, clean glass navigation items
- **Active states**: Gradient 2px inset outline + `text-ai-teal-300`
- **Badges**: Count alerts using `bg-ai-gold-600/15 text-ai-gold-300`

### Navigation Item States
```css
.sidebar-item {
  @apply flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium;
  @apply text-foreground/80 hover:text-foreground hover:bg-white/5;
}

.sidebar-item.active {
  @apply text-ai-teal-300;
  @apply ring-2 ring-inset ring-ai-teal-500/30;
  @apply bg-gradient-to-r from-ai-teal-600/10 to-ai-gold-600/5;
}
```

## P4 Composed KPI Hero (12-Column)

### Layout Structure
- **Span 7**: Big score (text-7xl), delta chip, mini sparkline, actions
- **Span 5**: Four stacked mini-stats with progress bars and links

### Visual Elements
- **Score**: `text-7xl font-metric text-ai-teal-300`
- **Delta chip**: Teal/gold with proper semantic coloring
- **Sparkline**: Canvas-based with teal gradient
- **Actions**: Gradient primary + ghost secondary buttons

### Mini-Stats Pattern
```typescript
interface MiniStatProps {
  icon: ComponentType
  label: string
  value: string | number
  color: 'teal' | 'gold' | 'neutral'
  link?: string
}
```

### Accessibility Features
- **ARIA labels** on score and buttons
- **Screen reader text** for action context
- **Focus management** with visible focus rings
- **Semantic structure** with proper heading hierarchy

## P4 Brand System

### Color Tokens

#### Base Accents
```css
:root {
  --ai-teal-500: 170 72% 45%;
  --ai-gold-500: 40 92% 52%;
  
  /* Derived scales */
  --ai-teal-600: 170 76% 38%;
  --ai-teal-300: 170 70% 60%;
  --ai-gold-600: 40 94% 44%;
  --ai-gold-300: 40 90% 66%;
  
  /* Glass & strokes */
  --glass-fill: 220 18% 12% / 0.72;
  --glass-stroke: 210 18% 98% / 0.08;
  --glass-stroke-strong: 210 18% 98% / 0.14;
}
```

#### Button Variants

**Gradient Primary (Brand Actions)**
```css
.btn-gradient-primary {
  background: linear-gradient(90deg, hsl(var(--ai-teal-600)), hsl(var(--ai-gold-600)));
  @apply text-white font-medium px-4 py-2 rounded-lg transition-opacity;
  @apply hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ai-teal-500;
}
```

**Ghost Secondary**
```css
.btn-ghost {
  @apply text-foreground/80 hover:text-foreground hover:bg-white/5;
  @apply px-4 py-2 rounded-lg font-medium transition-all;
  @apply focus-visible:ring-2 focus-visible:ring-ai-teal-500;
}
```

### P4 Glass Cards with Gradient Micro-Strokes

```css
.glass-card {
  position: relative;
  background: hsl(var(--glass-fill));
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--glass-stroke));
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06);
}

/* Gradient hairline */
.glass-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(90deg, hsl(var(--ai-teal-600)), hsl(var(--ai-gold-600)));
  mask: linear-gradient(#000,#000) content-box, linear-gradient(#000,#000);
  mask-composite: exclude;
  opacity: .18;
}
```

### P4 Difficulty Chips

Difficulty chips with brand colors:
- **Easy (≤40)**: `bg-ai-teal-600/20 text-ai-teal-300`
- **Medium (41-70)**: `bg-ai-gold-600/16 text-ai-gold-300`  
- **Hard (>70)**: `bg-danger/20 text-danger`

### Interactive Links
```css
.link-brand {
  @apply text-brand transition-opacity;
  @apply hover:opacity-90 focus-visible:outline-2 focus-visible:outline-brand/70;
}
```

## Table Density

### Overview
Enterprise tables support two density modes for different use cases:

### Density Variants

#### Comfortable (Default)
- **Use case**: Executive dashboards, detailed analysis
- **Padding**: `py-4` for cells and headers
- **Best for**: When readability and visual breathing room are priorities

#### Compact
- **Use case**: Data-heavy screens, power users
- **Padding**: `py-2` for cells and headers  
- **Best for**: Maximizing information density

### Implementation
```typescript
const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

// Apply density classes dynamically
<table className={cn(
  "table-enterprise",
  density === 'compact' ? "table-compact" : "table-comfortable"
)}>
```

### Toggle Control
```typescript
<div className="flex rounded-lg border border-border overflow-hidden">
  <button
    onClick={() => setDensity('comfortable')}
    className={density === 'comfortable' ? "bg-brand text-brand-foreground" : "bg-panel"}
  >
    Comfortable
  </button>
  <button
    onClick={() => setDensity('compact')}
    className={density === 'compact' ? "bg-brand text-brand-foreground" : "bg-panel"}
  >
    Compact
  </button>
</div>
```

## P4 Enterprise Tables

### Core Features
- **Sticky headers** with glass backdrop blur
- **Enhanced hover**: `bg-ai-teal-500/02` with `ring-1 ring-ai-teal-500/08`
- **Monospace numerics**: `ui-monospace, 'SF Mono', 'Monaco'` font stack
- **Uppercase headers**: `text-transform: uppercase; letter-spacing: 0.025em`
- **Density controls**: Comfortable (1rem) vs Compact (0.5rem) padding

### Accessibility
- **Proper table semantics** with `<thead>`, `<tbody>`, `<th>`, `<td>`
- **Column header association** via implicit table structure
- **Keyboard navigation** support
- **Screen reader friendly** pagination controls

### Data Formatting
- **Numeric columns**: Right-aligned with `tabular-nums` font variant
- **Status indicators**: Semantic color coding with sufficient contrast
- **Interactive elements**: Focus-visible states for keyboard users

## P4 Content Islands (Anti-Glare)

### Implementation
Keep dark shell, wrap editor + content in single light section:

```html
<!-- Dark app shell remains -->
<div className="h-full">
  <h1 className="text-foreground">Content Studio</h1>
  
  <!-- Single light island -->
  <section data-surface="content" className="rounded-2xl border border-border/50 bg-[hsl(var(--panel))] p-6">
    <!-- Editor, panels, forms -->
  </section>
</div>
```

### CSS Variables Override (Reduced Glare)
```css
[data-surface="content"] {
  --panel: 210 20% 99%;      /* Off-white to reduce glare */
  --panel-2: 210 20% 98%;    /* Subtle elevation */
  --fg: 222 47% 10%;         /* Dark text */
  --border: 214 17% 92%;     /* Light borders */
}
```

## Focus & Accessibility Standards

### Focus Ring Standard
All interactive elements use consistent focus styling:
```css
.focus-ring:focus-visible,
button:focus-visible,
a:focus-visible {
  outline: 2px solid hsl(var(--brand) / 0.7);
  outline-offset: 2px;
}
```

### WCAG AA Compliance
- **Color contrast**: 4.5:1 minimum for normal text
- **Focus indicators**: Visible and high-contrast
- **Non-color cues**: Icons and text accompany color-coded status
- **Keyboard navigation**: All interactive elements accessible via keyboard

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy, landmarks
- **ARIA labels**: Context for complex interactions
- **Status announcements**: Dynamic content changes communicated
- **Table headers**: Associated with data cells for context

## P4 Charts Theme

### Brand Palette Initialization
```typescript
const css = getComputedStyle(document.documentElement);
Chart.defaults.color = css.getPropertyValue('--fg').trim();
Chart.defaults.borderColor = css.getPropertyValue('--border').trim();

const palette = [
  css.getPropertyValue('--ai-teal-300'),
  css.getPropertyValue('--ai-gold-500'), 
  '#6b7280'
];
```

### Glass Tooltips
```typescript
Chart.defaults.plugins.tooltip.backgroundColor = 'hsl(var(--glass-fill))';
Chart.defaults.plugins.tooltip.borderColor = 'hsl(var(--glass-stroke))';
Chart.defaults.plugins.tooltip.cornerRadius = 8;
```

## P4 Command/Copilot (⌘K)

### Top Bar Integration
```typescript
<button onClick={() => setCommandPaletteOpen(true)}>
  <Search className="h-4 w-4" />
  <span>Search or command...</span>
  <kbd>⌘K</kbd>
</button>
```

### Quick Actions
- **Start Press Release** → `/press-releases/new` (≤3 clicks)
- **Draft Content** → `/content/new` (≤3 clicks)  
- **Analyze URL** → `/citemind` (≤2 clicks)
- **Export Analytics** → `/analytics/export` (≤2 clicks)

### PostHog Tracking
```typescript
if (window.posthog) {
  window.posthog.capture('flow_path_len', { 
    flow: 'press_release', 
    steps: 1 
  });
}
```

## Component Architecture

### SectionCard
Standardized container for dashboard sections with:
- Consistent header structure (title, subtitle, icon, badge)
- Flexible action area for buttons and links
- Content island support via `data-surface="content"`

### DataTable
Enterprise-grade table component featuring:
- Generic typing for any data structure
- Flexible column definitions with custom renderers
- Built-in pagination and density controls
- Accessibility-first implementation

### KPIHero
Executive-focused metric display with:
- Responsive typography scaling
- Integrated trend visualization
- Prominent call-to-action placement
- Full accessibility support

## Performance Considerations

### Lazy Loading
- Chart.js loaded dynamically when needed
- Large data tables implement virtual scrolling for 1000+ rows
- Images and non-critical assets defer loading

### Bundle Optimization
- Tree-shaking enabled for icon libraries
- CSS utilities purged in production builds
- Component code-splitting at route level

### Accessibility Performance
- Focus management optimized for screen readers
- Reduced motion preferences respected
- High contrast mode detection and adaptation