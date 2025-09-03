import { cn } from '../../lib/utils'

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle';
}

export function GlassCard({ 
  children, 
  className, 
  variant = 'default' 
}: GlassCardProps) {
  const variantStyles = {
    default: 'glass-card',
    elevated: 'glass-card shadow-xl',
    subtle: 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg'
  };

  return (
    <div 
      className={cn(
        variantStyles[variant],
        "relative",
        className
      )}
    >
      {/* Noise texture overlay for enhanced glass effect */}
      {variant !== 'subtle' && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-inherit opacity-[0.035] mix-blend-mode-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' opacity='0.35'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.05'/></svg>")`
          }}
        />
      )}
      
      {/* Content with proper z-index layering */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}