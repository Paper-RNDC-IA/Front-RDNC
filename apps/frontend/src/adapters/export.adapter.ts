import type { SummaryItem } from '../types/common';
import type { ExportCombinedApi } from '../types/export';
import { formatNumber } from '../utils/formatters';

export function adaptExportSummary(data: ExportCombinedApi): SummaryItem[] {
  return data.summary.map((item) => ({
    label: item.label,
    value: formatNumber(item.total),
  }));
}
