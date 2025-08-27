// KPI Data Management Hooks
// React hooks for KPI data fetching, caching, and real-time updates

import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
  DashboardData, 
  HeroKPI, 
  MiniKPI, 
  SecondaryKPI, 
  WalletData, 
  PRQueueItem, 
  AlertItem, 
  AgentHealth,
  KPIHookState,
  DashboardHookState
} from '../types/kpi';
import { kpiService } from '../services/kpiService';

/**
 * Base hook for KPI data fetching with loading states and error handling
 */
function useKPIBase<T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    immediate?: boolean;
    pollInterval?: number;
    retryOnError?: boolean;
    onError?: (error: Error) => void;
    onSuccess?: (data: T) => void;
  } = {}
): KPIHookState<T> {
  const {
    immediate = true,
    pollInterval,
    retryOnError = true,
    onError,
    onSuccess
  } = options;
  
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
    lastFetch: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
    lastFetch: null
  });
  
  const pollIntervalRef = useRef<NodeJS.Timeout>(undefined);
  const mountedRef = useRef(true);
  const retryCountRef = useRef(0);
  
  const fetchData = useCallback(async () => {
    if (!mountedRef.current) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fetcher();
      
      if (mountedRef.current) {
        setState({
          data,
          loading: false,
          error: null,
          lastFetch: new Date().toISOString()
        });
        
        retryCountRef.current = 0;
        onSuccess?.(data);
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorObj
        }));
        
        onError?.(errorObj);
        
        // Retry logic
        if (retryOnError && retryCountRef.current < 3) {
          retryCountRef.current++;
          setTimeout(() => {
            if (mountedRef.current) {
              fetchData();
            }
          }, Math.pow(2, retryCountRef.current) * 1000);
        }
      }
    }
  }, [fetcher, retryOnError, onError, onSuccess]);
  
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);
  
  // Initial fetch
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData, ...dependencies]);
  
  // Polling setup
  useEffect(() => {
    if (pollInterval && pollInterval > 0) {
      pollIntervalRef.current = setInterval(() => {
        if (mountedRef.current) {
          fetchData();
        }
      }, pollInterval);
      
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [pollInterval, fetchData]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);
  
  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    lastFetch: state.lastFetch,
    refetch: fetchData,
    refresh
  };
}

/**
 * Hook for complete dashboard data
 */
export function useDashboardData(options: {
  pollInterval?: number;
  useCache?: boolean;
  onError?: (error: Error) => void;
} = {}): DashboardHookState {
  const { pollInterval = 30000, useCache = true, onError } = options;
  
  const baseHook = useKPIBase(
    () => kpiService.getDashboardData(useCache),
    [],
    {
      pollInterval,
      onError,
      onSuccess: (_data) => {
        console.log('Dashboard data refreshed:', new Date().toISOString());
      }
    }
  );
  
  // Individual refetch methods
  const refetchHero = useCallback(async () => {
    try {
      await kpiService.getHeroKPI();
      if (baseHook.data) {
        // Update only hero data in current state
        // Note: This would require exposing setState from baseHook
        // For now, we'll trigger a full refetch
        baseHook.refetch();
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }, [baseHook, onError]);
  
  const refetchSecondary = useCallback(async () => {
    try {
      await kpiService.getSecondaryKPIs();
      if (baseHook.data) {
        baseHook.refetch();
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }, [baseHook, onError]);
  
  const refetchRightRail = useCallback(async () => {
    try {
      const [_wallet, _prQueue, _alerts, _agentHealth] = await Promise.all([
        kpiService.getWalletData(),
        kpiService.getPRQueue(),
        kpiService.getAlerts(),
        kpiService.getAgentHealth()
      ]);
      
      if (baseHook.data) {
        baseHook.refetch();
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }, [baseHook, onError]);
  
  return {
    ...baseHook,
    refetchHero,
    refetchSecondary,
    refetchRightRail
  };
}

/**
 * Hook for hero KPI data only
 */
export function useHeroKPI(options: {
  pollInterval?: number;
  onError?: (error: Error) => void;
} = {}): KPIHookState<HeroKPI> {
  return useKPIBase(
    () => kpiService.getHeroKPI(),
    [],
    options
  );
}

/**
 * Hook for mini KPIs data
 */
export function useMiniKPIs(options: {
  pollInterval?: number;
  onError?: (error: Error) => void;
} = {}): KPIHookState<MiniKPI[]> {
  return useKPIBase(
    () => kpiService.getMiniKPIs(),
    [],
    options
  );
}

/**
 * Hook for secondary KPIs data
 */
export function useSecondaryKPIs(options: {
  pollInterval?: number;
  onError?: (error: Error) => void;
} = {}): KPIHookState<SecondaryKPI[]> {
  return useKPIBase(
    () => kpiService.getSecondaryKPIs(),
    [],
    options
  );
}

/**
 * Hook for wallet data
 */
export function useWalletData(options: {
  pollInterval?: number;
  onError?: (error: Error) => void;
} = {}): KPIHookState<WalletData> {
  return useKPIBase(
    () => kpiService.getWalletData(),
    [],
    options
  );
}

/**
 * Hook for PR queue data
 */
export function usePRQueue(options: {
  pollInterval?: number;
  onError?: (error: Error) => void;
} = {}): KPIHookState<PRQueueItem[]> {
  return useKPIBase(
    () => kpiService.getPRQueue(),
    [],
    options
  );
}

/**
 * Hook for alerts data
 */
export function useAlerts(options: {
  pollInterval?: number;
  onError?: (error: Error) => void;
  autoMarkAsRead?: boolean;
} = {}): KPIHookState<AlertItem[]> {
  const { autoMarkAsRead = false, ...hookOptions } = options;
  
  const hook = useKPIBase(
    () => kpiService.getAlerts(),
    [],
    hookOptions
  );
  
  // Auto-mark alerts as read after viewing
  useEffect(() => {
    if (autoMarkAsRead && hook.data && hook.data.length > 0) {
      // This would trigger an API call to mark alerts as read
      // For now, we'll just log it
      console.log('Marking alerts as read:', hook.data.map(a => a.id));
    }
  }, [autoMarkAsRead, hook.data]);
  
  return hook;
}

/**
 * Hook for agent health data
 */
export function useAgentHealth(options: {
  pollInterval?: number;
  onError?: (error: Error) => void;
} = {}): KPIHookState<AgentHealth> {
  return useKPIBase(
    () => kpiService.getAgentHealth(),
    [],
    {
      pollInterval: 10000, // More frequent polling for health data
      ...options
    }
  );
}

/**
 * Hook for real-time KPI updates using WebSocket or Server-Sent Events
 */
export function useRealTimeKPIUpdates(options: {
  enabled?: boolean;
  endpoint?: string;
  onUpdate?: (data: Partial<DashboardData>) => void;
  onError?: (error: Error) => void;
} = {}) {
  const { enabled = false, endpoint = '/api/kpi/stream', onUpdate, onError } = options;
  const eventSourceRef = useRef<EventSource | null>(null);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  
  useEffect(() => {
    if (!enabled) return;
    
    const connectToStream = () => {
      try {
        setConnectionState('connecting');
        
        const eventSource = new EventSource(endpoint);
        eventSourceRef.current = eventSource;
        
        eventSource.onopen = () => {
          setConnectionState('connected');
          console.log('Connected to KPI real-time stream');
        };
        
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            onUpdate?.(data);
          } catch (error) {
            console.error('Failed to parse real-time KPI data:', error);
          }
        };
        
        eventSource.onerror = (error) => {
          console.error('KPI real-time stream error:', error);
          setConnectionState('disconnected');
          
          const errorObj = new Error('Real-time stream connection failed');
          onError?.(errorObj);
          
          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            if (eventSourceRef.current) {
              eventSourceRef.current.close();
            }
            connectToStream();
          }, 5000);
        };
        
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        onError?.(errorObj);
        setConnectionState('disconnected');
      }
    };
    
    connectToStream();
    
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setConnectionState('disconnected');
    };
  }, [enabled, endpoint, onUpdate, onError]);
  
  return {
    connectionState,
    disconnect: () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setConnectionState('disconnected');
    }
  };
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticKPIUpdates<T>(
  initialData: T | null,
  updateFn: (data: T) => Promise<T>
) {
  const [optimisticData, setOptimisticData] = useState<T | null>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const updateOptimistically = useCallback(async (newData: T) => {
    // Immediately update UI
    setOptimisticData(newData);
    setIsUpdating(true);
    setError(null);
    
    try {
      // Send update to server
      const result = await updateFn(newData);
      setOptimisticData(result);
    } catch (error) {
      // Revert on error
      setOptimisticData(initialData);
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsUpdating(false);
    }
  }, [initialData, updateFn]);
  
  // Update optimistic data when initial data changes
  useEffect(() => {
    if (!isUpdating) {
      setOptimisticData(initialData);
    }
  }, [initialData, isUpdating]);
  
  return {
    data: optimisticData,
    isUpdating,
    error,
    update: updateOptimistically
  };
}

/**
 * Hook for KPI comparison across time periods
 */
export function useKPIComparison(
  metric: string,
  periods: string[] = ['1d', '7d', '30d']
) {
  const [comparisonData, setComparisonData] = useState<{
    [period: string]: any;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchComparisons = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await Promise.all(
        periods.map(async (period) => {
          const data = await kpiService.getTimeSeriesData(metric, period);
          return { period, data };
        })
      );
      
      const comparisonMap = results.reduce((acc, { period, data }) => {
        acc[period] = data;
        return acc;
      }, {} as { [period: string]: any });
      
      setComparisonData(comparisonMap);
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  }, [metric, periods]);
  
  useEffect(() => {
    fetchComparisons();
  }, [fetchComparisons]);
  
  return {
    data: comparisonData,
    loading,
    error,
    refetch: fetchComparisons
  };
}

/**
 * Custom hook for handling KPI alerts and notifications
 */
export function useKPINotifications() {
  const [notifications, setNotifications] = useState<AlertItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Subscribe to alerts
  const { data: alerts } = useAlerts({ pollInterval: 15000 });
  
  useEffect(() => {
    if (alerts) {
      setNotifications(alerts);
      setUnreadCount(alerts.filter(alert => alert.actionRequired).length);
    }
  }, [alerts]);
  
  const markAsRead = useCallback((alertId: string) => {
    setNotifications(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, actionRequired: false }
          : alert
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);
  
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(alert => ({ ...alert, actionRequired: false }))
    );
    setUnreadCount(0);
  }, []);
  
  const dismissAlert = useCallback((alertId: string) => {
    setNotifications(prev => prev.filter(alert => alert.id !== alertId));
    setUnreadCount(prev => {
      const alert = notifications.find(a => a.id === alertId);
      return alert?.actionRequired ? Math.max(0, prev - 1) : prev;
    });
  }, [notifications]);
  
  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissAlert
  };
}

// Export utility functions
export { kpiService };
