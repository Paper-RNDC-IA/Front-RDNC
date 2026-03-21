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

export type StatsDashboardApi = {
  kpis: StatsKpiApi[];
  trends: StatsTrendApi[];
  summary: StatsSummaryApi[];
};
