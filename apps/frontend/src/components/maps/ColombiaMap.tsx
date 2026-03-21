import { useMemo, useState } from 'react';

import { Card } from '../common/Card';
import type { DepartmentShape, MapData, MapDepartment, MapLayer } from './types';

type ColombiaMapProps = {
  mapData: MapData;
  activeLayer: MapLayer;
  selectedDepartmentId: string | null;
  zoom: number;
  onSelectDepartment: (departmentId: string) => void;
};

type TooltipState = {
  x: number;
  y: number;
  department: MapDepartment;
};

const layerStyle: Record<MapLayer, { label: string; unit: string; palette: string[] }> = {
  production: {
    label: 'Produccion',
    unit: 'ton/dia',
    palette: ['#1f2937', '#7c2d12', '#c2410c', '#ea580c', '#fdba74'],
  },
  demand: {
    label: 'Demanda',
    unit: 'viajes/dia',
    palette: ['#1f2937', '#9a3412', '#d97706', '#f59e0b', '#fde68a'],
  },
  royalties: {
    label: 'Regalias',
    unit: 'MM COP',
    palette: ['#1f2937', '#7c2d12', '#b45309', '#f97316', '#fed7aa'],
  },
};

const departmentShapes: DepartmentShape[] = [
  {
    id: 'antioquia',
    name: 'Antioquia',
    path: 'M120 140 L160 120 L200 140 L196 182 L162 206 L126 186 Z',
    centroid: { x: 164, y: 162 },
  },
  {
    id: 'atlantico',
    name: 'Atlantico',
    path: 'M170 62 L190 52 L214 58 L208 82 L182 88 L168 76 Z',
    centroid: { x: 192, y: 70 },
  },
  {
    id: 'bolivar',
    name: 'Bolivar',
    path: 'M146 88 L174 78 L198 92 L192 118 L164 126 L142 108 Z',
    centroid: { x: 170, y: 102 },
  },
  {
    id: 'magdalena',
    name: 'Magdalena',
    path: 'M206 82 L234 74 L250 92 L246 114 L220 122 L204 104 Z',
    centroid: { x: 226, y: 98 },
  },
  {
    id: 'santander',
    name: 'Santander',
    path: 'M244 128 L278 118 L300 138 L292 166 L258 176 L236 154 Z',
    centroid: { x: 268, y: 146 },
  },
  {
    id: 'boyaca',
    name: 'Boyaca',
    path: 'M236 176 L268 168 L282 194 L272 222 L240 228 L224 202 Z',
    centroid: { x: 252, y: 198 },
  },
  {
    id: 'cundinamarca',
    name: 'Cundinamarca',
    path: 'M206 214 L242 206 L262 230 L252 264 L216 274 L194 246 Z',
    centroid: { x: 228, y: 238 },
  },
  {
    id: 'meta',
    name: 'Meta',
    path: 'M250 258 L302 244 L332 278 L320 326 L268 340 L240 300 Z',
    centroid: { x: 286, y: 292 },
  },
  {
    id: 'valle-del-cauca',
    name: 'Valle del Cauca',
    path: 'M116 240 L146 224 L168 248 L156 286 L124 302 L106 270 Z',
    centroid: { x: 138, y: 262 },
  },
  {
    id: 'narino',
    name: 'Narino',
    path: 'M104 316 L134 306 L156 334 L146 374 L118 388 L92 356 Z',
    centroid: { x: 124, y: 344 },
  },
];

function getValueRange(mapData: MapData, activeLayer: MapLayer): { min: number; max: number } {
  const values = mapData.departments
    .map((department) => department.values[activeLayer])
    .filter((metric) => metric.available && metric.value !== null)
    .map((metric) => metric.value as number);

  if (!values.length) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

function getLayerColor(
  activeLayer: MapLayer,
  value: number | null,
  available: boolean,
  min: number,
  max: number,
): string {
  if (!available || value === null) {
    return '#1f2937';
  }

  const palette = layerStyle[activeLayer].palette;

  if (min === max) {
    return palette[palette.length - 1];
  }

  const ratio = (value - min) / (max - min);
  const index = Math.min(palette.length - 1, Math.max(0, Math.floor(ratio * palette.length)));

  return palette[index];
}

function formatValue(value: number | null, unit: string): string {
  if (value === null) {
    return 'Sin dato';
  }

  return `${new Intl.NumberFormat('es-CO').format(value)} ${unit}`.trim();
}

export function ColombiaMap({
  mapData,
  activeLayer,
  selectedDepartmentId,
  zoom,
  onSelectDepartment,
}: ColombiaMapProps): JSX.Element {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const departmentsById = useMemo(() => {
    return mapData.departments.reduce<Map<string, MapDepartment>>((acc, item) => {
      acc.set(item.id, item);
      return acc;
    }, new Map<string, MapDepartment>());
  }, [mapData]);

  const valueRange = useMemo(() => getValueRange(mapData, activeLayer), [activeLayer, mapData]);

  const availableCount = useMemo(() => {
    return mapData.departments.filter((department) => department.values[activeLayer].available).length;
  }, [activeLayer, mapData.departments]);

  return (
    <Card title="Mapa SVG interactivo de Colombia">
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-3">
        <svg viewBox="60 20 310 410" className="h-[520px] w-full">
          <g transform={`translate(220 220) scale(${zoom}) translate(-220 -220)`}>
            <path
              d="M90 40 L250 40 L340 110 L350 260 L250 410 L120 390 L80 300 L70 170 Z"
              fill="#020617"
              stroke="#1e293b"
              strokeWidth="2"
            />
            {departmentShapes.map((shape) => {
              const department = departmentsById.get(shape.id);
              const metric = department?.values[activeLayer];
              const fill = getLayerColor(
                activeLayer,
                metric?.value ?? null,
                metric?.available ?? false,
                valueRange.min,
                valueRange.max,
              );
              const isSelected = selectedDepartmentId === shape.id;

              return (
                <g key={shape.id}>
                  <path
                    d={shape.path}
                    fill={fill}
                    stroke={isSelected ? '#f8fafc' : '#0f172a'}
                    strokeWidth={isSelected ? 2.5 : 1.2}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => onSelectDepartment(shape.id)}
                    onMouseLeave={() => setTooltip(null)}
                    onMouseMove={(event) => {
                      const svgRect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();

                      if (!svgRect || !department) {
                        return;
                      }

                      setTooltip({
                        x: event.clientX - svgRect.left + 12,
                        y: event.clientY - svgRect.top + 12,
                        department,
                      });
                    }}
                  />

                  {isSelected ? (
                    <circle cx={shape.centroid.x} cy={shape.centroid.y} r="4" fill="#f8fafc" />
                  ) : null}
                </g>
              );
            })}
          </g>
        </svg>

        {tooltip ? (
          <div
            className="pointer-events-none absolute rounded-md border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs text-slate-100 shadow-lg"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <p className="font-semibold text-orange-300">{tooltip.department.name}</p>
            <p>
              {layerStyle[activeLayer].label}:{' '}
              {formatValue(
                tooltip.department.values[activeLayer].value,
                tooltip.department.values[activeLayer].unit || layerStyle[activeLayer].unit,
              )}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-orange-400" />
          Capa activa: {layerStyle[activeLayer].label}
        </div>

        <div className="flex items-center gap-2">
          {layerStyle[activeLayer].palette.map((color) => (
            <span key={color} className="h-3 flex-1 rounded-sm" style={{ backgroundColor: color }} />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Min: {formatValue(valueRange.min, layerStyle[activeLayer].unit)}</span>
          <span>Max: {formatValue(valueRange.max, layerStyle[activeLayer].unit)}</span>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
          Disponibilidad de datos: {availableCount}/{mapData.departments.length} departamentos
        </div>
      </div>
    </Card>
  );
}
