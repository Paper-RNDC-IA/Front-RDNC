import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { adaptStatsKpis, adaptStatsSummary, adaptStatsTrend } from '../adapters/stats.adapter';
import { getFiabilidad, getStatsDashboard } from '../services/stats.service';
import type { ChartDatum, DateRange, KpiItem } from '../types/common';
import type { FiabilidadApi } from '../types/stats';
import { getDefaultDateRange, normalizeDateRange } from '../utils/date';

type StatsPageState = {
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  updatedAt: string | null;
  healthStatus: string | null;
  kpis: KpiItem[];
  trendChart: ChartDatum[];
  summaryChart: ChartDatum[];
  fiabilidad: FiabilidadApi | null;
};

export function useStatsPage() {
  const requestIdRef = useRef(0);

  const [state, setState] = useState<StatsPageState>({
    loading: true,
    error: null,
    dateRange: getDefaultDateRange(),
    updatedAt: null,
    healthStatus: null,
    kpis: [],
    trendChart: [],
    summaryChart: [],
    fiabilidad: null,
  });

  const load = useCallback(async (dateRange: DateRange) => {
    const requestId = ++requestIdRef.current;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [dashboardRes, fiabilidadRes] = await Promise.allSettled([
        getStatsDashboard(dateRange),
        getFiabilidad(),
      ]);

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (dashboardRes.status !== 'fulfilled') {
        throw dashboardRes.reason;
      }

      const dashboard = dashboardRes.value;

      setState((prev) => ({
        ...prev,
        loading: false,
        updatedAt: dashboard.updatedAt ?? null,
        healthStatus: dashboard.healthStatus ?? null,
        kpis: adaptStatsKpis(dashboard.kpis),
        trendChart: adaptStatsTrend(dashboard.trends),
        summaryChart: adaptStatsSummary(dashboard.summary),
        fiabilidad: fiabilidadRes.status === 'fulfilled' ? fiabilidadRes.value : null,
      }));
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }

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
    const normalizedRange = normalizeDateRange(dateRange);

    setState((prev) => {
      if (
        prev.dateRange.from === normalizedRange.from &&
        prev.dateRange.to === normalizedRange.to
      ) {
        return prev;
      }

      return { ...prev, dateRange: normalizedRange };
    });
  }, []);

  const reload = useCallback(() => {
    void load(state.dateRange);
  }, [load, state.dateRange]);

  return useMemo(
    () => ({
      loading: state.loading,
      error: state.error,
      dateRange: state.dateRange,
      updatedAt: state.updatedAt,
      healthStatus: state.healthStatus,
      kpis: state.kpis,
      trendChart: state.trendChart,
      summaryChart: state.summaryChart,
      fiabilidad: state.fiabilidad,
      setDateRange,
      reload,
    }),
    [reload, setDateRange, state],
  );
}
