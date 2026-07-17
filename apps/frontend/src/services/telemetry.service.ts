import type { DateRange } from '../types/common';
import type {
  AlertApi,
  Co2TendenciaRowApi,
  CorridorSegmentApi,
  NodoParadaApi,
  SecurityEventApi,
  SpeedPointApi,
  TelemetryKpiApi,
} from '../types/telemetry';

import { api } from './api';
import { endpoints } from './endpoints';

function buildDateQuery(dateRange?: DateRange): Record<string, string> {
  return {
    from: dateRange?.from ?? '',
    to: dateRange?.to ?? '',
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toNumber(value: unknown): number {
  return typeof value === 'number' ? value : Number(value ?? 0);
}

function normalizeKpis(payload: unknown): TelemetryKpiApi[] {
  if (Array.isArray(payload)) {
    return payload as TelemetryKpiApi[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  return [
    { label: 'Distancia Total', value: toNumber(payload.distancia_total) },
    { label: 'Velocidad Promedio', value: toNumber(payload.velocidad_promedio) },
    { label: 'Velocidad Maxima', value: toNumber(payload.velocidad_maxima) },
    { label: 'Total Registros', value: toNumber(payload.total_registros) },
  ];
}

function normalizeSpeeds(payload: unknown): SpeedPointApi[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.filter(isRecord).map((item) => ({
    period: String(item.period ?? item.hora ?? 'N/A'),
    avg_speed: toNumber(item.avg_speed ?? item.velocidad_promedio),
  }));
}

function normalizeAlerts(payload: unknown): AlertApi[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  const grouped = new Map<string, number>();

  payload.filter(isRecord).forEach((item) => {
    const key = String(item.type ?? item.motivo ?? 'Sin tipo');
    grouped.set(key, (grouped.get(key) ?? 0) + 1);
  });

  return Array.from(grouped.entries()).map(([type, count]) => ({
    type,
    count,
  }));
}

function normalizeCorridor(payload: unknown): CorridorSegmentApi[] {
  if (Array.isArray(payload)) {
    return payload as CorridorSegmentApi[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  return [
    {
      segment: String(payload.segment ?? payload.corredor_principal ?? 'Corredor principal'),
      vehicles: toNumber(payload.vehicles ?? payload.registros),
      avg_speed: toNumber(payload.avg_speed ?? payload.velocidad_promedio),
    },
  ];
}

function normalizeSecurityEvents(payload: unknown): SecurityEventApi[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  const grouped = new Map<string, number>();

  payload.filter(isRecord).forEach((item) => {
    const key = String(item.event ?? item.motivo ?? 'Evento');
    grouped.set(key, (grouped.get(key) ?? 0) + 1);
  });

  return Array.from(grouped.entries()).map(([event, count]) => ({
    event,
    count,
  }));
}

export async function getTelemetryKpis(dateRange?: DateRange): Promise<TelemetryKpiApi[]> {
  const response = await api.get<unknown>(endpoints.telemetry.kpis, buildDateQuery(dateRange));
  return normalizeKpis(response);
}

export async function getTelemetrySpeeds(dateRange?: DateRange): Promise<SpeedPointApi[]> {
  const response = await api.get<unknown>(endpoints.telemetry.speeds, buildDateQuery(dateRange));
  return normalizeSpeeds(response);
}

export async function getTelemetryAlerts(dateRange?: DateRange): Promise<AlertApi[]> {
  const response = await api.get<unknown>(endpoints.telemetry.alerts, buildDateQuery(dateRange));
  return normalizeAlerts(response);
}

export async function getTelemetryCorridor(dateRange?: DateRange): Promise<CorridorSegmentApi[]> {
  const response = await api.get<unknown>(endpoints.telemetry.corridor, buildDateQuery(dateRange));
  return normalizeCorridor(response);
}

export async function getTelemetryEvents(dateRange?: DateRange): Promise<SecurityEventApi[]> {
  const response = await api.get<unknown>(endpoints.telemetry.events, buildDateQuery(dateRange));
  return normalizeSecurityEvents(response);
}

export async function getSecurityEvents(dateRange?: DateRange): Promise<SecurityEventApi[]> {
  return getTelemetryEvents(dateRange);
}

export async function getSpeedTrend(dateRange?: DateRange): Promise<SpeedPointApi[]> {
  return getTelemetrySpeeds(dateRange);
}

export async function getCorridorSummary(dateRange?: DateRange): Promise<CorridorSegmentApi[]> {
  return getTelemetryCorridor(dateRange);
}

export async function getCo2Tendencia(params?: {
  vehicle_id?: string;
  from?: string;
  to?: string;
}): Promise<Co2TendenciaRowApi[]> {
  const query: Record<string, string> = {};
  if (params?.vehicle_id) query.vehicle_id = params.vehicle_id;
  if (params?.from) query.from = params.from;
  if (params?.to) query.to = params.to;

  const response = await api.get<unknown>(endpoints.telemetry.co2Tendencia, query);
  return Array.isArray(response) ? (response as Co2TendenciaRowApi[]) : [];
}

export async function getNodosParada(params?: {
  vehicle_id?: string;
  velocidad_max?: number;
  min_registros?: number;
  from?: string;
  to?: string;
}): Promise<NodoParadaApi[]> {
  const query: Record<string, string> = {};
  if (params?.vehicle_id) query.vehicle_id = params.vehicle_id;
  if (params?.velocidad_max !== undefined) query.velocidad_max = String(params.velocidad_max);
  if (params?.min_registros !== undefined) query.min_registros = String(params.min_registros);
  if (params?.from) query.from = params.from;
  if (params?.to) query.to = params.to;

  const response = await api.get<unknown>(endpoints.telemetry.nodos, query);
  return Array.isArray(response) ? (response as NodoParadaApi[]) : [];
}

export async function uploadTelemetryExcel(
  file: File,
): Promise<{ success: boolean; rows: number }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.postForm<unknown>(endpoints.telemetry.upload, formData);

  if (isRecord(response)) {
    return {
      success: true,
      rows: toNumber(response.rows ?? response.total_rows ?? response.total_registros),
    };
  }

  return { success: true, rows: 0 };
}
