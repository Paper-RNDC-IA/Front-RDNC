import type { ExportCombinedApi } from '../types/export';
import type { CompanyApi, CompanyKpiApi } from '../types/companies';
import type {
  ManifestDistributionApi,
  ManifestKpiApi,
  ManifestTrendApi,
  RouteRankingApi,
  CompanyRankingApi,
} from '../types/manifests';
import type { MapLayerApiItem } from '../types/geography-map';
import type { DepartmentIntensityApi, RouteKpiApi } from '../types/routes';
import type { StatsKpiApi, StatsSummaryApi, StatsTrendApi } from '../types/stats';
import type {
  AlertApi,
  CorridorSegmentApi,
  SecurityEventApi,
  SpeedPointApi,
  TelemetryKpiApi,
} from '../types/telemetry';

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
  {
    departamento: 'Antioquia',
    valor: 1450,
    manifiestos: 4200,
    tipo: 'produccion',
    unit: 'ton/dia',
  },
  {
    departamento: 'Cundinamarca',
    valor: 1780,
    manifiestos: 5800,
    tipo: 'produccion',
    unit: 'ton/dia',
  },
  {
    departamento: 'Valle del Cauca',
    valor: 1320,
    manifiestos: 3900,
    tipo: 'produccion',
    unit: 'ton/dia',
  },
  { departamento: 'Atlantico', valor: 940, manifiestos: 2200, tipo: 'produccion', unit: 'ton/dia' },
  {
    departamento: 'Santander',
    valor: 1080,
    manifiestos: 2650,
    tipo: 'produccion',
    unit: 'ton/dia',
  },
  { departamento: 'Bolivar', valor: 890, manifiestos: 1980, tipo: 'produccion', unit: 'ton/dia' },
  { departamento: 'Meta', valor: 810, manifiestos: 1700, tipo: 'produccion', unit: 'ton/dia' },
  { departamento: 'Narino', valor: 650, manifiestos: 1320, tipo: 'produccion', unit: 'ton/dia' },
  { departamento: 'Magdalena', valor: 720, manifiestos: 1460, tipo: 'produccion', unit: 'ton/dia' },
  { departamento: 'Boyaca', valor: 760, manifiestos: 1550, tipo: 'produccion', unit: 'ton/dia' },
];

export const mockGeographyDemandMap: MapLayerApiItem[] = [
  { departamento: 'Antioquia', valor: 540, tipo: 'demanda', unit: 'viajes/dia' },
  { departamento: 'Cundinamarca', valor: 680, tipo: 'demanda', unit: 'viajes/dia' },
  { departamento: 'Valle del Cauca', valor: 490, tipo: 'demanda', unit: 'viajes/dia' },
  { departamento: 'Atlantico', valor: 330, tipo: 'demanda', unit: 'viajes/dia' },
  { departamento: 'Santander', valor: 380, tipo: 'demanda', unit: 'viajes/dia' },
  { departamento: 'Bolivar', valor: 295, tipo: 'demanda', unit: 'viajes/dia' },
  { departamento: 'Meta', valor: 272, tipo: 'demanda', unit: 'viajes/dia' },
  { departamento: 'Narino', valor: 198, tipo: 'demanda', unit: 'viajes/dia' },
  { departamento: 'Magdalena', valor: 226, tipo: 'demanda', unit: 'viajes/dia' },
  { departamento: 'Boyaca', valor: 240, tipo: 'demanda', unit: 'viajes/dia' },
];

export const mockGeographyRoyaltiesMap: MapLayerApiItem[] = [
  { departamento: 'Antioquia', valor: 124, toneladas: 500000, tipo: 'regalias', unit: 'MM COP' },
  { departamento: 'Cundinamarca', valor: 110, toneladas: 420000, tipo: 'regalias', unit: 'MM COP' },
  {
    departamento: 'Valle del Cauca',
    valor: 98,
    toneladas: 390000,
    tipo: 'regalias',
    unit: 'MM COP',
  },
  { departamento: 'Atlantico', valor: 76, toneladas: 270000, tipo: 'regalias', unit: 'MM COP' },
  { departamento: 'Santander', valor: 88, toneladas: 310000, tipo: 'regalias', unit: 'MM COP' },
  { departamento: 'Bolivar', valor: 72, toneladas: 250000, tipo: 'regalias', unit: 'MM COP' },
  { departamento: 'Meta', valor: 130, toneladas: 530000, tipo: 'regalias', unit: 'MM COP' },
  { departamento: 'Narino', valor: 54, toneladas: 190000, tipo: 'regalias', unit: 'MM COP' },
  { departamento: 'Magdalena', valor: 60, toneladas: 220000, tipo: 'regalias', unit: 'MM COP' },
  { departamento: 'Boyaca', valor: 66, toneladas: 235000, tipo: 'regalias', unit: 'MM COP' },
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
