import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  adaptSecurityEvents,
  adaptSpeedTrend,
  adaptTelemetryAlerts,
  adaptTelemetryCorridor,
  adaptTelemetryKpis,
} from '../adapters/telemetry.adapter';
import {
  getCorridorSummary,
  getSecurityEvents,
  getSpeedTrend,
  getTelemetryAlerts,
  getTelemetryKpis,
  uploadTelemetryExcel,
} from '../services/telemetry.service';
import type { ChartDatum, DateRange, KpiItem } from '../types/common';
import { getDefaultDateRange } from '../utils/date';

type TelemetriaPageState = {
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  kpis: KpiItem[];
  speedTrend: ChartDatum[];
  alerts: Array<Record<string, string | number>>;
  corridorSummary: Array<Record<string, string | number>>;
  securityEvents: Array<Record<string, string | number>>;
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
  });

  const load = useCallback(async (dateRange: DateRange) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [kpisRes, speedRes, alertsRes, corridorRes, securityRes] = await Promise.all([
        getTelemetryKpis(dateRange),
        getSpeedTrend(dateRange),
        getTelemetryAlerts(dateRange),
        getCorridorSummary(dateRange),
        getSecurityEvents(dateRange),
      ]);

      setState((prev) => ({
        ...prev,
        loading: false,
        kpis: adaptTelemetryKpis(kpisRes),
        speedTrend: adaptSpeedTrend(speedRes),
        alerts: adaptTelemetryAlerts(alertsRes),
        corridorSummary: adaptTelemetryCorridor(corridorRes),
        securityEvents: adaptSecurityEvents(securityRes),
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

  const onUpload = useCallback(
    async (file: File) => {
      await uploadTelemetryExcel(file);
      await load(state.dateRange);
    },
    [load, state.dateRange],
  );

  const reload = useCallback(() => {
    void load(state.dateRange);
  }, [load, state.dateRange]);

  const setDateRange = useCallback((dateRange: DateRange) => {
    setState((prev) => ({ ...prev, dateRange }));
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
      setDateRange,
      onUpload,
      reload,
    }),
    [onUpload, reload, setDateRange, state],
  );
}
