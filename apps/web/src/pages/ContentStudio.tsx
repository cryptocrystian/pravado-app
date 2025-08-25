import { FileText, Target, Users, Lightbulb, Wand2, RotateCcw, Save, Send } from 'lucide-react'

export function ContentStudio() {
  // No longer forcing light mode - using content islands instead

  return (
    <div className="h-full">
      {/* Header - stays in dark shell */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Content Studio</h1>
        <p className="text-foreground/60 mt-2">Create, edit, and optimize content with AI assistance</p>
      </div>

      {/* Main Content Area - wrapped in true light island */}
      <section data-surface="content" className="glass-card p-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)]">
          {/* Left Panel - Brief & AI */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Content Brief */}
            <div className="bg-white/50 border border-border rounded-lg p-6 h-fit shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-ai-teal-500" />
              <h3 className="font-semibold text-foreground">Content Brief</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Content Type</label>
                <select className="w-full p-2.5 border border-border rounded-lg bg-white/50 focus:ring-2 focus:ring-ai-teal-500/20 focus:border-ai-teal-500/50 focus:outline-none transition-all">
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
                  className="w-full p-2.5 border border-border rounded-lg bg-white/50 focus:ring-2 focus:ring-ai-teal-500/20 focus:border-ai-teal-500/50 focus:outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tone & Style</label>
                <select className="w-full p-2.5 border border-border rounded-lg bg-white/50 focus:ring-2 focus:ring-ai-teal-500/20 focus:border-ai-teal-500/50 focus:outline-none transition-all">
                  <option>Professional & Authoritative</option>
                  <option>Conversational & Friendly</option>
                  <option>Technical & Detailed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">SERP Intent</label>
                <textarea 
                  placeholder="What user problem does this content solve?"
                  className="w-full p-2.5 h-20 border border-border rounded-lg bg-white/50 resize-none focus:ring-2 focus:ring-ai-teal-500/20 focus:border-ai-teal-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* AI Assistance Panel */}
          <div className="bg-white/50 border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="h-5 w-5 text-ai-teal-500" />
              <h3 className="font-semibold text-foreground">AI Assistant</h3>
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-ai-teal-600/15 text-ai-teal-300 border border-ai-teal-600/30 rounded-full">Live</span>
            </div>
            
            <div className="space-y-3">
              <button className="w-full p-3 text-left border border-border/50 rounded-lg hover:border-ai-teal-500/30 hover:bg-ai-teal-500/5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Generate Outline</span>
                  <Lightbulb className="h-4 w-4 text-ai-teal-500" />
                </div>
                <p className="text-xs text-foreground/60 mt-1">Create structured content outline</p>
              </button>
              
              <button className="w-full p-3 text-left border border-border/50 rounded-lg hover:border-ai-teal-500/30 hover:bg-ai-teal-500/5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Improve SEO</span>
                  <Target className="h-4 w-4 text-ai-teal-500" />
                </div>
                <p className="text-xs text-foreground/60 mt-1">Optimize for search visibility</p>
              </button>
              
              <button className="w-full p-3 text-left border border-border/50 rounded-lg hover:border-ai-teal-500/30 hover:bg-ai-teal-500/5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rewrite Section</span>
                  <RotateCcw className="h-4 w-4 text-ai-teal-500" />
                </div>
                <p className="text-xs text-foreground/60 mt-1">Enhance selected text</p>
              </button>
              
              <button className="w-full p-3 text-left border border-border/50 rounded-lg hover:border-ai-teal-500/30 hover:bg-ai-teal-500/5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tone Adjustment</span>
                  <Users className="h-4 w-4 text-ai-teal-500" />
                </div>
                <p className="text-xs text-foreground/60 mt-1">Match target audience</p>
              </button>
            </div>

            <div className="mt-4 p-3 bg-ai-teal-500/5 rounded-lg border border-ai-teal-500/20">
              <p className="text-sm text-ai-teal-600 font-medium">💡 AI Suggestion</p>
              <p className="text-xs text-foreground/70 mt-1">
                Consider adding a case study in section 3 to increase engagement by ~25%
              </p>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white/50 border border-border rounded-lg p-6 h-full flex flex-col shadow-sm">
            {/* Editor Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-ai-teal-500/20">
              <div className="flex items-center gap-2 relative">
                <FileText className="h-5 w-5 text-ai-teal-500" />
                <input 
                  type="text" 
                  placeholder="Untitled Document"
                  className="text-lg font-semibold bg-transparent focus:outline-none border-none text-foreground"
                />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ai-teal-500 transform scale-x-0 transition-transform focus-within:scale-x-100" />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground/60">Auto-saved 2 min ago</span>
                <button className="px-4 py-2 rounded-lg font-medium text-sm text-foreground/80 hover:text-foreground hover:bg-white/5 transition-all border border-border/50">
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Draft
                </button>
                <button className="px-4 py-2 rounded-lg font-medium text-sm bg-gradient-to-r from-ai-teal-600 to-ai-gold-600 text-white hover:opacity-90 transition-all">
                  <Send className="h-4 w-4 mr-2 inline" />
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
                className="w-full h-full p-4 border border-border rounded-lg bg-white/30 resize-none focus:ring-2 focus:ring-ai-teal-500/20 focus:border-ai-teal-500/50 focus:outline-none font-mono text-sm leading-relaxed text-foreground"
                style={{ minHeight: '400px' }}
              />
            </div>

            {/* Editor Footer */}
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground/60">Words: 0</span>
                <span className="text-sm text-foreground/60">Characters: 0</span>
                <span className="text-sm text-foreground/60">Reading time: 0 min</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-ai-teal-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-foreground/60">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
      
      {/* Right rail - Versions & Timeline (outside content island) */}
      <aside className="absolute top-24 right-6 w-64 space-y-4">
        <div className="glass-card p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Versions</h4>
          <div className="space-y-2">
            <div className="text-xs text-foreground/60">
              <div className="flex items-center justify-between py-1">
                <span>Current draft</span>
                <span className="text-ai-teal-300">Active</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>v2.1 - Published</span>
                <span>2 days ago</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-ai-gold-300" />
            Copilot Tips
          </h4>
          <div className="text-xs text-foreground/70 space-y-2">
            <p>• Press ⌘K for quick AI actions</p>
            <p>• Highlight text + Tab for rewrites</p>
            <p>• Use @mentions for citations</p>
          </div>
        </div>
      </aside>
    </div>
  )
}