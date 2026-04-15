import type {
  StatsDashboardApi,
  StatsDashboardRawApi,
  StatsKpiApi,
  StatsSummaryApi,
  StatsTrendApi,
} from '../types/stats';
import type { DateRange } from '../types/common';

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

function normalizeDashboard(payload: unknown): Omit<StatsDashboardApi, 'healthStatus'> {
  if (!isRecord(payload)) {
    return {
      kpis: [],
      trends: [],
      summary: [],
    };
  }

  const dashboard = payload as StatsDashboardRawApi;
  const manifests = isRecord(dashboard.manifiestos) ? dashboard.manifiestos : {};
  const routes = isRecord(dashboard.rutas) ? dashboard.rutas : {};
  const companies = isRecord(dashboard.empresas) ? dashboard.empresas : {};

  const kpis: StatsKpiApi[] = [
    {
      label: 'Manifiestos Totales',
      value: toNumber(manifests.total_manifiestos),
      delta: `${toNumber(manifests.variacion_manifiestos).toFixed(1)}%`,
      trend: toNumber(manifests.variacion_manifiestos) >= 0 ? 'up' : 'down',
    },
    {
      label: 'Toneladas Totales',
      value: toNumber(manifests.total_toneladas),
      delta: `${toNumber(manifests.variacion_toneladas).toFixed(1)}%`,
      trend: toNumber(manifests.variacion_toneladas) >= 0 ? 'up' : 'down',
    },
    {
      label: 'Empresas Activas',
      value: toNumber(companies.empresas_activas ?? manifests.empresas_activas),
    },
    {
      label: 'Rutas Activas',
      value: toNumber(routes.total_rutas),
    },
  ];

  const summary: StatsSummaryApi[] = [
    { module: 'Manifiestos', total: toNumber(manifests.total_manifiestos) },
    { module: 'Rutas', total: toNumber(routes.total_rutas) },
    { module: 'Empresas', total: toNumber(companies.total_empresas) },
  ];

  const trends: StatsTrendApi[] = Array.isArray(dashboard.trends)
    ? dashboard.trends.filter(isRecord).map((item) => ({
        period:
          typeof item.period === 'string'
            ? item.period
            : `${String(item.mes ?? '').padStart(2, '0')}/${item.anio ?? ''}`,
        total: toNumber(item.total ?? item.total_manifiestos),
      }))
    : [];

  return {
    kpis,
    trends,
    summary,
    updatedAt:
      typeof dashboard.ultima_actualizacion === 'string'
        ? dashboard.ultima_actualizacion
        : undefined,
  };
}

function mergeSummaryFromStatsSummary(
  summary: StatsSummaryApi[],
  payload: unknown,
): StatsSummaryApi[] {
  if (!isRecord(payload)) {
    return summary;
  }

  const telemetryTotal = toNumber(payload.total_telemetry_records);
  const next = summary.filter((item) => item.module !== 'Telemetria');

  return [...next, { module: 'Telemetria', total: telemetryTotal }];
}

export async function getStatsDashboard(dateRange?: DateRange): Promise<StatsDashboardApi> {
  const [dashboardRes, summaryRes, healthRes] = await Promise.allSettled([
    api.get<unknown>(endpoints.stats.dashboard, buildDateQuery(dateRange)),
    api.get<unknown>(endpoints.stats.summary, buildDateQuery(dateRange)),
    api.get<unknown>(endpoints.stats.health),
  ]);

  if (dashboardRes.status !== 'fulfilled') {
    throw dashboardRes.reason;
  }

  const normalized = normalizeDashboard(dashboardRes.value);

  const mergedSummary =
    summaryRes.status === 'fulfilled'
      ? mergeSummaryFromStatsSummary(normalized.summary, summaryRes.value)
      : normalized.summary;

  const healthStatus =
    healthRes.status === 'fulfilled' && isRecord(healthRes.value)
      ? String(healthRes.value.status ?? 'unknown')
      : undefined;

  return {
    ...normalized,
    summary: mergedSummary,
    healthStatus,
  };
}

export async function getStatsKpis(dateRange?: DateRange): Promise<StatsKpiApi[]> {
  const dashboard = await getStatsDashboard(dateRange);
  return dashboard.kpis;
}

export async function getStatsTrends(dateRange?: DateRange): Promise<StatsTrendApi[]> {
  const dashboard = await getStatsDashboard(dateRange);
  return dashboard.trends;
}

export async function getStatsSummary(dateRange?: DateRange): Promise<StatsSummaryApi[]> {
  const dashboard = await getStatsDashboard(dateRange);
  return dashboard.summary;
}
