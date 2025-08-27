export function ContentStudio() {
  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Content Studio with Light Island */}
      <div data-surface="content" className="p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Content Studio</h1>
          <p className="text-gray-600">
            Create, edit, and manage your content with AI-powered assistance
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Editor</h2>
              <textarea
                className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ai-teal-500 focus:border-ai-teal-500"
                placeholder="Start writing your content here..."
                defaultValue="# AI Marketing Automation: The Future is Now

Artificial intelligence is transforming how businesses approach marketing automation..."
              />
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm bg-ai-teal-500 text-white rounded-lg hover:bg-ai-teal-600 transition-colors">
                    Save Draft
                  </button>
                  <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Preview
                  </button>
                </div>
                
                <div className="text-sm text-gray-500">
                  Auto-saved 2 minutes ago
                </div>
              </div>
            </div>
          </div>
          
          {/* Brief Panel */}
          <div className="space-y-6">
            {/* Brief */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Brief</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    B2B Marketing Directors at mid-size SaaS companies
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SERP Intent
                  </label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    Informational: "AI marketing automation benefits"
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tone
                  </label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    Professional, authoritative, with practical examples
                  </p>
                </div>
              </div>
            </div>
            
            {/* AI Sidebar */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Assistant</h3>
              
              <div className="space-y-3">
                <button className="w-full p-3 text-left bg-ai-teal-50 border border-ai-teal-200 rounded-lg hover:bg-ai-teal-100 transition-colors">
                  <div className="font-medium text-ai-teal-900">Generate</div>
                  <div className="text-sm text-ai-teal-700">Create new content from brief</div>
                </button>
                
                <button className="w-full p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">Rewrite</div>
                  <div className="text-sm text-gray-600">Improve selected text</div>
                </button>
                
                <button className="w-full p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">Repurpose</div>
                  <div className="text-sm text-gray-600">Create social posts, emails</div>
                </button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Style Presets</h4>
                <div className="space-y-1">
                  <button className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1">
                    → Thought Leadership
                  </button>
                  <button className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1">
                    → Product Update
                  </button>
                  <button className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1">
                    → Customer Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}