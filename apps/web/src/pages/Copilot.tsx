import { Bot, Zap } from 'lucide-react'

export function Copilot() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">AI Copilot</h1>
        <p className="text-text/60 mt-2">Your intelligent marketing assistant</p>
      </div>
      
      <div className="card p-8 text-center">
        <Bot className="h-12 w-12 text-ai mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Context-Aware AI Assistant</h3>
        <p className="text-text/60 mb-6">Get intelligent recommendations and automate tasks based on your current workflow</p>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-ai" />
          <span className="text-sm font-medium text-ai">Slide-in drawer interface coming soon</span>
        </div>
        
        <button className="btn-primary">
          Activate AI Copilot
        </button>
      </div>
    </div>
  )
}