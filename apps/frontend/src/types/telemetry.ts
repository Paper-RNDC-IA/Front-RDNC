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
  severity: string;
};

export type CorridorSegmentApi = {
  segment: string;
  vehicles: number;
  avg_speed: number;
};

export type SecurityEventApi = {
  event: string;
  count: number;
  status: string;
};

export type TelemetryDashboardApi = {
  kpis: TelemetryKpiApi[];
  speed_trend: SpeedPointApi[];
  alerts: AlertApi[];
  corridor: CorridorSegmentApi[];
  security_events: SecurityEventApi[];
};
