import type { DateRange } from '../types/common';
import type { DepartmentIntensityApi, RouteKpiApi } from '../types/routes';

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

function normalizeRouteKpis(payload: unknown): RouteKpiApi[] {
  if (Array.isArray(payload)) {
    return payload as RouteKpiApi[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  return [
    { label: 'Rutas Totales', value: toNumber(payload.total_rutas) },
    { label: 'Corredores Activos', value: toNumber(payload.corredores_activos) },
    { label: 'Departamentos Activos', value: toNumber(payload.departamentos_activos) },
    { label: 'Viajes Totales', value: toNumber(payload.total_viajes) },
  ];
}

function normalizeDepartments(payload: unknown): DepartmentIntensityApi[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .filter(isRecord)
    .map((item) => ({
      department: String(item.department ?? item.departamento ?? 'Sin departamento'),
      trips: toNumber(item.trips ?? item.viajes ?? item.total),
      intensity: toNumber(item.intensity ?? item.valor ?? item.total),
    }));
}

export async function getRoutesKpis(dateRange?: DateRange): Promise<RouteKpiApi[]> {
  const response = await api.get<unknown>(endpoints.routes.kpis, buildDateQuery(dateRange));
  return normalizeRouteKpis(response);
}

export async function getRoutesCorridors(dateRange?: DateRange): Promise<unknown[]> {
  const response = await api.get<unknown>(endpoints.routes.corridors, buildDateQuery(dateRange));
  return Array.isArray(response) ? response : [];
}

export async function getRoutesDepartments(dateRange?: DateRange): Promise<DepartmentIntensityApi[]> {
  const response = await api.get<unknown>(
    endpoints.routes.departments,
    buildDateQuery(dateRange),
  );
  return normalizeDepartments(response);
}

export async function getRoutesFlow(dateRange?: DateRange): Promise<unknown[]> {
  const response = await api.get<unknown>(endpoints.routes.flow, buildDateQuery(dateRange));
  return Array.isArray(response) ? response : [];
}

export async function getRoutesHeatmap(dateRange?: DateRange): Promise<unknown[]> {
  const response = await api.get<unknown>(endpoints.routes.heatmap, buildDateQuery(dateRange));
  return Array.isArray(response) ? response : [];
}

export async function getRoutesHistory(dateRange?: DateRange): Promise<unknown[]> {
  const response = await api.get<unknown>(endpoints.routes.history, buildDateQuery(dateRange));
  return Array.isArray(response) ? response : [];
}

export async function getRouteKpis(dateRange?: DateRange): Promise<RouteKpiApi[]> {
  return getRoutesKpis(dateRange);
}

export async function getDepartmentIntensity(dateRange?: DateRange): Promise<DepartmentIntensityApi[]> {
  return getRoutesDepartments(dateRange);
}
