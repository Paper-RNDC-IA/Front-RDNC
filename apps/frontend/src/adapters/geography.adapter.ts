import type { KpiItem } from '../types/common';
import type { DepartmentIntensityApi, RouteKpiApi } from '../types/routes';
import { formatNumber } from '../utils/formatters';

export type DepartmentView = {
  department: string;
  trips: number;
  intensity: number;
};

export function adaptGeographyKpis(items: RouteKpiApi[]): KpiItem[] {
  return items.map((item) => ({
    label: item.label,
    value: formatNumber(item.value),
    delta: item.delta,
    trend: item.trend,
  }));
}

export function adaptDepartments(items: DepartmentIntensityApi[]): DepartmentView[] {
  return items.map((item) => ({
    department: item.department,
    trips: item.trips,
    intensity: item.intensity,
  }));
}
