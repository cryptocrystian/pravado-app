import { FileText, Megaphone, Link2, Download, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { GlassCard } from './GlassCard'
import { trackFlow, FLOWS } from '../../services/analyticsService'

interface QuickActionProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

function QuickAction({ icon: Icon, label, description, onClick, variant = 'primary' }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start gap-3 p-5 rounded-xl text-left transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2",
        "hover:transform hover:scale-[1.02]",
        variant === 'primary' 
          ? "bg-ai text-white shadow-lg hover:shadow-xl"
          : "bg-surface/5 border border-white/10 text-foreground hover:bg-surface/10 hover:border-white/20"
      )}
    >
      {/* Icon with background */}
      <div className={cn(
        "p-3 rounded-lg transition-colors",
        variant === 'primary' 
          ? "bg-surface/20" 
          : "bg-ai group-hover:bg-ai"
      )}>
        <Icon className={cn(
          "h-6 w-6 transition-colors",
          variant === 'primary' ? "text-white" : "text-ai"
        )} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={cn(
          "font-semibold mb-1 transition-colors",
          variant === 'primary' ? "text-white" : "text-foreground group-hover:text-ai"
        )}>
          {label}
        </div>
        <div className={cn(
          "text-sm transition-colors",
          variant === 'primary' ? "text-white/80" : "text-foreground/60"
        )}>
          {description}
        </div>
      </div>

      {/* Arrow indicator */}
      <ArrowRight className={cn(
        "h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0",
        variant === 'primary' ? "text-white" : "text-ai"
      )} />

      {/* Hover effect overlay for secondary variant */}
      {variant === 'secondary' && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="absolute inset-0 bg-ai rounded-xl" />
        </div>
      )}
    </button>
  );
}

interface QuickActionsRowProps {
  onAction?: (action: string, route?: string) => void;
  className?: string;
}

export function QuickActionsRow({ onAction, className }: QuickActionsRowProps) {
  const handleAction = (actionKey: string, route?: string) => {
    // Enhanced flow tracking for Phase 3
    const flowMap: Record<string, string> = {
      'new_content': FLOWS.CREATE_CONTENT,
      'new_press_release': FLOWS.START_PR,
      'analyze_url': FLOWS.ANALYZE_URL,
      'export_analytics': FLOWS.EXPORT_DATA
    };

    const flowName = flowMap[actionKey] || 'unknown_quick_action';
    
    // Start flow tracking
    trackFlow.start(flowName, 'quick_actions', {
      action: actionKey,
      route: route || 'unknown',
      variant: 'primary'
    });
    
    // Track as critical action
    trackFlow.critical('quick_action', {
      component: 'quick_actions_row',
      action: actionKey,
      route
    });

    // Track Phase 3 component interaction
    trackFlow.phase3('quick_actions', 'action_clicked', {
      action: actionKey,
      has_route: !!route
    });
    
    // Legacy PostHog tracking (maintained for backward compatibility)
    if (window.posthog) {
      window.posthog.capture('quick_action_clicked', { 
        action: actionKey,
        route: route || 'unknown',
        timestamp: new Date().toISOString()
      });
    }
    
    // Navigate if route provided
    if (route) {
      window.location.href = route;
      // Track navigation completion
      trackFlow.step('navigation', 'quick_actions', {
        destination: route,
        action: actionKey
      });
    }
    
    // Call callback
    onAction?.(actionKey, route);
  };

  return (
    <GlassCard className={cn("p-6", className)}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Quick Actions</h3>
        <p className="text-sm text-foreground/60">Start creating and analyzing with one click</p>
      </div>

      {/* 4 primary actions in responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction
          icon={FileText}
          label="New Content"
          description="Create engaging content"
          variant="primary"
          onClick={() => handleAction('new_content', '/content/new')}
        />
        <QuickAction
          icon={Megaphone}
          label="New PR"
          description="Draft press release"
          variant="secondary"
          onClick={() => handleAction('new_press_release', '/pr/new')}
        />
        <QuickAction
          icon={Link2}
          label="Analyze URL"
          description="Get AI insights"
          variant="secondary"
          onClick={() => handleAction('analyze_url', '/citemind')}
        />
        <QuickAction
          icon={Download}
          label="Export"
          description="Download reports"
          variant="secondary"
          onClick={() => handleAction('export_analytics', '/analytics/export')}
        />
      </div>

      {/* Mobile responsive behavior indicators */}
      <div className="sm:hidden mt-4 flex justify-center">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-ai rounded-full"></div>
          <div className="w-2 h-2 bg-surface/20 rounded-full"></div>
          <div className="w-2 h-2 bg-surface/20 rounded-full"></div>
          <div className="w-2 h-2 bg-surface/20 rounded-full"></div>
        </div>
      </div>
    </GlassCard>
  );
}