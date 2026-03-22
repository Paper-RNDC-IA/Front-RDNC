import type { ChartDatum, KpiItem } from '../types/common';
import type {
  AlertApi,
  CorridorSegmentApi,
  SecurityEventApi,
  SpeedPointApi,
  TelemetryKpiApi,
} from '../types/telemetry';
import { formatNumber } from '../utils/formatters';

export function adaptTelemetryKpis(items: TelemetryKpiApi[]): KpiItem[] {
  return items.map((item) => ({
    label: item.label,
    value: formatNumber(item.value),
    delta: item.delta,
    trend: item.trend,
  }));
}

export function adaptSpeedTrend(items: SpeedPointApi[]): ChartDatum[] {
  return items.map((item) => ({
    label: item.period,
    value: item.avg_speed,
  }));
}

export function adaptTelemetryAlerts(items: AlertApi[]): Array<Record<string, string | number>> {
  return items.map((item) => ({
    type: item.type,
    count: formatNumber(item.count),
    severity: item.severity,
  }));
}

export function adaptTelemetryCorridor(
  items: CorridorSegmentApi[],
): Array<Record<string, string | number>> {
  return items.map((item) => ({
    segment: item.segment,
    vehicles: formatNumber(item.vehicles),
    avgSpeed: item.avg_speed,
  }));
}

export function adaptSecurityEvents(
  items: SecurityEventApi[],
): Array<Record<string, string | number>> {
  return items.map((item) => ({
    event: item.event,
    count: formatNumber(item.count),
    status: item.status,
  }));
}
