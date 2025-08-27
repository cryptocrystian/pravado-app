import { TrendingUp, TrendingDown, Minus, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '../../lib/utils'
import { GlassCard } from './GlassCard'

interface KpiTileProps {
  title: string;
  value: string | number;
  delta?: {
    value: string;
    positive: boolean;
  };
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'mini' | 'expanded';
  accentColor?: 'teal' | 'gold' | 'neutral';
  icon?: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  error?: string;
  onClick?: () => void;
  className?: string;
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'neutral' }) {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4" />
    case 'down':
      return <TrendingDown className="h-4 w-4" />
    default:
      return <Minus className="h-4 w-4" />
  }
}

export function KpiTile({
  title,
  value,
  delta,
  trend = 'neutral',
  variant = 'expanded',
  accentColor = 'teal',
  icon: Icon,
  loading = false,
  error,
  onClick,
  className
}: KpiTileProps) {
  const accentClasses = {
    teal: {
      accent: 'text-ai',
      bg: 'bg-ai',
      border: 'border-ai',
      deltaPositive: 'text-ai bg-ai',
      deltaNegative: 'text-premium bg-premium'
    },
    gold: {
      accent: 'text-premium',
      bg: 'bg-premium',
      border: 'border-premium',
      deltaPositive: 'text-premium bg-premium',
      deltaNegative: 'text-ai bg-ai'
    },
    neutral: {
      accent: 'text-foreground/80',
      bg: 'bg-foreground/5',
      border: 'border-foreground/10',
      deltaPositive: 'text-ai bg-ai',
      deltaNegative: 'text-premium bg-premium'
    }
  };

  const colors = accentClasses[accentColor];

  const Component = onClick ? 'button' : 'div';

  // Loading state
  if (loading) {
    return (
      <GlassCard className={cn(
        "flex items-center justify-center",
        variant === 'mini' ? 'h-24' : 'h-32',
        className
      )}>
        <Loader2 className="h-6 w-6 animate-spin text-ai" />
      </GlassCard>
    );
  }

  // Error state
  if (error) {
    return (
      <GlassCard className={cn(
        "flex flex-col items-center justify-center text-center p-4",
        variant === 'mini' ? 'h-24' : 'h-32',
        className
      )}>
        <AlertCircle className="h-5 w-5 text-danger mb-2" />
        <span className="text-xs text-foreground/60">{error}</span>
      </GlassCard>
    );
  }

  return (
    <Component
      onClick={onClick}
      className={cn(
        "relative group w-full text-left",
        onClick && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2 rounded-lg",
        className
      )}
    >
      <GlassCard className={cn(
        "p-4 transition-all duration-200",
        variant === 'mini' ? 'h-24' : 'h-32',
        onClick && "hover:bg-foreground/10"
      )}>
        <div className="flex flex-col h-full">
          {/* Header with icon and trend */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {Icon && (
                <div className={cn("p-1.5 rounded-lg", colors.bg, colors.border, "border")}>
                  <Icon className={cn("h-4 w-4", colors.accent)} />
                </div>
              )}
              <h4 className="text-xs font-medium text-foreground/60 truncate">
                {title}
              </h4>
            </div>
            
            {trend && variant === 'expanded' && (
              <div className={cn(
                "p-1 rounded-full",
                trend === 'up' && "text-ai bg-ai",
                trend === 'down' && "text-premium bg-premium",
                trend === 'neutral' && "text-foreground/40 bg-foreground/5"
              )}>
                <TrendIcon trend={trend} />
              </div>
            )}
          </div>

          {/* Value and delta */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-baseline gap-2 mb-1">
              <span className={cn(
                "font-semibold tracking-tight",
                variant === 'mini' ? 'text-lg' : 'text-2xl',
                colors.accent
              )}>
                {value}
              </span>
              
              {delta && (
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  delta.positive ? colors.deltaPositive : colors.deltaNegative
                )}>
                  {delta.positive ? '+' : ''}{delta.value}
                </span>
              )}
            </div>

            {variant === 'expanded' && (
              <div className="text-xs text-foreground/50">
                vs. last period
              </div>
            )}
          </div>

          {/* Progress indicator for mini variant */}
          {variant === 'mini' && typeof value === 'number' && (
            <div className="w-full h-1 bg-foreground/10 rounded-full overflow-hidden mt-2">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  accentColor === 'teal' && "bg-ai",
                  accentColor === 'gold' && "bg-premium",
                  accentColor === 'neutral' && "bg-foreground/30"
                )}
                style={{ width: `${Math.min(100, Math.max(0, Number(value)))}%` }}
              />
            </div>
          )}
        </div>

        {/* Hover effect overlay */}
        {onClick && (
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="absolute inset-0 bg-ai rounded-lg" />
            <div className="absolute inset-0 border border-ai rounded-lg" />
          </div>
        )}
      </GlassCard>
    </Component>
  );
}