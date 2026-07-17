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

export type InteranualRowApi = {
  anio: number;
  total_manifiestos: number;
  total_toneladas: number;
  empresas_activas: number;
  var_manifiestos_pct: number | null;
  var_toneladas_pct: number | null;
};

export type OdMatrixRowApi = {
  origen_dane: string;
  destino_dane: string;
  origen: string;
  destino: string;
  departamento_origen: string;
  departamento_destino: string;
  total_viajes: number;
  total_toneladas: number;
  origen_lat: number;
  origen_lon: number;
  destino_lat: number;
  destino_lon: number;
};

export type ClusterRowApi = {
  cluster_id: number;
  total_viajes: number;
  total_toneladas: number;
  centroide: { origen_top: string; destino_top: string };
  rutas_miembro: {
    departamento_origen: string;
    departamento_destino: string;
    total_viajes: number;
    total_toneladas: number;
  }[];
};
