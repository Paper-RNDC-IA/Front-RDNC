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

// Columnas que no son KPIs útiles (periodos, códigos)
const SKIP_KPI_COLS = new Set(['ANOMES', 'PERIODO', 'FECHA']);

// Mapeo de nombres de columnas RNDC y GPS a etiquetas en español
const COL_LABEL_MAP: Record<string, string> = {
  VIAJES: 'Total viajes',
  VIAJESVACIOS: 'Viajes vacíos',
  PLACAS: 'Vehículos (placas)',
  VALORPACTADO: 'Valor pactado ($)',
  KILOGRAMOS: 'Kilogramos',
  GALONES: 'Galones',
  VIAJESVALORCERO: 'Viajes valor $0',
  VIAJESLIQUIDOS: 'Viajes líquidos',
  DISTANCIA: 'Distancia (km)',
  VELOCIDAD: 'Velocidad prom.',
  CO2: 'CO₂ (kg)',
  // GPS KPIs
  VEHICULOS: 'Vehículos',
  PUNTOS_GPS: 'Puntos GPS',
  DISTANCIA_KM: 'Distancia total (km)',
  VEL_PROMEDIO: 'Velocidad prom. (km/h)',
  MESES: 'Meses de datos',
};

function resolveInsightKpis(insight: CompanyFileInsightApi): Array<{
  label: string;
  value: number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
}> {
  const raw = (insight as { kpis?: unknown }).kpis;

  // Array of {label, value} objects — use as-is
  if (Array.isArray(raw)) {
    return raw
      .filter(isRecord)
      .map((item) => ({
        label: String(item.label ?? 'KPI'),
        value: toNumber(item.value),
        delta: typeof item.delta === 'string' ? item.delta : undefined,
        trend:
          item.trend === 'up' || item.trend === 'down' || item.trend === 'neutral'
            ? item.trend
            : undefined,
      }));
  }

  if (!isRecord(raw)) return [];

  const entries = Object.entries(raw);

  // Detect nested stats pattern: {COL: {total, promedio, maximo, minimo}}
  const isNestedStats =
    entries.length > 0 &&
    entries.every(([, v]) => isRecord(v) && ('total' in (v as object) || 'promedio' in (v as object)));

  if (isNestedStats) {
    return entries
      .filter(([key]) => !SKIP_KPI_COLS.has(key))
      .map(([key, stats]) => ({
        label: COL_LABEL_MAP[key] ?? toLabelFromKey(key),
        value: toNumber((stats as Record<string, unknown>).total),
      }));
  }

  // Simple {key: number} dict
  return entries
    .filter(([key]) => !SKIP_KPI_COLS.has(key))
    .map(([key, value]) => ({
      label: COL_LABEL_MAP[key] ?? toLabelFromKey(key),
      value: toNumber(value),
    }));
}

function resolveInsightTrend(insight: CompanyFileInsightApi): Array<{ period: string; total: number }> {
  const raw = (insight as { trend?: unknown }).trend;

  if (Array.isArray(raw)) {
    if (raw.length === 0) return [];
    return raw
      .filter(isRecord)
      .map((item) => ({
        period: String(item.period ?? item.label ?? item.ANOMES ?? 'N/A'),
        total: toNumber(item.total ?? item.value ?? item.VIAJES),
      }));
  }

  if (!isRecord(raw)) return [];

  return Object.entries(raw).map(([period, total]) => ({
    period,
    total: toNumber(total),
  }));
}

function resolveInsightCategories(
  insight: CompanyFileInsightApi,
): Array<{ label: string; total: number }> {
  const fileKind = String((insight as { file_kind?: unknown }).file_kind ?? '');

  // GPS files: build vehicle distribution from preview rows
  if (fileKind === 'gps') {
    const preview = (insight as { preview?: unknown }).preview;
    if (Array.isArray(preview)) {
      return (preview as unknown[])
        .filter(isRecord)
        .map((row) => ({
          label: String(row.vehicle_id ?? 'Vehículo'),
          total: toNumber(row.distance_km ?? row.total_points ?? 1),
        }));
    }
    return [];
  }

  // Unknown/missing/error kinds: no categories
  if (['gps_raw', 'unknown', 'missing', 'error'].includes(fileKind)) {
    return [];
  }

  const raw = (insight as { categories?: unknown }).categories;
  const preview = (insight as { preview?: unknown }).preview;

  // If categories is an array of strings (column names), build distribution from preview
  if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'string') {
    const catCols = (raw as string[]).filter((c) => !SKIP_KPI_COLS.has(c));
    if (!Array.isArray(preview) || catCols.length === 0) return [];

    // Use first category column and group by its values summing VIAJES
    const col = catCols[0];
    const groups = new Map<string, number>();
    (preview as unknown[]).filter(isRecord).forEach((row) => {
      const key = String(row[col] ?? 'Otro');
      const viajes = toNumber(row.VIAJES ?? row.viajes ?? row.total ?? 1);
      groups.set(key, (groups.get(key) ?? 0) + viajes);
    });

    return Array.from(groups.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total);
  }

  if (Array.isArray(raw)) {
    return raw
      .filter(isRecord)
      .map((item) => ({
        label: String(item.label ?? 'Categoria'),
        total: toNumber(item.total ?? item.value),
      }));
  }

  if (!isRecord(raw)) return [];

  return Object.entries(raw).map(([label, total]) => ({
    label: toLabelFromKey(label),
    total: toNumber(total),
  }));
}

function resolveInsightNotes(insight: CompanyFileInsightApi): string[] {
  const raw = (insight as { notes?: unknown }).notes;
  const fileKind = String((insight as { file_kind?: unknown }).file_kind ?? '');

  // Backend already provides a descriptive note string — use it
  if (typeof raw === 'string' && raw.length > 0) return [raw];
  if (Array.isArray(raw) && raw.length > 0) return raw.map((item) => String(item));

  // Generate fallback notes from the insight data
  const rows = toNumber((insight as { rows?: unknown }).rows);
  const cols = toNumber((insight as { columns?: unknown }).columns);
  const notes: string[] = [];

  if (fileKind === 'gps') {
    notes.push('Archivo GPS procesado correctamente. Usa el Mapa de recorrido para ver la trayectoria.');
  } else if (fileKind === 'gps_raw') {
    notes.push('Archivo GPS detectado. El análisis de ruta está disponible en la sección Mapa de recorrido.');
  } else if (fileKind === 'unknown') {
    notes.push('Formato de archivo no reconocido. El sistema espera archivos RNDC (.xlsx) o GPS (.xls/.xlsx).');
  } else if (fileKind === 'missing') {
    notes.push('El archivo no se encontró en el servidor. Por favor, vuelve a cargarlo.');
  } else if (rows > 0) {
    notes.push(`El archivo contiene ${formatNumber(rows)} registros y ${cols} columnas.`);
  }

  return notes;
}

function formatBytes(value: number): string {
  if (!value || value < 0) return '—';
  if (value < 1024) return `${value} B`;
  const kb = value / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function toDateLabel(isoDate: string | undefined | null): string {
  if (!isoDate) return 'Sin fecha';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function resolveField(item: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) return item[key];
  }
  return undefined;
}

const STATUS_LABELS: Record<string, string> = {
  processed: 'Procesado',
  processing: 'Procesando',
  error: 'Error',
  processed_without_coordinates: 'Procesado (sin GPS)',
  processed_with_errors: 'Error al procesar',
  pending: 'Pendiente',
  uploaded: 'Cargado',
  failed: 'Fallido',
};

function translateStatus(raw: unknown): string {
  const s = String(raw ?? '');
  return STATUS_LABELS[s] ?? s ?? '—';
}

export function adaptCompanyFiles(items: CompanyFileApi[]): CompanyFileRow[] {
  return items
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const raw = item as unknown as Record<string, unknown>;
      const id = String(resolveField(raw, 'id', 'file_id') ?? '');
      const fileName = String(
        resolveField(raw, 'file_name', 'filename', 'name', 'original_name', 'original_filename') ?? 'Sin nombre',
      );
      const sizeBytes = Number(resolveField(raw, 'size_bytes', 'size', 'file_size', 'bytes') ?? 0);
      const uploadedAt = String(resolveField(raw, 'uploaded_at', 'created_at', 'upload_date', 'date') ?? '');
      const records = Number(resolveField(raw, 'records', 'record_count', 'total_records', 'num_records', 'rows') ?? 0);
      const status = resolveField(raw, 'status', 'estado');
      const module = String(resolveField(raw, 'source_module', 'module', 'tipo', 'type', 'modulo') ?? '—');

      return {
        id,
        fileName,
        size: formatBytes(sizeBytes),
        uploadedAt: toDateLabel(uploadedAt),
        records: records > 0 ? formatNumber(records) : '—',
        status: translateStatus(status),
        module,
      };
    });
}

export function adaptCompanySummary(summary: CompanyFileSummaryApi): KpiItem[] {
  const raw = (summary ?? {}) as Record<string, unknown>;

  const pick = (...keys: string[]) => {
    for (const k of keys) {
      if (raw[k] !== undefined && raw[k] !== null) return Number(raw[k]) || 0;
    }
    return 0;
  };

  const totalFiles = pick('total_files', 'files_count', 'total', 'count');
  const totalSizeBytes = pick('total_size_bytes', 'total_size', 'size_bytes');

  // Derive processed/error counts from by_type array if present
  const byType = Array.isArray(raw.by_type)
    ? (raw.by_type as Array<{ type?: string; count?: number }>)
    : [];

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const typeBreakdown = byType
    .map((t) => `${t.type?.toUpperCase() ?? '?'}: ${t.count ?? 0}`)
    .join(' · ') || '—';

  return [
    { label: 'Archivos cargados', value: formatNumber(totalFiles) },
    { label: 'Espacio utilizado', value: formatSize(totalSizeBytes) },
    { label: 'Tipos de archivo', value: typeBreakdown },
    { label: 'Empresa ID', value: String(pick('company_id') || '—') },
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
    (insight as { file_id?: unknown }).file_id && typeof (insight as { file_id?: unknown }).file_id === 'string'
      ? (insight as { file_id: string }).file_id
      : 'sin-archivo';

  return categories.map((item) => ({
    categoria: item.label,
    total: item.total,
    archivo_id: fileId,
  }));
}
