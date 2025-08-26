import { cn } from '../../lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  gradient?: boolean
  className?: string
}

export function GlassCard({ 
  children, 
  gradient = false, 
  className, 
  ...props 
}: GlassCardProps) {
  return (
    <div
      className={cn(
        // Base glass effect
        "bg-[hsl(var(--glass-fill))] backdrop-blur-md border border-[hsl(var(--glass-stroke))] rounded-2xl shadow-glass",
        // Gradient hairline option
        gradient && "border-transparent bg-gradient-to-br from-[hsl(var(--glass-stroke))] via-transparent to-[hsl(var(--glass-stroke))] p-px",
        className
      )}
      {...props}
    >
      {gradient ? (
        <div className="bg-[hsl(var(--glass-fill))] backdrop-blur-md rounded-2xl h-full w-full">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  )
}