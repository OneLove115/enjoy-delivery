/**
 * POST /api/consumer/orders/[id]/stream-token
 * Fetches a signed SSE token from Veloci for use with EventSource.
 * Veloci endpoint: POST /api/consumer/orders/[id]/stream-token
 *
 * TODO: Confirm this endpoint exists on Veloci — flagged for backend agent.
 */
import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const token = req.cookies.get('enjoy_session')?.value;

    const data = await vpFetch<{ token: string }>(`/api/consumer/orders/${id}/stream-token`, {
      method: 'POST',
      ...(token ? { token } : {}),
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    console.error('[EnJoy /api/consumer/orders/[id]/stream-token] Error:', err);
    return NextResponse.json(
      { error: err.message ?? 'Internal server error' },
      { status: err.status ?? 500 },
    );
  }
}
