import React, { ChangeEvent } from 'react';
import { DataSourcePluginOptionsEditorProps, SelectableValue } from '@grafana/data';
import { InlineField, Input, Select, FieldSet } from '@grafana/ui';
import { AnomalyDataSourceOptions, NoiseModel } from './types';

interface Props extends DataSourcePluginOptionsEditorProps<AnomalyDataSourceOptions> {}

/**
 * Config Editor Component
 * Provides configuration options for the Financial Anomaly Engine datasource
 */
export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;
  const { jsonData } = options;

  // Noise model options
  const noiseModelOptions: Array<SelectableValue<NoiseModel>> = [
    {
      label: 'Gaussian',
      value: NoiseModel.GAUSSIAN,
      description: 'Normal distribution noise - smooth, bell-curve patterns',
    },
    {
      label: 'Uniform',
      value: NoiseModel.UNIFORM,
      description: 'Uniform random noise - equally distributed fluctuations',
    },
    {
      label: 'Chaotic',
      value: NoiseModel.CHAOTIC,
      description: 'Chaotic system noise - complex, unpredictable patterns',
    },
  ];

  // Handle engine seed change
  const onEngineSeedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value) || undefined;
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        engineSeed: value,
      },
    });
  };

  // Handle noise model change
  const onNoiseModelChange = (selection: SelectableValue<NoiseModel>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        noiseModel: selection.value,
      },
    });
  };

  // Generate random seed
  const generateRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 1000000);
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        engineSeed: randomSeed,
      },
    });
  };

  return (
    <div>
      <FieldSet label="Anomaly Engine Configuration">
        <InlineField
          label="Engine Seed"
          labelWidth={20}
          tooltip="Seed value for the random number generator. Use the same seed for reproducible results."
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input
              type="number"
              value={jsonData.engineSeed || ''}
              onChange={onEngineSeedChange}
              placeholder="Enter seed or leave empty for auto"
              width={30}
            />
            <button
              onClick={generateRandomSeed}
              style={{
                padding: '6px 12px',
                background: '#3f51b5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Generate Random
            </button>
          </div>
        </InlineField>

        <InlineField
          label="Noise Model"
          labelWidth={20}
          tooltip="Mathematical model used for generating baseline noise in the anomaly signals"
        >
          <Select
            options={noiseModelOptions}
            value={jsonData.noiseModel || NoiseModel.GAUSSIAN}
            onChange={onNoiseModelChange}
            width={40}
          />
        </InlineField>
      </FieldSet>

      <FieldSet label="Information">
        <div style={{ padding: '12px', background: '#1f1f1f', borderRadius: '4px' }}>
          <h4 style={{ marginTop: 0, color: '#fff' }}>Financial Anomaly Engine</h4>
          <p style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.6' }}>
            This datasource generates synthetic financial market anomaly signals using advanced mathematical
            models. It simulates various market conditions including:
          </p>
          <ul style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.8' }}>
            <li>
              <strong>Gaussian Noise:</strong> Standard market fluctuations following normal distribution
            </li>
            <li>
              <strong>Uniform Noise:</strong> Evenly distributed random movements
            </li>
            <li>
              <strong>Chaotic Noise:</strong> Complex patterns from deterministic chaos theory
            </li>
          </ul>
          <p style={{ fontSize: '13px', color: '#aaa', marginTop: '12px' }}>
            <strong>Current Seed:</strong> {jsonData.engineSeed || 'Auto-generated'}
            <br />
            <strong>Noise Model:</strong> {jsonData.noiseModel || 'gaussian'}
            <br />
            <br />
            <strong>Created by:</strong> Eda Kızılarmut - Fall-2025
          </p>
        </div>
      </FieldSet>
    </div>
  );
}
