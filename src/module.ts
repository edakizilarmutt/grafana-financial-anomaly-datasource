import { DataSourcePlugin } from '@grafana/data';
import { AnomalyDataSource } from './datasource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { AnomalyQuery, AnomalyDataSourceOptions } from './types';

/**
 * Export the plugin for Grafana to load
 */
export const plugin = new DataSourcePlugin<AnomalyDataSource, AnomalyQuery, AnomalyDataSourceOptions>(
  AnomalyDataSource
)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
