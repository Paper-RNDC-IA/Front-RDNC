export class HttpError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.payload = payload;
  }
}

const BASE_URL = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? '')
  .toString()
  .replace(/\/$/, '');
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 25000);
const SESSION_STORAGE_KEY = 'transdata-rndc:company-session';
const API_LAST_CLIENT_AT_KEY = 'transdata-rndc:api-last-client-at';
const API_LAST_SERVER_AT_KEY = 'transdata-rndc:api-last-server-at';

export function getApiBaseUrl(): string {
  return BASE_URL;
}

export type ApiSyncInfo = {
  lastClientAt: string | null;
  lastServerAt: string | null;
};

export function getApiSyncInfo(): ApiSyncInfo {
  try {
    return {
      lastClientAt: localStorage.getItem(API_LAST_CLIENT_AT_KEY),
      lastServerAt: localStorage.getItem(API_LAST_SERVER_AT_KEY),
    };
  } catch {
    return {
      lastClientAt: null,
      lastServerAt: null,
    };
  }
}

function persistApiSyncInfo(response: Response): void {
  try {
    localStorage.setItem(API_LAST_CLIENT_AT_KEY, new Date().toISOString());

    const serverDateHeader = response.headers.get('date');

    if (!serverDateHeader) {
      return;
    }

    const parsed = new Date(serverDateHeader);

    if (!Number.isNaN(parsed.getTime())) {
      localStorage.setItem(API_LAST_SERVER_AT_KEY, parsed.toISOString());
    }
  } catch {
    // noop: sync info is best-effort only
  }
}

function getAuthHeader(): Record<string, string> {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as { token?: string };

    return parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
  } catch {
    return {};
  }
}

function logDevRequest(method: string, url: string, status: number): void {
  if (!import.meta.env.DEV) {
    return;
  }

  console.info(`[api] ${method} ${url} -> ${status}`);
}

function resolveUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function readPayloadText(payload: unknown): string {
  if (typeof payload === 'string') {
    return payload;
  }

  if (payload && typeof payload === 'object' && 'detail' in payload) {
    const detail = (payload as { detail?: unknown }).detail;

    if (typeof detail === 'string') {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (typeof item === 'string') {
            return item;
          }

          if (item && typeof item === 'object') {
            const message = 'msg' in item ? (item as { msg?: unknown }).msg : null;
            const location = 'loc' in item ? (item as { loc?: unknown }).loc : null;
            const locationText = Array.isArray(location)
              ? location.map((part) => String(part)).join('.')
              : '';

            if (typeof message === 'string' && locationText) {
              return `${locationText}: ${message}`;
            }

            if (typeof message === 'string') {
              return message;
            }
          }

          return '';
        })
        .filter(Boolean)
        .join(' | ');
    }
  }

  return '';
}

function resolveValidationErrorMessage(payload: unknown): string {
  const payloadText = readPayloadText(payload).toLowerCase();

  const hasRangeIssue =
    payloadText.includes('from') &&
    payloadText.includes('to') &&
    (payloadText.includes('greater') ||
      payloadText.includes('after') ||
      payloadText.includes('before') ||
      payloadText.includes('menor') ||
      payloadText.includes('mayor') ||
      payloadText.includes('order') ||
      payloadText.includes('rango'));

  if (hasRangeIssue) {
    return 'Rango invalido: la fecha inicial debe ser menor o igual a la final.';
  }

  const hasFormatIssue =
    payloadText.includes('date') ||
    payloadText.includes('format') ||
    payloadText.includes('regex') ||
    payloadText.includes('parsing') ||
    payloadText.includes('from') ||
    payloadText.includes('to');

  if (hasFormatIssue) {
    return 'Formato invalido: usar YYYY-MM-DD.';
  }

  return 'Solicitud invalida: revisa los parametros enviados.';
}

export async function httpRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const url = resolveUrl(path);
  const controller = new AbortController();
  const timeout = Number.isFinite(REQUEST_TIMEOUT_MS) ? REQUEST_TIMEOUT_MS : 25000;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let response: Response;

  try {
    response = await fetch(url, {
      credentials: 'include',
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...getAuthHeader(),
        ...init?.headers,
      },
    });
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new HttpError(`La solicitud supero el tiempo limite (${timeout} ms).`, 408, null);
    }

    throw new HttpError('No fue posible conectar con el backend.', 0, null);
  }

  clearTimeout(timeoutId);
  logDevRequest(init?.method ?? 'GET', url, response.status);
  persistApiSyncInfo(response);

  const hasBody = response.status !== 204;
  const contentType = response.headers.get('content-type') ?? '';
  const payload = hasBody
    ? contentType.includes('application/json')
      ? await response.json()
      : await response.text()
    : null;

  if (!response.ok) {
    if (response.status === 422) {
      throw new HttpError(resolveValidationErrorMessage(payload), response.status, payload);
    }

    const payloadText = readPayloadText(payload);
    const errorMessage = payloadText
      ? `La solicitud fallo con estado ${response.status}: ${payloadText}`
      : `La solicitud fallo con estado ${response.status}.`;

    throw new HttpError(errorMessage, response.status, payload);
  }

  return payload as T;
}
