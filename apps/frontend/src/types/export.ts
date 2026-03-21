import type { DateRange } from './common';

export type ExportModule = 'all' | 'stats' | 'manifests' | 'telemetry' | 'routes' | 'companies';

export type ExportRequest = {
  module: ExportModule;
  date_range: DateRange;
};

export type ExportSummaryApi = {
  label: string;
  total: number;
};

export type ExportCombinedApi = {
  summary: ExportSummaryApi[];
  rows: Record<string, string | number>[];
};
