/**
 * POST /api/consumer/orders
 * Proxies order submission to VelociPizza's consumer order endpoint.
 * Body: { items: { menuItemId: string; quantity: number; modifiers?: ... }[], ... }
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { vpFetch } from '@/lib/velocipizza';

const orderItemModifierSchema = z.object({
  modifierId: z.string().min(1),
  optionId: z.string().min(1).optional(),
  quantity: z.number().int().positive().optional(),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
}).strict();

const orderItemSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().int().positive(),
  modifiers: z.array(orderItemModifierSchema).optional(),
}).strict();

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  orderType: z.enum(['DELIVERY', 'PICKUP', 'DINE_IN']).optional(),
  deliveryAddress: z.string().min(1).optional(),
  customerName: z.string().min(1).optional(),
  customerPhone: z.string().min(1).optional(),
  customerEmail: z.string().email().optional(),
  notes: z.string().optional(),
  tip: z.number().nonnegative().optional(),
  voucherCode: z.string().optional(),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('enjoy_session')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const rawBody = await req.json();
    const parsed = createOrderSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid order payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = await vpFetch<unknown>('/api/consumer/orders', {
      method: 'POST',
      body: parsed.data,
      token,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('[EnJoy /api/consumer/orders] Error:', error);
    return NextResponse.json({ error: error.message ?? 'Internal server error' }, { status: error.status ?? 500 });
  }
}
