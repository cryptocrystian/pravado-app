import React, { useState } from 'react';
import { 
  GlassCard, 
  KPIHero, 
  KpiTile, 
  QuickActionsRow, 
  RightRailTile, 
  DataTableV2
} from '../components/v2';

/**
 * Component Gallery - Interactive showcase of all v2 components
 * Features brand color variations, hover effects, and responsive behavior demos
 */

interface ComponentSection {
  title: string;
  description: string;
  component: React.ReactNode;
}

const ComponentGallery: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState('default');
  const [showInteractive, setShowInteractive] = useState(true);

  // Sample data for components

  const sampleTableData = [
    {
      id: 1,
      keyword: "ai marketing tools",
      position: 3,
      volume: 12500,
      difficulty: 67,
      trend: "up" as const,
      ctr: "4.2%"
    },
    {
      id: 2,
      keyword: "content optimization",
      position: 8,
      volume: 8900,
      difficulty: 54,
      trend: "down" as const,
      ctr: "2.8%"
    },
    {
      id: 3,
      keyword: "seo analytics",
      position: 12,
      volume: 15600,
      difficulty: 72,
      trend: "up" as const,
      ctr: "3.1%"
    }
  ];

  const componentSections: ComponentSection[] = [
    {
      title: "Glass Card",
      description: "Foundational glass morphism card with backdrop blur effects",
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-2">Default Glass Card</h3>
            <p className="text-sm text-foreground/70">
              Basic glass card with subtle blur and border effects.
            </p>
          </GlassCard>
          
          <GlassCard className="p-6 bg-ai-teal-500/10 border-ai-teal-500/20">
            <h3 className="text-lg font-semibold mb-2 text-ai-teal-300">
              Teal Variant
            </h3>
            <p className="text-sm text-foreground/70">
              Glass card with AI teal brand accent colors.
            </p>
          </GlassCard>
          
          <GlassCard className="p-6 bg-ai-gold-500/10 border-ai-gold-500/20">
            <h3 className="text-lg font-semibold mb-2 text-ai-gold-300">
              Gold Variant
            </h3>
            <p className="text-sm text-foreground/70">
              Glass card with AI gold brand accent colors.
            </p>
          </GlassCard>
        </div>
      )
    },
    {
      title: "KPI Hero",
      description: "Main dashboard hero section with key performance indicators",
      component: (
        <div className="space-y-6">
          <KPIHero 
            score={87} 
            label="Content Authority Score"
            delta={{ value: "+12.3%", positive: true }}
            sparklineData={[65, 68, 72, 69, 75, 78, 81, 77, 83, 87]}
            data-testid="kpi-hero-demo" 
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h4 className="text-md font-semibold mb-4">Responsive Behavior</h4>
              <p className="text-sm text-foreground/70 mb-4">
                KPI Hero adapts to different screen sizes with smart layout adjustments.
              </p>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ai-teal-500/20 text-ai-teal-300">
                  Desktop
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ai-gold-500/20 text-ai-gold-300">
                  Tablet
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/20 text-slate-300">
                  Mobile
                </span>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6">
              <h4 className="text-md font-semibold mb-4">Brand Integration</h4>
              <p className="text-sm text-foreground/70 mb-4">
                Consistent application of AI teal and gold brand colors.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-ai-teal-500"></div>
                  <span className="text-xs">AI Teal (Primary)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-ai-gold-500"></div>
                  <span className="text-xs">AI Gold (Secondary)</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )
    },
    {
      title: "KPI Tiles",
      description: "Individual metric tiles with trend indicators and glass styling",
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiTile 
            title="Total Revenue"
            value="$124.5K"
            delta={{ value: "+12.5%", positive: true }}
            trend="up"
            data-testid="kpi-tile-revenue"
          />
          
          <KpiTile 
            title="Active Users"
            value="8.2K"
            delta={{ value: "+8.1%", positive: true }}
            trend="up"
            data-testid="kpi-tile-users"
          />
          
          <KpiTile 
            title="Conversion Rate"
            value="3.2%"
            delta={{ value: "-2.1%", positive: false }}
            trend="down"
            data-testid="kpi-tile-conversion"
          />
          
          <KpiTile 
            title="Avg Session"
            value="4m 32s"
            delta={{ value: "+5.4%", positive: true }}
            trend="up"
            data-testid="kpi-tile-session"
          />
        </div>
      )
    },
    {
      title: "Quick Actions Row",
      description: "Horizontal row of action buttons with brand styling",
      component: (
        <div className="space-y-6">
          <QuickActionsRow data-testid="quick-actions-demo" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <button className="btn-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Primary Button
            </button>
            <button className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Secondary Button
            </button>
            <button className="btn-ghost px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Ghost Button
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Right Rail Tiles",
      description: "Secondary metric tiles for sidebar or right-rail layouts",
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RightRailTile 
            title="SEO Score"
            insight="Your SEO score of 87/100 indicates good performance with room for improvement"
            confidence={87}
            category="optimization"
            data-testid="right-rail-seo"
          />
          
          <RightRailTile 
            title="Page Speed"
            insight="Average load time is 2.1s, showing significant improvement"
            confidence={78}
            category="trending"
            data-testid="right-rail-speed"
          />
          
          <RightRailTile 
            title="Bounce Rate"
            insight="Bounce rate of 34.2% is below industry average, indicating good user engagement"
            confidence={92}
            category="insight"
            data-testid="right-rail-bounce"
          />
        </div>
      )
    },
    {
      title: "Data Table V2",
      description: "Enhanced data table with enterprise styling and interactive features",
      component: (
        <div className="space-y-6">
          <DataTableV2 
            data={sampleTableData} 
            columns={[
              { key: 'keyword', label: 'Keyword', sortable: true },
              { key: 'position', label: 'Position', sortable: true },
              { key: 'volume', label: 'Volume', sortable: true },
              { key: 'difficulty', label: 'Difficulty', sortable: true },
              { key: 'trend', label: 'Trend' },
              { key: 'ctr', label: 'CTR', sortable: true }
            ]}
            data-testid="data-table-demo"
          />
          
          <div className="flex gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Density Options</h4>
              <div className="flex gap-2" data-testid="density-toggle">
                <button className="px-3 py-1 text-xs rounded bg-panel border">
                  Default
                </button>
                <button className="px-3 py-1 text-xs rounded bg-panel border">
                  Comfortable
                </button>
                <button className="px-3 py-1 text-xs rounded bg-panel border">
                  Compact
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Status Chips</h4>
              <div className="flex gap-2">
                <span className="chip-success px-2 py-1 text-xs rounded">Success</span>
                <span className="chip-warning px-2 py-1 text-xs rounded">Warning</span>
                <span className="chip-danger px-2 py-1 text-xs rounded">Danger</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Component Gallery</h1>
          <p className="text-lg text-foreground/70 mb-6">
            Interactive showcase of Pravado's V2 component library with glass morphism styling and AI brand accents.
          </p>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedVariant('default')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  selectedVariant === 'default' 
                    ? 'bg-ai-teal-500 text-white' 
                    : 'bg-panel border hover:bg-panel-elevated'
                }`}
              >
                Default
              </button>
              <button
                onClick={() => setSelectedVariant('teal')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  selectedVariant === 'teal' 
                    ? 'bg-ai-teal-500 text-white' 
                    : 'bg-panel border hover:bg-panel-elevated'
                }`}
              >
                Teal Accent
              </button>
              <button
                onClick={() => setSelectedVariant('gold')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  selectedVariant === 'gold' 
                    ? 'bg-ai-gold-500 text-black' 
                    : 'bg-panel border hover:bg-panel-elevated'
                }`}
              >
                Gold Accent
              </button>
            </div>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showInteractive}
                onChange={(e) => setShowInteractive(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Interactive States</span>
            </label>
          </div>
        </div>

        {/* Component Sections */}
        <div className="space-y-16">
          {componentSections.map((section, index) => (
            <section key={index} className="space-y-6">
              <div className="border-b border-border pb-4">
                <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                <p className="text-foreground/70">{section.description}</p>
              </div>
              
              <div className="component-showcase">
                {section.component}
              </div>
              
              {/* Code Example (collapsed by default) */}
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-ai-teal-300 hover:text-ai-teal-500 transition-colors">
                  View Usage Example
                </summary>
                <GlassCard className="mt-4 p-4">
                  <pre className="text-xs text-foreground/80 overflow-x-auto">
                    <code>{`<${section.title.replace(/\s+/g, '')} 
  data-testid="${section.title.toLowerCase().replace(/\s+/g, '-')}"
  className="custom-styles"
  // Additional props...
/>`}</code>
                  </pre>
                </GlassCard>
              </details>
            </section>
          ))}
        </div>

        {/* Brand Guidelines Section */}
        <section className="mt-16 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-bold mb-2">Brand Guidelines</h2>
            <p className="text-foreground/70">
              Color palette and styling guidelines for consistent brand application.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AI Teal Colors */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">AI Teal Palette</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-ai-teal-300"></div>
                    <span className="text-sm">ai-teal-300</span>
                  </div>
                  <code className="text-xs text-foreground/60">170 70% 58%</code>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-ai-teal-500"></div>
                    <span className="text-sm">ai-teal-500</span>
                  </div>
                  <code className="text-xs text-foreground/60">170 72% 45%</code>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-ai-teal-700"></div>
                    <span className="text-sm">ai-teal-700</span>
                  </div>
                  <code className="text-xs text-foreground/60">170 78% 34%</code>
                </div>
              </div>
            </GlassCard>
            
            {/* AI Gold Colors */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">AI Gold Palette</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-ai-gold-300"></div>
                    <span className="text-sm">ai-gold-300</span>
                  </div>
                  <code className="text-xs text-foreground/60">40 92% 66%</code>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-ai-gold-500"></div>
                    <span className="text-sm">ai-gold-500</span>
                  </div>
                  <code className="text-xs text-foreground/60">40 92% 52%</code>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-ai-gold-700"></div>
                    <span className="text-sm">ai-gold-700</span>
                  </div>
                  <code className="text-xs text-foreground/60">40 94% 40%</code>
                </div>
              </div>
            </GlassCard>
            
            {/* Glass Effects */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Glass Morphism</h3>
              <div className="space-y-3">
                <div className="p-3 rounded bg-background/10 backdrop-blur-sm border border-border/50">
                  <span className="text-sm">Light Glass</span>
                </div>
                <div className="p-3 rounded bg-background/20 backdrop-blur-md border border-border">
                  <span className="text-sm">Medium Glass</span>
                </div>
                <div className="p-3 rounded bg-background/30 backdrop-blur-lg border border-border/80">
                  <span className="text-sm">Heavy Glass</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-foreground/60">
            Pravado UI Component Gallery - Built with React + Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ComponentGallery;