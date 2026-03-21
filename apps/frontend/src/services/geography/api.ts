import { mockGeographyDemandMap, mockGeographyProductionMap, mockGeographyRoyaltiesMap } from '../../constants/mocks';
import type { MapLayerApiItem } from '../../types/geography-map';

import { api, withMockFallback } from '../api';
import { endpoints } from '../endpoints';

export function fetchProductionMap(): Promise<MapLayerApiItem[]> {
  return withMockFallback(
    () => api.get<MapLayerApiItem[]>(endpoints.routes.productionMap),
    mockGeographyProductionMap,
  );
}

export function fetchDemandMap(): Promise<MapLayerApiItem[]> {
  return withMockFallback(
    () => api.get<MapLayerApiItem[]>(endpoints.routes.demandMap),
    mockGeographyDemandMap,
  );
}

export function fetchRoyaltiesMap(): Promise<MapLayerApiItem[]> {
  return withMockFallback(
    () => api.get<MapLayerApiItem[]>(endpoints.routes.royaltiesMap),
    mockGeographyRoyaltiesMap,
  );
}
