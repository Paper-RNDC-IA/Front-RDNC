import { useEffect, useState } from 'react';

import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { VehicleRouteMap } from '../maps/VehicleRouteMap';
import { useCompanyRoutes } from '../../hooks/useCompanyRoutes';
import { getCo2Tendencia, getNodosParada } from '../../services/telemetry.service';
import type { Co2TendenciaRowApi, NodoParadaApi } from '../../types/telemetry';

type RouteMapPanelProps = {
  companyId: string;
  selectedFileId: string | null;
};

type Tab = 'mapa' | 'nodos' | 'co2' | 'alertas';

const TABS: { id: Tab; label: string }[] = [
  { id: 'mapa', label: 'Mapa & Ruta' },
  { id: 'nodos', label: 'Nodos & Viajes' },
  { id: 'co2', label: 'Costos & CO₂' },
  { id: 'alertas', label: 'Flags & Alertas' },
];

function EventBadge({ level }: { level: string }): JSX.Element {
  const className =
    level === 'high'
      ? 'border-red-300 bg-red-50 text-red-700'
      : level === 'medium'
        ? 'border-amber-300 bg-amber-50 text-amber-700'
        : level === 'low'
          ? 'border-sky-300 bg-sky-50 text-sky-700'
          : 'border-slate-300 bg-slate-50 text-slate-700';

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase ${className}`}
    >
      {level}
    </span>
  );
}

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }): JSX.Element {
  return (
    <div className="flex flex-wrap gap-1 border-b border-[#f0d8c7] pb-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={[
            'rounded-t-lg px-3 py-1.5 text-[13px] font-semibold transition-colors',
            active === tab.id
              ? 'border-b-2 border-[#d9540a] bg-[#fff5eb] text-[#9a3d0f]'
              : 'text-slate-500 hover:text-slate-800',
          ].join(' ')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function RouteMapPanel({ companyId, selectedFileId }: RouteMapPanelProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>('mapa');
  const [co2Data, setCo2Data] = useState<Co2TendenciaRowApi[]>([]);
  const [nodos, setNodos] = useState<NodoParadaApi[]>([]);
  const [loadingCo2, setLoadingCo2] = useState(false);
  const [loadingNodos, setLoadingNodos] = useState(false);

  const {
    files,
    vehicles,
    months,
    filters,
    mapData,
    mapStats,
    eventsPreview,
    error,
    loadingFiles,
    loadingVehicles,
    loadingMonths,
    loadingMap,
    hasReadyFilters,
    isMapEmpty,
    setFileId,
    setVehicleId,
    setMonth,
    refresh,
  } = useCompanyRoutes({
    companyId,
    initialFileId: selectedFileId,
    enabled: Boolean(companyId),
  });

  useEffect(() => {
    if (!filters.vehicleId) {
      setCo2Data([]);
      setNodos([]);
      return;
    }

    setLoadingCo2(true);
    void getCo2Tendencia({ vehicle_id: filters.vehicleId })
      .then(setCo2Data)
      .finally(() => setLoadingCo2(false));

    setLoadingNodos(true);
    void getNodosParada({ vehicle_id: filters.vehicleId, velocidad_max: 5, min_registros: 3 })
      .then(setNodos)
      .finally(() => setLoadingNodos(false));
  }, [filters.vehicleId]);

  if (!selectedFileId && !loadingFiles && !files.length) {
    return (
      <EmptyState
        title="Mapa de recorridos no disponible"
        message="Sube y procesa al menos un archivo con rutas GPS para habilitar esta seccion."
      />
    );
  }

  return (
    <section className="space-y-4">
      <Card
        title="Analisis de recorrido"
        actions={
          <button
            type="button"
            onClick={refresh}
            className="rounded-lg border border-[#efc5a7] bg-[#fff5eb] px-3 py-1 text-xs font-semibold text-[#9a3d0f] transition hover:bg-[#ffe9d6]"
          >
            Actualizar
          </button>
        }
      >
        <p className="text-sm text-slate-600">
          Selecciona archivo, vehiculo y mes para visualizar la trayectoria GPS, CO₂, nodos de
          parada y eventos operativos del recorrido.
        </p>
      </Card>

      {error ? (
        <ErrorState title="Error cargando recorridos" message={error} onRetry={refresh} />
      ) : null}

      <Card title="Filtros del recorrido">
        <div className="grid gap-3 lg:grid-cols-3">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Archivo
            </span>
            <select
              value={filters.fileId}
              onChange={(event) => setFileId(event.target.value)}
              disabled={loadingFiles || !files.length}
              className="w-full rounded-xl border border-[#e9cdb6] bg-[#fff9f4] px-3 py-2 text-sm text-slate-800 outline-none ring-orange-200 transition focus:ring"
            >
              <option value="">Seleccionar archivo</option>
              {files.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Vehiculo
            </span>
            <select
              value={filters.vehicleId}
              onChange={(event) => setVehicleId(event.target.value)}
              disabled={loadingVehicles || !filters.fileId}
              className="w-full rounded-xl border border-[#e9cdb6] bg-[#fff9f4] px-3 py-2 text-sm text-slate-800 outline-none ring-orange-200 transition focus:ring"
            >
              <option value="">Seleccionar vehiculo</option>
              {vehicles.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Mes
            </span>
            <select
              value={filters.month}
              onChange={(event) => setMonth(event.target.value)}
              disabled={loadingMonths || !filters.vehicleId}
              className="w-full rounded-xl border border-[#e9cdb6] bg-[#fff9f4] px-3 py-2 text-sm text-slate-800 outline-none ring-orange-200 transition focus:ring"
            >
              <option value="">Seleccionar mes</option>
              {months.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {!hasReadyFilters ? (
        <EmptyState
          title="Completa los filtros del recorrido"
          message="Selecciona un archivo, vehiculo y mes para cargar el analisis del recorrido."
        />
      ) : null}

      {hasReadyFilters ? (
        <Card title="">
          <TabBar active={activeTab} onChange={setActiveTab} />

          <div className="mt-4">
            {activeTab === 'mapa' ? (
              <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
                <div className="space-y-3">
                  <VehicleRouteMap data={mapData} loading={loadingMap} maxEventMarkers={24} />
                  <div className="rounded-xl border border-[#f0d8c7] bg-[#fff8f2] px-3 py-2 text-xs text-slate-700">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2">
                        <span className="route-marker route-marker-start route-marker-inline">
                          I
                        </span>{' '}
                        Inicio
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="route-marker route-marker-end route-marker-inline">F</span>{' '}
                        Fin
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="route-marker route-marker-event route-marker-inline">
                          !
                        </span>{' '}
                        Eventos
                      </span>
                    </div>
                  </div>
                </div>

                <Card title="KPIs del recorrido">
                  <div className="space-y-2">
                    {mapStats.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-[#f0d7c3] bg-[#fffbf8] px-3 py-2"
                      >
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-[#7c3310]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : null}

            {activeTab === 'nodos' ? (
              <div>
                <p className="mb-3 text-sm text-slate-600">
                  Puntos donde el vehiculo se detiene con frecuencia (velocidad &lt; 5 km/h, minimo
                  3 registros).
                </p>
                {loadingNodos ? (
                  <p className="text-sm text-slate-500">Cargando nodos de parada...</p>
                ) : nodos.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No se detectaron nodos de parada para este vehiculo.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#f0d8c7] text-left text-xs uppercase tracking-wide text-slate-500">
                          <th className="pb-2 pr-4">Latitud</th>
                          <th className="pb-2 pr-4">Longitud</th>
                          <th className="pb-2 pr-4">Registros</th>
                          <th className="pb-2 pr-4">Vel. prom.</th>
                          <th className="pb-2 pr-4">Primera vez</th>
                          <th className="pb-2">Ultima vez</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nodos.map((n, i) => (
                          <tr key={i} className="border-b border-[#fdf0e6] hover:bg-[#fff8f2]">
                            <td className="py-1.5 pr-4 text-slate-700">{n.lat.toFixed(4)}</td>
                            <td className="py-1.5 pr-4 text-slate-700">{n.lon.toFixed(4)}</td>
                            <td className="py-1.5 pr-4 font-semibold text-[#7c3310]">
                              {n.registros}
                            </td>
                            <td className="py-1.5 pr-4 text-slate-700">
                              {n.vel_promedio.toFixed(1)} km/h
                            </td>
                            <td className="py-1.5 pr-4 text-slate-500">{n.primera_vez}</td>
                            <td className="py-1.5 text-slate-500">{n.ultima_vez}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === 'co2' ? (
              <div>
                <p className="mb-3 text-sm text-slate-600">
                  Tendencia mensual de emisiones CO₂ y costo estimado de combustible para este
                  vehiculo.
                </p>
                {loadingCo2 ? (
                  <p className="text-sm text-slate-500">Cargando datos de CO₂...</p>
                ) : co2Data.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No hay datos de CO₂ disponibles para este vehiculo.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        {
                          label: 'CO₂ Total',
                          value: `${co2Data.reduce((s, r) => s + r.co2_kg, 0).toFixed(1)} kg`,
                        },
                        {
                          label: 'Costo total',
                          value: `$${co2Data.reduce((s, r) => s + r.costo_cop, 0).toLocaleString('es-CO')}`,
                        },
                        {
                          label: 'Distancia total',
                          value: `${co2Data.reduce((s, r) => s + r.distancia_km, 0).toFixed(1)} km`,
                        },
                        {
                          label: 'Galones totales',
                          value: `${co2Data.reduce((s, r) => s + r.galones, 0).toFixed(1)}`,
                        },
                      ].map((kpi) => (
                        <div
                          key={kpi.label}
                          className="rounded-xl border border-[#f0d7c3] bg-[#fffbf8] px-3 py-2"
                        >
                          <p className="text-[11px] uppercase tracking-wide text-slate-500">
                            {kpi.label}
                          </p>
                          <p className="text-sm font-semibold text-[#7c3310]">{kpi.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#f0d8c7] text-left text-xs uppercase tracking-wide text-slate-500">
                            <th className="pb-2 pr-4">Mes</th>
                            <th className="pb-2 pr-4">CO₂ (kg)</th>
                            <th className="pb-2 pr-4">CO₂ acum.</th>
                            <th className="pb-2 pr-4">Galones</th>
                            <th className="pb-2 pr-4">Costo COP</th>
                            <th className="pb-2">Distancia km</th>
                          </tr>
                        </thead>
                        <tbody>
                          {co2Data.map((row) => (
                            <tr
                              key={row.mes}
                              className="border-b border-[#fdf0e6] hover:bg-[#fff8f2]"
                            >
                              <td className="py-1.5 pr-4 font-medium text-slate-700">{row.mes}</td>
                              <td className="py-1.5 pr-4 text-slate-700">
                                {row.co2_kg.toFixed(1)}
                              </td>
                              <td className="py-1.5 pr-4 text-slate-500">
                                {row.co2_kg_acumulado.toFixed(1)}
                              </td>
                              <td className="py-1.5 pr-4 text-slate-700">
                                {row.galones.toFixed(1)}
                              </td>
                              <td className="py-1.5 pr-4 font-semibold text-[#7c3310]">
                                ${row.costo_cop.toLocaleString('es-CO')}
                              </td>
                              <td className="py-1.5 text-slate-700">
                                {row.distancia_km.toFixed(1)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === 'alertas' ? (
              <div>
                <p className="mb-3 text-sm text-slate-600">
                  Eventos operativos detectados en el recorrido seleccionado.
                </p>
                {loadingMap ? (
                  <p className="text-sm text-slate-500">Cargando eventos...</p>
                ) : eventsPreview.length ? (
                  <ul className="space-y-2">
                    {eventsPreview.map((event) => (
                      <li
                        key={event.id}
                        className="rounded-xl border border-[#eed8c7] bg-[#fff9f4] px-3 py-2"
                      >
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800">{event.label}</p>
                          <EventBadge level={event.severity} />
                        </div>
                        <p className="text-xs text-slate-600">{event.description}</p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {event.timestamp || 'Sin timestamp'}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">
                    No se detectaron eventos para los filtros seleccionados.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </Card>
      ) : null}

      {isMapEmpty && activeTab === 'mapa' ? (
        <EmptyState
          title="Sin puntos de recorrido"
          message="El archivo tiene seleccion valida pero no contiene suficientes puntos GPS para dibujar la ruta."
        />
      ) : null}
    </section>
  );
}
