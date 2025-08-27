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
    if (confidence >= 90) return 'text-ai bg-ai';
    if (confidence >= 70) return 'text-premium bg-premium';
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
    trending: 'border-ai bg-ai
    optimization: 'border-premium bg-ai
    alert: 'border-red-400/30 bg-ai
    insight: 'border-white/10 bg-surface/5'
  };

  return (
    <GlassCard className={cn(
      "relative p-5 transition-all duration-200 hover:bg-surface/10",
      categoryStyles[category],
      className
    )}>
      {/* Premium badge */}
      {isPremium && (
        <div className="absolute -top-2 -right-2 bg-ai p-2 rounded-lg shadow-lg">
          <Star className="h-3 w-3 text-white" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={cn(
          "p-2 rounded-lg shrink-0",
          category === 'trending' && "bg-ai text-ai",
          category === 'optimization' && "bg-premium text-premium",
          category === 'alert' && "bg-red-400/10 text-red-400",
          category === 'insight' && "bg-ai text-ai"
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
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2",
                action.variant === 'primary' 
                  ? "bg-ai text-white hover:opacity-90"
                  : "text-foreground/80 hover:text-foreground hover:bg-surface/10"
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
        <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-surface/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2">
          <span>Learn More</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Premium gold accent */}
      {isPremium && (
        <div className="absolute inset-0 rounded-lg pointer-events-none">
          <div className="absolute inset-0 rounded-lg bg-ai opacity-50" />
          <div className="absolute inset-0 rounded-lg border border-premium" />
        </div>
      )}
    </GlassCard>
  );
}