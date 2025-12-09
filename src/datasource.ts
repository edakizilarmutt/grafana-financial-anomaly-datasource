import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
  TimeRange,
} from '@grafana/data';

import {
  AnomalyQuery,
  AnomalyDataSourceOptions,
  MetricType,
  NoiseModel,
  METRIC_METADATA,
} from './types';

/**
 * Seeded random number generator for reproducible results
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  gaussian(mean: number = 0, stdDev: number = 1): number {
    // Box-Muller transform
    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
  }

  uniform(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

export class AnomalyDataSource extends DataSourceApi<AnomalyQuery, AnomalyDataSourceOptions> {
  private engineSeed: number;
  private noiseModel: NoiseModel;

  constructor(instanceSettings: DataSourceInstanceSettings<AnomalyDataSourceOptions>) {
    super(instanceSettings);
    this.engineSeed = instanceSettings.jsonData.engineSeed || Date.now();
    this.noiseModel = instanceSettings.jsonData.noiseModel || NoiseModel.GAUSSIAN;
  }

  /**
   * Main query method - generates time series data
   */
  async query(options: DataQueryRequest<AnomalyQuery>): Promise<DataQueryResponse> {
    const { range, targets } = options;

    const data = targets.map((target) => {
      const query = {
        ...target,
        metricType: target.metricType || MetricType.USI,
        volatilityLevel: target.volatilityLevel ?? 50,
        spikeFrequency: target.spikeFrequency ?? 5,
      };

      return this.generateTimeSeries(query, range);
    });

    return { data };
  }

  /**
   * Generate time series data for a single query
   */
  private generateTimeSeries(query: AnomalyQuery, range: TimeRange): MutableDataFrame {
    const from = range.from.valueOf();
    const to = range.to.valueOf();
    const points = this.calculateDataPoints(from, to);
    const interval = (to - from) / points;

    const metadata = METRIC_METADATA[query.metricType];
    const rng = new SeededRandom(this.engineSeed + this.hashString(query.refId));

    const timeValues: number[] = [];
    const values: number[] = [];
    const anomalyScores: number[] = [];
    const labels: string[] = [];

    // Generate spike positions
    const spikePositions = this.generateSpikePositions(points, query.spikeFrequency, rng);

    for (let i = 0; i < points; i++) {
      const timestamp = from + i * interval;
      const normalizedTime = i / points;

      // Calculate base value with multiple components
      let value = metadata.baseValue;

      // Add trend component
      value += this.calculateTrend(normalizedTime, query.metricType);

      // Add periodic components
      value += this.calculatePeriodicComponent(normalizedTime, rng);

      // Add volatility clustering
      const volatilityCluster = this.calculateVolatilityCluster(normalizedTime, query.volatilityLevel, rng);
      value += volatilityCluster;

      // Add noise based on model
      const noise = this.generateNoise(rng, query.volatilityLevel / 100);
      value += noise * metadata.volatilityMultiplier;

      // Add spikes
      const spikeValue = spikePositions[i] ? this.generateSpike(query, rng) : 0;
      value += spikeValue;

      // Calculate anomaly score (0-100)
      const anomalyScore = this.calculateAnomalyScore(
        value,
        metadata.baseValue,
        spikeValue,
        volatilityCluster
      );

      // Generate label
      const label = this.generateLabel(anomalyScore, query.metricType);

      timeValues.push(timestamp);
      values.push(Math.max(0, value)); // Ensure non-negative
      anomalyScores.push(anomalyScore);
      labels.push(label);
    }

    return new MutableDataFrame({
      refId: query.refId,
      fields: [
        { name: 'Time', type: FieldType.time, values: timeValues },
        { name: metadata.name, type: FieldType.number, values: values },
        { name: 'Anomaly Score', type: FieldType.number, values: anomalyScores },
        { name: 'Label', type: FieldType.string, values: labels },
      ],
    });
  }

  /**
   * Calculate appropriate number of data points based on time range
   */
  private calculateDataPoints(from: number, to: number): number {
    const duration = to - from;
    const hours = duration / (1000 * 60 * 60);

    if (hours < 1) {
      return 200;
    } else if (hours < 24) {
      return 500;
    } else if (hours < 168) {
      return 700;
    } else {
      return 1000;
    }
  }

  /**
   * Generate random spike positions
   */
  private generateSpikePositions(points: number, frequency: number, rng: SeededRandom): boolean[] {
    const positions: boolean[] = new Array(points).fill(false);
    const numSpikes = Math.min(frequency, points / 10);

    for (let i = 0; i < numSpikes; i++) {
      const position = Math.floor(rng.next() * points);
      positions[position] = true;
    }

    return positions;
  }

  /**
   * Calculate trend component based on metric type
   */
  private calculateTrend(normalizedTime: number, metricType: MetricType): number {
    switch (metricType) {
      case MetricType.USI:
        return Math.sin(normalizedTime * Math.PI * 2) * 15;
      case MetricType.LCL:
        return Math.cos(normalizedTime * Math.PI * 3) * 10;
      case MetricType.VSS:
        return normalizedTime * 20 - 10;
      case MetricType.MPW:
        return Math.exp(-normalizedTime * 2) * 25;
      case MetricType.SPS:
        return Math.sin(normalizedTime * Math.PI * 4) * 30;
      case MetricType.ADF:
        return Math.tan(normalizedTime * Math.PI / 2) * 5;
      default:
        return 0;
    }
  }

  /**
   * Calculate periodic component with multiple frequencies
   */
  private calculatePeriodicComponent(normalizedTime: number, rng: SeededRandom): number {
    const freq1 = Math.sin(normalizedTime * Math.PI * 8) * 8;
    const freq2 = Math.cos(normalizedTime * Math.PI * 16) * 4;
    const freq3 = Math.sin(normalizedTime * Math.PI * 32) * 2;

    return freq1 + freq2 + freq3;
  }

  /**
   * Calculate volatility clustering effect
   */
  private calculateVolatilityCluster(
    normalizedTime: number,
    volatilityLevel: number,
    rng: SeededRandom
  ): number {
    // GARCH-like volatility clustering
    const clusterCenter = 0.5 + rng.gaussian(0, 0.2);
    const distance = Math.abs(normalizedTime - clusterCenter);
    const clusterStrength = Math.exp(-distance * 10);

    return rng.gaussian(0, volatilityLevel / 10) * clusterStrength;
  }

  /**
   * Generate noise based on selected model
   */
  private generateNoise(rng: SeededRandom, intensity: number): number {
    switch (this.noiseModel) {
      case NoiseModel.GAUSSIAN:
        return rng.gaussian(0, 5 * intensity);
      case NoiseModel.UNIFORM:
        return rng.uniform(-10 * intensity, 10 * intensity);
      case NoiseModel.CHAOTIC:
        // Logistic map chaos
        let x = rng.next();
        const r = 3.9;
        x = r * x * (1 - x);
        return (x - 0.5) * 20 * intensity;
      default:
        return 0;
    }
  }

  /**
   * Generate spike value
   */
  private generateSpike(query: AnomalyQuery, rng: SeededRandom): number {
    const metadata = METRIC_METADATA[query.metricType];
    const direction = rng.next() > 0.5 ? 1 : -1;
    const magnitude = rng.uniform(0.5, 2.0) * metadata.baseValue * (query.volatilityLevel / 50);

    return direction * magnitude;
  }

  /**
   * Calculate anomaly score (0-100)
   */
  private calculateAnomalyScore(
    value: number,
    baseValue: number,
    spikeValue: number,
    volatilityCluster: number
  ): number {
    const deviation = Math.abs(value - baseValue);
    const normalizedDeviation = deviation / baseValue;

    let score = normalizedDeviation * 50;

    if (Math.abs(spikeValue) > 0) {
      score += 30;
    }

    if (Math.abs(volatilityCluster) > 10) {
      score += 20;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Generate label based on anomaly score
   */
  private generateLabel(score: number, metricType: MetricType): string {
    if (score > 80) {
      return 'CRITICAL';
    } else if (score > 60) {
      return 'HIGH';
    } else if (score > 40) {
      return 'MEDIUM';
    } else if (score > 20) {
      return 'LOW';
    } else {
      return 'NORMAL';
    }
  }

  /**
   * Hash string to number for seeding
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * Test datasource connection
   */
  async testDatasource(): Promise<{ status: string; message: string }> {
    try {
      // Test data generation
      const testRange = {
        from: { valueOf: () => Date.now() - 3600000 } as any,
        to: { valueOf: () => Date.now() } as any,
        raw: { from: 'now-1h', to: 'now' },
      };

      const testQuery: AnomalyQuery = {
        refId: 'test',
        metricType: MetricType.USI,
        volatilityLevel: 50,
        spikeFrequency: 5,
      };

      const frame = this.generateTimeSeries(testQuery, testRange);

      if (frame.length > 0) {
        return {
          status: 'success',
          message: `Financial Anomaly Engine is operational. Using ${this.noiseModel} noise model with seed ${this.engineSeed}.`,
        };
      }

      return {
        status: 'error',
        message: 'Failed to generate test data',
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}
