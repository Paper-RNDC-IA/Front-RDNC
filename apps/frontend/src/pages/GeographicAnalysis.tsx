import { useCallback, useEffect, useMemo, useState } from 'react';

import { adaptGeographyKpis } from '../adapters/geography.adapter';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { ColombiaMap } from '../components/maps/ColombiaMap';
import { DetailedReportModal } from '../components/maps/DetailedReportModal';
import type { MapData, MapLayer, MapLayerApiItem } from '../components/maps/types';
import { toDepartmentId } from '../components/maps/types';
import { mockGeographyDepartments } from '../constants/mocks';
import { fetchDemandMap, fetchProductionMap, fetchRoyaltiesMap } from '../services/geography/api';
import { getRouteKpis } from '../services/routes.service';
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
  activeLayer: MapLayer;
  zoom: number;
  selectedDepartmentId: string | null;
  mapData: MapData | null;
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
  const defaultDepartments = [
    ...allMapDepartments,
    ...mockGeographyDepartments.map((item) => item.department),
  ];

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
    activeLayer: 'production',
    zoom: 1,
    selectedDepartmentId: null,
    mapData: null,
  });
  const [isReportOpen, setIsReportOpen] = useState(false);

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [kpiRes, productionRes, demandRes, royaltiesRes] = await Promise.all([
        getRouteKpis(),
        fetchProductionMap(),
        fetchDemandMap(),
        fetchRoyaltiesMap(),
      ]);

      const mapData = buildMapData(productionRes, demandRes, royaltiesRes);

      setSummaryKpis(adaptGeographyKpis(kpiRes));
      setState((prev) => ({
        ...prev,
        loading: false,
        mapData,
        selectedDepartmentId:
          prev.selectedDepartmentId && mapData.departments.some((item) => item.id === prev.selectedDepartmentId)
            ? prev.selectedDepartmentId
            : mapData.departments[0]?.id ?? null,
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
    void load();
  }, [load]);

  const selectedDepartment = useMemo(() => {
    if (!state.mapData || !state.selectedDepartmentId) {
      return null;
    }

    return state.mapData.departments.find((item) => item.id === state.selectedDepartmentId) ?? null;
  }, [state.mapData, state.selectedDepartmentId]);

  const activeLayerValue = selectedDepartment?.values[state.activeLayer];
  const visibleKpis = summaryKpis.slice(0, 3);

  if (state.loading) {
    return <LoadingState title="Cargando analisis geografico" />;
  }

  if (state.error) {
    return <ErrorState title="No fue posible cargar el mapa" message={state.error} onRetry={load} />;
  }

  if (!state.mapData || !state.mapData.departments.length) {
    return <EmptyState title="Sin datos geograficos" message="No hay datos disponibles para renderizar el mapa." />;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3">
        <h2 className="text-2xl font-semibold text-slate-100">Distribucion Geografica Nacional</h2>
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300">
          ACTUALIZADO: {new Date(state.mapData.updatedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
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
          onSelectDepartment={(departmentId) => setState((prev) => ({ ...prev, selectedDepartmentId: departmentId }))}
        />

        <Card title="Departamento" className="border-slate-700 bg-slate-950/85">
          {!selectedDepartment ? (
            <p className="text-sm text-slate-400">Selecciona un departamento para ver detalles.</p>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                <p className="text-4xl font-bold text-slate-100">{selectedDepartment.name}</p>
              </div>

              <div className="rounded-xl border border-blue-900/70 bg-gradient-to-br from-blue-950/60 to-slate-900 px-4 py-4">
                <p className="text-sm font-semibold text-blue-300">Produccion</p>
                <p className="mt-2 text-4xl font-bold text-slate-100">
                  {selectedDepartment.values.production.available
                    ? formatNumber(selectedDepartment.values.production.value ?? 0)
                    : 'N/A'}
                </p>
                <p className="text-right text-sm text-slate-200">{selectedDepartment.values.production.unit}</p>
                <p className="mt-2 text-sm text-blue-300/90">
                  {selectedDepartment.values.production.secondaryLabel}: {' '}
                  {selectedDepartment.values.production.secondaryValue !== null &&
                  selectedDepartment.values.production.secondaryValue !== undefined
                    ? formatNumber(selectedDepartment.values.production.secondaryValue)
                    : 'N/A'}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-900/70 bg-gradient-to-br from-emerald-950/50 to-slate-900 px-4 py-4">
                <p className="text-sm font-semibold text-emerald-300">Regalias generadas</p>
                <p className="mt-2 text-4xl font-bold text-slate-100">
                  {selectedDepartment.values.royalties.available
                    ? formatNumber(selectedDepartment.values.royalties.value ?? 0)
                    : 'N/A'}
                </p>
                <p className="text-right text-sm text-slate-200">{selectedDepartment.values.royalties.unit}</p>
                <p className="mt-2 text-sm text-emerald-300/90">
                  {selectedDepartment.values.royalties.secondaryLabel}: {' '}
                  {selectedDepartment.values.royalties.secondaryValue !== null &&
                  selectedDepartment.values.royalties.secondaryValue !== undefined
                    ? formatNumber(selectedDepartment.values.royalties.secondaryValue)
                    : 'N/A'}
                </p>
              </div>

              <div className="rounded-xl border border-orange-900/70 bg-gradient-to-br from-orange-950/50 to-slate-900 px-4 py-4">
                <p className="text-sm font-semibold text-orange-300">Demanda regional</p>
                <p className="mt-2 text-4xl font-bold text-slate-100">
                  {selectedDepartment.values.demand.available
                    ? formatNumber(selectedDepartment.values.demand.value ?? 0)
                    : 'N/A'}
                </p>
                <p className="text-right text-sm text-slate-200">{selectedDepartment.values.demand.unit}</p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
                Capa activa: <span className="font-semibold text-slate-100">{layerLabels[state.activeLayer]}</span>
                <div>
                  Valor activo:{' '}
                  {activeLayerValue?.available
                    ? `${formatNumber(activeLayerValue.value ?? 0)} ${activeLayerValue.unit}`
                    : 'Sin dato'}
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-3">
                {visibleKpis.map((item) => (
                  <div key={item.label} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
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
    </section>
  );
}
