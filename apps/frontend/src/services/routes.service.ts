import type { DateRange } from '../types/common';
import type { DepartmentIntensityApi, RouteKpiApi } from '../types/routes';
import { mockGeographyDepartments, mockGeographyKpis } from '../constants/mocks';

import { api, withMockFallback } from './api';
import { endpoints } from './endpoints';

function buildDateQuery(dateRange?: DateRange): Record<string, string> {
  return {
    from: dateRange?.from ?? '',
    to: dateRange?.to ?? '',
  };
}

export function getRouteKpis(dateRange?: DateRange): Promise<RouteKpiApi[]> {
  return withMockFallback(
    () => api.get<RouteKpiApi[]>(endpoints.routes.kpis, buildDateQuery(dateRange)),
    mockGeographyKpis,
  );
}

export function getDepartmentIntensity(dateRange?: DateRange): Promise<DepartmentIntensityApi[]> {
  return withMockFallback(
    () =>
      api.get<DepartmentIntensityApi[]>(endpoints.routes.departments, buildDateQuery(dateRange)),
    mockGeographyDepartments,
  );
}
