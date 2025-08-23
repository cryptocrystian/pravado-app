import { useEffect, useRef, useCallback } from 'react'

interface UsePollingOptions {
  interval?: number
  immediate?: boolean
  enabled?: boolean
}

/**
 * Custom hook for polling data at regular intervals
 * Useful for keeping dashboard data fresh
 */
export function usePolling(
  callback: () => void | Promise<void>,
  options: UsePollingOptions = {}
) {
  const {
    interval = 30000, // 30 seconds default
    immediate = true,
    enabled = true,
  } = options

  const intervalRef = useRef<NodeJS.Timeout>()
  const callbackRef = useRef(callback)

  // Keep callback ref current
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const start = useCallback(() => {
    if (!enabled) return

    if (immediate) {
      callbackRef.current()
    }

    intervalRef.current = setInterval(() => {
      callbackRef.current()
    }, interval)
  }, [interval, immediate, enabled])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }, [])

  const restart = useCallback(() => {
    stop()
    start()
  }, [start, stop])

  useEffect(() => {
    if (enabled) {
      start()
    } else {
      stop()
    }

    return stop
  }, [enabled, start, stop])

  // Cleanup on unmount
  useEffect(() => {
    return stop
  }, [stop])

  return { start, stop, restart }
}

/**
 * Hook for polling dashboard metrics
 */
export function useDashboardPolling(
  fetchMetrics: () => void,
  interval: number = 60000 // 1 minute
) {
  return usePolling(fetchMetrics, {
    interval,
    immediate: false, // Don't fetch immediately as it's handled by the component
    enabled: true,
  })
}

/**
 * Hook for polling analytics data
 */
export function useAnalyticsPolling(
  fetchData: () => void,
  interval: number = 300000 // 5 minutes
) {
  return usePolling(fetchData, {
    interval,
    immediate: false,
    enabled: true,
  })
}