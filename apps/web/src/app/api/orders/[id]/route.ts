import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

const SUPA_URL = process.env.SUPABASE_URL || '';
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const TRACKING_SECRET = process.env.ORDER_TRACKING_SECRET || '';

/**
 * Verify a tracking token for an order.
 * Token format: base64url(payload).base64url(hmac)
 * Payload: `${orderId}|${expiryMs}`
 * Returns true only if the HMAC is valid, matches the orderId, and hasn't expired.
 */
function verifyTrackingToken(orderId: string, token: string | null): boolean {
  if (!token || !TRACKING_SECRET) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  try {
    const payload = Buffer.from(parts[0], 'base64url').toString('utf8');
    const providedMac = Buffer.from(parts[1], 'base64url');
    const [tokenOrderId, expiryStr] = payload.split('|');
    if (tokenOrderId !== orderId) return false;
    const expiry = Number(expiryStr);
    if (!Number.isFinite(expiry) || Date.now() > expiry) return false;
    const expectedMac = createHmac('sha256', TRACKING_SECRET).update(payload).digest();
    if (providedMac.length !== expectedMac.length) return false;
    return timingSafeEqual(providedMac, expectedMac);
  } catch {
    return false;
  }
}

/**
 * Redact a delivery address for unauthenticated tracking.
 * Keeps street name / city for ETA context but drops house number, postcode, apt.
 */
function redactAddress(addr: string): string {
  if (!addr) return '';
  // Drop digits (house number, postcode) and anything after the first comma-separated street part.
  const firstPart = addr.split(',')[0].replace(/\d+[A-Za-z]?/g, '').trim();
  return firstPart || 'In uw buurt';
}

/**
 * GET /api/orders/[id]?t=<signed-token>
 * Public order tracking. Without a valid signed token, sensitive PII is redacted.
 * With a valid token, full customer address + name are returned.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.nextUrl.searchParams.get('t');
  const authorized = verifyTrackingToken(id, token);

  if (!SUPA_URL || !SUPA_KEY) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  try {
    const headers = { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` };

    const res = await fetch(
      `${SUPA_URL}/rest/v1/orders?id=eq.${id}&select=id,order_number,status,total,items,customer_name,delivery_address,tenant_id,created_at&limit=1`,
      { headers }
    );
    const rows = res.ok ? await res.json() : [];
    const order = rows[0];
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    let restaurantName = 'Restaurant';
    if (order.tenant_id) {
      const tRes = await fetch(`${SUPA_URL}/rest/v1/tenants?id=eq.${order.tenant_id}&select=name&limit=1`, { headers });
      const tenants = tRes.ok ? await tRes.json() : [];
      if (tenants[0]) restaurantName = tenants[0].name;
    }

    const statusMap: Record<string, string> = {
      pending_payment: 'confirmed', new: 'confirmed', pending_acceptance: 'confirmed',
      accepted: 'preparing', preparing: 'preparing', ready: 'ready',
      picked_up: 'on_the_way', out_for_delivery: 'on_the_way',
      delivered: 'delivered', completed: 'delivered', cancelled: 'cancelled',
    };

    let parsedItems: any[] = [];
    try {
      const raw = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      parsedItems = (raw || []).map((i: any) => ({
        name: i.name || 'Item',
        quantity: i.quantity || i.qty || 1,
        price: Math.round(parseFloat(i.unitPrice || i.basePrice || '0') * 100),
      }));
    } catch {}

    return NextResponse.json({
      id: order.id,
      restaurantName,
      status: statusMap[order.status] || order.status,
      total: Math.round(parseFloat(order.total) * 100),
      estimatedMinutes: ['preparing', 'accepted'].includes(order.status) ? 25 : order.status === 'ready' ? 5 : undefined,
      items: parsedItems,
      rider: ['picked_up', 'out_for_delivery'].includes(order.status) ? { name: 'Bezorger' } : undefined,
      // PII — only returned to authorized (signed-token) requests
      address: authorized ? (order.delivery_address || '') : redactAddress(order.delivery_address || ''),
      customerName: authorized ? (order.customer_name || '') : undefined,
    });
  } catch (err) {
    console.error('[orders/[id]] Error:', err);
    return NextResponse.json({ error: 'Failed to load order' }, { status: 500 });
  }
}
