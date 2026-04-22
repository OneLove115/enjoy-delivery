/**
 * DELETE /api/consumer/reservations/[id]
 * Proxy to Veloci DELETE /api/reservations/[id].
 *
 * NOTE: Veloci's /api/reservations/[id] DELETE route existence is unconfirmed —
 * needs backend validation. If absent this proxy returns 404 from Veloci.
 */
import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

type Params = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const token = req.cookies.get('enjoy_session')?.value;

    const data = await vpFetch<unknown>(`/api/reservations/${id}`, {
      method: 'DELETE',
      ...(token ? { token } : {}),
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    console.error('[EnJoy /api/consumer/reservations/[id] DELETE] Error:', err);
    return NextResponse.json(
      { error: err.message ?? 'Internal server error' },
      { status: err.status ?? 500 },
    );
  }
}
