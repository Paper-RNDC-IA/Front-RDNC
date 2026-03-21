import type { DateRange } from '../types/common';
import type {
  CompanyRankingApi,
  ManifestDistributionApi,
  ManifestKpiApi,
  ManifestTrendApi,
  RouteRankingApi,
} from '../types/manifests';
import {
  mockManifestCompanyRanking,
  mockManifestDistribution,
  mockManifestKpis,
  mockManifestRouteRanking,
  mockManifestTrends,
} from '../constants/mocks';

import { api, withMockFallback } from './api';
import { endpoints } from './endpoints';

function buildDateQuery(dateRange?: DateRange): Record<string, string> {
  return {
    from: dateRange?.from ?? '',
    to: dateRange?.to ?? '',
  };
}

export function getManifestKpis(dateRange?: DateRange): Promise<ManifestKpiApi[]> {
  return withMockFallback(
    () => api.get<ManifestKpiApi[]>(endpoints.manifests.kpis, buildDateQuery(dateRange)),
    mockManifestKpis,
  );
}

export function getManifestTrends(dateRange?: DateRange): Promise<ManifestTrendApi[]> {
  return withMockFallback(
    () => api.get<ManifestTrendApi[]>(endpoints.manifests.trends, buildDateQuery(dateRange)),
    mockManifestTrends,
  );
}

export function getRouteRanking(dateRange?: DateRange): Promise<RouteRankingApi[]> {
  return withMockFallback(
    () => api.get<RouteRankingApi[]>(endpoints.manifests.routeRanking, buildDateQuery(dateRange)),
    mockManifestRouteRanking,
  );
}

export function getCompanyRanking(dateRange?: DateRange): Promise<CompanyRankingApi[]> {
  return withMockFallback(
    () => api.get<CompanyRankingApi[]>(endpoints.manifests.companyRanking, buildDateQuery(dateRange)),
    mockManifestCompanyRanking,
  );
}

export function getManifestDistribution(dateRange?: DateRange): Promise<ManifestDistributionApi[]> {
  return withMockFallback(
    () => api.get<ManifestDistributionApi[]>(endpoints.manifests.distribution, buildDateQuery(dateRange)),
    mockManifestDistribution,
  );
}
