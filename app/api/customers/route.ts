import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export interface LiveCustomerRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  ordersCount: number;
  totalSpent: number;
  status: 'Active' | 'VIP' | 'Inactive';
  avatar: string;
  registeredAt: string;
  source?: string;
}

// In-memory store of customers registered or updated via https://shopmate-ecommerce-kohl.vercel.app/
let LIVE_CUSTOMERS: LiveCustomerRecord[] = [];

function getInitials(name: string): string {
  const parts = (name || 'Customer').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CU';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      customers: LIVE_CUSTOMERS,
      total: LIVE_CUSTOMERS.length,
      timestamp: new Date().toISOString(),
    },
    { headers: CORS_HEADERS }
  );
}

// Receive newly registered customer or profile update from the live storefront
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawName = (body.name || body.customerName || '').trim();
    const rawEmail = (body.email || body.customerEmail || '').trim().toLowerCase();

    if (!rawName || !rawEmail) {
      return NextResponse.json(
        { success: false, error: 'Customer name and email are required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const phone = (body.phone || body.customerPhone || '+880 1700-000000').trim();
    const rawAddr = (body.address || '').trim();
    const rawCity = (body.city || '').trim();
    const fullAddress =
      rawAddr && rawCity && !rawAddr.toLowerCase().includes(rawCity.toLowerCase())
        ? `${rawAddr}, ${rawCity}`
        : rawAddr || rawCity || 'Dhaka, Bangladesh';

    const existingIdx = LIVE_CUSTOMERS.findIndex(c => c.email.toLowerCase() === rawEmail);

    if (existingIdx !== -1) {
      const existing = LIVE_CUSTOMERS[existingIdx];
      const updated: LiveCustomerRecord = {
        ...existing,
        name: rawName,
        phone,
        address: fullAddress,
        avatar: getInitials(rawName),
        status: body.status || existing.status,
      };
      LIVE_CUSTOMERS.splice(existingIdx, 1);
      LIVE_CUSTOMERS.unshift(updated);

      return NextResponse.json(
        {
          success: true,
          message: 'Customer profile updated in Admin Panel',
          customer: updated,
          isNew: false,
        },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    const newCustomer: LiveCustomerRecord = {
      id: Date.now(),
      name: rawName,
      email: rawEmail,
      phone,
      address: fullAddress,
      ordersCount: Number(body.ordersCount || 0),
      totalSpent: Number(body.totalSpent || 0),
      status: body.status || 'Active',
      avatar: getInitials(rawName),
      registeredAt: body.registeredAt || new Date().toISOString(),
      source: body.source || 'Storefront Sign Up',
    };

    LIVE_CUSTOMERS.unshift(newCustomer);

    console.log(`[ShopMate Customers] New account registered: ${newCustomer.name} (${newCustomer.email})`);

    return NextResponse.json(
      {
        success: true,
        message: 'Customer registered and synced with Admin Panel successfully',
        customer: newCustomer,
        isNew: true,
      },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message || 'Failed to register customer' },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}
