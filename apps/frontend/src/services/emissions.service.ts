import type {
  EmissionsCorridorApi,
  EmissionsMethodologyApi,
  EmissionsMonthApi,
  EmissionsOverviewApi,
  EmissionsTerritoryApi,
  EmissionsTrendItemApi,
} from '../types/emissions';

import { api } from './api';
import { endpoints } from './endpoints';

export function getEmissionsOverview(anio?: number): Promise<EmissionsOverviewApi> {
  return api.get<EmissionsOverviewApi>(endpoints.emissions.overview, { anio });
}

export async function getEmissionsTrend(): Promise<EmissionsTrendItemApi[]> {
  const res = await api.get<{ serie: EmissionsTrendItemApi[] }>(endpoints.emissions.trend);
  return res.serie ?? [];
}

export async function getEmissionsMonthly(anio?: number): Promise<EmissionsMonthApi[]> {
  const res = await api.get<{ meses: EmissionsMonthApi[] }>(endpoints.emissions.monthly, { anio });
  return res.meses ?? [];
}

export async function getEmissionsTerritories(
  anio: number | undefined,
  nivel: 'departamento' | 'municipio',
  rol: 'origen' | 'destino',
  limite = 12,
): Promise<EmissionsTerritoryApi[]> {
  const res = await api.get<{ items: EmissionsTerritoryApi[] }>(endpoints.emissions.territories, {
    anio,
    nivel,
    rol,
    limite,
  });
  return res.items ?? [];
}

export async function getEmissionsCorridors(
  anio: number | undefined,
  limite = 12,
): Promise<EmissionsCorridorApi[]> {
  const res = await api.get<{ items: EmissionsCorridorApi[] }>(endpoints.emissions.corridors, {
    anio,
    limite,
  });
  return res.items ?? [];
}

export function getEmissionsMethodology(): Promise<EmissionsMethodologyApi> {
  return api.get<EmissionsMethodologyApi>(endpoints.emissions.methodology);
}
