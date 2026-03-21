import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  adaptCompanyRanking,
  adaptManifestDistribution,
  adaptManifestKpis,
  adaptManifestTrend,
  adaptRouteRanking,
} from '../adapters/manifests.adapter';
import {
  getCompanyRanking,
  getManifestDistribution,
  getManifestKpis,
  getManifestTrends,
  getRouteRanking,
} from '../services/manifests.service';
import type { ChartDatum, DateRange, KpiItem } from '../types/common';
import { getDefaultDateRange } from '../utils/date';

type ManifiestosPageState = {
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  kpis: KpiItem[];
  trends: ChartDatum[];
  routeRanking: Array<Record<string, string | number>>;
  companyRanking: Array<Record<string, string | number>>;
  distribution: ChartDatum[];
};

export function useManifiestosPage() {
  const [state, setState] = useState<ManifiestosPageState>({
    loading: true,
    error: null,
    dateRange: getDefaultDateRange(),
    kpis: [],
    trends: [],
    routeRanking: [],
    companyRanking: [],
    distribution: [],
  });

  const load = useCallback(async (dateRange: DateRange) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [kpisRes, trendsRes, routeRes, companyRes, distributionRes] = await Promise.all([
        getManifestKpis(dateRange),
        getManifestTrends(dateRange),
        getRouteRanking(dateRange),
        getCompanyRanking(dateRange),
        getManifestDistribution(dateRange),
      ]);

      setState((prev) => ({
        ...prev,
        loading: false,
        kpis: adaptManifestKpis(kpisRes),
        trends: adaptManifestTrend(trendsRes),
        routeRanking: adaptRouteRanking(routeRes),
        companyRanking: adaptCompanyRanking(companyRes),
        distribution: adaptManifestDistribution(distributionRes),
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error inesperado en manifiestos',
      }));
    }
  }, []);

  useEffect(() => {
    void load(state.dateRange);
  }, [load, state.dateRange]);

  const setDateRange = useCallback((dateRange: DateRange) => {
    setState((prev) => ({ ...prev, dateRange }));
  }, []);

  const reload = useCallback(() => {
    void load(state.dateRange);
  }, [load, state.dateRange]);

  return useMemo(
    () => ({
      loading: state.loading,
      error: state.error,
      dateRange: state.dateRange,
      kpis: state.kpis,
      trends: state.trends,
      routeRanking: state.routeRanking,
      companyRanking: state.companyRanking,
      distribution: state.distribution,
      setDateRange,
      reload,
    }),
    [reload, setDateRange, state],
  );
}
