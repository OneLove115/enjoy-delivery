/**
 * GET  /api/consumer/orders/[id]  — fetch order detail
 * DELETE /api/consumer/orders/[id] — cancel order (within allowed window)
 */
import { NextRequest, NextResponse } from 'next/server';
import { vpFetch } from '@/lib/velocipizza';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const token = req.cookies.get('enjoy_session')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const data = await vpFetch<unknown>(`/api/consumer/orders/${id}`, { token });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: err.status ?? 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const token = req.cookies.get('enjoy_session')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const data = await vpFetch<unknown>(`/api/consumer/orders/${id}`, {
      method: 'DELETE',
      token,
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: err.status ?? 500 });
  }
}
