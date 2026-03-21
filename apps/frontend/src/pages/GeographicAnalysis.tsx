import { useCallback, useEffect, useMemo, useState } from 'react';

import { adaptGeographyKpis } from '../adapters/geography.adapter';
import { KpiCard } from '../components/common/KpiCard';
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
    acc.set(toDepartmentId(item.department), item);
    return acc;
  }, new Map<string, MapLayerApiItem>());
}

function buildMapData(
  production: MapLayerApiItem[],
  demand: MapLayerApiItem[],
  royalties: MapLayerApiItem[],
): MapData {
  const defaultDepartments = mockGeographyDepartments.map((item) => item.department);

  const departmentNameById = [
    ...defaultDepartments,
    ...production.map((item) => item.department),
    ...demand.map((item) => item.department),
    ...royalties.map((item) => item.department),
  ].reduce<Map<string, string>>((acc, departmentName) => {
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

    return {
      id,
      name: departmentName,
      values: {
        production: {
          value: productionItem?.value ?? null,
          unit: productionItem?.unit ?? 'ton/dia',
          available: productionItem?.value !== null && productionItem?.value !== undefined,
        },
        demand: {
          value: demandItem?.value ?? null,
          unit: demandItem?.unit ?? 'viajes/dia',
          available: demandItem?.value !== null && demandItem?.value !== undefined,
        },
        royalties: {
          value: royaltiesItem?.value ?? null,
          unit: royaltiesItem?.unit ?? 'MM COP',
          available: royaltiesItem?.value !== null && royaltiesItem?.value !== undefined,
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
  const [kpis, setKpis] = useState<ReturnType<typeof adaptGeographyKpis>>([]);
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

      setKpis(adaptGeographyKpis(kpiRes));
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
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </div>

      <Card title="Configuracion de capa geoespacial">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(layerLabels) as MapLayer[]).map((layer) => (
              <button
                key={layer}
                type="button"
                onClick={() => setState((prev) => ({ ...prev, activeLayer: layer }))}
                className={[
                  'rounded-md px-3 py-2 text-sm transition-colors',
                  state.activeLayer === layer
                    ? 'bg-orange-600 text-white'
                    : 'border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800',
                ].join(' ')}
              >
                {layerLabels[layer]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md border border-slate-700 px-3 py-1 text-slate-200"
              onClick={() => setState((prev) => ({ ...prev, zoom: Math.max(0.8, prev.zoom - 0.1) }))}
            >
              -
            </button>
            <span className="text-sm text-slate-300">Zoom: {state.zoom.toFixed(1)}x</span>
            <button
              type="button"
              className="rounded-md border border-slate-700 px-3 py-1 text-slate-200"
              onClick={() => setState((prev) => ({ ...prev, zoom: Math.min(1.8, prev.zoom + 0.1) }))}
            >
              +
            </button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <ColombiaMap
          mapData={state.mapData}
          activeLayer={state.activeLayer}
          selectedDepartmentId={state.selectedDepartmentId}
          zoom={state.zoom}
          onSelectDepartment={(departmentId) => setState((prev) => ({ ...prev, selectedDepartmentId: departmentId }))}
        />

        <Card title="Panel de detalle territorial">
          {!selectedDepartment ? (
            <p className="text-sm text-slate-400">Selecciona un departamento para ver detalles.</p>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-950/70 px-3 py-2">
                <p className="text-xs text-slate-400">Departamento</p>
                <p className="text-sm font-semibold text-slate-100">{selectedDepartment.name}</p>
              </div>

              <div className="rounded-lg bg-slate-950/70 px-3 py-2">
                <p className="text-xs text-slate-400">Capa activa</p>
                <p className="text-sm text-orange-300">{layerLabels[state.activeLayer]}</p>
              </div>

              <div className="rounded-lg bg-slate-950/70 px-3 py-2">
                <p className="text-xs text-slate-400">Valor capa activa</p>
                <p className="text-sm text-slate-100">
                  {activeLayerValue?.available
                    ? `${formatNumber(activeLayerValue.value ?? 0)} ${activeLayerValue.unit}`
                    : 'Sin dato para la capa activa'}
                </p>
              </div>

              <div className="rounded-lg bg-slate-950/70 px-3 py-2">
                <p className="text-xs text-slate-400">Disponibilidad de datos</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-200">
                  <li>Produccion: {selectedDepartment.values.production.available ? 'Si' : 'No'}</li>
                  <li>Demanda: {selectedDepartment.values.demand.available ? 'Si' : 'No'}</li>
                  <li>Regalias: {selectedDepartment.values.royalties.available ? 'Si' : 'No'}</li>
                </ul>
              </div>

              <button
                type="button"
                className="w-full rounded-md bg-orange-700 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600"
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
