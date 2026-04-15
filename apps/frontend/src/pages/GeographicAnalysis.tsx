import { useCallback, useEffect, useMemo, useState } from 'react';

import { adaptGeographyKpis } from '../adapters/geography.adapter';
import { Card } from '../components/common/Card';
import { DateRangeFilter } from '../components/common/DateRangeFilter';
import { BarChartWidget } from '../components/charts/BarChartWidget';
import { PieChartWidget } from '../components/charts/PieChartWidget';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { DataSourceBadge } from '../components/common/DataSourceBadge';
import { PageIntro } from '../components/common/PageIntro';
import { MetricInfoTooltip } from '../components/common/MetricInfoTooltip';
import { ColombiaMap } from '../components/maps/ColombiaMap';
import { DetailedReportModal } from '../components/maps/DetailedReportModal';
import type { MapData, MapLayer, MapLayerApiItem } from '../components/maps/types';
import { toDepartmentId } from '../components/maps/types';
import { fetchDemandMap, fetchProductionMap, fetchRoyaltiesMap } from '../services/geography/api';
import { getRouteKpis } from '../services/routes.service';
import type { DateRange } from '../types/common';
import { getDefaultDateRange } from '../utils/date';
import { formatNumber } from '../utils/formatters';

const layerLabels: Record<MapLayer, string> = {
  production: 'Produccion',
  demand: 'Demanda',
  royalties: 'Regalias',
};

const allMapDepartments = [
  'La Guajira',
  'Magdalena',
  'Atlantico',
  'Cesar',
  'Bolivar',
  'Sucre',
  'Cordoba',
  'Norte de Santander',
  'Santander',
  'Boyaca',
  'Antioquia',
  'Caldas',
  'Risaralda',
  'Quindio',
  'Cundinamarca',
  'Bogota D.C.',
  'Tolima',
  'Huila',
  'Choco',
  'Valle del Cauca',
  'Cauca',
  'Narino',
  'Arauca',
  'Casanare',
  'Meta',
  'Vichada',
  'Guaviare',
  'Caqueta',
  'Putumayo',
  'Vaupes',
  'Guainia',
  'Amazonas',
  'San Andres y Providencia',
];

type GeographicState = {
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  activeLayer: MapLayer;
  zoom: number;
  selectedDepartmentId: string | null;
  mapData: MapData | null;
};

type MetricExplanationTopic = 'production' | 'royalties' | 'demand';

const metricExplanationContent: Record<
  MetricExplanationTopic,
  {
    title: string;
    meaning: string;
    interpretation: string;
    supportingMetric?: string;
  }
> = {
  production: {
    title: 'Produccion (ton/dia)',
    meaning:
      'Muestra el volumen promedio diario de carga asociado al departamento en toneladas por dia (ton/dia).',
    interpretation:
      'Valores altos indican territorios con mayor actividad logistica de salida o procesamiento de carga.',
    supportingMetric:
      'El indicador secundario "Manifiestos" representa la cantidad de manifiestos asociados al mismo departamento.',
  },
  royalties: {
    title: 'Aporte economico estimado (MM COP)',
    meaning:
      'Representa una estimacion economica de regalias asociadas al movimiento de carga del departamento, expresada en millones de pesos colombianos (MM COP).',
    interpretation:
      'No es un pago directo por viaje; es una aproximacion territorial para comparar impacto economico relativo entre departamentos.',
    supportingMetric:
      '"Toneladas asociadas" indica el volumen de carga usado como referencia para la estimacion del aporte economico.',
  },
  demand: {
    title: 'Demanda regional (viajes/dia)',
    meaning:
      'Indica la demanda estimada de movilizacion de carga por departamento en viajes por dia (viajes/dia).',
    interpretation:
      'Valores altos sugieren mayor presion operativa y necesidad de capacidad de transporte en ese territorio.',
  },
};

function getLayerItemByDepartment(items: MapLayerApiItem[]): Map<string, MapLayerApiItem> {
  return items.reduce<Map<string, MapLayerApiItem>>((acc, item) => {
    const departmentName = item.departamento ?? item.department;

    if (!departmentName) {
      return acc;
    }

    acc.set(toDepartmentId(departmentName), item);
    return acc;
  }, new Map<string, MapLayerApiItem>());
}

function readDepartmentName(item: MapLayerApiItem): string | null {
  return item.departamento ?? item.department ?? null;
}

function readLayerValue(item: MapLayerApiItem | undefined): number | null {
  if (!item) {
    return null;
  }

  if (typeof item.valor === 'number') {
    return item.valor;
  }

  if (typeof item.value === 'number') {
    return item.value;
  }

  return null;
}

function buildMapData(
  production: MapLayerApiItem[],
  demand: MapLayerApiItem[],
  royalties: MapLayerApiItem[],
): MapData {
  const defaultDepartments = [...allMapDepartments];

  const departmentNameById = [
    ...defaultDepartments,
    ...production.map(readDepartmentName).filter((item): item is string => Boolean(item)),
    ...demand.map(readDepartmentName).filter((item): item is string => Boolean(item)),
    ...royalties.map(readDepartmentName).filter((item): item is string => Boolean(item)),
  ].reduce<Map<string, string>>((acc, departmentName: string) => {
    const id = toDepartmentId(departmentName);

    if (!acc.has(id)) {
      acc.set(id, departmentName);
    }

    return acc;
  }, new Map<string, string>());

  const productionIndex = getLayerItemByDepartment(production);
  const demandIndex = getLayerItemByDepartment(demand);
  const royaltiesIndex = getLayerItemByDepartment(royalties);

  const departments = Array.from(departmentNameById.entries()).map(([id, departmentName]) => {
    const productionItem = productionIndex.get(id);
    const demandItem = demandIndex.get(id);
    const royaltiesItem = royaltiesIndex.get(id);
    const productionValue = readLayerValue(productionItem);
    const demandValue = readLayerValue(demandItem);
    const royaltiesValue = readLayerValue(royaltiesItem);

    return {
      id,
      name: departmentName,
      values: {
        production: {
          value: productionValue,
          unit: productionItem?.unit ?? 'ton/dia',
          available: productionValue !== null,
          secondaryLabel: 'Manifiestos',
          secondaryValue: productionItem?.manifiestos ?? null,
        },
        demand: {
          value: demandValue,
          unit: demandItem?.unit ?? 'viajes/dia',
          available: demandValue !== null,
          secondaryLabel: 'Demanda regional',
          secondaryValue: demandValue,
        },
        royalties: {
          value: royaltiesValue,
          unit: royaltiesItem?.unit ?? 'MM COP',
          available: royaltiesValue !== null,
          secondaryLabel: 'Toneladas asociadas',
          secondaryValue: royaltiesItem?.toneladas ?? null,
        },
      },
    };
  });

  return {
    departments,
    source: 'FastAPI /api/routes/*',
    updatedAt: new Date().toISOString(),
  };
}

export function GeographicAnalysis(): JSX.Element {
  const [summaryKpis, setSummaryKpis] = useState<ReturnType<typeof adaptGeographyKpis>>([]);
  const [state, setState] = useState<GeographicState>({
    loading: true,
    error: null,
    dateRange: getDefaultDateRange(),
    activeLayer: 'production',
    zoom: 1,
    selectedDepartmentId: null,
    mapData: null,
  });
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [explanationTopic, setExplanationTopic] = useState<MetricExplanationTopic | null>(null);

  const toggleExplanation = useCallback((topic: MetricExplanationTopic) => {
    setExplanationTopic((previous) => (previous === topic ? null : topic));
  }, []);

  const load = useCallback(async (dateRange: DateRange) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [kpiRes, productionRes, demandRes, royaltiesRes] = await Promise.all([
        getRouteKpis(dateRange),
        fetchProductionMap(dateRange),
        fetchDemandMap(dateRange),
        fetchRoyaltiesMap(dateRange),
      ]);

      const mapData = buildMapData(productionRes, demandRes, royaltiesRes);

      setSummaryKpis(adaptGeographyKpis(kpiRes));
      setState((prev) => ({
        ...prev,
        loading: false,
        mapData,
        selectedDepartmentId:
          prev.selectedDepartmentId &&
          mapData.departments.some((item) => item.id === prev.selectedDepartmentId)
            ? prev.selectedDepartmentId
            : null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error inesperado en geografia',
      }));
    }
  }, []);

  useEffect(() => {
    void load(state.dateRange);
  }, [load, state.dateRange]);

  const selectedDepartment = useMemo(() => {
    if (!state.mapData || !state.selectedDepartmentId) {
      return null;
    }

    return state.mapData.departments.find((item) => item.id === state.selectedDepartmentId) ?? null;
  }, [state.mapData, state.selectedDepartmentId]);

  const topDepartments = useMemo(() => {
    if (!state.mapData) {
      return [];
    }

    return [...state.mapData.departments]
      .map((department) => ({
        name: department.name,
        value: department.values[state.activeLayer].value ?? 0,
        unit: department.values[state.activeLayer].unit,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [state.activeLayer, state.mapData]);

  const activeLayerValue = selectedDepartment?.values[state.activeLayer];
  const visibleKpis = summaryKpis.slice(0, 3);

  const topDepartmentsChart = topDepartments.map((item) => ({
    label: item.name,
    value: item.value,
  }));

  const layerDistribution = [
    {
      label: 'Produccion',
      value: (state.mapData?.departments ?? []).reduce(
        (acc, department) => acc + (department.values.production.value ?? 0),
        0,
      ),
    },
    {
      label: 'Demanda',
      value: (state.mapData?.departments ?? []).reduce(
        (acc, department) => acc + (department.values.demand.value ?? 0),
        0,
      ),
    },
    {
      label: 'Regalias',
      value: (state.mapData?.departments ?? []).reduce(
        (acc, department) => acc + (department.values.royalties.value ?? 0),
        0,
      ),
    },
  ].filter((item) => item.value > 0);

  if (state.loading) {
    return <LoadingState title="Cargando analisis geografico" />;
  }

  if (state.error) {
    return (
      <ErrorState
        title="No fue posible cargar el mapa"
        message={state.error}
        onRetry={() => void load(state.dateRange)}
      />
    );
  }

  if (!state.mapData || !state.mapData.departments.length) {
    return (
      <EmptyState
        title="Sin datos geograficos"
        message="No hay datos disponibles para renderizar el mapa."
        source="RNDC publico y agregaciones territoriales internas"
      />
    );
  }

  return (
    <section className="space-y-6">
      <DataSourceBadge
        module="Inteligencia territorial"
        sourceLabel="RNDC publico + calculo territorial"
        sourceDetail="Cruce de endpoints /api/routes/* para produccion, demanda y regalias"
        visibility="hybrid"
      />

      <PageIntro
        title="Inteligencia Territorial y Mapas"
        subtitle="Visualizacion geografica para entender como se distribuye la actividad de carga por departamento en Colombia."
        periodLabel={`${state.dateRange.from} a ${state.dateRange.to}`}
        highlights={[
          'Que muestra: distribucion geografica por capa',
          'Para que sirve: detectar territorios relevantes',
          'Fuente: RNDC y agregacion territorial',
          'Analisis: produccion, demanda y regalias',
        ]}
        moduleGuide={{
          summary:
            'Este modulo convierte datos territoriales en un mapa interactivo para analizar diferencias regionales.',
          purpose:
            'Permite identificar departamentos lideres, rezagados y cambios segun la capa seleccionada.',
          userType: 'Evaluadores, analistas territoriales y planificadores.',
          source: 'RNDC publico + endpoints de rutas y calculos internos de agregacion.',
          analysisType: 'Analisis geografico comparativo por capa, ranking y distribucion.',
          scope: 'Cobertura nacional por departamento, segun disponibilidad de fuente.',
          interpretation:
            'Cambie entre capas para comparar territorios y use el panel derecho para profundizar en el departamento seleccionado.',
          limitations:
            'Valores nulos o N/A indican ausencia de dato reportado para la capa activa.',
          useCases: [
            'Identificar hubs territoriales de actividad.',
            'Comparar dinamicas entre produccion y demanda.',
            'Soportar lectura regional en sustentaciones.',
          ],
        }}
      />

      {selectedDepartment ? (
        <DateRangeFilter
          value={state.dateRange}
          onChange={(dateRange) => setState((prev) => ({ ...prev, dateRange }))}
        />
      ) : (
        <Card className="border-zinc-200 bg-white/90">
          <p className="text-sm text-slate-700">
            Selecciona un departamento en el mapa para habilitar el filtro de fechas por rango.
          </p>
        </Card>
      )}

      <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3">
        <h2 className="text-2xl font-semibold text-slate-100">Distribucion Geografica Nacional</h2>
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300">
          ACTUALIZADO:{' '}
          {new Date(state.mapData.updatedAt).toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <MetricInfoTooltip
            label="Como leer el mapa"
            meaning="Cada capa usa una metrica diferente; seleccione departamento para ver detalle y metadatos de origen."
            interpretation="Compare top departamentos por capa para detectar desequilibrios territoriales."
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <ColombiaMap
          mapData={state.mapData}
          activeLayer={state.activeLayer}
          selectedDepartmentId={state.selectedDepartmentId}
          zoom={state.zoom}
          onLayerChange={(layer) => setState((prev) => ({ ...prev, activeLayer: layer }))}
          onZoomIn={() => setState((prev) => ({ ...prev, zoom: Math.min(1.8, prev.zoom + 0.1) }))}
          onZoomOut={() => setState((prev) => ({ ...prev, zoom: Math.max(0.8, prev.zoom - 0.1) }))}
          onResetZoom={() => setState((prev) => ({ ...prev, zoom: 1 }))}
          onSelectDepartment={(departmentId) =>
            setState((prev) => ({ ...prev, selectedDepartmentId: departmentId }))
          }
        />

        <Card title="Departamento" className="border-slate-700 bg-slate-950/85">
          {!selectedDepartment ? (
            <p className="text-sm text-slate-400">Selecciona un departamento para ver detalles.</p>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                <p className="text-4xl font-bold text-slate-100">{selectedDepartment.name}</p>
              </div>

              <div
                className={`cursor-pointer rounded-xl border px-4 py-4 transition ${
                  explanationTopic === 'production'
                    ? 'border-orange-300 bg-[#fff6ed]'
                    : 'border-orange-300 bg-white'
                }`}
                onClick={() => toggleExplanation('production')}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleExplanation('production');
                  }
                }}
              >
                <p className="text-sm font-semibold text-orange-600">Produccion</p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {selectedDepartment.values.production.available
                    ? formatNumber(selectedDepartment.values.production.value ?? 0)
                    : 'N/A'}
                </p>
                <p className="text-right text-sm text-slate-900">
                  {selectedDepartment.values.production.unit}
                </p>
                <p className="mt-2 text-sm text-orange-500">
                  {selectedDepartment.values.production.secondaryLabel}:{' '}
                  {selectedDepartment.values.production.secondaryValue !== null &&
                  selectedDepartment.values.production.secondaryValue !== undefined
                    ? formatNumber(selectedDepartment.values.production.secondaryValue)
                    : 'N/A'}
                </p>
                <p className="mt-2 text-xs text-slate-700">Haz clic para ver explicacion</p>
                {explanationTopic === 'production' ? (
                  <div className="mt-3 rounded-lg border border-orange-200 bg-[#fff6ed] px-3 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {metricExplanationContent.production.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-800">
                      {metricExplanationContent.production.meaning}
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      {metricExplanationContent.production.interpretation}
                    </p>
                    {metricExplanationContent.production.supportingMetric ? (
                      <p className="mt-2 text-xs text-slate-600">
                        {metricExplanationContent.production.supportingMetric}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div
                className={`cursor-pointer rounded-xl border px-4 py-4 transition ${
                  explanationTopic === 'royalties'
                    ? 'border-orange-300 bg-[#fff6ed]'
                    : 'border-orange-300 bg-white'
                }`}
                onClick={() => toggleExplanation('royalties')}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleExplanation('royalties');
                  }
                }}
              >
                <p className="text-sm font-semibold text-orange-600">Aporte economico estimado</p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {selectedDepartment.values.royalties.available
                    ? formatNumber(selectedDepartment.values.royalties.value ?? 0)
                    : 'N/A'}
                </p>
                <p className="text-right text-sm text-slate-900">
                  {selectedDepartment.values.royalties.unit}
                </p>
                <p className="mt-2 text-sm text-orange-500">
                  {selectedDepartment.values.royalties.secondaryLabel}:{' '}
                  {selectedDepartment.values.royalties.secondaryValue !== null &&
                  selectedDepartment.values.royalties.secondaryValue !== undefined
                    ? formatNumber(selectedDepartment.values.royalties.secondaryValue)
                    : 'N/A'}
                </p>
                <p className="mt-2 text-xs text-slate-700">Haz clic para ver explicacion</p>
                {explanationTopic === 'royalties' ? (
                  <div className="mt-3 rounded-lg border border-orange-200 bg-[#fff6ed] px-3 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {metricExplanationContent.royalties.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-800">
                      {metricExplanationContent.royalties.meaning}
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      {metricExplanationContent.royalties.interpretation}
                    </p>
                    {metricExplanationContent.royalties.supportingMetric ? (
                      <p className="mt-2 text-xs text-slate-600">
                        {metricExplanationContent.royalties.supportingMetric}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div
                className={`cursor-pointer rounded-xl border px-4 py-4 transition ${
                  explanationTopic === 'demand'
                    ? 'border-orange-300 bg-[#fff6ed]'
                    : 'border-orange-300 bg-white'
                }`}
                onClick={() => toggleExplanation('demand')}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleExplanation('demand');
                  }
                }}
              >
                <p className="text-sm font-semibold text-orange-600">Demanda regional</p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {selectedDepartment.values.demand.available
                    ? formatNumber(selectedDepartment.values.demand.value ?? 0)
                    : 'N/A'}
                </p>
                <p className="text-right text-sm text-slate-900">
                  {selectedDepartment.values.demand.unit}
                </p>
                <p className="mt-2 text-xs text-slate-700">Haz clic para ver explicacion</p>
                {explanationTopic === 'demand' ? (
                  <div className="mt-3 rounded-lg border border-orange-200 bg-[#fff6ed] px-3 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {metricExplanationContent.demand.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-800">
                      {metricExplanationContent.demand.meaning}
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      {metricExplanationContent.demand.interpretation}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
                Capa activa:{' '}
                <span className="font-semibold text-slate-100">
                  {layerLabels[state.activeLayer]}
                </span>
                <div>
                  Valor activo:{' '}
                  {activeLayerValue?.available
                    ? `${formatNumber(activeLayerValue.value ?? 0)} ${activeLayerValue.unit}`
                    : 'Sin dato'}
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3">
                <p className="text-sm font-semibold text-slate-100">Top departamentos</p>
                <p className="mt-1 text-xs text-slate-400">
                  Mayor actividad segun la capa activa ({layerLabels[state.activeLayer]}).
                </p>
                <ul className="mt-3 space-y-2">
                  {topDepartments.map((item, index) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2"
                    >
                      <span className="text-xs text-slate-200">
                        {index + 1}. {item.name}
                      </span>
                      <span className="text-xs font-semibold text-orange-200">
                        {formatNumber(item.value)} {item.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-2 md:grid-cols-3">
                {visibleKpis.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                  >
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-100">{item.value}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="w-full rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-500"
                onClick={() => setIsReportOpen(true)}
              >
                Ver informe detallado
              </button>
            </div>
          )}
        </Card>
      </div>

      <DetailedReportModal
        open={isReportOpen}
        department={selectedDepartment}
        onClose={() => setIsReportOpen(false)}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <BarChartWidget
          title="Top departamentos"
          subtitle="Ranking territorial por la capa actualmente seleccionada"
          data={topDepartmentsChart}
          dataKey="value"
          xKey="label"
          horizontal
          sortDescending
          valueLabel={layerLabels[state.activeLayer]}
          sourceLabel="RNDC publico + agregacion territorial"
          help={{
            description: 'Compara departamentos segun la capa activa seleccionada en el mapa.',
            xAxis: `Valor de ${layerLabels[state.activeLayer].toLowerCase()}.`,
            yAxis: 'Departamento.',
            interpretation:
              'Los primeros departamentos concentran mayor peso territorial para la capa elegida.',
          }}
        />
        <PieChartWidget
          title="Distribucion nacional por capa"
          subtitle="Participacion relativa de produccion, demanda y regalias"
          data={layerDistribution}
          dataKey="value"
          nameKey="label"
          sourceLabel="Calculo interno del sistema"
          help={{
            description: 'Resume la participacion nacional de produccion, demanda y regalias.',
            xAxis: 'Capa territorial.',
            yAxis: 'Participacion y volumen agregado.',
            interpretation:
              'Capas con mayor participacion explican la dominante del comportamiento territorial observado.',
          }}
        />
      </div>
    </section>
  );
}
