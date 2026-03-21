import { httpRequest } from './http';

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

function buildPath(path: string, query?: QueryParams): string {
  if (!query) {
    return path;
  }

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return;
    }

    params.set(key, String(value));
  });

  const search = params.toString();
  return search ? `${path}?${search}` : path;
}

export const api = {
  get<T>(path: string, query?: QueryParams): Promise<T> {
    return httpRequest<T>(buildPath(path, query), { method: 'GET' });
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return httpRequest<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  postForm<T>(path: string, body: FormData): Promise<T> {
    return httpRequest<T>(path, {
      method: 'POST',
      body,
    });
  },

  delete<T>(path: string): Promise<T> {
    return httpRequest<T>(path, {
      method: 'DELETE',
    });
  },
};

export async function withMockFallback<T>(request: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await request();
  } catch (error) {
    // TODO: Remove this fallback after all FastAPI endpoints are confirmed in integration.
    console.warn('Using temporary mock fallback:', error);
    return fallback;
  }
}
