export type MapLayer = 'production' | 'demand' | 'royalties';

export type LayerMetric = {
  value: number | null;
  unit: string;
  available: boolean;
  secondaryLabel?: string;
  secondaryValue?: number | null;
};

export type MapDepartment = {
  id: string;
  name: string;
  values: Record<MapLayer, LayerMetric>;
};

export type MapData = {
  departments: MapDepartment[];
  source: string;
  updatedAt: string;
};

export type MapLayerApiItem = {
  department?: string;
  value?: number | null;
  departamento?: string;
  valor?: number | null;
  manifiestos?: number;
  toneladas?: number;
  tipo?: string;
  unit?: string;
};

export type DepartmentShape = {
  id: string;
  name: string;
  path: string;
  centroid: { x: number; y: number };
};

export function toDepartmentId(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
