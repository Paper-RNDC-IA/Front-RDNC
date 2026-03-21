import { useCallback, useEffect, useMemo, useState } from 'react';

import { adaptStatsKpis, adaptStatsSummary, adaptStatsTrend } from '../adapters/stats.adapter';
import { getStatsKpis, getStatsSummary, getStatsTrends } from '../services/stats.service';
import type { ChartDatum, DateRange, KpiItem } from '../types/common';
import { getDefaultDateRange } from '../utils/date';

type StatsPageState = {
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  kpis: KpiItem[];
  trendChart: ChartDatum[];
  summaryChart: ChartDatum[];
};

export function useStatsPage() {
  const [state, setState] = useState<StatsPageState>({
    loading: true,
    error: null,
    dateRange: getDefaultDateRange(),
    kpis: [],
    trendChart: [],
    summaryChart: [],
  });

  const load = useCallback(async (dateRange: DateRange) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [kpisRes, trendsRes, summaryRes] = await Promise.all([
        getStatsKpis(dateRange),
        getStatsTrends(dateRange),
        getStatsSummary(dateRange),
      ]);

      setState((prev) => ({
        ...prev,
        loading: false,
        kpis: adaptStatsKpis(kpisRes),
        trendChart: adaptStatsTrend(trendsRes),
        summaryChart: adaptStatsSummary(summaryRes),
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
      trendChart: state.trendChart,
      summaryChart: state.summaryChart,
      setDateRange,
      reload,
    }),
    [reload, setDateRange, state],
  );
}
