import type { ExportCombinedApi } from '../types/export';
import type { CompanyApi, CompanyKpiApi } from '../types/companies';
import type { ManifestDistributionApi, ManifestKpiApi, ManifestTrendApi, RouteRankingApi, CompanyRankingApi } from '../types/manifests';
import type { MapLayerApiItem } from '../types/geography-map';
import type { DepartmentIntensityApi, RouteKpiApi } from '../types/routes';
import type { StatsKpiApi, StatsSummaryApi, StatsTrendApi } from '../types/stats';
import type { AlertApi, CorridorSegmentApi, SecurityEventApi, SpeedPointApi, TelemetryKpiApi } from '../types/telemetry';

export const mockStatsKpis: StatsKpiApi[] = [
  { label: 'Viajes Totales', value: 12540, delta: '+4.2%', trend: 'up' },
  { label: 'Empresas Activas', value: 332, delta: '+1.1%', trend: 'up' },
  { label: 'Incidentes', value: 84, delta: '-2.5%', trend: 'down' },
  { label: 'Cumplimiento', value: 96, delta: '+0.8%', trend: 'up' },
];

export const mockStatsTrends: StatsTrendApi[] = [
  { period: 'Ene', total: 1800 },
  { period: 'Feb', total: 1950 },
  { period: 'Mar', total: 2100 },
  { period: 'Abr', total: 2050 },
  { period: 'May', total: 2200 },
  { period: 'Jun', total: 2440 },
];

export const mockStatsSummary: StatsSummaryApi[] = [
  { module: 'Manifiestos', total: 5400 },
  { module: 'Telemetria', total: 3100 },
  { module: 'Geografia', total: 2200 },
  { module: 'Empresas', total: 1840 },
];

export const mockManifestKpis: ManifestKpiApi[] = [
  { label: 'Manifiestos emitidos', value: 5400, delta: '+3.8%', trend: 'up' },
  { label: 'Rutas activas', value: 128, delta: '+2.1%', trend: 'up' },
  { label: 'Empresas en ruta', value: 96, delta: '+0.7%', trend: 'up' },
  { label: 'Novedades', value: 42, delta: '-6.1%', trend: 'down' },
];

export const mockManifestTrends: ManifestTrendApi[] = [
  { period: 'Semana 1', total: 1200 },
  { period: 'Semana 2', total: 1380 },
  { period: 'Semana 3', total: 1425 },
  { period: 'Semana 4', total: 1395 },
];

export const mockManifestRouteRanking: RouteRankingApi[] = [
  { route: 'Bogota - Medellin', trips: 440, incidents: 5 },
  { route: 'Cali - Buenaventura', trips: 385, incidents: 8 },
  { route: 'Barranquilla - Cartagena', trips: 332, incidents: 3 },
  { route: 'Bogota - Villavicencio', trips: 298, incidents: 6 },
];

export const mockManifestCompanyRanking: CompanyRankingApi[] = [
  { company: 'Carga Andina SAS', manifests: 740, compliance: 97 },
  { company: 'Logistica del Norte', manifests: 690, compliance: 95 },
  { company: 'Transportes del Pacifico', manifests: 620, compliance: 93 },
  { company: 'Rutas Seguras LTDA', manifests: 560, compliance: 91 },
];

export const mockManifestDistribution: ManifestDistributionApi[] = [
  { status: 'Cumplido', total: 4200 },
  { status: 'En proceso', total: 980 },
  { status: 'Con novedad', total: 220 },
];

export const mockTelemetryKpis: TelemetryKpiApi[] = [
  { label: 'Vehiculos monitoreados', value: 1580, delta: '+2.4%', trend: 'up' },
  { label: 'Velocidad promedio', value: 52, delta: '+1.8%', trend: 'up' },
  { label: 'Alertas activas', value: 35, delta: '-10.2%', trend: 'down' },
  { label: 'Eventos de seguridad', value: 9, delta: '-18.0%', trend: 'down' },
];

export const mockTelemetrySpeedTrend: SpeedPointApi[] = [
  { period: '06:00', avg_speed: 45 },
  { period: '09:00', avg_speed: 52 },
  { period: '12:00', avg_speed: 56 },
  { period: '15:00', avg_speed: 58 },
  { period: '18:00', avg_speed: 49 },
];

export const mockTelemetryAlerts: AlertApi[] = [
  { type: 'Exceso de velocidad', count: 17, severity: 'Alta' },
  { type: 'Desvio de ruta', count: 9, severity: 'Media' },
  { type: 'Detencion prolongada', count: 9, severity: 'Media' },
];

export const mockTelemetryCorridor: CorridorSegmentApi[] = [
  { segment: 'Bogota - La Vega', vehicles: 220, avg_speed: 48 },
  { segment: 'La Vega - Villeta', vehicles: 205, avg_speed: 52 },
  { segment: 'Villeta - Guaduas', vehicles: 198, avg_speed: 50 },
];

export const mockTelemetrySecurityEvents: SecurityEventApi[] = [
  { event: 'Boton de panico', count: 2, status: 'Atendido' },
  { event: 'Apertura no autorizada', count: 4, status: 'En revision' },
  { event: 'Perdida de senal', count: 3, status: 'Mitigado' },
];

export const mockGeographyKpis: RouteKpiApi[] = [
  { label: 'Departamentos con actividad', value: 24, delta: '+2', trend: 'up' },
  { label: 'Corredores activos', value: 18, delta: '+1', trend: 'up' },
  { label: 'Rutas criticas', value: 5, delta: '-1', trend: 'down' },
  { label: 'Cobertura territorial', value: 82, delta: '+3%', trend: 'up' },
];

export const mockGeographyDepartments: DepartmentIntensityApi[] = [
  { department: 'Antioquia', trips: 620, intensity: 88 },
  { department: 'Cundinamarca', trips: 780, intensity: 92 },
  { department: 'Valle del Cauca', trips: 560, intensity: 80 },
  { department: 'Atlantico', trips: 340, intensity: 64 },
  { department: 'Santander', trips: 410, intensity: 71 },
  { department: 'Bolivar', trips: 320, intensity: 58 },
  { department: 'Meta', trips: 290, intensity: 47 },
  { department: 'Nariño', trips: 260, intensity: 44 },
  { department: 'Magdalena', trips: 230, intensity: 41 },
  { department: 'Boyaca', trips: 300, intensity: 55 },
];

export const mockGeographyProductionMap: MapLayerApiItem[] = [
  { department: 'Antioquia', value: 1450, unit: 'ton/dia' },
  { department: 'Cundinamarca', value: 1780, unit: 'ton/dia' },
  { department: 'Valle del Cauca', value: 1320, unit: 'ton/dia' },
  { department: 'Atlantico', value: 940, unit: 'ton/dia' },
  { department: 'Santander', value: 1080, unit: 'ton/dia' },
  { department: 'Bolivar', value: 890, unit: 'ton/dia' },
  { department: 'Meta', value: 810, unit: 'ton/dia' },
  { department: 'Narino', value: 650, unit: 'ton/dia' },
  { department: 'Magdalena', value: 720, unit: 'ton/dia' },
  { department: 'Boyaca', value: 760, unit: 'ton/dia' },
];

export const mockGeographyDemandMap: MapLayerApiItem[] = [
  { department: 'Antioquia', value: 540, unit: 'viajes/dia' },
  { department: 'Cundinamarca', value: 680, unit: 'viajes/dia' },
  { department: 'Valle del Cauca', value: 490, unit: 'viajes/dia' },
  { department: 'Atlantico', value: 330, unit: 'viajes/dia' },
  { department: 'Santander', value: 380, unit: 'viajes/dia' },
  { department: 'Bolivar', value: 295, unit: 'viajes/dia' },
  { department: 'Meta', value: 272, unit: 'viajes/dia' },
  { department: 'Narino', value: 198, unit: 'viajes/dia' },
  { department: 'Magdalena', value: 226, unit: 'viajes/dia' },
  { department: 'Boyaca', value: 240, unit: 'viajes/dia' },
];

export const mockGeographyRoyaltiesMap: MapLayerApiItem[] = [
  { department: 'Antioquia', value: 124, unit: 'MM COP' },
  { department: 'Cundinamarca', value: 110, unit: 'MM COP' },
  { department: 'Valle del Cauca', value: 98, unit: 'MM COP' },
  { department: 'Atlantico', value: 76, unit: 'MM COP' },
  { department: 'Santander', value: 88, unit: 'MM COP' },
  { department: 'Bolivar', value: 72, unit: 'MM COP' },
  { department: 'Meta', value: 130, unit: 'MM COP' },
  { department: 'Narino', value: 54, unit: 'MM COP' },
  { department: 'Magdalena', value: 60, unit: 'MM COP' },
  { department: 'Boyaca', value: 66, unit: 'MM COP' },
];

export const mockCompanyKpis: CompanyKpiApi[] = [
  { label: 'Empresas habilitadas', value: 332, delta: '+4', trend: 'up' },
  { label: 'Empresas con actividad', value: 290, delta: '+2', trend: 'up' },
  { label: 'Empresas en seguimiento', value: 26, delta: '-3', trend: 'down' },
  { label: 'Promedio cumplimiento', value: 95, delta: '+1.3%', trend: 'up' },
];

export const mockCompanies: CompanyApi[] = [
  {
    id: 'cmp-1',
    name: 'Carga Andina SAS',
    nit: '901234567-1',
    active_vehicles: 130,
    compliance: 97,
    city: 'Bogota',
    status: 'Activa',
  },
  {
    id: 'cmp-2',
    name: 'Logistica del Norte',
    nit: '900987654-0',
    active_vehicles: 108,
    compliance: 95,
    city: 'Barranquilla',
    status: 'Activa',
  },
  {
    id: 'cmp-3',
    name: 'Transportes del Pacifico',
    nit: '900112233-9',
    active_vehicles: 96,
    compliance: 93,
    city: 'Cali',
    status: 'Activa',
  },
  {
    id: 'cmp-4',
    name: 'Rutas Seguras LTDA',
    nit: '901998877-5',
    active_vehicles: 84,
    compliance: 91,
    city: 'Medellin',
    status: 'Observacion',
  },
];

export const mockExportCombined: ExportCombinedApi = {
  summary: [
    { label: 'Registros consolidados', total: 1842 },
    { label: 'Modulos incluidos', total: 6 },
    { label: 'Filas con novedad', total: 72 },
  ],
  rows: [
    { module: 'stats', metric: 'viajes_totales', value: 12540 },
    { module: 'manifests', metric: 'manifiestos_emitidos', value: 5400 },
    { module: 'telemetry', metric: 'vehiculos_monitoreados', value: 1580 },
    { module: 'routes', metric: 'departamentos_con_actividad', value: 24 },
    { module: 'companies', metric: 'empresas_habilitadas', value: 332 },
  ],
};
