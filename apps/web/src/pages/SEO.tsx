import { Search, TrendingUp, Globe, Link } from 'lucide-react'
import { SectionCard } from '../components/SectionCard'
import { DataTable } from '../components/DataTable'

// Mock SEO data
const seoKeywords = [
  { keyword: 'marketing automation', position: 3, difficulty: 45, volume: 8100, trend: '+2' },
  { keyword: 'email marketing software', position: 7, difficulty: 72, volume: 12000, trend: '-1' },
  { keyword: 'lead generation tools', position: 12, difficulty: 38, volume: 5400, trend: '+5' },
  { keyword: 'crm integration', position: 15, difficulty: 55, volume: 3200, trend: '+3' },
  { keyword: 'customer segmentation', position: 8, difficulty: 42, volume: 2900, trend: '0' },
  { keyword: 'marketing analytics', position: 4, difficulty: 68, volume: 6700, trend: '+1' },
  { keyword: 'conversion tracking', position: 11, difficulty: 51, volume: 4100, trend: '+2' },
  { keyword: 'campaign optimization', position: 6, difficulty: 39, volume: 3800, trend: '+4' }
]

const competitors = [
  { domain: 'hubspot.com', visibility: 92, keywords: 45000, traffic: '2.1M', change: '+5%' },
  { domain: 'salesforce.com', visibility: 88, keywords: 38000, traffic: '1.8M', change: '+2%' },
  { domain: 'marketo.com', visibility: 76, keywords: 28000, traffic: '1.2M', change: '-1%' },
  { domain: 'mailchimp.com', visibility: 71, keywords: 25000, traffic: '980K', change: '+3%' }
]

const keywordColumns = [
  {
    key: 'keyword' as const,
    label: 'Keyword',
    render: (value: string) => <span className="font-medium">{value}</span>
  },
  {
    key: 'position' as const,
    label: 'Position',
    align: 'right' as const,
    numeric: true,
    render: (value: number) => <span className="font-mono">{value}</span>
  },
  {
    key: 'difficulty' as const,
    label: 'Difficulty',
    align: 'center' as const
  },
  {
    key: 'volume' as const,
    label: 'Volume',
    align: 'right' as const,
    numeric: true,
    render: (value: number) => <span className="font-mono">{value.toLocaleString()}</span>
  },
  {
    key: 'trend' as const,
    label: 'Trend',
    align: 'center' as const,
    render: (value: string) => {
      const isPositive = value.startsWith('+')
      const isNegative = value.startsWith('-')
      return (
        <span className={
          isPositive ? 'chip-success' : isNegative ? 'chip-danger' : 'chip-warning'
        }>
          {value}
        </span>
      )
    }
  }
]

const competitorColumns = [
  {
    key: 'domain' as const,
    label: 'Domain',
    render: (value: string) => <span className="font-medium">{value}</span>
  },
  {
    key: 'visibility' as const,
    label: 'Visibility',
    align: 'right' as const,
    numeric: true,
    render: (value: number) => <span className="font-mono">{value}%</span>
  },
  {
    key: 'keywords' as const,
    label: 'Keywords',
    align: 'right' as const,
    numeric: true,
    render: (value: number) => <span className="font-mono">{value.toLocaleString()}</span>
  },
  {
    key: 'traffic' as const,
    label: 'Est. Traffic',
    align: 'right' as const,
    numeric: true
  },
  {
    key: 'change' as const,
    label: 'Change',
    align: 'center' as const,
    render: (value: string) => {
      const isPositive = value.startsWith('+')
      const isNegative = value.startsWith('-')
      return (
        <span className={
          isPositive ? 'chip-success' : isNegative ? 'chip-danger' : 'chip-warning'
        }>
          {value}
        </span>
      )
    }
  }
]

export function SEO() {
  return (
    <div className="min-h-screen">
      <section data-surface="content" className="p-4 lg:p-6 space-y-10 md:space-y-12">
        
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">SEO/GEO</h1>
          <p className="text-foreground/60 mt-2">Search engine and generative engine optimization</p>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SectionCard
            title="Keywords"
            icon={Search}
            className="p-6"
          >
            <div className="space-y-2">
              <div className="text-2xl font-bold text-brand">142</div>
              <p className="text-sm text-foreground/60">Tracked keywords</p>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="chip-success">+8 this week</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="AI Answers"
            icon={Globe}
            className="p-6"
          >
            <div className="space-y-2">
              <div className="text-2xl font-bold text-brand">23</div>
              <p className="text-sm text-foreground/60">SGE appearances</p>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="chip-success">+5 improved</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Competitors"
            icon={TrendingUp}
            className="p-6"
          >
            <div className="space-y-2">
              <div className="text-2xl font-bold text-brand">12</div>
              <p className="text-sm text-foreground/60">Tracked domains</p>
              <div className="flex items-center gap-1 text-xs">
                <span className="chip-warning">2 gaining</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Backlinks"
            icon={Link}
            className="p-6"
          >
            <div className="space-y-2">
              <div className="text-2xl font-bold text-brand">67</div>
              <p className="text-sm text-foreground/60">Quality links</p>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="chip-success">+12 acquired</span>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Keywords table */}
        <SectionCard
          title="Keyword Performance"
          subtitle="Track your most important search terms"
          icon={Search}
          action={
            <div className="flex gap-2">
              <button className="btn-secondary">Export</button>
              <button className="btn-primary">Add Keywords</button>
            </div>
          }
        >
          <DataTable 
            data={seoKeywords}
            columns={keywordColumns}
            showDensityToggle={true}
          />
        </SectionCard>

        {/* Competitors table */}
        <SectionCard
          title="Competitor Analysis"
          subtitle="Monitor competitive landscape and opportunities"
          icon={TrendingUp}
          action={
            <div className="flex gap-2">
              <button className="btn-secondary">Full Analysis</button>
              <button className="btn-primary">Add Competitor</button>
            </div>
          }
        >
          <DataTable 
            data={competitors}
            columns={competitorColumns}
            showDensityToggle={true}
          />
        </SectionCard>

      </section>
    </div>
  )
}