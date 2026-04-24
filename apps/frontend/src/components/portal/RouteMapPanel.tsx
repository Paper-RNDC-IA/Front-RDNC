import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { VehicleRouteMap } from '../maps/VehicleRouteMap';
import { useCompanyRoutes } from '../../hooks/useCompanyRoutes';

type RouteMapPanelProps = {
  companyId: string;
  selectedFileId: string | null;
};

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

export function RouteMapPanel({ companyId, selectedFileId }: RouteMapPanelProps): JSX.Element {
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
        title="Mapa de recorridos"
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
          Selecciona archivo, vehiculo y mes para visualizar la trayectoria GPS, KPIs y eventos
          operativos relevantes del recorrido.
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
          message="Selecciona un archivo, vehiculo y mes para cargar el mini mapa con los datos procesados."
        />
      ) : null}

      {hasReadyFilters ? (
        <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
          <Card title="Trayectoria del vehiculo" className="space-y-3">
            <VehicleRouteMap data={mapData} loading={loadingMap} maxEventMarkers={24} />

            <div className="rounded-xl border border-[#f0d8c7] bg-[#fff8f2] px-3 py-2 text-xs text-slate-700">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2">
                  <span className="route-marker route-marker-start route-marker-inline">I</span>{' '}
                  Inicio
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="route-marker route-marker-end route-marker-inline">F</span> Fin
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="route-marker route-marker-event route-marker-inline">!</span>{' '}
                  Eventos
                </span>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
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

            <Card title="Eventos relevantes">
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
            </Card>
          </div>
        </div>
      ) : null}

      {isMapEmpty ? (
        <EmptyState
          title="Sin puntos de recorrido"
          message="El archivo tiene seleccion valida pero no contiene suficientes puntos GPS para dibujar la ruta."
        />
      ) : null}
    </section>
  );
}
