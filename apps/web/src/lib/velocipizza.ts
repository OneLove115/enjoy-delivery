// SERVER-SIDE ONLY — never import in 'use client' files

type FetchOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export async function vpFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const BASE = process.env.VELOCIPIZZA_API_URL;
  if (!BASE) throw new Error('VELOCIPIZZA_API_URL is not set');

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;

  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw Object.assign(new Error(err.message ?? 'VelociPizza API error'), { status: res.status });
  }
  return res.json() as Promise<T>;
}
