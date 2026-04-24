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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toNumber(value: unknown): number {
  return typeof value === 'number' ? value : Number(value ?? 0);
}

function toLabelFromKey(key: string): string {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function resolveInsightKpis(insight: CompanyFileInsightApi): Array<{
  label: string;
  value: number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
}> {
  const raw = (insight as { kpis?: unknown }).kpis;

  if (Array.isArray(raw)) {
    return raw.filter(isRecord).map((item) => ({
      label: String(item.label ?? 'KPI'),
      value: toNumber(item.value),
      delta: typeof item.delta === 'string' ? item.delta : undefined,
      trend:
        item.trend === 'up' || item.trend === 'down' || item.trend === 'neutral'
          ? item.trend
          : undefined,
    }));
  }

  if (!isRecord(raw)) {
    return [];
  }

  return Object.entries(raw).map(([key, value]) => ({
    label: toLabelFromKey(key),
    value: toNumber(value),
  }));
}

function resolveInsightTrend(
  insight: CompanyFileInsightApi,
): Array<{ period: string; total: number }> {
  const raw = (insight as { trend?: unknown }).trend;

  if (Array.isArray(raw)) {
    return raw.filter(isRecord).map((item) => ({
      period: String(item.period ?? item.label ?? 'N/A'),
      total: toNumber(item.total ?? item.value),
    }));
  }

  if (!isRecord(raw)) {
    return [];
  }

  return Object.entries(raw).map(([period, total]) => ({
    period,
    total: toNumber(total),
  }));
}

function resolveInsightCategories(
  insight: CompanyFileInsightApi,
): Array<{ label: string; total: number }> {
  const raw = (insight as { categories?: unknown }).categories;

  if (Array.isArray(raw)) {
    return raw.filter(isRecord).map((item) => ({
      label: String(item.label ?? 'Categoria'),
      total: toNumber(item.total ?? item.value),
    }));
  }

  if (!isRecord(raw)) {
    return [];
  }

  return Object.entries(raw).map(([label, total]) => ({
    label: toLabelFromKey(label),
    total: toNumber(total),
  }));
}

function resolveInsightNotes(insight: CompanyFileInsightApi): string[] {
  const raw = (insight as { notes?: unknown }).notes;

  if (Array.isArray(raw)) {
    return raw.map((item) => String(item));
  }

  if (typeof raw === 'string') {
    return [raw];
  }

  if (isRecord(raw)) {
    return Object.entries(raw).map(([key, value]) => `${toLabelFromKey(key)}: ${String(value)}`);
  }

  return [];
}

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
  return resolveInsightKpis(insight).map((item) => ({
    label: item.label,
    value: formatNumber(item.value),
    delta: item.delta,
    trend: item.trend,
  }));
}

export function adaptInsightTrend(insight: CompanyFileInsightApi): ChartDatum[] {
  return resolveInsightTrend(insight).map((item) => ({
    label: item.period,
    value: item.total,
  }));
}

export function adaptInsightCategories(insight: CompanyFileInsightApi): ChartDatum[] {
  return resolveInsightCategories(insight).map((item) => ({
    label: item.label,
    value: item.total,
  }));
}

export function adaptInsightNotes(insight: CompanyFileInsightApi): SummaryItem[] {
  return resolveInsightNotes(insight).map((item, index) => ({
    label: `Nota ${index + 1}`,
    value: item,
  }));
}

export function adaptInsightRows(
  insight: CompanyFileInsightApi,
): Array<Record<string, string | number>> {
  const categories = resolveInsightCategories(insight);
  const fileId =
    (insight as { file_id?: unknown }).file_id &&
    typeof (insight as { file_id?: unknown }).file_id === 'string'
      ? (insight as { file_id: string }).file_id
      : 'sin-archivo';

  return categories.map((item) => ({
    categoria: item.label,
    total: item.total,
    archivo_id: fileId,
  }));
}
