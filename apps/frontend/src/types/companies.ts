export type CompanyKpiApi = {
  label: string;
  value: number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
};

export type CompanyApi = {
  id: string;
  name: string;
  nit: string;
  active_vehicles: number;
  compliance: number;
  city?: string;
  status?: string;
};

export type CompaniesDashboardApi = {
  kpis: CompanyKpiApi[];
  companies: CompanyApi[];
};
