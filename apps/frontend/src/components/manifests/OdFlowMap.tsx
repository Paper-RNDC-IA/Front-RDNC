import 'leaflet/dist/leaflet.css';

import { MapContainer, Polyline, TileLayer, Tooltip } from 'react-leaflet';

import { formatNumber } from '../../utils/formatters';
import type { OdMatrixRowApi } from '../../types/manifests';

interface Props {
  rows: OdMatrixRowApi[];
}

const COLOMBIA_CENTER: [number, number] = [4.5, -74.0];

function lineWeight(toneladas: number, maxTon: number): number {
  const ratio = maxTon > 0 ? toneladas / maxTon : 0;
  return Math.max(1, Math.round(ratio * 8));
}

function lineColor(toneladas: number, maxTon: number): string {
  const ratio = maxTon > 0 ? toneladas / maxTon : 0;
  if (ratio > 0.6) return '#ef4444';
  if (ratio > 0.3) return '#f97316';
  return '#3b82f6';
}

export function OdFlowMap({ rows }: Props): JSX.Element {
  const valid = rows.filter(
    (r) =>
      r.origen_lat != null &&
      r.origen_lon != null &&
      r.destino_lat != null &&
      r.destino_lon != null,
  );

  const maxTon = Math.max(...valid.map((r) => r.total_toneladas), 1);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <div className="border-b border-slate-100 bg-white px-5 py-4">
        <p className="text-sm font-semibold text-slate-800">Mapa de flujos OD</p>
        <p className="mt-0.5 text-xs text-slate-500">
          Grosor y color proporcional a toneladas. Rojo = mayor volumen.
        </p>
      </div>
      <MapContainer
        center={COLOMBIA_CENTER}
        zoom={5}
        style={{ height: 420 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {valid.map((r) => (
          <Polyline
            key={`${r.origen_dane}-${r.destino_dane}`}
            positions={[
              [r.origen_lat, r.origen_lon],
              [r.destino_lat, r.destino_lon],
            ]}
            pathOptions={{
              color: lineColor(r.total_toneladas, maxTon),
              weight: lineWeight(r.total_toneladas, maxTon),
              opacity: 0.75,
            }}
          >
            <Tooltip sticky>
              <span className="text-xs">
                <strong>{r.origen}</strong> → <strong>{r.destino}</strong>
                <br />
                {r.departamento_origen} → {r.departamento_destino}
                <br />
                {formatNumber(r.total_viajes)} viajes · {formatNumber(r.total_toneladas)} ton
              </span>
            </Tooltip>
          </Polyline>
        ))}
      </MapContainer>
      {valid.length === 0 && (
        <div className="flex h-16 items-center justify-center bg-white text-sm text-slate-400">
          Sin coordenadas disponibles para trazar flujos.
        </div>
      )}
    </div>
  );
}
