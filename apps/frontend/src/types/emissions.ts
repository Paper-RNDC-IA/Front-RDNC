export type Co2Range = { bajo: number; central: number; alto: number };

export type EmissionsGroupApi = {
  grupo: string;
  viajes: number;
  toneladas: number;
  veh_km: number;
  ton_km: number;
  estimado: boolean;
  co2_t_central: number;
};

export type EmissionsOverviewApi = {
  anio: number;
  meses: number;
  parcial: boolean;
  viajes: number;
  viajes_pesados: number;
  viajes_livianos_y_otros: number;
  toneladas: number;
  toneladas_pesados: number;
  veh_km_pesados: number;
  ton_km_pesados: number;
  distancia_media_km: number;
  cobertura_distancia_pct: number;
  co2_t: Co2Range;
  intensidad_g_por_ton_km: Co2Range;
  por_grupo: EmissionsGroupApi[];
};

export type EmissionsTrendItemApi = EmissionsOverviewApi & {
  variacion_ton_km_pct: number | null;
  variacion_co2_central_pct: number | null;
};

export type EmissionsTerritoryApi = {
  territorio: string;
  codigo: string | null;
  viajes: number;
  ton_km: number;
  veh_km: number;
  co2_t: Co2Range;
  participacion_pct: number;
};

export type EmissionsCorridorApi = {
  origen: string;
  destino: string;
  viajes: number;
  toneladas: number;
  ton_km: number;
  co2_t: Co2Range;
};

export type EmissionsMonthApi = {
  mes: number;
  viajes: number;
  toneladas: number;
  ton_km: number;
  co2_t_central: number;
};

export type EmissionsMethodologyApi = {
  metodo: string;
  fuente_factores: string;
  grupos_estimados: string[];
  no_estimado: string;
  limites: string[];
  factores_g_co2_por_km: Record<string, Co2Range & { categoria_fecoc: string }>;
  alineacion_modelo_colombiano: Record<string, string>;
  ods: string[];
};
