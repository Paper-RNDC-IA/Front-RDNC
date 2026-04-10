import { useCallback, useEffect, useMemo, useState } from 'react';

import { adaptStatsKpis, adaptStatsSummary, adaptStatsTrend } from '../adapters/stats.adapter';
import { getStatsDashboard } from '../services/stats.service';
import type { ChartDatum, KpiItem } from '../types/common';

type StatsPageState = {
  loading: boolean;
  error: string | null;
  updatedAt: string | null;
  healthStatus: string | null;
  kpis: KpiItem[];
  trendChart: ChartDatum[];
  summaryChart: ChartDatum[];
};

export function useStatsPage() {
  const [state, setState] = useState<StatsPageState>({
    loading: true,
    error: null,
    updatedAt: null,
    healthStatus: null,
    kpis: [],
    trendChart: [],
    summaryChart: [],
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const dashboard = await getStatsDashboard();

      setState((prev) => ({
        ...prev,
        loading: false,
        updatedAt: dashboard.updatedAt ?? null,
        healthStatus: dashboard.healthStatus ?? null,
        kpis: adaptStatsKpis(dashboard.kpis),
        trendChart: adaptStatsTrend(dashboard.trends),
        summaryChart: adaptStatsSummary(dashboard.summary),
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error inesperado en estadisticas',
      }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const reload = useCallback(() => {
    void load();
  }, [load]);

  return useMemo(
    () => ({
      loading: state.loading,
      error: state.error,
      updatedAt: state.updatedAt,
      healthStatus: state.healthStatus,
      kpis: state.kpis,
      trendChart: state.trendChart,
      summaryChart: state.summaryChart,
      reload,
    }),
    [reload, state],
  );
}
