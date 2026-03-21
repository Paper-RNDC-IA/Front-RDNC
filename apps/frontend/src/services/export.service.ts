import type { DateRange } from '../types/common';
import type { ExportCombinedApi, ExportModule } from '../types/export';
import { mockExportCombined } from '../constants/mocks';

import { api, withMockFallback } from './api';
import { endpoints } from './endpoints';

export function getCombinedExport(module: ExportModule, dateRange: DateRange): Promise<ExportCombinedApi> {
  return withMockFallback(
    () =>
      api.post<ExportCombinedApi>(endpoints.export.combined, {
        module,
        date_range: dateRange,
      }),
    mockExportCombined,
  );
}
