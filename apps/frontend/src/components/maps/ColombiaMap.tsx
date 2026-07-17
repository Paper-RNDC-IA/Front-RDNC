import { useEffect, useMemo, useRef, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';

import { Card } from '../common/Card';
import type { MapData, MapDepartment, MapLayer } from './types';

type ColombiaMapProps = {
  mapData: MapData;
  activeLayer: MapLayer;
  selectedDepartmentId: string | null;
  zoom: number;
  onLayerChange: (layer: MapLayer) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onSelectDepartment: (departmentId: string) => void;
};

const layerStyle: Record<MapLayer, { label: string; unit: string; palette: string[] }> = {
  production: {
    label: 'Produccion',
    unit: 'ton/dia',
    palette: ['#fff3e0', '#f9d9b0', '#f2b475', '#d88939', '#ad6218'],
  },
  demand: {
    label: 'Demanda',
    unit: 'viajes/dia',
    palette: ['#ffedd5', '#fdba74', '#fb923c', '#f97316', '#c2410c'],
  },
  royalties: {
    label: 'Regalias',
    unit: 'MM COP',
    palette: ['#d1fae5', '#6ee7b7', '#34d399', '#10b981', '#047857'],
  },
};

// Coordenadas reales de la capital de cada departamento — usadas como punto
// representativo para el mapa de burbujas (no son el centroide geometrico
// exacto del departamento, pero dan una posicion real sobre el mapa).
const DEPARTMENT_COORDS: Record<string, { lat: number; lon: number }> = {
  'la-guajira': { lat: 11.5444, lon: -72.9072 },
  magdalena: { lat: 11.2408, lon: -74.199 },
  atlantico: { lat: 10.9639, lon: -74.7964 },
  cesar: { lat: 10.4631, lon: -73.2532 },
  bolivar: { lat: 10.391, lon: -75.4794 },
  sucre: { lat: 9.3047, lon: -75.3978 },
  cordoba: { lat: 8.7479, lon: -75.8814 },
  'norte-de-santander': { lat: 7.8939, lon: -72.5078 },
  santander: { lat: 7.1193, lon: -73.1227 },
  boyaca: { lat: 5.5353, lon: -73.3678 },
  antioquia: { lat: 6.2442, lon: -75.5812 },
  caldas: { lat: 5.0689, lon: -75.5174 },
  risaralda: { lat: 4.8133, lon: -75.6961 },
  quindio: { lat: 4.5339, lon: -75.6811 },
  cundinamarca: { lat: 5.0, lon: -74.3 },
  'bogota-d-c': { lat: 4.711, lon: -74.0721 },
  tolima: { lat: 4.4389, lon: -75.2322 },
  huila: { lat: 2.9273, lon: -75.2819 },
  choco: { lat: 5.6947, lon: -76.6611 },
  'valle-del-cauca': { lat: 3.4516, lon: -76.532 },
  cauca: { lat: 2.4448, lon: -76.6147 },
  narino: { lat: 1.2136, lon: -77.2811 },
  arauca: { lat: 7.0847, lon: -70.7591 },
  casanare: { lat: 5.3378, lon: -72.3959 },
  meta: { lat: 4.142, lon: -73.6266 },
  vichada: { lat: 6.1892, lon: -67.4859 },
  guaviare: { lat: 2.5697, lon: -72.6403 },
  caqueta: { lat: 1.6144, lon: -75.6062 },
  putumayo: { lat: 1.1467, lon: -76.6486 },
  vaupes: { lat: 1.2536, lon: -70.2342 },
  guainia: { lat: 3.8653, lon: -67.9239 },
  amazonas: { lat: -4.2153, lon: -69.9406 },
  'san-andres-y-providencia': { lat: 12.5847, lon: -81.7006 },
};

const COLOMBIA_CENTER: [number, number] = [4.5709, -74.2973];
const DEFAULT_ZOOM = 5;
const MIN_RADIUS = 6;
const MAX_RADIUS = 32;

function getValueRange(mapData: MapData, activeLayer: MapLayer): { min: number; max: number } {
  const values = mapData.departments
    .map((department) => department.values[activeLayer])
    .filter((metric) => metric.available && metric.value !== null)
    .map((metric) => metric.value as number);

  if (!values.length) {
    return { min: 0, max: 0 };
  }

  return { min: Math.min(...values), max: Math.max(...values) };
}

function getLayerColor(activeLayer: MapLayer, ratio: number | null): string {
  const palette = layerStyle[activeLayer].palette;
  if (ratio === null) {
    return '#cbd5e1';
  }
  const index = Math.min(palette.length - 1, Math.max(0, Math.floor(ratio * palette.length)));
  return palette[index];
}

function getRadius(ratio: number | null): number {
  if (ratio === null) {
    return MIN_RADIUS;
  }
  return MIN_RADIUS + ratio * (MAX_RADIUS - MIN_RADIUS);
}

function formatValue(value: number | null, unit: string): string {
  if (value === null) {
    return 'Sin dato';
  }
  return `${new Intl.NumberFormat('es-CO').format(value)} ${unit}`.trim();
}

function MapZoomController({
  zoom,
  mapRef,
}: {
  zoom: number;
  mapRef: React.MutableRefObject<LeafletMap | null>;
}): null {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  useEffect(() => {
    map.setZoom(DEFAULT_ZOOM + Math.round((zoom - 1) * 4));
  }, [map, zoom]);

  return null;
}

export function ColombiaMap({
  mapData,
  activeLayer,
  selectedDepartmentId,
  zoom,
  onLayerChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onSelectDepartment,
}: ColombiaMapProps): JSX.Element {
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);

  const departmentsById = useMemo(() => {
    return mapData.departments.reduce<Map<string, MapDepartment>>((acc, item) => {
      acc.set(item.id, item);
      return acc;
    }, new Map<string, MapDepartment>());
  }, [mapData]);

  const valueRange = useMemo(() => getValueRange(mapData, activeLayer), [activeLayer, mapData]);

  const availableCount = useMemo(() => {
    return mapData.departments.filter((department) => department.values[activeLayer].available)
      .length;
  }, [activeLayer, mapData.departments]);

  const layerPercentages = [
    'Muy Alta (80-100%)',
    'Alta (60-80%)',
    'Media (40-60%)',
    'Baja (20-40%)',
    'Muy Baja (0-20%)',
  ];

  const points = mapData.departments
    .map((department) => {
      const coords = DEPARTMENT_COORDS[department.id];
      if (!coords) {
        return null;
      }
      const metric = department.values[activeLayer];
      const ratio =
        metric.available && metric.value !== null && valueRange.max > valueRange.min
          ? (metric.value - valueRange.min) / (valueRange.max - valueRange.min)
          : metric.available && metric.value !== null
            ? 1
            : null;
      return { department, coords, metric, ratio };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <Card className="border-slate-300 bg-white" title="">
      <div className="relative min-h-[620px] overflow-hidden rounded-xl border border-slate-300 bg-[#f3f4f6] p-4">
        <div className="absolute left-3 top-3 z-[1000] flex flex-col gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm"
            onClick={() => {
              mapRef.current?.zoomIn();
              onZoomIn();
            }}
          >
            +
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm"
            onClick={() => {
              mapRef.current?.zoomOut();
              onZoomOut();
            }}
          >
            -
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm"
            onClick={() => {
              mapRef.current?.setView(COLOMBIA_CENTER, DEFAULT_ZOOM);
              onResetZoom();
            }}
          >
            R
          </button>
        </div>

        <div className="absolute right-6 top-4 z-[1000] rounded-xl border border-slate-300 bg-white/95 p-1 shadow-md">
          <div className="flex items-center gap-1">
            {(['production', 'royalties', 'demand'] as MapLayer[]).map((layer) => (
              <button
                key={layer}
                type="button"
                onClick={() => onLayerChange(layer)}
                className={[
                  'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                  activeLayer === layer && layer === 'production' ? 'bg-amber-700 text-white' : '',
                  activeLayer === layer && layer === 'royalties' ? 'bg-emerald-600 text-white' : '',
                  activeLayer === layer && layer === 'demand' ? 'bg-orange-600 text-white' : '',
                  activeLayer !== layer ? 'text-slate-600 hover:bg-slate-100' : '',
                ].join(' ')}
              >
                {layerStyle[layer].label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[560px] w-full pt-8 xl:h-[620px]">
          <MapContainer
            center={COLOMBIA_CENTER}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom
            className="h-full w-full rounded-lg"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapZoomController zoom={zoom} mapRef={mapRef} />

            {points.map(({ department, coords, metric, ratio }) => {
              const isSelected = selectedDepartmentId === department.id;
              return (
                <CircleMarker
                  key={department.id}
                  center={[coords.lat, coords.lon]}
                  radius={getRadius(ratio)}
                  pathOptions={{
                    fillColor: getLayerColor(activeLayer, ratio),
                    fillOpacity: 0.85,
                    color: isSelected ? '#7c2d12' : '#ffffff',
                    weight: isSelected ? 3 : 1.5,
                  }}
                  eventHandlers={{
                    click: () => onSelectDepartment(department.id),
                  }}
                >
                  <Popup>
                    <strong>{department.name}</strong>
                    <br />
                    {layerStyle[activeLayer].label}:{' '}
                    {formatValue(metric.value, metric.unit || layerStyle[activeLayer].unit)}
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        <div className="absolute bottom-4 left-8 z-[1000]">
          {!isExplorerOpen ? (
            <button
              type="button"
              className="rounded-xl border border-slate-300 bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow-md hover:bg-white"
              onClick={() => setIsExplorerOpen(true)}
            >
              Abrir explorador
            </button>
          ) : (
            <div className="max-w-xs rounded-2xl border border-slate-300 bg-white/95 p-5 shadow-md">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-lg font-semibold text-slate-800">Explorador Interactivo</h4>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  onClick={() => setIsExplorerOpen(false)}
                >
                  Minimizar
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Haz clic en cualquier burbuja para ver estadisticas detalladas de produccion,
                regalias y demanda regional. El tamano y color de cada burbuja reflejan el valor
                de la capa activa.
              </p>
            </div>
          )}
        </div>

        <div className="absolute bottom-4 right-4 z-[1000]">
          {!isLegendOpen ? (
            <button
              type="button"
              className="rounded-xl border border-slate-300 bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow-md hover:bg-white"
              onClick={() => setIsLegendOpen(true)}
            >
              Abrir leyenda
            </button>
          ) : (
            <div className="w-[310px] rounded-2xl border border-slate-300 bg-white/95 p-5 shadow-md">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-lg font-semibold text-slate-800">Leyenda del Mapa</h4>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  onClick={() => setIsLegendOpen(false)}
                >
                  Minimizar
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-500">Intensidad de Datos</p>
              <div className="mt-3 space-y-2">
                {layerStyle[activeLayer].palette
                  .slice()
                  .reverse()
                  .map((color, index) => (
                    <div
                      key={`${color}-${index}`}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <span
                        className="inline-flex h-4 w-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {layerPercentages[index]}
                    </div>
                  ))}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="inline-flex h-4 w-4 rounded-full border border-slate-300 bg-[#cbd5e1]" />
                  Sin datos
                </div>
              </div>
              <div className="mt-4 border-t border-slate-200 pt-3 text-sm text-slate-600">
                {availableCount} de {mapData.departments.length} departamentos con datos
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
