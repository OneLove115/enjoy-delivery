import { NextRequest, NextResponse } from 'next/server';

const SUPA_URL = process.env.SUPABASE_URL || '';
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * GET /api/orders/[id]
 * Public order tracking — no auth needed (order ID is the secret).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

    // Get restaurant name
    let restaurantName = 'Restaurant';
    if (order.tenant_id) {
      const tRes = await fetch(`${SUPA_URL}/rest/v1/tenants?id=eq.${order.tenant_id}&select=name&limit=1`, { headers });
      const tenants = tRes.ok ? await tRes.json() : [];
      if (tenants[0]) restaurantName = tenants[0].name;
    }

    // Map status
    const statusMap: Record<string, string> = {
      pending_payment: 'confirmed', new: 'confirmed', pending_acceptance: 'confirmed',
      accepted: 'preparing', preparing: 'preparing', ready: 'ready',
      picked_up: 'on_the_way', out_for_delivery: 'on_the_way',
      delivered: 'delivered', completed: 'delivered', cancelled: 'cancelled',
    };

    // Parse items
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
      address: order.delivery_address || '',
    });
  } catch (err) {
    console.error('[orders/[id]] Error:', err);
    return NextResponse.json({ error: 'Failed to load order' }, { status: 500 });
  }
}
