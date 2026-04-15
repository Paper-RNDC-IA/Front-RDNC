import type { MapLayerApiItem } from '../../types/geography-map';
import type { DateRange } from '../../types/common';

import { api } from '../api';
import { endpoints } from '../endpoints';

function buildDateQuery(dateRange?: DateRange): Record<string, string> {
  return {
    from: dateRange?.from ?? '',
    to: dateRange?.to ?? '',
  };
}

export async function fetchProductionMap(dateRange?: DateRange): Promise<MapLayerApiItem[]> {
  const response = await api.get<unknown>(endpoints.routes.productionMap, buildDateQuery(dateRange));
  return Array.isArray(response) ? (response as MapLayerApiItem[]) : [];
}

export async function fetchDemandMap(dateRange?: DateRange): Promise<MapLayerApiItem[]> {
  const response = await api.get<unknown>(endpoints.routes.demandMap, buildDateQuery(dateRange));
  return Array.isArray(response) ? (response as MapLayerApiItem[]) : [];
}

export async function fetchRoyaltiesMap(dateRange?: DateRange): Promise<MapLayerApiItem[]> {
  const response = await api.get<unknown>(endpoints.routes.royaltiesMap, buildDateQuery(dateRange));
  return Array.isArray(response) ? (response as MapLayerApiItem[]) : [];
}
