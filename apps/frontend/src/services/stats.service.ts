import type { DateRange } from '../types/common';
import type { StatsKpiApi, StatsSummaryApi, StatsTrendApi } from '../types/stats';
import { mockStatsKpis, mockStatsSummary, mockStatsTrends } from '../constants/mocks';

import { api, withMockFallback } from './api';
import { endpoints } from './endpoints';

function buildDateQuery(dateRange?: DateRange): Record<string, string> {
  return {
    from: dateRange?.from ?? '',
    to: dateRange?.to ?? '',
  };
}

export function getStatsKpis(dateRange?: DateRange): Promise<StatsKpiApi[]> {
  return withMockFallback(
    () => api.get<StatsKpiApi[]>(endpoints.stats.kpis, buildDateQuery(dateRange)),
    mockStatsKpis,
  );
}

export function getStatsTrends(dateRange?: DateRange): Promise<StatsTrendApi[]> {
  return withMockFallback(
    () => api.get<StatsTrendApi[]>(endpoints.stats.trends, buildDateQuery(dateRange)),
    mockStatsTrends,
  );
}

export function getStatsSummary(dateRange?: DateRange): Promise<StatsSummaryApi[]> {
  return withMockFallback(
    () => api.get<StatsSummaryApi[]>(endpoints.stats.summary, buildDateQuery(dateRange)),
    mockStatsSummary,
  );
}
