import { CreditCard, Calendar } from 'lucide-react'

export function PR() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">PR & Outreach</h1>
        <p className="text-text/60 mt-2">Manage media relationships and PR campaigns</p>
      </div>
      
      {/* PR Credits Widget */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-premium" />
            <div>
              <h3 className="font-semibold">PR Credits Wallet</h3>
              <p className="text-sm text-text/60">Premium distribution credits</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-premium">12</div>
            <div className="text-sm text-text/60">Credits remaining</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-premium/10 rounded-lg border border-premium/20">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-premium" />
            <span className="text-sm font-medium text-premium">Expires December 31, 2024</span>
          </div>
          <p className="text-xs text-text/70 mt-1">23 days remaining in current cycle</p>
        </div>
        
        <div className="mt-4">
          <button className="btn-primary">Purchase Additional Credits</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Media Outreach</h3>
          <p className="text-text/60">Personalized pitch creation and tracking</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Press Releases</h3>
          <p className="text-text/60">Draft and distribute press releases</p>
        </div>
      </div>
    </div>
  )
}