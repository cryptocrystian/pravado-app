import { Brain, Sparkles, ChevronRight, Star, TrendingUp, AlertCircle } from 'lucide-react'
import { cn } from '../../lib/utils'
import { GlassCard } from './GlassCard'

interface RightRailTileProps {
  title: string;
  insight: string;
  confidence?: number;
  isPremium?: boolean;
  category?: 'trending' | 'optimization' | 'alert' | 'insight';
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  className?: string;
}

function CategoryIcon({ category }: { category: RightRailTileProps['category'] }) {
  switch (category) {
    case 'trending':
      return <TrendingUp className="h-4 w-4" />
    case 'optimization':
      return <Sparkles className="h-4 w-4" />
    case 'alert':
      return <AlertCircle className="h-4 w-4" />
    default:
      return <Brain className="h-4 w-4" />
  }
}

function ConfidenceIndicator({ confidence }: { confidence: number }) {
  const getColor = () => {
    if (confidence >= 90) return 'text-ai-teal-300 bg-ai-teal-500/15';
    if (confidence >= 70) return 'text-ai-gold-300 bg-ai-gold-500/15';
    return 'text-foreground/60 bg-foreground/10';
  };

  return (
    <div className={cn("px-2 py-0.5 rounded text-xs font-medium", getColor())}>
      {confidence}% confident
    </div>
  );
}

export function RightRailTile({
  title,
  insight,
  confidence = 85,
  isPremium = false,
  category = 'insight',
  actions = [],
  className
}: RightRailTileProps) {
  const categoryStyles = {
    trending: 'border-ai-teal-500/30 bg-gradient-to-br from-ai-teal-500/5 to-transparent',
    optimization: 'border-ai-gold-500/30 bg-gradient-to-br from-ai-gold-500/5 to-transparent',
    alert: 'border-red-400/30 bg-gradient-to-br from-red-400/5 to-transparent',
    insight: 'border-white/10 bg-white/5'
  };

  return (
    <GlassCard className={cn(
      "relative p-5 transition-all duration-200 hover:bg-white/10",
      categoryStyles[category],
      className
    )}>
      {/* Premium badge */}
      {isPremium && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-ai-gold-500 to-ai-gold-600 p-2 rounded-lg shadow-lg">
          <Star className="h-3 w-3 text-white" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={cn(
          "p-2 rounded-lg shrink-0",
          category === 'trending' && "bg-ai-teal-500/10 text-ai-teal-500",
          category === 'optimization' && "bg-ai-gold-500/10 text-ai-gold-500",
          category === 'alert' && "bg-red-400/10 text-red-400",
          category === 'insight' && "bg-ai-teal-500/10 text-ai-teal-500"
        )}>
          <CategoryIcon category={category} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground mb-1 leading-tight">
            {title}
          </h4>
          <ConfidenceIndicator confidence={confidence} />
        </div>
      </div>

      {/* AI insight display */}
      <div className="mb-4">
        <p className="text-sm text-foreground/80 leading-relaxed">
          {insight}
        </p>
      </div>

      {/* Action buttons with proper states */}
      {actions.length > 0 && (
        <div className="flex flex-col gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai-teal-500 focus-visible:ring-offset-2",
                action.variant === 'primary' 
                  ? "bg-gradient-to-r from-ai-teal-500 to-ai-gold-500 text-white hover:opacity-90"
                  : "text-foreground/80 hover:text-foreground hover:bg-white/10"
              )}
            >
              <span>{action.label}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ))}
        </div>
      )}

      {/* Default action if no actions provided */}
      {actions.length === 0 && (
        <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai-teal-500 focus-visible:ring-offset-2">
          <span>Learn More</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Premium gold accent */}
      {isPremium && (
        <div className="absolute inset-0 rounded-lg pointer-events-none">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-ai-gold-500/10 to-transparent opacity-50" />
          <div className="absolute inset-0 rounded-lg border border-ai-gold-500/20" />
        </div>
      )}
    </GlassCard>
  );
}