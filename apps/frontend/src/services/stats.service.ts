import type {
  FiabilidadApi,
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
      label: 'Viajes Totales',
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

  const trends: StatsTrendApi[] = Array.isArray(dashboard.trends)
    ? dashboard.trends.filter(isRecord).map((item) => ({
        period:
          typeof item.period === 'string'
            ? item.period
            : `${String(item.mes ?? '').padStart(2, '0')}/${item.anio ?? ''}`,
        total: toNumber(item.total ?? item.total_manifiestos),
      }))
    : [];

  // Viajes por AÑO, a partir de la serie mensual. Antes este grafico sumaba viajes + rutas +
  // empresas como si fueran "modulos" comparables (total 55.653.011): unidades distintas que
  // no se pueden sumar, y el panel concluia "Viajes lidera con 53.863.845 registros".
  // Un año con menos de 12 meses se rotula como parcial: no es comparable con uno completo.
  const porAnio = new Map<number, { total: number; meses: number }>();
  if (Array.isArray(dashboard.trends)) {
    for (const item of dashboard.trends.filter(isRecord)) {
      const anio = toNumber(item.anio);
      if (!anio) continue;
      const actual = porAnio.get(anio) ?? { total: 0, meses: 0 };
      actual.total += toNumber(item.total ?? item.total_manifiestos);
      actual.meses += 1;
      porAnio.set(anio, actual);
    }
  }
  const summary: StatsSummaryApi[] = [...porAnio.entries()]
    .sort(([a], [b]) => a - b)
    .map(([anio, { total, meses }]) => ({
      module: meses < 12 ? `${anio} (${meses} meses)` : String(anio),
      total,
    }));

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

export async function getStatsDashboard(dateRange?: DateRange): Promise<StatsDashboardApi> {
  const [dashboardRes, healthRes] = await Promise.allSettled([
    api.get<unknown>(endpoints.stats.dashboard, buildDateQuery(dateRange)),
    api.get<unknown>(endpoints.stats.health),
  ]);

  if (dashboardRes.status !== 'fulfilled') {
    throw dashboardRes.reason;
  }

  const normalized = normalizeDashboard(dashboardRes.value);

  const mergedSummary = normalized.summary.filter((item) => item.module !== 'Telemetria');

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

export async function getFiabilidad(): Promise<FiabilidadApi | null> {
  const response = await api.get<unknown>(endpoints.stats.fiabilidad);
  if (isRecord(response)) {
    return response as FiabilidadApi;
  }
  return null;
}
