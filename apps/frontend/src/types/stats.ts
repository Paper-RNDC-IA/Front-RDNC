export type StatsKpiApi = {
  label: string;
  value: number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
};

export type StatsTrendApi = {
  period: string;
  total: number;
};

export type StatsSummaryApi = {
  module: string;
  total: number;
};

export type StatsDashboardRawApi = {
  manifiestos?: {
    total_manifiestos?: number;
    total_toneladas?: number;
    empresas_activas?: number;
    variacion_manifiestos?: number;
    variacion_toneladas?: number;
  };
  rutas?: {
    total_rutas?: number;
    corredores_activos?: number;
  };
  empresas?: {
    total_empresas?: number;
    empresas_activas?: number;
  };
  trends?: Array<{
    period?: string;
    total?: number;
    total_manifiestos?: number;
    mes?: number;
    anio?: number;
  }>;
  ultima_actualizacion?: string;
};

export type StatsDashboardApi = {
  kpis: StatsKpiApi[];
  trends: StatsTrendApi[];
  summary: StatsSummaryApi[];
  updatedAt?: string;
  healthStatus?: string;
};
