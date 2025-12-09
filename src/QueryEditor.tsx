import React, { ChangeEvent } from 'react';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { InlineField, Select, Input, Slider } from '@grafana/ui';
import { AnomalyDataSource } from './datasource';
import { AnomalyQuery, AnomalyDataSourceOptions, MetricType, METRIC_METADATA } from './types';

type Props = QueryEditorProps<AnomalyDataSource, AnomalyQuery, AnomalyDataSourceOptions>;

/**
 * Query Editor Component
 * Provides UI controls for configuring anomaly queries
 */
export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  // Metric type options
  const metricTypeOptions: Array<SelectableValue<MetricType>> = Object.values(MetricType).map((type) => ({
    label: METRIC_METADATA[type].name,
    value: type,
    description: METRIC_METADATA[type].description,
  }));

  // Handle metric type change
  const onMetricTypeChange = (selection: SelectableValue<MetricType>) => {
    onChange({
      ...query,
      metricType: selection.value || MetricType.USI,
    });
    onRunQuery();
  };

  // Handle volatility level change (from slider)
  const onVolatilityChange = (value?: number) => {
    onChange({
      ...query,
      volatilityLevel: value ?? 50,
    });
    onRunQuery();
  };

  // Handle volatility level change (from input)
  const onVolatilityInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(100, Number(event.target.value) || 0));
    onChange({
      ...query,
      volatilityLevel: value,
    });
  };

  // Handle spike frequency change
  const onSpikeFrequencyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(50, Number(event.target.value) || 0));
    onChange({
      ...query,
      spikeFrequency: value,
    });
    onRunQuery();
  };

  return (
    <div className="gf-form-group">
      <div className="gf-form">
        <InlineField
          label="Metric Type"
          labelWidth={20}
          tooltip="Select the type of financial anomaly metric to monitor"
        >
          <Select
            options={metricTypeOptions}
            value={query.metricType || MetricType.USI}
            onChange={onMetricTypeChange}
            width={40}
          />
        </InlineField>
      </div>

      <div className="gf-form">
        <InlineField
          label="Volatility Level"
          labelWidth={20}
          tooltip="Controls the intensity of market volatility (0-100). Higher values produce more chaotic patterns."
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '400px' }}>
            <div style={{ flexGrow: 1, minWidth: '200px' }}>
              <Slider
                value={query.volatilityLevel ?? 50}
                min={0}
                max={100}
                step={1}
                onAfterChange={onVolatilityChange}
                onChange={onVolatilityChange}
              />
            </div>
            <Input
              type="number"
              value={query.volatilityLevel ?? 50}
              onChange={onVolatilityInputChange}
              onBlur={onRunQuery}
              width={10}
              min={0}
              max={100}
            />
          </div>
        </InlineField>
      </div>

      <div className="gf-form">
        <InlineField
          label="Spike Frequency"
          labelWidth={20}
          tooltip="Number of anomalous spikes to generate in the time range (0-50)"
        >
          <Input
            type="number"
            value={query.spikeFrequency ?? 5}
            onChange={onSpikeFrequencyChange}
            width={10}
            min={0}
            max={50}
            step={1}
          />
        </InlineField>
      </div>

      <div style={{ marginTop: '12px', padding: '8px', background: '#1f1f1f', borderRadius: '4px' }}>
        <div style={{ fontSize: '12px', color: '#999' }}>
          <strong>Current Configuration:</strong>
          <div style={{ marginTop: '4px' }}>
            Metric: {METRIC_METADATA[query.metricType || MetricType.USI].name}
          </div>
          <div>Volatility: {query.volatilityLevel ?? 50}%</div>
          <div>Expected Spikes: {query.spikeFrequency ?? 5}</div>
        </div>
      </div>
    </div>
  );
}
