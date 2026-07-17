import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  adaptSecurityEvents,
  adaptSpeedTrend,
  adaptTelemetryAlerts,
  adaptTelemetryCorridor,
  adaptTelemetryKpis,
} from '../adapters/telemetry.adapter';
import {
  getCo2Tendencia,
  getCorridorSummary,
  getNodosParada,
  getSecurityEvents,
  getSpeedTrend,
  getTelemetryAlerts,
  getTelemetryKpis,
} from '../services/telemetry.service';
import type { ChartDatum, DateRange, KpiItem } from '../types/common';
import type { Co2TendenciaRowApi, NodoParadaApi } from '../types/telemetry';
import { getDefaultDateRange, normalizeDateRange } from '../utils/date';

type TelemetriaPageState = {
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  kpis: KpiItem[];
  speedTrend: ChartDatum[];
  alerts: Array<Record<string, string | number>>;
  corridorSummary: Array<Record<string, string | number>>;
  securityEvents: Array<Record<string, string | number>>;
  co2Tendencia: Co2TendenciaRowApi[];
  nodos: NodoParadaApi[];
};

export function useTelemetriaPage() {
  const [state, setState] = useState<TelemetriaPageState>({
    loading: true,
    error: null,
    dateRange: getDefaultDateRange(),
    kpis: [],
    speedTrend: [],
    alerts: [],
    corridorSummary: [],
    securityEvents: [],
    co2Tendencia: [],
    nodos: [],
  });

  const load = useCallback(async (dateRange: DateRange) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [kpisRes, speedRes, alertsRes, corridorRes, securityRes, co2Res, nodosRes] =
        await Promise.all([
          getTelemetryKpis(dateRange),
          getSpeedTrend(dateRange),
          getTelemetryAlerts(dateRange),
          getCorridorSummary(dateRange),
          getSecurityEvents(dateRange),
          getCo2Tendencia({ from: dateRange.from, to: dateRange.to }),
          getNodosParada({ from: dateRange.from, to: dateRange.to }),
        ]);

      setState((prev) => ({
        ...prev,
        loading: false,
        kpis: adaptTelemetryKpis(kpisRes),
        speedTrend: adaptSpeedTrend(speedRes),
        alerts: adaptTelemetryAlerts(alertsRes),
        corridorSummary: adaptTelemetryCorridor(corridorRes),
        securityEvents: adaptSecurityEvents(securityRes),
        co2Tendencia: co2Res,
        nodos: nodosRes,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error inesperado en telemetria',
      }));
    }
  }, []);

  useEffect(() => {
    void load(state.dateRange);
  }, [load, state.dateRange]);

  const reload = useCallback(() => {
    void load(state.dateRange);
  }, [load, state.dateRange]);

  const setDateRange = useCallback((dateRange: DateRange) => {
    setState((prev) => ({ ...prev, dateRange: normalizeDateRange(dateRange) }));
  }, []);

  return useMemo(
    () => ({
      loading: state.loading,
      error: state.error,
      dateRange: state.dateRange,
      kpis: state.kpis,
      speedTrend: state.speedTrend,
      alerts: state.alerts,
      corridorSummary: state.corridorSummary,
      securityEvents: state.securityEvents,
      co2Tendencia: state.co2Tendencia,
      nodos: state.nodos,
      setDateRange,
      reload,
    }),
    [reload, setDateRange, state],
  );
}
