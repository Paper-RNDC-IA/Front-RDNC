import type {
  FileOption,
  MonthOption,
  RouteEvent,
  RouteEventApi,
  RouteFileApi,
  RouteMapApi,
  RouteMapStats,
  RouteMonthApi,
  RoutePoint,
  RoutePointApi,
  RouteVehicleApi,
  VehicleOption,
  VehicleRouteMap,
} from '../types/company-routes';

import { formatKilometers, formatSpeed } from '../utils/formatters';

function toNumber(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isValidCoordinate(point: RoutePoint): boolean {
  return Number.isFinite(point.lat) && Number.isFinite(point.lng);
}

function toDateTimeLabel(value: string | null | undefined): string {
  if (!value) {
    return 'Sin fecha';
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
}

function formatMonthLabel(value: string): string {
  const [year, month] = value.split('-');
  const monthAsNumber = Number(month);
  const yearAsNumber = Number(year);

  if (!Number.isInteger(monthAsNumber) || !Number.isInteger(yearAsNumber)) {
    return value;
  }

  const date = new Date(yearAsNumber, monthAsNumber - 1, 1);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-CO', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function adaptPoint(point: RoutePointApi): RoutePoint {
  return {
    lat: toNumber(point.lat),
    lng: toNumber(point.lng),
    timestamp: point.timestamp ?? null,
    speedKmh: toNullableNumber(point.speed_kmh),
  };
}

function adaptEvent(item: RouteEventApi, index: number): RouteEvent {
  const type = item.type?.trim() || 'Evento';

  return {
    id: item.id ?? `${type}-${index}`,
    type,
    label: item.label?.trim() || type,
    description: item.description?.trim() || 'Evento detectado durante el recorrido.',
    lat: toNumber(item.lat),
    lng: toNumber(item.lng),
    timestamp: item.timestamp ?? null,
    severity:
      item.severity === 'high' ||
      item.severity === 'medium' ||
      item.severity === 'low' ||
      item.severity === 'info'
        ? item.severity
        : 'info',
  };
}

function buildTimeRangeLabel(
  fromAt: string | null | undefined,
  toAt: string | null | undefined,
): string {
  if (!fromAt && !toAt) {
    return 'Sin rango temporal';
  }

  return `${toDateTimeLabel(fromAt)} - ${toDateTimeLabel(toAt)}`;
}

export function adaptRouteFiles(items: RouteFileApi[]): FileOption[] {
  return items.map((item) => ({
    value: item.file_id,
    label: item.file_name,
  }));
}

export function adaptRouteVehicles(items: RouteVehicleApi[]): VehicleOption[] {
  return items.map((item) => ({
    value: item.vehicle_id,
    label: item.vehicle_label || item.plate || item.vehicle_id,
  }));
}

export function adaptRouteMonths(items: RouteMonthApi[]): MonthOption[] {
  return items.map((item) => ({
    value: item.month,
    label: item.label || formatMonthLabel(item.month),
  }));
}

export function adaptRouteMapStats(data: VehicleRouteMap): Array<{ label: string; value: string }> {
  const stats = data.stats;

  return [
    { label: 'Distancia recorrida', value: formatKilometers(stats.distanceKm) },
    { label: 'Velocidad promedio', value: formatSpeed(stats.avgSpeedKmh) },
    { label: 'Velocidad maxima', value: formatSpeed(stats.maxSpeedKmh) },
    { label: 'Total de puntos', value: String(stats.totalPoints) },
    { label: 'Rango temporal', value: stats.timeRangeLabel },
  ];
}

export function adaptVehicleRouteMap(
  map: RouteMapApi,
  eventsPayload: RouteEventApi[],
): VehicleRouteMap {
  const rawPath = (map.points ?? map.path ?? []).map(adaptPoint).filter(isValidCoordinate);
  const startPoint = map.start_point ? adaptPoint(map.start_point) : (rawPath[0] ?? null);
  const endPoint = map.end_point
    ? adaptPoint(map.end_point)
    : (rawPath[rawPath.length - 1] ?? null);
  const events = eventsPayload
    .map(adaptEvent)
    .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));

  const statsFromApi = map.stats ?? {};
  const stats: RouteMapStats = {
    distanceKm: toNumber(statsFromApi.distance_km),
    avgSpeedKmh: toNumber(statsFromApi.avg_speed_kmh),
    maxSpeedKmh: toNumber(statsFromApi.max_speed_kmh),
    totalPoints: toNumber(statsFromApi.total_points) || rawPath.length,
    timeRangeLabel: buildTimeRangeLabel(statsFromApi.from_at, statsFromApi.to_at),
  };

  if (!stats.distanceKm && rawPath.length > 1) {
    stats.distanceKm = Math.round(rawPath.length * 0.1 * 10) / 10;
  }

  return {
    path: rawPath,
    startPoint,
    endPoint,
    events,
    stats,
  };
}
