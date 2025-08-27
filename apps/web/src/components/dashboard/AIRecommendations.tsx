import { useState } from 'react'
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  MessageCircle, 
  Plus,
  Pause,
  Settings
} from 'lucide-react'

const mockRecommendations = [
  {
    id: 1,
    title: "Target 'AI marketing automation' keyword cluster",
    rationale: "High search volume, low competition, aligns with your product positioning",
    confidence: 92,
    impact: "High",
    predictedLift: "+15%",
    expanded: false,
    details: {
      why: "Recent SERP analysis shows declining competition for AI marketing terms",
      dataPoints: ["1.2K monthly searches", "Competition score: 0.3", "Current ranking: #23"],
      suggestedCopy: "Create thought leadership content around AI marketing automation trends"
    }
  },
  {
    id: 2,
    title: "Refresh outdated content from Q2 2023",
    rationale: "Performance dropped 40% due to outdated statistics and examples",
    confidence: 87,
    impact: "Medium", 
    predictedLift: "+8%",
    expanded: false,
    details: {
      why: "Content freshness is a ranking factor, especially for marketing topics",
      dataPoints: ["12 pieces identified", "Avg traffic drop: 40%", "Last updated: 6+ months"],
      suggestedCopy: "Update with 2024 data, add recent case studies, refresh CTAs"
    }
  },
  {
    id: 3,
    title: "Pitch TechCrunch on Series A announcement",
    rationale: "Sarah Perez covers SaaS funding, recently wrote about similar companies",
    confidence: 78,
    impact: "High",
    predictedLift: "+25%",
    expanded: false,
    details: {
      why: "Perfect timing with funding announcement and journalist's recent coverage",
      dataPoints: ["3 similar stories last month", "Response rate: 15%", "Domain authority: 95"],
      suggestedCopy: "Personalized pitch highlighting unique AI automation angle"
    }
  }
]

export function AIRecommendations() {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [confidenceGate, setConfidenceGate] = useState(85)
  const [isPaused, setIsPaused] = useState(false)
  
  const toggleExpanded = (id: number) => {
    setExpanded(expanded === id ? null : id)
  }
  
  const toggleSelected = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Header with Automation Bar */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">AI Recommendations</h3>
        
        {/* Automation Bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Settings className="w-4 h-4" />
            <span>Confidence gate ≥{confidenceGate}% (approval required)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isPaused 
                  ? 'bg-warning-500/20 text-warning-500' 
                  : 'bg-success-500/20 text-success-500'
              }`}
            >
              <Pause className="w-4 h-4" />
              {isPaused ? 'Paused' : 'Active'}
            </button>
            <button className="px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white border border-white/20 hover:bg-white/5 transition-colors">
              View Queue
            </button>
          </div>
        </div>
      </div>
      
      {/* Batch Actions */}
      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-ai-teal-500/10 border border-ai-teal-500/30 rounded-lg">
          <span className="text-sm text-ai-teal-300">
            {selectedItems.length} items selected
          </span>
          <button className="btn-primary px-4 py-2 rounded-lg text-sm font-medium">
            Approve Selected
          </button>
        </div>
      )}
      
      {/* Recommendations List */}
      <div className="space-y-3">
        {mockRecommendations.map((rec) => (
          <div key={rec.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Selection Checkbox */}
                <button
                  onClick={() => toggleSelected(rec.id)}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedItems.includes(rec.id)
                      ? 'bg-ai-teal-500 border-ai-teal-500'
                      : 'border-white/30 hover:border-white/50'
                  }`}
                >
                  {selectedItems.includes(rec.id) && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </button>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-400 mb-3">{rec.rationale}</p>
                      
                      {/* Chips */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="chip-confidence px-2 py-1 rounded-full text-xs font-medium">
                          {rec.confidence}% confidence
                        </span>
                        <span className="chip-impact px-2 py-1 rounded-full text-xs font-medium">
                          {rec.impact} impact
                        </span>
                        <span className="chip-delta-up text-xs font-medium">
                          {rec.predictedLift} lift
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button className="btn-primary px-3 py-1.5 rounded-lg text-xs font-medium">
                        Approve
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/20 text-gray-300 hover:bg-white/5 transition-colors">
                        Ask Copilot
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/20 text-gray-300 hover:bg-white/5 transition-colors">
                        Queue
                      </button>
                    </div>
                  </div>
                  
                  {/* Expand/Collapse */}
                  <button
                    onClick={() => toggleExpanded(rec.id)}
                    className="flex items-center gap-1 text-xs text-ai-teal-300 hover:text-ai-teal-500 transition-colors"
                  >
                    {expanded === rec.id ? (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        Hide details
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-3 h-3" />
                        Show details
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Expanded Details */}
            {expanded === rec.id && (
              <div className="border-t border-white/10 p-4 bg-white/5">
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-white mb-2">Why this matters:</h5>
                    <p className="text-sm text-gray-400">{rec.details.why}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-white mb-2">Data points:</h5>
                    <ul className="space-y-1">
                      {rec.details.dataPoints.map((point, index) => (
                        <li key={index} className="text-sm text-gray-400 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-ai-teal-300 rounded-full" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-white mb-2">Suggested approach:</h5>
                    <p className="text-sm text-gray-400">{rec.details.suggestedCopy}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}