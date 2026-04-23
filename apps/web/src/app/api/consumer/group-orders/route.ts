/**
 * POST /api/consumer/group-orders
 * Proxies group order creation to VelociPizza backend.
 *
 * Note: Group order endpoints gracefully degrade — if Veloci backend
 * doesn't have group order support yet, the frontend falls back to demo mode.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { vpFetch } from '@/lib/velocipizza';

const groupOrderItemModifierSchema = z.object({
  modifierId: z.string().min(1),
  optionId: z.string().min(1).optional(),
  quantity: z.number().int().positive().optional(),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
}).strict();

const groupOrderItemSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().int().positive(),
  modifiers: z.array(groupOrderItemModifierSchema).optional(),
}).strict();

const createGroupOrderSchema = z.object({
  items: z.array(groupOrderItemSchema).min(1),
  orderType: z.enum(['DELIVERY', 'PICKUP', 'DINE_IN']).optional(),
  maxParticipants: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('enjoy_session')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const rawBody = await req.json();
    const parsed = createGroupOrderSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid group order payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = await vpFetch<unknown>('/api/consumer/group-orders', {
      method: 'POST',
      body: parsed.data,
      token,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('[EnJoy /api/consumer/group-orders] Error:', error);
    return NextResponse.json(
      { error: error.message ?? 'Group orders not available' },
      { status: error.status ?? 503 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('enjoy_session')?.value;
    if (!token) return NextResponse.json([], { status: 200 });

    const data = await vpFetch<unknown>('/api/consumer/group-orders', { token });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
