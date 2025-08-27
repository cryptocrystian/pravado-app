export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Analytics</h1>
        <p className="text-text/60 mt-2">Cross-pillar performance analysis and attribution</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Attribution Map</h3>
          <p className="text-text/60">Track campaign influence across channels</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Share of Voice</h3>
          <p className="text-text/60">Market presence and competitor analysis</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Conversions</h3>
          <p className="text-text/60">Revenue attribution and ROI tracking</p>
        </div>
      </div>
    </div>
  )
}