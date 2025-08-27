import { Wallet as WalletIcon, Plus } from 'lucide-react'
import { PRCredit } from '../types'

interface WalletProps {
  credits: PRCredit[]
  onAddCredits?: () => void
}

export function Wallet({ credits, onAddCredits }: WalletProps) {
  const basicCredits = credits.find(c => c.type === 'basic')
  const premiumCredits = credits.find(c => c.type === 'premium')

  return (
    <div className="bg-white dark:bg-surface-dark rounded-lg p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <WalletIcon className="w-5 h-5 text-premium-gold" />
          <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
            PR Credits
          </h3>
        </div>
      </div>
      
      <div className="space-y-3">
        {basicCredits && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <div>
              <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                Basic Distribution
              </p>
              <p className="text-xs text-gray-500">
                Expires {new Date(basicCredits.expiresAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
                {basicCredits.remaining}
              </p>
              <p className="text-xs text-gray-500">of {basicCredits.total}</p>
            </div>
          </div>
        )}
        
        {premiumCredits && (
          <div className="flex items-center justify-between p-3 bg-premium-gold/10 rounded">
            <div>
              <p className="text-sm font-medium text-premium-gold">
                Premium Distribution
              </p>
              <p className="text-xs text-premium-gold/70">
                Expires {new Date(premiumCredits.expiresAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-premium-gold">
                {premiumCredits.remaining}
              </p>
              <p className="text-xs text-premium-gold/70">of {premiumCredits.total}</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={onAddCredits}
          className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-premium-gold hover:text-premium-gold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Credits</span>
        </button>
      </div>
    </div>
  )
}