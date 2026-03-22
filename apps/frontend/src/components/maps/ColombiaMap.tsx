import { useMemo, useState } from 'react';

import { Card } from '../common/Card';
import type { DepartmentShape, MapData, MapDepartment, MapLayer } from './types';

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

type TooltipState = {
  x: number;
  y: number;
  department: MapDepartment;
};

type DepartmentMapShape = DepartmentShape & {
  labelX: number;
  labelY: number;
  shortName: string;
};

const layerStyle: Record<MapLayer, { label: string; unit: string; palette: string[] }> = {
  production: {
    label: 'Produccion',
    unit: 'ton/dia',
    palette: ['#dbeafe', '#93c5fd', '#60a5fa', '#2563eb', '#1e40af'],
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

const departmentShapes: DepartmentMapShape[] = [
  {
    id: 'la-guajira',
    name: 'La Guajira',
    path: 'M650,50 L720,40 L750,60 L780,90 L770,130 L740,150 L700,140 L670,120 L650,90 Z',
    centroid: { x: 715, y: 95 },
    labelX: 715,
    labelY: 95,
    shortName: 'LA GUAJIRA',
  },
  {
    id: 'magdalena',
    name: 'Magdalena',
    path: 'M580,80 L650,70 L670,110 L650,140 L620,150 L590,140 L580,110 Z',
    centroid: { x: 620, y: 115 },
    labelX: 620,
    labelY: 115,
    shortName: 'MAGDALENA',
  },
  {
    id: 'atlantico',
    name: 'Atlantico',
    path: 'M540,100 L580,90 L590,120 L570,140 L550,135 L540,120 Z',
    centroid: { x: 565, y: 115 },
    labelX: 565,
    labelY: 115,
    shortName: 'ATLANTICO',
  },
  {
    id: 'cesar',
    name: 'Cesar',
    path: 'M620,160 L680,150 L700,180 L680,220 L650,230 L620,210 Z',
    centroid: { x: 660, y: 190 },
    labelX: 660,
    labelY: 190,
    shortName: 'CESAR',
  },
  {
    id: 'bolivar',
    name: 'Bolivar',
    path: 'M480,140 L580,130 L590,180 L570,220 L530,240 L490,220 L480,180 Z',
    centroid: { x: 535, y: 185 },
    labelX: 535,
    labelY: 185,
    shortName: 'BOLIVAR',
  },
  {
    id: 'sucre',
    name: 'Sucre',
    path: 'M430,220 L490,210 L500,250 L480,280 L450,275 L430,250 Z',
    centroid: { x: 465, y: 245 },
    labelX: 465,
    labelY: 245,
    shortName: 'SUCRE',
  },
  {
    id: 'cordoba',
    name: 'Cordoba',
    path: 'M380,260 L430,250 L440,290 L420,320 L390,315 L380,285 Z',
    centroid: { x: 410, y: 285 },
    labelX: 410,
    labelY: 285,
    shortName: 'CORDOBA',
  },
  {
    id: 'norte-de-santander',
    name: 'Norte de Santander',
    path: 'M590,200 L650,190 L670,230 L650,270 L620,275 L590,250 Z',
    centroid: { x: 630, y: 235 },
    labelX: 630,
    labelY: 235,
    shortName: 'N. SANTANDER',
  },
  {
    id: 'santander',
    name: 'Santander',
    path: 'M520,270 L590,260 L610,320 L580,360 L540,365 L520,325 Z',
    centroid: { x: 565, y: 315 },
    labelX: 565,
    labelY: 315,
    shortName: 'SANTANDER',
  },
  {
    id: 'boyaca',
    name: 'Boyaca',
    path: 'M480,360 L540,350 L560,400 L540,440 L500,445 L480,405 Z',
    centroid: { x: 520, y: 400 },
    labelX: 520,
    labelY: 400,
    shortName: 'BOYACA',
  },
  {
    id: 'antioquia',
    name: 'Antioquia',
    path: 'M350,320 L420,310 L450,370 L430,420 L380,435 L350,385 Z',
    centroid: { x: 400, y: 375 },
    labelX: 400,
    labelY: 375,
    shortName: 'ANTIOQUIA',
  },
  {
    id: 'caldas',
    name: 'Caldas',
    path: 'M380,440 L430,430 L450,470 L430,500 L400,495 L380,465 Z',
    centroid: { x: 415, y: 465 },
    labelX: 415,
    labelY: 465,
    shortName: 'CALDAS',
  },
  {
    id: 'risaralda',
    name: 'Risaralda',
    path: 'M330,470 L380,460 L390,490 L370,510 L350,505 L330,485 Z',
    centroid: { x: 360, y: 485 },
    labelX: 360,
    labelY: 485,
    shortName: 'RISARALDA',
  },
  {
    id: 'quindio',
    name: 'Quindio',
    path: 'M360,510 L390,500 L400,530 L380,550 L360,540 Z',
    centroid: { x: 380, y: 525 },
    labelX: 380,
    labelY: 525,
    shortName: 'QUINDIO',
  },
  {
    id: 'cundinamarca',
    name: 'Cundinamarca',
    path: 'M450,450 L520,440 L540,500 L520,540 L470,545 L450,485 Z',
    centroid: { x: 495, y: 495 },
    labelX: 495,
    labelY: 495,
    shortName: 'CUNDINAMARCA',
  },
  {
    id: 'bogota-d-c',
    name: 'Bogota D.C.',
    path: 'M485,515 L505,510 L510,530 L490,535 Z',
    centroid: { x: 497, y: 522 },
    labelX: 497,
    labelY: 522,
    shortName: 'BOGOTA',
  },
  {
    id: 'tolima',
    name: 'Tolima',
    path: 'M420,550 L480,540 L500,590 L480,630 L440,635 L420,595 Z',
    centroid: { x: 460, y: 590 },
    labelX: 460,
    labelY: 590,
    shortName: 'TOLIMA',
  },
  {
    id: 'huila',
    name: 'Huila',
    path: 'M400,640 L460,630 L480,680 L460,720 L420,725 L400,685 Z',
    centroid: { x: 440, y: 675 },
    labelX: 440,
    labelY: 675,
    shortName: 'HUILA',
  },
  {
    id: 'choco',
    name: 'Choco',
    path: 'M250,350 L330,340 L350,420 L330,480 L280,490 L250,430 Z',
    centroid: { x: 300, y: 415 },
    labelX: 300,
    labelY: 415,
    shortName: 'CHOCO',
  },
  {
    id: 'valle-del-cauca',
    name: 'Valle del Cauca',
    path: 'M290,520 L370,510 L390,570 L370,610 L320,615 L290,565 Z',
    centroid: { x: 340, y: 565 },
    labelX: 340,
    labelY: 565,
    shortName: 'VALLE',
  },
  {
    id: 'cauca',
    name: 'Cauca',
    path: 'M320,620 L390,610 L410,670 L390,710 L340,715 L320,665 Z',
    centroid: { x: 365, y: 665 },
    labelX: 365,
    labelY: 665,
    shortName: 'CAUCA',
  },
  {
    id: 'narino',
    name: 'Narino',
    path: 'M310,720 L390,710 L410,770 L390,810 L340,815 L310,765 Z',
    centroid: { x: 360, y: 765 },
    labelX: 360,
    labelY: 765,
    shortName: 'NARINO',
  },
  {
    id: 'arauca',
    name: 'Arauca',
    path: 'M610,340 L690,330 L710,380 L690,420 L650,425 L610,385 Z',
    centroid: { x: 660, y: 380 },
    labelX: 660,
    labelY: 380,
    shortName: 'ARAUCA',
  },
  {
    id: 'casanare',
    name: 'Casanare',
    path: 'M560,420 L640,410 L660,470 L640,510 L590,515 L560,465 Z',
    centroid: { x: 610, y: 465 },
    labelX: 610,
    labelY: 465,
    shortName: 'CASANARE',
  },
  {
    id: 'meta',
    name: 'Meta',
    path: 'M520,550 L590,540 L610,610 L590,670 L540,675 L520,625 Z',
    centroid: { x: 565, y: 615 },
    labelX: 565,
    labelY: 615,
    shortName: 'META',
  },
  {
    id: 'vichada',
    name: 'Vichada',
    path: 'M650,460 L730,450 L750,520 L730,580 L680,585 L650,525 Z',
    centroid: { x: 700, y: 520 },
    labelX: 700,
    labelY: 520,
    shortName: 'VICHADA',
  },
  {
    id: 'guaviare',
    name: 'Guaviare',
    path: 'M590,680 L660,670 L680,730 L660,770 L620,775 L590,725 Z',
    centroid: { x: 635, y: 725 },
    labelX: 635,
    labelY: 725,
    shortName: 'GUAVIARE',
  },
  {
    id: 'caqueta',
    name: 'Caqueta',
    path: 'M480,730 L550,720 L570,780 L550,820 L500,825 L480,775 Z',
    centroid: { x: 525, y: 775 },
    labelX: 525,
    labelY: 775,
    shortName: 'CAQUETA',
  },
  {
    id: 'putumayo',
    name: 'Putumayo',
    path: 'M410,820 L480,810 L500,870 L480,910 L430,915 L410,865 Z',
    centroid: { x: 455, y: 865 },
    labelX: 455,
    labelY: 865,
    shortName: 'PUTUMAYO',
  },
  {
    id: 'vaupes',
    name: 'Vaupes',
    path: 'M570,830 L650,820 L670,880 L650,920 L600,925 L570,875 Z',
    centroid: { x: 620, y: 875 },
    labelX: 620,
    labelY: 875,
    shortName: 'VAUPES',
  },
  {
    id: 'guainia',
    name: 'Guainia',
    path: 'M680,590 L760,580 L780,640 L760,680 L710,685 L680,635 Z',
    centroid: { x: 730, y: 635 },
    labelX: 730,
    labelY: 635,
    shortName: 'GUAINIA',
  },
  {
    id: 'amazonas',
    name: 'Amazonas',
    path: 'M430,920 L570,910 L590,990 L570,1050 L480,1055 L430,1005 Z',
    centroid: { x: 510, y: 985 },
    labelX: 510,
    labelY: 985,
    shortName: 'AMAZONAS',
  },
  {
    id: 'san-andres-y-providencia',
    name: 'San Andres y Providencia',
    path: 'M150,100 L190,95 L195,130 L155,135 Z',
    centroid: { x: 172, y: 115 },
    labelX: 172,
    labelY: 115,
    shortName: 'SAN ANDRES',
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
    return '#f1f5f9';
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
  onLayerChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onSelectDepartment,
}: ColombiaMapProps): JSX.Element {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);

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

  return (
    <Card className="border-slate-300 bg-slate-200/70" title="">
      <div className="relative min-h-[620px] overflow-hidden rounded-xl border border-slate-300 bg-[#d8e0ec] p-4">
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm"
            onClick={onZoomIn}
          >
            +
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm"
            onClick={onZoomOut}
          >
            -
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm"
            onClick={onResetZoom}
          >
            R
          </button>
        </div>

        <div className="absolute right-6 top-4 z-20 rounded-xl border border-slate-300 bg-white/95 p-1 shadow-md">
          <div className="flex items-center gap-1">
            {(['production', 'royalties', 'demand'] as MapLayer[]).map((layer) => (
              <button
                key={layer}
                type="button"
                onClick={() => onLayerChange(layer)}
                className={[
                  'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                  activeLayer === layer && layer === 'production' ? 'bg-blue-600 text-white' : '',
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
          <svg viewBox="0 0 900 1100" className="h-full w-full">
            <defs>
              <filter id="map-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="1" dy="2" result="offsetblur" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="ocean-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e9f1fb" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#c8d8ee" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            <rect width="900" height="1100" fill="url(#ocean-bg)" />

            <g transform={`translate(450 550) scale(${zoom}) translate(-450 -550)`}>
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
                      stroke={isSelected ? '#1f2937' : '#ffffff'}
                      strokeWidth={isSelected ? 2.4 : 1.2}
                      filter={isSelected ? 'url(#map-shadow)' : undefined}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => onSelectDepartment(shape.id)}
                      onMouseLeave={() => setTooltip(null)}
                      onMouseMove={(event) => {
                        const svgRect =
                          event.currentTarget.ownerSVGElement?.getBoundingClientRect();

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
                      <circle cx={shape.centroid.x} cy={shape.centroid.y} r="4" fill="#fbbf24" />
                    ) : null}

                    <text
                      x={shape.labelX}
                      y={shape.labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={shape.shortName.length > 10 ? 9 : 10}
                      fontWeight={700}
                      fill="rgba(15,23,42,0.85)"
                      className="pointer-events-none select-none"
                    >
                      {shape.shortName}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        <div className="absolute bottom-4 left-8 z-20">
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
                Haz clic en cualquier departamento para ver estadisticas detalladas de produccion,
                regalias y demanda regional. Usa los controles para acercar.
              </p>
            </div>
          )}
        </div>

        <div className="absolute bottom-4 right-4 z-20">
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
                        className="inline-flex h-4 w-4 rounded-sm"
                        style={{ backgroundColor: color }}
                      />
                      {layerPercentages[index]}
                    </div>
                  ))}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="inline-flex h-4 w-4 rounded-sm border border-slate-300 bg-[#f1f5f9]" />
                  Sin datos
                </div>
              </div>
              <div className="mt-4 border-t border-slate-200 pt-3 text-sm text-slate-600">
                {availableCount} de {mapData.departments.length} departamentos con datos
              </div>
            </div>
          )}
        </div>

        {tooltip ? (
          <div
            className="pointer-events-none absolute rounded-xl border border-slate-300 bg-slate-900/95 px-3 py-2 text-sm text-slate-100 shadow-lg"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <p className="font-semibold text-white">{tooltip.department.name}</p>
            <p>
              {layerStyle[activeLayer].label}:{' '}
              {formatValue(
                tooltip.department.values[activeLayer].value,
                tooltip.department.values[activeLayer].unit || layerStyle[activeLayer].unit,
              )}
            </p>
            {!tooltip.department.values[activeLayer].available ? (
              <p>Sin datos registrados</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
