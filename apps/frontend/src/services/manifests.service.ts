import type { DateRange } from '../types/common';
import type {
  CompanyRankingApi,
  ManifestDistributionApi,
  ManifestKpiApi,
  ManifestTrendApi,
  RouteRankingApi,
} from '../types/manifests';

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

function normalizeKpis(payload: unknown): ManifestKpiApi[] {
  if (Array.isArray(payload)) {
    return payload as ManifestKpiApi[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  return [
    { label: 'Manifiestos Totales', value: toNumber(payload.total_manifiestos) },
    { label: 'Toneladas Totales', value: toNumber(payload.total_toneladas) },
    { label: 'Empresas Activas', value: toNumber(payload.empresas_activas) },
    {
      label: 'Variacion Toneladas',
      value: toNumber(payload.variacion_toneladas),
      delta: `${toNumber(payload.variacion_toneladas).toFixed(2)}%`,
      trend: toNumber(payload.variacion_toneladas) >= 0 ? 'up' : 'down',
    },
  ];
}

function normalizeTrends(payload: unknown): ManifestTrendApi[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .filter(isRecord)
    .map((item) => ({
      period:
        typeof item.period === 'string'
          ? item.period
          : `${String(item.mes ?? '').padStart(2, '0')}/${item.anio ?? ''}`,
      total: toNumber(item.total ?? item.total_manifiestos),
    }));
}

function normalizeRouteRanking(payload: unknown): RouteRankingApi[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .filter(isRecord)
    .map((item) => ({
      route: String(item.route ?? item.label ?? 'Sin ruta'),
      trips: toNumber(item.trips ?? item.value),
      incidents: toNumber(item.incidents ?? item.toneladas),
    }));
}

function normalizeCompanyRanking(payload: unknown): CompanyRankingApi[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .filter(isRecord)
    .map((item) => ({
      company: String(item.company ?? item.nombre ?? item.label ?? item.empresa_id ?? 'Sin empresa'),
      manifests: toNumber(item.manifests ?? item.total_manifiestos ?? item.value),
      compliance: toNumber(item.compliance ?? item.toneladas),
    }));
}

function normalizeDistribution(payload: unknown): ManifestDistributionApi[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .filter(isRecord)
    .map((item) => ({
      status: String(item.status ?? item.tipo_mercancia ?? item.label ?? 'Sin categoria'),
      total: toNumber(item.total ?? item.value),
    }));
}

export async function getManifestsKpis(dateRange?: DateRange): Promise<ManifestKpiApi[]> {
  const response = await api.get<unknown>(endpoints.manifests.kpis, buildDateQuery(dateRange));
  return normalizeKpis(response);
}

export async function getManifestsTrend(dateRange?: DateRange): Promise<ManifestTrendApi[]> {
  const response = await api.get<unknown>(endpoints.manifests.trends, buildDateQuery(dateRange));
  return normalizeTrends(response);
}

export async function getManifestsMap(dateRange?: DateRange): Promise<unknown> {
  return api.get<unknown>(endpoints.manifests.map, buildDateQuery(dateRange));
}

export async function getManifestsRanking(dateRange?: DateRange): Promise<RouteRankingApi[]> {
  const response = await api.get<unknown>(
    endpoints.manifests.routeRanking,
    buildDateQuery(dateRange),
  );
  return normalizeRouteRanking(response);
}

export async function getManifestsTop20(dateRange?: DateRange): Promise<unknown[]> {
  const response = await api.get<unknown>(endpoints.manifests.top20, buildDateQuery(dateRange));
  return Array.isArray(response) ? response : [];
}

export async function getManifestKpis(dateRange?: DateRange): Promise<ManifestKpiApi[]> {
  return getManifestsKpis(dateRange);
}

export async function getManifestTrends(dateRange?: DateRange): Promise<ManifestTrendApi[]> {
  return getManifestsTrend(dateRange);
}

export async function getRouteRanking(dateRange?: DateRange): Promise<RouteRankingApi[]> {
  return getManifestsRanking(dateRange);
}

export async function getCompanyRanking(dateRange?: DateRange): Promise<CompanyRankingApi[]> {
  const response = await api.get<unknown>(
    endpoints.manifests.companyRanking,
    buildDateQuery(dateRange),
  );
  return normalizeCompanyRanking(response);
}

export async function getManifestDistribution(
  dateRange?: DateRange,
): Promise<ManifestDistributionApi[]> {
  const response = await api.get<unknown>(
    endpoints.manifests.distribution,
    buildDateQuery(dateRange),
  );
  return normalizeDistribution(response);
}
