/**
 * EnJoy Service Worker
 * Strategies:
 *  - App shell (HTML, offline page): cache-first with network fallback
 *  - _next/static/*: stale-while-revalidate (immutable assets)
 *  - /api/*: network-first with 3 s timeout, no caching on failure
 *  - Manifest / icons: cache-only after first fetch
 *  - Everything else: network-first → stale-while-revalidate fallback
 */

const CACHE_VERSION = 'enjoy-v1';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const OFFLINE_PAGE_URL = '/offline';

const PRECACHE_URLS = [
  OFFLINE_PAGE_URL,
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ─── Install ─────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ─── Activate ────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('enjoy-') && k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch ───────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Non-GET: pass through
  if (request.method !== 'GET') return;

  // Cross-origin (analytics, fonts CDN): pass through
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;

  // _next/static/*  → stale-while-revalidate
  if (path.startsWith('/_next/static/')) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // Manifest + icons → cache-only after precache
  if (path === '/manifest.webmanifest' || path.startsWith('/icons/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // API routes → network-first with 3 s timeout
  if (path.startsWith('/api/')) {
    event.respondWith(networkFirstWithTimeout(request, 3000));
    return;
  }

  // HTML navigation + everything else → network-first, offline fallback
  event.respondWith(networkFirstWithOfflineFallback(request));
});

// ─── Strategy helpers ────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkFetch = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });
  return cached ?? networkFetch;
}

async function networkFirstWithTimeout(request, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timer);
    return response;
  } catch {
    clearTimeout(timer);
    // For API failures return a generic JSON error (don't serve stale sensitive data)
    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    // Cache successful HTML navigations for offline resilience
    if (response.ok && request.headers.get('Accept')?.includes('text/html')) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Last resort: offline page
    const offline = await caches.match(OFFLINE_PAGE_URL);
    return offline ?? new Response('You are offline', { status: 503 });
  }
}
