import type { ChartDatum, KpiItem, SummaryItem } from '../types/common';
import type {
  CompanyFileApi,
  CompanyFileInsightApi,
  CompanyFileSummaryApi,
} from '../types/company-portal';

import { formatNumber } from '../utils/formatters';

export type CompanyFileRow = {
  id: string;
  fileName: string;
  size: string;
  uploadedAt: string;
  records: string;
  status: string;
  module: string;
};

function formatBytes(value: number): string {
  if (value < 1024) {
    return `${value} B`;
  }

  const kb = value / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(kb / 1024).toFixed(1)} MB`;
}

function toDateLabel(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function adaptCompanyFiles(items: CompanyFileApi[]): CompanyFileRow[] {
  return items.map((item) => ({
    id: item.id,
    fileName: item.file_name,
    size: formatBytes(item.size_bytes),
    uploadedAt: toDateLabel(item.uploaded_at),
    records: formatNumber(item.records),
    status: item.status,
    module: item.source_module,
  }));
}

export function adaptCompanySummary(summary: CompanyFileSummaryApi): KpiItem[] {
  return [
    {
      label: 'Archivos cargados',
      value: formatNumber(summary.total_files),
    },
    {
      label: 'Registros totales',
      value: formatNumber(summary.total_records),
    },
    {
      label: 'Archivos procesados',
      value: formatNumber(summary.processed_files),
    },
    {
      label: 'Archivos pendientes',
      value: formatNumber(summary.pending_files),
    },
  ];
}

export function adaptInsightKpis(insight: CompanyFileInsightApi): KpiItem[] {
  return insight.kpis.map((item) => ({
    label: item.label,
    value: formatNumber(item.value),
    delta: item.delta,
    trend: item.trend,
  }));
}

export function adaptInsightTrend(insight: CompanyFileInsightApi): ChartDatum[] {
  return insight.trend.map((item) => ({
    label: item.period,
    value: item.total,
  }));
}

export function adaptInsightCategories(insight: CompanyFileInsightApi): ChartDatum[] {
  return insight.categories.map((item) => ({
    label: item.label,
    value: item.total,
  }));
}

export function adaptInsightNotes(insight: CompanyFileInsightApi): SummaryItem[] {
  return insight.notes.map((item, index) => ({
    label: `Nota ${index + 1}`,
    value: item,
  }));
}

export function adaptInsightRows(insight: CompanyFileInsightApi): Array<Record<string, string | number>> {
  return insight.categories.map((item) => ({
    categoria: item.label,
    total: item.total,
    archivo_id: insight.file_id,
  }));
}
