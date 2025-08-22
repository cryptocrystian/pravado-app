export function SEO() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">SEO/GEO</h1>
        <p className="text-text/60 mt-2">Search engine and generative engine optimization</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Keywords</h3>
          <p className="text-text/60">Track rankings and opportunities</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">AI Answers</h3>
          <p className="text-text/60">Monitor SGE, Perplexity, Gemini presence</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Competitors</h3>
          <p className="text-text/60">Competitive analysis and tracking</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Backlinks</h3>
          <p className="text-text/60">Link building opportunities</p>
        </div>
      </div>
    </div>
  )
}