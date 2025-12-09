import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

/**
 * Metric types available in the Financial Anomaly Engine
 */
export enum MetricType {
  USI = 'USI', // Unexpected Spike Index
  LCL = 'LCL', // Liquidity Chaos Level
  VSS = 'VSS', // Volatility Storm Score
  MPW = 'MPW', // Market Panic Wave
  SPS = 'SPS', // Synthetic Price Shock
  ADF = 'ADF', // Algorithmic Distortion Factor
}

/**
 * Noise model types for anomaly generation
 */
export enum NoiseModel {
  GAUSSIAN = 'gaussian',
  UNIFORM = 'uniform',
  CHAOTIC = 'chaotic',
}

/**
 * Query structure for the datasource
 */
export interface AnomalyQuery extends DataQuery {
  metricType: MetricType;
  volatilityLevel: number; // 0-100
  spikeFrequency: number; // Number of spikes per time range
}

/**
 * Default query values
 */
export const defaultQuery: Partial<AnomalyQuery> = {
  metricType: MetricType.USI,
  volatilityLevel: 50,
  spikeFrequency: 5,
};

/**
 * Configuration options for the datasource
 */
export interface AnomalyDataSourceOptions extends DataSourceJsonData {
  engineSeed?: number;
  noiseModel?: NoiseModel;
}

/**
 * Secure configuration fields (not currently used but available for future)
 */
export interface AnomalySecureJsonData {
  apiKey?: string;
}

/**
 * Metric metadata for display and calculation
 */
export interface MetricMetadata {
  name: string;
  description: string;
  baseValue: number;
  volatilityMultiplier: number;
}

/**
 * Metadata for all available metrics
 */
export const METRIC_METADATA: Record<MetricType, MetricMetadata> = {
  [MetricType.USI]: {
    name: 'Unexpected Spike Index',
    description: 'Measures sudden price movements that deviate from expected patterns',
    baseValue: 100,
    volatilityMultiplier: 1.5,
  },
  [MetricType.LCL]: {
    name: 'Liquidity Chaos Level',
    description: 'Quantifies market liquidity disruptions and order book imbalances',
    baseValue: 50,
    volatilityMultiplier: 2.0,
  },
  [MetricType.VSS]: {
    name: 'Volatility Storm Score',
    description: 'Tracks clustering of high-volatility periods',
    baseValue: 75,
    volatilityMultiplier: 2.5,
  },
  [MetricType.MPW]: {
    name: 'Market Panic Wave',
    description: 'Detects coordinated selling pressure and fear-driven behavior',
    baseValue: 30,
    volatilityMultiplier: 3.0,
  },
  [MetricType.SPS]: {
    name: 'Synthetic Price Shock',
    description: 'Simulates extreme price movements from external shocks',
    baseValue: 200,
    volatilityMultiplier: 4.0,
  },
  [MetricType.ADF]: {
    name: 'Algorithmic Distortion Factor',
    description: 'Identifies anomalies caused by automated trading systems',
    baseValue: 85,
    volatilityMultiplier: 1.8,
  },
};
