import { useEffect } from 'react'
import { FileText, Target, Users, Lightbulb, Wand2, RotateCcw, Save, Send } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export function ContentStudio() {
  const { setLightMode } = useTheme()

  // Force light mode for Content Studio per spec
  useEffect(() => {
    setLightMode()
  }, [setLightMode])

  return (
    <div className="h-full bg-bg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text">Content Studio</h1>
        <p className="text-text/60 mt-2">Create, edit, and optimize content with AI assistance</p>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Brief Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Content Brief */}
          <div className="card p-6 h-fit">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Content Brief</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Content Type</label>
                <select className="w-full p-2 border border-surface/50 rounded-lg bg-bg focus:ring-2 focus:ring-primary/20 focus:outline-none">
                  <option>Blog Post</option>
                  <option>Press Release</option>
                  <option>Social Post</option>
                  <option>Email Campaign</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Target Audience</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Marketing Directors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Enterprise Leaders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">SMB Owners</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Primary Keywords</label>
                <input 
                  type="text" 
                  placeholder="marketing automation, AI tools..."
                  className="w-full p-2 border border-surface/50 rounded-lg bg-bg focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tone & Style</label>
                <select className="w-full p-2 border border-surface/50 rounded-lg bg-bg focus:ring-2 focus:ring-primary/20 focus:outline-none">
                  <option>Professional & Authoritative</option>
                  <option>Conversational & Friendly</option>
                  <option>Technical & Detailed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">SERP Intent</label>
                <textarea 
                  placeholder="What user problem does this content solve?"
                  className="w-full p-2 h-20 border border-surface/50 rounded-lg bg-bg resize-none focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* AI Assistance Panel */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="h-5 w-5 text-ai" />
              <h3 className="font-semibold">AI Assistant</h3>
              <span className="ai-badge">Live</span>
            </div>
            
            <div className="space-y-3">
              <button className="w-full p-3 text-left border border-surface/50 rounded-lg hover:border-ai/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Generate Outline</span>
                  <Lightbulb className="h-4 w-4 text-ai" />
                </div>
                <p className="text-xs text-text/60 mt-1">Create structured content outline</p>
              </button>
              
              <button className="w-full p-3 text-left border border-surface/50 rounded-lg hover:border-ai/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Improve SEO</span>
                  <Target className="h-4 w-4 text-ai" />
                </div>
                <p className="text-xs text-text/60 mt-1">Optimize for search visibility</p>
              </button>
              
              <button className="w-full p-3 text-left border border-surface/50 rounded-lg hover:border-ai/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rewrite Section</span>
                  <RotateCcw className="h-4 w-4 text-ai" />
                </div>
                <p className="text-xs text-text/60 mt-1">Enhance selected text</p>
              </button>
              
              <button className="w-full p-3 text-left border border-surface/50 rounded-lg hover:border-ai/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tone Adjustment</span>
                  <Users className="h-4 w-4 text-ai" />
                </div>
                <p className="text-xs text-text/60 mt-1">Match target audience</p>
              </button>
            </div>

            <div className="mt-4 p-3 bg-ai/5 rounded-lg border border-ai/20">
              <p className="text-sm text-ai font-medium">💡 AI Suggestion</p>
              <p className="text-xs text-text/70 mt-1">
                Consider adding a case study in section 3 to increase engagement by ~25%
              </p>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="col-span-12 lg:col-span-8">
          <div className="card p-6 h-full flex flex-col">
            {/* Editor Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-surface/50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <input 
                  type="text" 
                  placeholder="Untitled Document"
                  className="text-lg font-semibold bg-transparent focus:outline-none border-none"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-text/60">Auto-saved 2 min ago</span>
                <button className="btn-secondary">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </button>
                <button className="btn-primary">
                  <Send className="h-4 w-4 mr-2" />
                  Publish
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 min-h-0">
              <textarea
                placeholder="Start writing your content here...

Use the AI assistant on the left to:
• Generate outlines and ideas
• Optimize for SEO
• Adjust tone and style
• Get real-time suggestions

The editor supports markdown formatting and will auto-save your progress."
                className="w-full h-full p-4 border border-surface/50 rounded-lg bg-bg resize-none focus:ring-2 focus:ring-primary/20 focus:outline-none font-mono text-sm leading-relaxed"
                style={{ minHeight: '400px' }}
              />
            </div>

            {/* Editor Footer */}
            <div className="mt-4 pt-4 border-t border-surface/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-text/60">Words: 0</span>
                <span className="text-sm text-text/60">Characters: 0</span>
                <span className="text-sm text-text/60">Reading time: 0 min</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-text/60">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}