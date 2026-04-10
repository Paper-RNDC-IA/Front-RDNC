import type { DateRange } from '../types/common';
import type { ExportCombinedApi, ExportModule } from '../types/export';

import { api } from './api';
import { endpoints } from './endpoints';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeExportResponse(payload: unknown): ExportCombinedApi {
  if (isRecord(payload) && Array.isArray(payload.summary) && Array.isArray(payload.rows)) {
    return payload as ExportCombinedApi;
  }

  if (Array.isArray(payload)) {
    return {
      summary: [{ label: 'Filas exportadas', total: payload.length }],
      rows: payload as Record<string, string | number>[],
    };
  }

  if (isRecord(payload)) {
    const rows = Array.isArray(payload.items)
      ? (payload.items as Record<string, string | number>[])
      : [payload as Record<string, string | number>];

    return {
      summary: [{ label: 'Filas exportadas', total: rows.length }],
      rows,
    };
  }

  return {
    summary: [],
    rows: [],
  };
}

export function getCombinedExport(
  module: ExportModule,
  dateRange: DateRange,
): Promise<ExportCombinedApi> {
  return api
    .post<unknown>(endpoints.export.combined, {
      format: 'csv',
      module,
      date_range: dateRange,
    })
    .then(normalizeExportResponse);
}
