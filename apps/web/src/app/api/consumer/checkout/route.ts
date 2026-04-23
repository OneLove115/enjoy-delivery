import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const VP_URL = process.env.VELOCIPIZZA_API_URL || process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

/**
 * Whitelist schema for the consumer checkout body.
 *
 * SECURITY: Uses `.strict()` so any extra property (e.g. `total`, `discountAmount`,
 * `consumerId`, `tenantId`, or any other server-authoritative / computed field)
 * causes validation to fail. This prevents mass-assignment attacks where a client
 * could otherwise spoof pricing, identity, or tenancy by injecting fields into
 * the JSON body that we blindly forwarded to the VelociPizza backend.
 *
 * All pricing, discounts, and tenant/consumer resolution must happen server-side
 * in VP — never trust the client for those values.
 */
const CheckoutItemSchema = z
  .object({
    menuItemId: z.string().uuid(),
    quantity: z.number().int().positive(),
    modifiers: z.array(z.string()).optional(),
  })
  .strict();

const DeliveryAddressSchema = z
  .object({
    street: z.string(),
    city: z.string(),
    zip: z.string(),
    country: z.string().optional(),
  })
  .strict();

const CheckoutBodySchema = z
  .object({
    items: z.array(CheckoutItemSchema).min(1),
    orderType: z.enum(['delivery', 'pickup', 'dine_in']),
    deliveryAddress: DeliveryAddressSchema.optional(),
    customerName: z.string().max(100),
    customerPhone: z.string().max(30),
    customerEmail: z.string().email(),
    notes: z.string().max(500).optional(),
    tip: z.number().min(0).max(200).optional(),
    voucherCode: z.string().max(64).optional(),
    scheduledFor: z.string().datetime().optional(),
    paymentMethod: z.enum(['card', 'ideal', 'cash', 'terminal']),
    restaurantSlug: z.string().optional(),
  })
  .strict();

/**
 * POST /api/consumer/checkout
 * Proxy to Veloci's Stripe checkout session creation.
 *
 * Applies input whitelisting (Zod strict) and idempotency-key propagation to
 * prevent duplicate order creation on retry / double-click.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = CheckoutBodySchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // Idempotency: re-use the client-supplied key so retries don't create a
    // second order. Fall back to a server-generated UUID if the client forgot
    // to send one (defensive — clients should always send it).
    const idempotencyKey =
      req.headers.get('Idempotency-Key') || req.headers.get('idempotency-key') || crypto.randomUUID();

    const res = await fetch(`${VP_URL}/api/consumer/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(parsed.data),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[EnJoy checkout proxy] Error:', err);
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}
