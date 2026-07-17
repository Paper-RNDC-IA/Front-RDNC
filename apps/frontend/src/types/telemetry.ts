export type TelemetryKpiApi = {
  label: string;
  value: number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
};

export type SpeedPointApi = {
  period: string;
  avg_speed: number;
};

export type AlertApi = {
  type: string;
  count: number;
  severity?: string;
};

export type CorridorSegmentApi = {
  segment: string;
  vehicles: number;
  avg_speed: number;
};

export type SecurityEventApi = {
  event: string;
  count: number;
  status?: string;
};

export type TelemetryDashboardApi = {
  kpis: TelemetryKpiApi[];
  speed_trend: SpeedPointApi[];
  alerts: AlertApi[];
  corridor: CorridorSegmentApi[];
  security_events: SecurityEventApi[];
};

export type Co2TendenciaRowApi = {
  mes: string;
  co2_kg: number;
  co2_kg_acumulado: number;
  galones: number;
  costo_cop: number;
  distancia_km: number;
  registros: number;
};

export type NodoParadaApi = {
  lat: number;
  lon: number;
  registros: number;
  vel_promedio: number;
  primera_vez: string;
  ultima_vez: string;
};
