import type { MapLayerApiItem } from '../../types/geography-map';

import { api } from '../api';
import { endpoints } from '../endpoints';

export async function fetchProductionMap(): Promise<MapLayerApiItem[]> {
  const response = await api.get<unknown>(endpoints.routes.productionMap);
  return Array.isArray(response) ? (response as MapLayerApiItem[]) : [];
}

export async function fetchDemandMap(): Promise<MapLayerApiItem[]> {
  const response = await api.get<unknown>(endpoints.routes.demandMap);
  return Array.isArray(response) ? (response as MapLayerApiItem[]) : [];
}

export async function fetchRoyaltiesMap(): Promise<MapLayerApiItem[]> {
  const response = await api.get<unknown>(endpoints.routes.royaltiesMap);
  return Array.isArray(response) ? (response as MapLayerApiItem[]) : [];
}
