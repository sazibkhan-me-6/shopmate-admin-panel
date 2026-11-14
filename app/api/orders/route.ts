import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Global in-memory order storage for live serverless instances
let LIVE_ORDERS: any[] = [
  {
    id: '#SM-1048',
    customer: 'Sazib Khan',
    phone: '+880 1614-703406',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    date: 'Today',
    total: 1099.0,
    paymentMethod: 'bKash',
    trxId: '9J8A7B6C5D',
    status: 'Processing',
  },
  {
    id: '#SM-1047',
    customer: 'Olivia Martin',
    phone: '+880 1712-345678',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    date: 'Nov 14, 2026',
    total: 319.0,
    paymentMethod: 'Credit Card',
    status: 'Processing',
  },
  {
    id: '#SM-1046',
    customer: 'Noah Williams',
    phone: '+880 1823-456789',
    address: 'Plot 15, Sector 7, Uttara Model Town, Dhaka',
    date: 'Nov 13, 2026',
    total: 89.0,
    paymentMethod: 'Nagad',
    trxId: '8K7L6M5N4P',
    status: 'Shipped',
  },
  {
    id: '#SM-1045',
    customer: 'Emma Brown',
    phone: '+880 1934-567890',
    address: 'Flat 4B, GEC Circle, Nasirabad, Chattogram',
    date: 'Nov 13, 2026',
    total: 409.0,
    paymentMethod: 'Cash on Delivery',
    status: 'Processing',
  },
  {
    id: '#SM-1044',
    customer: 'Ava Wilson',
    phone: '+880 1656-789012',
    address: 'House 14, Road 27, Dhanmondi, Dhaka',
    date: 'Nov 12, 2026',
    total: 91.24,
    paymentMethod: 'SSLCommerz',
    status: 'Delivered',
  },
];

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      orders: LIVE_ORDERS,
      totalCount: LIVE_ORDERS.length,
      timestamp: new Date().toISOString(),
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const customerName =
      data.customer?.name || data.customerName || (typeof data.customer === 'string' ? data.customer : 'Guest Customer');
    const customerPhone = data.customer?.phone || data.phone || '+880 1XXXXXXXXX';
    const customerAddress =
      [data.customer?.address, data.customer?.city].filter(Boolean).join(', ') || data.address || 'Dhaka, Bangladesh';

    const newOrder = {
      id: data.id || '#SM-' + Math.floor(1000 + Math.random() * 9000),
      customer: customerName,
      phone: customerPhone,
      address: customerAddress,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      total: parseFloat(data.total) || 0,
      paymentMethod: data.payment || data.paymentDetails?.method || 'Cash on Delivery',
      trxId: data.paymentDetails?.transactionId || data.trxId || 'N/A',
      status: 'Processing',
      items: data.items || [],
      receivedAt: new Date().toISOString(),
    };

    // Prepend new order
    LIVE_ORDERS.unshift(newOrder);

    console.log(`[ShopMate Admin] Received new live order ${newOrder.id} from ${newOrder.customer}`);

    return NextResponse.json(
      {
        success: true,
        orderId: newOrder.id,
        order: newOrder,
        message: 'Order received and logged in ShopMate Admin Panel successfully',
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process incoming order' },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { orderId, status } = await req.json();
    LIVE_ORDERS = LIVE_ORDERS.map(o => (o.id === orderId ? { ...o, status } : o));
    return NextResponse.json({ success: true, message: `Order ${orderId} updated to ${status}` }, { headers: CORS_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400, headers: CORS_HEADERS });
  }
}
