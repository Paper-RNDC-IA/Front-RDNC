import type {
  RouteEventApi,
  RouteFileApi,
  RouteMapApi,
  RouteMonthApi,
  RouteVehicleApi,
} from '../types/company-routes';

import { api } from './api';
import { endpoints } from './endpoints';
import { HttpError } from './http';

type RouteQuery = {
  company_id: string;
  file_id?: string;
  vehicle_id?: string;
  month?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toArray<T>(payload: unknown, key: string): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (isRecord(payload) && Array.isArray(payload[key])) {
    return payload[key] as T[];
  }

  return [];
}

function withRequestError(action: string, error: unknown): never {
  if (error instanceof HttpError) {
    if (error.status === 401) {
      throw new Error(
        `${action}: sesion no valida para el modulo de recorridos. Cierra sesion, inicia sesion de nuevo y reintenta. Si persiste, el backend esta rechazando el token para /api/telemetry/routes/* aunque el frontend lo envie.`,
      );
    }

    if (error.status === 404) {
      throw new Error(
        `${action}: el backend desplegado no tiene habilitados los endpoints de recorridos (/api/telemetry/routes/*). Publica la version mas reciente del backend e intenta de nuevo.`,
      );
    }

    throw new Error(`${action}: ${error.message}`);
  }

  if (error instanceof Error) {
    throw new Error(`${action}: ${error.message}`);
  }

  throw new Error(`${action}: no fue posible conectar con el backend.`);
}

export async function getRouteFiles(companyId: string): Promise<RouteFileApi[]> {
  try {
    const response = await api.get<unknown>(endpoints.telemetryRoutes.files, {
      company_id: companyId,
    });

    return toArray<RouteFileApi>(response, 'files');
  } catch (error) {
    withRequestError('No fue posible cargar archivos con rutas procesadas', error);
  }
}

export async function getRouteVehicles(query: RouteQuery): Promise<RouteVehicleApi[]> {
  try {
    const response = await api.get<unknown>(endpoints.telemetryRoutes.vehicles, query);
    return toArray<RouteVehicleApi>(response, 'vehicles');
  } catch (error) {
    withRequestError('No fue posible cargar vehiculos disponibles', error);
  }
}

export async function getRouteMonths(query: RouteQuery): Promise<RouteMonthApi[]> {
  try {
    const response = await api.get<unknown>(endpoints.telemetryRoutes.months, query);
    return toArray<RouteMonthApi>(response, 'months');
  } catch (error) {
    withRequestError('No fue posible cargar meses disponibles', error);
  }
}

export async function getRouteMap(query: RouteQuery): Promise<RouteMapApi> {
  try {
    const response = await api.get<unknown>(endpoints.telemetryRoutes.map, query);

    if (isRecord(response)) {
      return response as RouteMapApi;
    }

    return {};
  } catch (error) {
    withRequestError('No fue posible cargar la trayectoria del vehiculo', error);
  }
}

export async function getRouteEvents(query: RouteQuery): Promise<RouteEventApi[]> {
  try {
    const response = await api.get<unknown>(endpoints.telemetryRoutes.events, query);
    return toArray<RouteEventApi>(response, 'events');
  } catch (error) {
    withRequestError('No fue posible cargar eventos de la ruta', error);
  }
}