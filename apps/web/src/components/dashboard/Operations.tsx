import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  FileText, 
  AlertTriangle, 
  Activity,
  MoreVertical 
} from 'lucide-react'

const contentQueue = [
  { title: "AI Marketing Automation Guide", status: "In Review", priority: "High" },
  { title: "Q1 Product Updates Blog", status: "Scheduled", priority: "Medium" },
  { title: "Customer Success Stories", status: "Draft", priority: "Low" },
]

const seoMovers = [
  { keyword: "marketing automation", position: 12, change: -3, isPositive: false },
  { keyword: "AI content creation", position: 8, change: +5, isPositive: true },
  { keyword: "customer segmentation", position: 15, change: +2, isPositive: true },
]

export function Operations() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Operations</h3>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Content Queue + SEO Movers - Left 8 cols */}
        <div className="col-span-8 space-y-6">
          {/* Content Queue */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-white">Content Queue</h4>
              <button className="text-ai-teal-300 hover:text-ai-teal-500 text-sm">View All</button>
            </div>
            
            <div className="space-y-3">
              {contentQueue.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-white">{item.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.priority === 'High' ? 'bg-danger-500/20 text-danger-500' :
                      item.priority === 'Medium' ? 'bg-warning-500/20 text-warning-500' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{item.status}</span>
                    <button>
                      <MoreVertical className="w-4 h-4 text-gray-500 hover:text-gray-300" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* SEO Movers */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-white">SEO Movers</h4>
              <button className="text-ai-teal-300 hover:text-ai-teal-500 text-sm">View All</button>
            </div>
            
            <div className="space-y-3">
              {seoMovers.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-sm text-white">{item.keyword}</span>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-sm text-gray-400">#{item.position}</span>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      item.isPositive ? 'chip-delta-up' : 'chip-delta-down'
                    }`}>
                      {item.isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {item.change > 0 ? '+' : ''}{item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Four Tiles - Right 4 cols */}
        <div className="col-span-4 grid grid-cols-2 gap-4">
          {/* Wallet (PR Credits) */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 text-premium-gold-300" />
              <h5 className="text-sm font-medium text-white">Wallet</h5>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-premium-gold-300">3</div>
              <div className="text-xs text-gray-400">Premium credits</div>
              <div className="text-xs text-gray-500">Expires in 45d</div>
            </div>
          </div>
          
          {/* PR Queue */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-ai-teal-300" />
                <h5 className="text-sm font-medium text-white">PR Queue</h5>
              </div>
              <span className="px-2 py-0.5 bg-premium-gold-500/20 text-premium-gold-300 rounded-full text-xs font-medium">
                1
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">2</div>
              <div className="text-xs text-gray-400">Active pitches</div>
              <div className="text-xs text-gray-500">Next: TechCrunch</div>
            </div>
          </div>
          
          {/* Alerts */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning-500" />
                <h5 className="text-sm font-medium text-white">Alerts</h5>
              </div>
              <span className="px-2 py-0.5 bg-danger-500/20 text-danger-500 rounded-full text-xs font-medium">
                3
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-danger-500">3</div>
              <div className="text-xs text-gray-400">Requires attention</div>
              <div className="text-xs text-gray-500">1 urgent</div>
            </div>
          </div>
          
          {/* Agent Health */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-success-500" />
              <h5 className="text-sm font-medium text-white">Agent Health</h5>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span className="text-sm font-medium text-success-500">Healthy</span>
              </div>
              <div className="text-xs text-gray-400">Last check: 2m ago</div>
              <div className="text-xs text-gray-500">Uptime: 99.9%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}