const DEFAULT_TIMEOUT_MS = 15000;

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface HttpRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: TBody;
  signal?: AbortSignal;
}

function getBaseUrl(): string {
  const env = (import.meta as unknown as { env?: Record<string, unknown> }).env || {};
  const baseUrl = env?.VITE_API_BASE_URL || env?.API_BASE_URL || '';
  if (!baseUrl) {
    console.warn('VITE_API_BASE_URL não definida. Usando "/" como base.');
    return '/';
  }
  return String(baseUrl);
}

export async function httpRequest<TResponse, TBody = unknown>(
  path: string,
  opts: HttpRequestOptions<TBody> = {}
): Promise<TResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const url = new URL(path.replace(/^\//, ''), getBaseUrl());
    const token = localStorage.getItem('person-nexus-token');
    const response = await fetch(url.toString(), {
      method: opts.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(opts.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      signal: opts.signal ?? controller.signal,
    });

    if (!response.ok) {
      let message = `Erro ${response.status} ${response.statusText}`;
      try {
        const text = await response.text();
        if (text) {
          try {
            const data = JSON.parse(text);
            if (data && typeof data === 'object' && 'message' in data) {
              message = String(data.message);
            } else {
              message = text;
            }
          } catch {
            message = text;
          }
        }
      } catch { /* empty */ }

      if (response.status === 401) {
        try {
          localStorage.removeItem('person-nexus-token');
          window.location.reload();
        } catch { /* empty */ }
      }
      throw new Error(message);
    }

    if (opts.method === 'DELETE' && (response.status === 204 || response.status === 200)) {
      return undefined as unknown as TResponse;
    }
    
    if (response.status === 204) {
      return undefined as unknown as TResponse;
    }
    
    try {
      return (await response.json()) as TResponse;
    } catch (error) {
      throw new Error('Resposta inválida do servidor');
    }
  } finally {
    clearTimeout(timeout);
  }
}

export function withQuery(path: string, query?: Record<string, string | number | boolean | undefined>) {
  if (!query) return path;
  const url = new URL(path, 'http://local');
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });
  const q = url.searchParams.toString();
  return q ? `${url.pathname}?${q}` : url.pathname;
}


