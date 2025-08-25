// Delta Calculator Utility
// Computes trends, deltas, and sparkline data from snapshot data

import type { DeltaCalculationInput, DeltaCalculationResult, TimeSeriesDataPoint, SparklineDataPoint } from '../types/kpi';

/**
 * Calculate delta/trend between two values
 */
export function calculateDelta(input: DeltaCalculationInput): DeltaCalculationResult {
  const { current, previous, period, format = 'smart' } = input;
  
  if (previous === 0) {
    return {
      value: current > 0 ? '+∞' : '0',
      percentage: current > 0 ? Infinity : 0,
      positive: current >= 0,
      period: period as 'hourly' | 'daily' | 'weekly' | 'monthly',
      rawChange: current,
      significanceLevel: current > 0 ? 'high' : 'low',
      trend: current > 0 ? 'improving' : 'stable'
    };
  }
  
  const rawChange = current - previous;
  const percentage = (rawChange / Math.abs(previous)) * 100;
  const positive = rawChange >= 0;
  
  // Determine significance based on percentage change
  let significanceLevel: 'low' | 'medium' | 'high';
  const absPercentage = Math.abs(percentage);
  
  if (absPercentage < 2) significanceLevel = 'low';
  else if (absPercentage < 10) significanceLevel = 'medium';
  else significanceLevel = 'high';
  
  // Determine trend
  let trend: 'improving' | 'declining' | 'stable';
  if (Math.abs(percentage) < 1) trend = 'stable';
  else if (positive) trend = 'improving';
  else trend = 'declining';
  
  // Format the delta value
  let value: string;
  switch (format) {
    case 'percentage':
      value = `${positive ? '+' : ''}${percentage.toFixed(1)}%`;
      break;
    case 'absolute':
      value = `${positive ? '+' : ''}${rawChange.toFixed(1)}`;
      break;
    case 'smart':
    default:
      // Use percentage for small numbers, absolute for large ones
      if (Math.abs(current) < 100) {
        value = `${positive ? '+' : ''}${percentage.toFixed(1)}%`;
      } else {
        value = `${positive ? '+' : ''}${formatNumber(rawChange)}`;
      }
      break;
  }
  
  return {
    value,
    percentage,
    positive,
    period: period as 'hourly' | 'daily' | 'weekly' | 'monthly',
    rawChange,
    significanceLevel,
    trend
  };
}

/**
 * Generate sparkline data points from time series data
 */
export function generateSparklineData(
  data: TimeSeriesDataPoint[],
  maxPoints: number = 20
): SparklineDataPoint[] {
  if (data.length === 0) return [];
  
  // Sort by timestamp
  const sortedData = [...data].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Sample data if we have more points than needed
  let sampledData = sortedData;
  if (sortedData.length > maxPoints) {
    const step = Math.floor(sortedData.length / maxPoints);
    sampledData = sortedData.filter((_, index) => index % step === 0);
    
    // Always include the last point
    if (sampledData[sampledData.length - 1] !== sortedData[sortedData.length - 1]) {
      sampledData[sampledData.length - 1] = sortedData[sortedData.length - 1];
    }
  }
  
  return sampledData.map(point => ({
    timestamp: point.timestamp,
    value: point.value
  }));
}

/**
 * Calculate trend direction from an array of values
 */
export function calculateTrendDirection(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable';
  
  const start = values[0];
  const end = values[values.length - 1];
  const change = ((end - start) / Math.abs(start)) * 100;
  
  if (Math.abs(change) < 2) return 'stable';
  return change > 0 ? 'up' : 'down';
}

/**
 * Calculate moving average for smoothing data
 */
export function calculateMovingAverage(values: number[], window: number = 3): number[] {
  if (values.length < window) return values;
  
  const result: number[] = [];
  
  for (let i = 0; i <= values.length - window; i++) {
    const sum = values.slice(i, i + window).reduce((acc, val) => acc + val, 0);
    result.push(sum / window);
  }
  
  return result;
}

/**
 * Detect anomalies in data using simple standard deviation method
 */
export function detectAnomalies(
  values: number[], 
  threshold: number = 2
): { indices: number[], values: number[] } {
  if (values.length < 3) return { indices: [], values: [] };
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  const anomalies: { indices: number[], values: number[] } = { indices: [], values: [] };
  
  values.forEach((value, index) => {
    if (Math.abs(value - mean) > threshold * stdDev) {
      anomalies.indices.push(index);
      anomalies.values.push(value);
    }
  });
  
  return anomalies;
}

/**
 * Calculate confidence intervals for projections
 */
export function calculateConfidenceInterval(
  values: number[], 
  confidence: number = 0.95
): { lower: number, upper: number, mean: number } {
  const n = values.length;
  const mean = values.reduce((sum, val) => sum + val, 0) / n;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
  const stdError = Math.sqrt(variance / n);
  
  // Using t-distribution approximation for confidence interval
  const tValue = getTValue(confidence, n - 1);
  const margin = tValue * stdError;
  
  return {
    mean,
    lower: mean - margin,
    upper: mean + margin
  };
}

/**
 * Simple t-value lookup for common confidence levels
 */
function getTValue(confidence: number, _degreesOfFreedom: number): number {
  // Simplified lookup table for common confidence levels
  const tTable: { [key: number]: number } = {
    0.90: 1.645,
    0.95: 1.96,
    0.99: 2.576
  };
  
  return tTable[confidence] || 1.96;
}

/**
 * Format number with appropriate units (K, M, B)
 */
export function formatNumber(num: number): string {
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (abs >= 1e9) {
    return `${sign}${(abs / 1e9).toFixed(1)}B`;
  } else if (abs >= 1e6) {
    return `${sign}${(abs / 1e6).toFixed(1)}M`;
  } else if (abs >= 1e3) {
    return `${sign}${(abs / 1e3).toFixed(1)}K`;
  }
  
  return `${sign}${abs.toFixed(0)}`;
}

/**
 * Calculate percentage change with safe handling of zero values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  
  return ((current - previous) / Math.abs(previous)) * 100;
}

/**
 * Generate synthetic sparkline data for development/testing
 */
export function generateMockSparklineData(
  baseValue: number,
  points: number = 20,
  volatility: number = 0.1,
  trend: number = 0.02
): SparklineDataPoint[] {
  const data: SparklineDataPoint[] = [];
  const now = new Date();
  
  for (let i = 0; i < points; i++) {
    const timestamp = new Date(now.getTime() - (points - i - 1) * 60 * 60 * 1000).toISOString();
    
    // Add trend and random volatility
    const trendComponent = baseValue * trend * i;
    const randomComponent = baseValue * volatility * (Math.random() - 0.5) * 2;
    const value = Math.max(0, baseValue + trendComponent + randomComponent);
    
    data.push({ timestamp, value: Math.round(value * 100) / 100 });
  }
  
  return data;
}

/**
 * Smooth data using exponential smoothing
 */
export function exponentialSmoothing(values: number[], alpha: number = 0.3): number[] {
  if (values.length === 0) return [];
  
  const smoothed: number[] = [values[0]];
  
  for (let i = 1; i < values.length; i++) {
    const smoothedValue = alpha * values[i] + (1 - alpha) * smoothed[i - 1];
    smoothed.push(smoothedValue);
  }
  
  return smoothed;
}
