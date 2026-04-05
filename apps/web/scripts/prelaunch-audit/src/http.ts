export interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
  ok: boolean;
  duration_ms: number;
}

export async function httpRequest(
  url: string,
  options: RequestInit & { timeout?: number } = {},
): Promise<HttpResponse> {
  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    options.timeout || 10000,
  );

  try {
    const { timeout: _, ...fetchOpts } = options;
    const response = await fetch(url, {
      ...fetchOpts,
      signal: controller.signal,
    });

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const body = await response.text();
    return {
      status: response.status,
      headers,
      body,
      ok: response.ok,
      duration_ms: Date.now() - start,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Request failed";
    return {
      status: 0,
      headers: {},
      body: msg,
      ok: false,
      duration_ms: Date.now() - start,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
