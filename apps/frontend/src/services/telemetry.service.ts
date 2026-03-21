import type { DateRange } from '../types/common';
import type {
  AlertApi,
  CorridorSegmentApi,
  SecurityEventApi,
  SpeedPointApi,
  TelemetryKpiApi,
} from '../types/telemetry';
import {
  mockTelemetryAlerts,
  mockTelemetryCorridor,
  mockTelemetryKpis,
  mockTelemetrySecurityEvents,
  mockTelemetrySpeedTrend,
} from '../constants/mocks';

import { api, withMockFallback } from './api';
import { endpoints } from './endpoints';

function buildDateQuery(dateRange?: DateRange): Record<string, string> {
  return {
    from: dateRange?.from ?? '',
    to: dateRange?.to ?? '',
  };
}

export function getTelemetryKpis(dateRange?: DateRange): Promise<TelemetryKpiApi[]> {
  return withMockFallback(
    () => api.get<TelemetryKpiApi[]>(endpoints.telemetry.kpis, buildDateQuery(dateRange)),
    mockTelemetryKpis,
  );
}

export function getSpeedTrend(dateRange?: DateRange): Promise<SpeedPointApi[]> {
  return withMockFallback(
    () => api.get<SpeedPointApi[]>(endpoints.telemetry.speeds, buildDateQuery(dateRange)),
    mockTelemetrySpeedTrend,
  );
}

export function getTelemetryAlerts(dateRange?: DateRange): Promise<AlertApi[]> {
  return withMockFallback(
    () => api.get<AlertApi[]>(endpoints.telemetry.alerts, buildDateQuery(dateRange)),
    mockTelemetryAlerts,
  );
}

export function getCorridorSummary(dateRange?: DateRange): Promise<CorridorSegmentApi[]> {
  return withMockFallback(
    () => api.get<CorridorSegmentApi[]>(endpoints.telemetry.corridor, buildDateQuery(dateRange)),
    mockTelemetryCorridor,
  );
}

export function getSecurityEvents(dateRange?: DateRange): Promise<SecurityEventApi[]> {
  return withMockFallback(
    () => api.get<SecurityEventApi[]>(endpoints.telemetry.securityEvents, buildDateQuery(dateRange)),
    mockTelemetrySecurityEvents,
  );
}

export function uploadTelemetryExcel(file: File): Promise<{ success: boolean; rows: number }> {
  const formData = new FormData();
  formData.append('file', file);

  return withMockFallback(
    () => api.postForm<{ success: boolean; rows: number }>(endpoints.telemetry.upload, formData),
    { success: true, rows: 0 },
  );
}
