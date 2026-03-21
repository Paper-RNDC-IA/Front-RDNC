export type ManifestKpiApi = {
  label: string;
  value: number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
};

export type ManifestTrendApi = {
  period: string;
  total: number;
};

export type RouteRankingApi = {
  route: string;
  trips: number;
  incidents: number;
};

export type CompanyRankingApi = {
  company: string;
  manifests: number;
  compliance: number;
};

export type ManifestDistributionApi = {
  status: string;
  total: number;
};

export type ManifestsDashboardApi = {
  kpis: ManifestKpiApi[];
  trends: ManifestTrendApi[];
  route_ranking: RouteRankingApi[];
  company_ranking: CompanyRankingApi[];
  distribution: ManifestDistributionApi[];
};
