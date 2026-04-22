'use client';
/**
 * useOrderStream — live order status via SSE.
 *
 * Flow:
 *  1. POST /api/consumer/orders/{id}/stream-token → EnJoy proxy → Veloci → signed token
 *  2. Open EventSource directly against Veloci (CORS-whitelisted):
 *     GET {VELOCI_API_URL}/api/consumer/orders/{id}/stream?t={token}
 *  3. Handle events, auto-reconnect with exponential backoff (1→2→4→…→30s).
 *  4. Stop reconnecting once status is terminal.
 *
 * EventSource fires JSON lines: { status: OrderStatus; at: string; data?: unknown }
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export type OrderStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface StreamEvent {
  status: OrderStatus;
  at: string;
}

export interface StreamState {
  status: OrderStatus | null;
  connected: boolean;
  error: string | null;
  events: StreamEvent[];
}

const TERMINAL: ReadonlySet<OrderStatus> = new Set(['delivered', 'cancelled']);
const VELOCI_API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN ?? 'https://www.veloci.online';
const BACKOFF_SEQUENCE = [1000, 2000, 4000, 8000, 16000, 30000];

function nextBackoff(attempt: number): number {
  return BACKOFF_SEQUENCE[Math.min(attempt, BACKOFF_SEQUENCE.length - 1)];
}

export function useOrderStream(orderId: string | null): StreamState {
  const [state, setState] = useState<StreamState>({
    status: null,
    connected: false,
    error: null,
    events: [],
  });

  // Stable ref so the cleanup in useEffect always closes the latest ES
  const esRef = useRef<EventSource | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef(0);
  const unmountedRef = useRef(false);

  const clearRetry = () => {
    if (retryTimerRef.current !== null) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const closeES = () => {
    esRef.current?.close();
    esRef.current = null;
  };

  const connect = useCallback(
    async (id: string) => {
      if (unmountedRef.current) return;

      // Step 1: get signed token from EnJoy proxy
      let token: string;
      try {
        const res = await fetch(`/api/consumer/orders/${id}/stream-token`, { method: 'POST' });
        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { error?: string };
          throw new Error(body.error ?? `Token fetch failed (${res.status})`);
        }
        const json = await res.json() as { token: string };
        token = json.token;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to get stream token';
        if (!unmountedRef.current) {
          setState(s => ({ ...s, error: msg, connected: false }));
        }
        return; // Don't retry on token failures (auth issue — backoff won't help)
      }

      if (unmountedRef.current) return;

      // Step 2: open EventSource directly against Veloci (CORS-whitelisted)
      const url = `${VELOCI_API_URL}/api/consumer/orders/${id}/stream?t=${encodeURIComponent(token)}`;
      const es = new EventSource(url);
      esRef.current = es;

      es.onopen = () => {
        if (unmountedRef.current) { es.close(); return; }
        attemptRef.current = 0; // reset backoff on successful connect
        setState(s => ({ ...s, connected: true, error: null }));
      };

      es.onmessage = (evt: MessageEvent<string>) => {
        if (unmountedRef.current) return;
        try {
          const payload = JSON.parse(evt.data) as { status?: OrderStatus; at?: string };
          if (!payload.status) return;
          const event: StreamEvent = {
            status: payload.status,
            at: payload.at ?? new Date().toISOString(),
          };
          setState(s => ({
            ...s,
            status: event.status,
            events: [...s.events, event],
          }));
          // Close cleanly if terminal — no reconnect needed
          if (TERMINAL.has(event.status)) {
            es.close();
            setState(s => ({ ...s, connected: false }));
          }
        } catch {
          // malformed event — ignore
        }
      };

      es.onerror = () => {
        if (unmountedRef.current) return;
        es.close();
        esRef.current = null;
        setState(s => ({ ...s, connected: false }));

        // Only reconnect if not in a terminal state
        setState(s => {
          const terminal = s.status !== null && TERMINAL.has(s.status);
          if (!terminal && !unmountedRef.current) {
            const delay = nextBackoff(attemptRef.current);
            attemptRef.current += 1;
            retryTimerRef.current = setTimeout(() => {
              if (!unmountedRef.current) connect(id);
            }, delay);
          }
          return s; // no state change here, side-effect only
        });
      };
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    unmountedRef.current = false;

    if (!orderId) return;

    connect(orderId);

    return () => {
      unmountedRef.current = true;
      clearRetry();
      closeES();
    };
  }, [orderId, connect]);

  return state;
}
