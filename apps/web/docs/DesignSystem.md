# Pravado Enterprise Design System
*Version 2.0 - Enterprise UI Overhaul*

## Brand Tokens & Color System

### Core AI Brand Colors (HSL)
```css
:root {
  /* AI Teal Palette */
  --ai-teal-300: 170 70% 58%;   /* Light teal for hover states */
  --ai-teal-500: 170 72% 45%;   /* Primary teal for active states */
  --ai-teal-700: 170 78% 34%;   /* Dark teal for emphasis */
  
  /* AI Gold Palette */
  --ai-gold-300: 40 92% 66%;    /* Light gold for highlights */
  --ai-gold-500: 40 92% 52%;    /* Primary gold for premium features */
  --ai-gold-700: 40 94% 40%;    /* Dark gold for depth */
  
  /* Brand Gradient */
  --brand-grad: linear-gradient(90deg, hsl(var(--ai-teal-500)), hsl(var(--ai-gold-500)));
}
```

### Foundation Colors
```css
:root {
  /* Dark Shell Foundation */
  --bg: 217 19% 9%;              /* #161B22 - Primary background */
  --fg: 213 31% 91%;             /* #E6EDF3 - Primary text */
  --border: 217 19% 13%;         /* #21262D - Subtle borders */
  
  /* Light Content Islands */
  --panel: 0 0% 98%;             /* #FAFAFA - Panel background */
  --panel-2: 0 0% 100%;          /* #FFFFFF - Elevated panels */
  
  /* Glass Morphism */
  --glass-bg: 0 0% 100% / 0.05;  /* Ultra-subtle glass overlay */
  --glass-border: 0 0% 100% / 0.1; /* Glass border */
  
  /* Semantic Colors */
  --brand: var(--ai-teal-500);
  --brand-foreground: 0 0% 100%;
  --success: 142 76% 36%;        /* #16A34A */
  --warning: 38 92% 50%;         /* #F59E0B */
  --danger: 0 84% 60%;           /* #EF4444 */
}
```

## 12-Column Grid System

### Desktop Layout (1200px+)
```css
.grid-container {
  display: grid;
  grid-template-columns: 240px 1fr 280px; /* Sidebar | Main | Right Rail */
  grid-template-areas: "sidebar content right-rail";
  gap: 24px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
}

.main-content {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  grid-area: content;
}
```

### Sidebar Specifications (240px)
```css
.sidebar {
  width: 240px;
  background: hsl(var(--bg));
  border-right: 1px solid hsl(var(--border));
  padding: 16px 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 0 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.sidebar-item:hover {
  background: hsla(var(--ai-teal-300) / 0.1);
}

.sidebar-item.active {
  background: hsla(var(--ai-teal-500) / 0.15);
  border-left: 3px solid hsl(var(--ai-teal-500));
}

.sidebar-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  opacity: 0.7;
}

.sidebar-item.active .sidebar-icon {
  opacity: 1;
  color: hsl(var(--ai-teal-500));
}

.sidebar-badge {
  margin-left: auto;
  background: hsl(var(--ai-gold-500));
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
}
```

### Tablet Layout (768px - 1199px)
```css
@media (max-width: 1199px) {
  .grid-container {
    grid-template-columns: 1fr 280px; /* Collapse sidebar, show right rail */
    grid-template-areas: "content right-rail";
  }
  
  .sidebar {
    transform: translateX(-100%);
    z-index: 50;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}
```

### Mobile Layout (< 768px)
```css
@media (max-width: 767px) {
  .grid-container {
    grid-template-columns: 1fr;
    grid-template-areas: "content";
    gap: 16px;
    padding: 0 16px;
  }
  
  .main-content {
    grid-template-columns: 1fr; /* Single column on mobile */
  }
}
```

## Typography Scale

### Hierarchy (Mobile-First)
```css
.text-display {
  font-size: 2rem;      /* 32px */
  line-height: 2.5rem;  /* 40px */
  font-weight: 700;
  letter-spacing: -0.02em;
}

.text-h1 {
  font-size: 1.75rem;   /* 28px */
  line-height: 2rem;    /* 32px */
  font-weight: 600;
  letter-spacing: -0.015em;
}

.text-h2 {
  font-size: 1.375rem;  /* 22px */
  line-height: 1.75rem; /* 28px */
  font-weight: 600;
  letter-spacing: -0.01em;
}

.text-h3 {
  font-size: 1.125rem;  /* 18px */
  line-height: 1.5rem;  /* 24px */
  font-weight: 600;
}

.text-body {
  font-size: 1rem;      /* 16px */
  line-height: 1.5rem;  /* 24px */
  font-weight: 400;
}

.text-meta {
  font-size: 0.75rem;   /* 12px */
  line-height: 0.875rem; /* 14px */
  font-weight: 500;
  opacity: 0.7;
}

.text-metric {
  font-weight: 700;
  font-feature-settings: 'tnum' on, 'lnum' on;
}
```

### Desktop Scale-Up
```css
@media (min-width: 768px) {
  .text-display { font-size: 2.5rem; line-height: 3rem; }
  .text-h1 { font-size: 2rem; line-height: 2.5rem; }
  .text-h2 { font-size: 1.5rem; line-height: 2rem; }
}
```

## Spacing System

### Tier System (12/16/24 Base)
```css
:root {
  /* Micro Spacing */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px - Primary tier */
  
  /* Base Spacing */
  --space-4: 1rem;     /* 16px - Primary tier */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px - Primary tier */
  
  /* Section Spacing */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  
  /* Layout Spacing */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
  --space-24: 6rem;    /* 96px */
}
```

### Usage Guidelines
- **12px**: Tight internal spacing (chip padding, icon gaps)
- **16px**: Standard component padding, button spacing
- **24px**: Section separators, card spacing
- **32px+**: Layout-level spacing, hero sections

## Component Specifications

### Hero Layout (Left Big Score + Right 4 Mini-KPIs)

```html
<div class="hero-container">
  <div class="hero-main-metric">
    <div class="metric-value">$2.4M</div>
    <div class="metric-label">Total Revenue</div>
    <div class="metric-change positive">+12.3% vs last month</div>
  </div>
  
  <div class="hero-mini-kpis">
    <div class="mini-kpi">
      <div class="mini-value">847</div>
      <div class="mini-label">Active Users</div>
    </div>
    <div class="mini-kpi">
      <div class="mini-value">23.4%</div>
      <div class="mini-label">Conversion</div>
    </div>
    <div class="mini-kpi">
      <div class="mini-value">4.8</div>
      <div class="mini-label">Avg Rating</div>
    </div>
    <div class="mini-kpi">
      <div class="mini-value">156</div>
      <div class="mini-label">New Signups</div>
    </div>
  </div>
</div>
```

```css
.hero-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  padding: 32px;
  background: hsl(var(--panel));
  border-radius: 16px;
  border: 1px solid hsl(var(--border));
  margin-bottom: 24px;
}

.hero-main-metric {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.metric-value {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  color: hsl(var(--ai-teal-500));
  margin-bottom: 8px;
}

.metric-label {
  font-size: 1.125rem;
  font-weight: 500;
  color: hsl(var(--fg));
  margin-bottom: 12px;
}

.metric-change {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  background: hsla(var(--success) / 0.1);
  color: hsl(var(--success));
  align-self: flex-start;
}

.hero-mini-kpis {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-content: center;
}

.mini-kpi {
  padding: 16px;
  background: hsl(var(--panel-2));
  border-radius: 12px;
  border: 1px solid hsl(var(--border));
  text-align: center;
}

.mini-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: hsl(var(--fg));
  margin-bottom: 4px;
}

.mini-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: hsl(var(--fg));
  opacity: 0.7;
}

@media (max-width: 767px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px;
  }
  
  .metric-value {
    font-size: 2.5rem;
  }
  
  .hero-mini-kpis {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### Quick Actions Component

```html
<div class="quick-actions">
  <h3 class="quick-actions-title">Quick Actions</h3>
  <div class="actions-grid">
    <button class="action-button primary">
      <span class="action-icon">+</span>
      <span class="action-text">Create Campaign</span>
    </button>
    <button class="action-button secondary">
      <span class="action-icon">↗</span>
      <span class="action-text">Export Data</span>
    </button>
    <button class="action-button secondary">
      <span class="action-icon">⚙</span>
      <span class="action-text">Settings</span>
    </button>
  </div>
</div>
```

```css
.quick-actions {
  background: hsl(var(--panel));
  border-radius: 12px;
  border: 1px solid hsl(var(--border));
  padding: 20px;
  margin-bottom: 24px;
}

.quick-actions-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: hsl(var(--fg));
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--panel-2));
  color: hsl(var(--fg));
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: hsla(var(--ai-teal-300) / 0.05);
  border-color: hsl(var(--ai-teal-300));
}

.action-button.primary {
  background: hsl(var(--ai-teal-500));
  color: white;
  border-color: hsl(var(--ai-teal-500));
}

.action-button.primary:hover {
  background: hsl(var(--ai-teal-700));
  border-color: hsl(var(--ai-teal-700));
}

.action-icon {
  font-size: 16px;
  opacity: 0.8;
}

@media (max-width: 480px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
```

### Tile System Components

```html
<div class="tiles-container">
  <div class="tile metric-tile">
    <div class="tile-header">
      <h4 class="tile-title">Revenue Growth</h4>
      <div class="tile-badge success">+15.2%</div>
    </div>
    <div class="tile-content">
      <div class="tile-metric">$847K</div>
      <div class="tile-subtitle">This quarter</div>
    </div>
  </div>
  
  <div class="tile chart-tile">
    <div class="tile-header">
      <h4 class="tile-title">Performance Overview</h4>
    </div>
    <div class="tile-content">
      <div class="chart-placeholder">[Chart Component]</div>
    </div>
  </div>
  
  <div class="tile list-tile">
    <div class="tile-header">
      <h4 class="tile-title">Recent Activity</h4>
      <button class="tile-action">View All</button>
    </div>
    <div class="tile-content">
      <div class="activity-list">
        <div class="activity-item">
          <div class="activity-dot"></div>
          <div class="activity-text">Campaign launched</div>
          <div class="activity-time">2h ago</div>
        </div>
      </div>
    </div>
  </div>
</div>
```

```css
.tiles-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.tile {
  background: hsl(var(--panel));
  border-radius: 12px;
  border: 1px solid hsl(var(--border));
  padding: 20px;
  transition: all 0.2s ease;
}

.tile:hover {
  border-color: hsla(var(--ai-teal-300) / 0.3);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.tile-header {
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 16px;
}

.tile-title {
  font-size: 1rem;
  font-weight: 600;
  color: hsl(var(--fg));
}

.tile-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.tile-badge.success {
  background: hsla(var(--success) / 0.1);
  color: hsl(var(--success));
}

.tile-metric {
  font-size: 2rem;
  font-weight: 700;
  color: hsl(var(--ai-teal-500));
  margin-bottom: 4px;
}

.tile-subtitle {
  font-size: 0.875rem;
  color: hsl(var(--fg));
  opacity: 0.7;
}

.tile-action {
  background: none;
  border: none;
  color: hsl(var(--ai-teal-500));
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.tile-action:hover {
  background: hsla(var(--ai-teal-300) / 0.1);
}

/* Responsive tile sizing */
@media (max-width: 767px) {
  .tiles-container {
    grid-template-columns: 1fr;
  }
}
```

### Right Rail Component

```html
<div class="right-rail">
  <div class="rail-section">
    <h4 class="rail-title">AI Insights</h4>
    <div class="insight-card">
      <div class="insight-icon">🤖</div>
      <div class="insight-content">
        <div class="insight-text">Revenue is trending 23% above forecast</div>
        <div class="insight-confidence">95% confidence</div>
      </div>
    </div>
  </div>
  
  <div class="rail-section">
    <h4 class="rail-title">Quick Stats</h4>
    <div class="stats-list">
      <div class="stat-item">
        <span class="stat-label">Conversion Rate</span>
        <span class="stat-value">4.2%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Avg Session</span>
        <span class="stat-value">3:42</span>
      </div>
    </div>
  </div>
</div>
```

```css
.right-rail {
  width: 280px;
  padding: 0 8px;
  space-y: 24px;
}

.rail-section {
  background: hsl(var(--panel));
  border-radius: 12px;
  border: 1px solid hsl(var(--border));
  padding: 16px;
  margin-bottom: 16px;
}

.rail-title {
  font-size: 1rem;
  font-weight: 600;
  color: hsl(var(--fg));
  margin-bottom: 12px;
}

.insight-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, 
    hsla(var(--ai-teal-500) / 0.05), 
    hsla(var(--ai-gold-500) / 0.05)
  );
  border-radius: 8px;
  border: 1px solid hsla(var(--ai-teal-300) / 0.2);
}

.insight-icon {
  font-size: 20px;
  line-height: 1;
}

.insight-text {
  font-size: 0.875rem;
  color: hsl(var(--fg));
  margin-bottom: 4px;
}

.insight-confidence {
  font-size: 0.75rem;
  color: hsl(var(--ai-teal-500));
  font-weight: 500;
}

.stats-list {
  space-y: 8px;
}

.stat-item {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 8px 0;
}

.stat-label {
  font-size: 0.875rem;
  color: hsl(var(--fg));
  opacity: 0.7;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: hsl(var(--fg));
}

@media (max-width: 1199px) {
  .right-rail {
    display: none; /* Hidden on tablet/mobile, accessible via modal */
  }
}
```

## Chip System & Usage Rules

### Chip Variants
```css
.chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

/* Teal Usage: AI features, active states, primary actions */
.chip-teal {
  background: hsla(var(--ai-teal-500) / 0.1);
  color: hsl(var(--ai-teal-700));
  border-color: hsla(var(--ai-teal-500) / 0.2);
}

.chip-teal:hover {
  background: hsla(var(--ai-teal-500) / 0.15);
  border-color: hsla(var(--ai-teal-500) / 0.3);
}

/* Gold Usage: Premium features, achievements, highlights */
.chip-gold {
  background: hsla(var(--ai-gold-500) / 0.1);
  color: hsl(var(--ai-gold-700));
  border-color: hsla(var(--ai-gold-500) / 0.2);
}

.chip-gold:hover {
  background: hsla(var(--ai-gold-500) / 0.15);
  border-color: hsla(var(--ai-gold-500) / 0.3);
}

/* Semantic variants */
.chip-success {
  background: hsla(var(--success) / 0.1);
  color: hsl(var(--success));
  border-color: hsla(var(--success) / 0.2);
}

.chip-warning {
  background: hsla(var(--warning) / 0.1);
  color: hsl(var(--warning));
  border-color: hsla(var(--warning) / 0.2);
}

.chip-neutral {
  background: hsl(var(--panel-2));
  color: hsl(var(--fg));
  border-color: hsl(var(--border));
}
```

### Teal/Gold Usage Mapping
```markdown
## Teal Usage
- Active navigation states
- Primary CTA buttons
- AI-powered features
- Real-time indicators
- Progress indicators
- Selected states

## Gold Usage  
- Premium/Pro features
- Achievement badges
- VIP status indicators
- Upgrade prompts
- Success celebrations
- High-value metrics

## Combined Usage (Gradient)
- Hero sections
- Brand headers
- Loading animations
- Key metric displays
- Premium onboarding
```

## Icon System & Active States

### Icon Specifications
```css
.icon {
  width: 20px;
  height: 20px;
  stroke-width: 1.5;
  transition: all 0.2s ease;
}

.icon-sm { width: 16px; height: 16px; }
.icon-lg { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }

/* Icon states */
.icon-default {
  color: hsl(var(--fg));
  opacity: 0.7;
}

.icon-active {
  color: hsl(var(--ai-teal-500));
  opacity: 1;
}

.icon-hover:hover {
  color: hsl(var(--ai-teal-300));
  opacity: 1;
  transform: translateY(-1px);
}

.icon-premium {
  color: hsl(var(--ai-gold-500));
}
```

### Active State Patterns
```css
/* Button Active States */
.btn-active {
  background: hsl(var(--ai-teal-500));
  color: white;
  border-color: hsl(var(--ai-teal-500));
  box-shadow: 0 0 0 3px hsla(var(--ai-teal-500) / 0.2);
}

/* Navigation Active States */
.nav-active {
  background: hsla(var(--ai-teal-500) / 0.15);
  border-left: 3px solid hsl(var(--ai-teal-500));
  color: hsl(var(--ai-teal-500));
}

/* Input Active States */
.input-active {
  border-color: hsl(var(--ai-teal-500));
  box-shadow: 0 0 0 2px hsla(var(--ai-teal-500) / 0.2);
}

/* Card Active States */
.card-active {
  border-color: hsl(var(--ai-teal-300));
  box-shadow: 0 8px 24px hsla(var(--ai-teal-500) / 0.15);
  transform: translateY(-2px);
}
```

## Accessibility Standards

### Focus Management
```css
.focus-visible {
  outline: 2px solid hsl(var(--ai-teal-500));
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
```

### Color Contrast Requirements
- **AA Standard**: Minimum 4.5:1 ratio for normal text
- **AAA Standard**: Minimum 7:1 ratio for small text
- **Large Text**: Minimum 3:1 ratio for 18px+ text
- **Interactive Elements**: Minimum 3:1 ratio for borders/states

### Motion & Animation
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Implementation Notes

### CSS Custom Properties Usage
All design tokens are defined as CSS custom properties for:
- Dynamic theming capability
- Runtime color adjustments
- Component-level overrides
- Easy maintenance and updates

### Component Development Guidelines
1. **Mobile-First**: Always design for mobile, enhance for desktop
2. **Progressive Enhancement**: Core functionality works without JavaScript
3. **Semantic HTML**: Use proper HTML elements for accessibility
4. **Performance**: Minimize CSS specificity, use efficient selectors
5. **Dark Shell Pattern**: Maintain dark navigation/shell with light content areas

### Browser Support
- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **CSS Features**: Custom properties, Grid, Flexbox, logical properties
- **Fallbacks**: Provide graceful degradation for older browsers

---

*This design system enforces enterprise-grade consistency while maintaining rapid development velocity. All components follow the dark shell + light content islands pattern with teal/gold AI brand accents.*