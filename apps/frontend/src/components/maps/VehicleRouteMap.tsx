import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, Polyline, TileLayer, useMap } from 'react-leaflet';
import L, { type LatLngBoundsExpression, type LatLngTuple } from 'leaflet';

import type { VehicleRouteMap as VehicleRouteMapModel } from '../../types/company-routes';

type VehicleRouteMapProps = {
  data: VehicleRouteMapModel | null;
  loading?: boolean;
  maxEventMarkers?: number;
};

type FitBoundsProps = {
  positions: LatLngTuple[];
};

const COLOMBIA_CENTER: LatLngTuple = [4.5709, -74.2973];
const COLOMBIA_BOUNDS: LatLngBoundsExpression = [
  [-4.3, -81.9],
  [13.5, -66.7],
];

function FitBounds({ positions }: FitBoundsProps): JSX.Element | null {
  const map = useMap();

  useEffect(() => {
    if (!positions.length) {
      return;
    }

    if (positions.length === 1) {
      map.setView(positions[0], 13, { animate: false });
      return;
    }

    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds.pad(0.15), { animate: false });
  }, [map, positions]);

  return null;
}

function buildMarkerIcon(className: string, label: string): L.DivIcon {
  return L.divIcon({
    className,
    html: `<span>${label}</span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export function VehicleRouteMap({
  data,
  loading = false,
  maxEventMarkers = 40,
}: VehicleRouteMapProps): JSX.Element {
  const startIcon = useMemo(() => buildMarkerIcon('route-marker route-marker-start', 'I'), []);
  const endIcon = useMemo(() => buildMarkerIcon('route-marker route-marker-end', 'F'), []);
  const eventIcon = useMemo(() => buildMarkerIcon('route-marker route-marker-event', '!'), []);

  if (loading) {
    return (
      <div className="route-map-shell">
        <div className="route-map-empty">
          <p className="text-sm font-semibold text-slate-900">Cargando recorrido</p>
          <p className="mt-1 text-xs text-slate-500">
            Preparando trayectoria y eventos del vehiculo.
          </p>
        </div>
      </div>
    );
  }

  if (!data || !data.path.length) {
    return (
      <div className="route-map-shell">
        <MapContainer
          center={COLOMBIA_CENTER}
          zoom={5}
          minZoom={4}
          maxBounds={COLOMBIA_BOUNDS}
          scrollWheelZoom
          className="route-map-canvas"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>

        <div className="route-map-empty">
          <p className="text-sm font-semibold text-slate-900">Mapa base de Colombia</p>
          <p className="mt-1 text-xs text-slate-500">
            Cuando subas y proceses un Excel con coordenadas validas, aqui se dibuja la ruta del
            vehiculo.
          </p>
        </div>
      </div>
    );
  }

  const positions: LatLngTuple[] = data.path.map((point) => [point.lat, point.lng]);
  const limitedEvents = data.events.slice(0, maxEventMarkers);

  return (
    <div className="route-map-shell">
      <MapContainer center={positions[0]} zoom={6} scrollWheelZoom className="route-map-canvas">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds positions={positions} />

        <Polyline
          positions={positions}
          pathOptions={{ color: '#ea580c', opacity: 0.88, weight: 4, lineCap: 'round' }}
        />

        {data.startPoint ? (
          <Marker position={[data.startPoint.lat, data.startPoint.lng]} icon={startIcon}>
            <Popup>
              <strong>Inicio</strong>
              <br />
              {data.startPoint.timestamp || 'Sin timestamp'}
            </Popup>
          </Marker>
        ) : null}

        {data.endPoint ? (
          <Marker position={[data.endPoint.lat, data.endPoint.lng]} icon={endIcon}>
            <Popup>
              <strong>Fin</strong>
              <br />
              {data.endPoint.timestamp || 'Sin timestamp'}
            </Popup>
          </Marker>
        ) : null}

        {limitedEvents.map((event) => (
          <Marker key={event.id} position={[event.lat, event.lng]} icon={eventIcon}>
            <Popup>
              <strong>{event.label}</strong>
              <br />
              {event.description}
              <br />
              {event.timestamp || 'Sin timestamp'}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
