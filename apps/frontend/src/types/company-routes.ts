export type RoutePoint = {
  lat: number;
  lng: number;
  timestamp: string | null;
  speedKmh: number | null;
};

export type RouteEvent = {
  id: string;
  type: string;
  label: string;
  description: string;
  lat: number;
  lng: number;
  timestamp: string | null;
  severity: 'high' | 'medium' | 'low' | 'info';
};

export type RouteMapStats = {
  distanceKm: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  totalPoints: number;
  timeRangeLabel: string;
};

export type VehicleRouteMap = {
  path: RoutePoint[];
  startPoint: RoutePoint | null;
  endPoint: RoutePoint | null;
  events: RouteEvent[];
  stats: RouteMapStats;
};

export type VehicleOption = {
  value: string;
  label: string;
};

export type MonthOption = {
  value: string;
  label: string;
};

export type FileOption = {
  value: string;
  label: string;
};

export type RouteMapFiltersState = {
  fileId: string;
  vehicleId: string;
  month: string;
};

export type RouteFileApi = {
  file_id: string;
  file_name: string;
  status?: string;
};

export type RouteVehicleApi = {
  vehicle_id: string;
  vehicle_label?: string;
  plate?: string;
};

export type RouteMonthApi = {
  month: string;
  label?: string;
};

export type RoutePointApi = {
  lat: number | string;
  lng: number | string;
  timestamp?: string | null;
  speed_kmh?: number | string | null;
};

export type RouteEventApi = {
  id?: string;
  type?: string;
  label?: string;
  description?: string;
  lat: number | string;
  lng: number | string;
  timestamp?: string | null;
  severity?: string;
};

export type RouteMapApi = {
  points?: RoutePointApi[];
  path?: RoutePointApi[];
  start_point?: RoutePointApi | null;
  end_point?: RoutePointApi | null;
  stats?: {
    distance_km?: number | string;
    avg_speed_kmh?: number | string;
    max_speed_kmh?: number | string;
    total_points?: number | string;
    from_at?: string | null;
    to_at?: string | null;
  };
};
