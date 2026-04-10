import type { DateRange } from '../types/common';
import type { StatsKpiApi, StatsSummaryApi, StatsTrendApi } from '../types/stats';

import { api } from './api';
import { endpoints } from './endpoints';

function buildDateQuery(dateRange?: DateRange): Record<string, string> {
  return {
    from: dateRange?.from ?? '',
    to: dateRange?.to ?? '',
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toNumber(value: unknown): number {
  return typeof value === 'number' ? value : Number(value ?? 0);
}

function normalizeStatsKpis(payload: unknown): StatsKpiApi[] {
  if (Array.isArray(payload)) {
    return payload as StatsKpiApi[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  return [
    { label: 'Manifiestos Totales', value: toNumber(payload.total_manifiestos) },
    { label: 'Toneladas Totales', value: toNumber(payload.total_toneladas) },
    { label: 'Empresas Activas', value: toNumber(payload.empresas_activas ?? payload.total_empresas) },
    { label: 'Rutas Totales', value: toNumber(payload.total_rutas) },
  ];
}

function normalizeStatsTrends(payload: unknown): StatsTrendApi[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .filter(isRecord)
    .map((item) => {
      const period =
        typeof item.period === 'string'
          ? item.period
          : `${String(item.mes ?? '').padStart(2, '0')}/${item.anio ?? ''}`;

      return {
        period,
        total: toNumber(item.total ?? item.total_manifiestos),
      };
    });
}

function normalizeStatsSummary(payload: unknown): StatsSummaryApi[] {
  if (Array.isArray(payload)) {
    return payload as StatsSummaryApi[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  return [
    { module: 'Manifiestos', total: toNumber(payload.total_manifiestos) },
    { module: 'Telemetria', total: toNumber(payload.total_telemetry_records) },
    { module: 'Rutas', total: toNumber(payload.total_routes) },
    { module: 'Empresas', total: toNumber(payload.total_companies) },
  ];
}

export async function getStatsDashboard(dateRange?: DateRange) {
  const [kpis, summary, trends] = await Promise.all([
    getStatsKpis(dateRange),
    getStatsSummary(dateRange),
    getStatsTrends(dateRange),
  ]);

  return { kpis, summary, trends };
}

export async function getStatsKpis(dateRange?: DateRange): Promise<StatsKpiApi[]> {
  const response = await api.get<unknown>(endpoints.stats.kpis, buildDateQuery(dateRange));
  return normalizeStatsKpis(response);
}

export async function getStatsTrends(dateRange?: DateRange): Promise<StatsTrendApi[]> {
  const response = await api.get<unknown>(endpoints.stats.trends, buildDateQuery(dateRange));
  return normalizeStatsTrends(response);
}

export async function getStatsSummary(dateRange?: DateRange): Promise<StatsSummaryApi[]> {
  const response = await api.get<unknown>(endpoints.stats.summary, buildDateQuery(dateRange));
  return normalizeStatsSummary(response);
}
