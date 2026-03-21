export type RouteKpiApi = {
  label: string;
  value: number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
};

export type DepartmentIntensityApi = {
  department: string;
  trips: number;
  intensity: number;
};

export type GeographyDashboardApi = {
  kpis: RouteKpiApi[];
  departments: DepartmentIntensityApi[];
};
