import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Default storefront data matching shopmate-ecommerce-kohl.vercel.app
const STORE_DATA = {
  storeName: 'ShopMate E-commerce',
  storeUrl: 'https://shopmate-ecommerce-kohl.vercel.app/',
  status: 'online',
  announcement: {
    active: true,
    text: '🎉 Free shipping on orders over $100! Use code SAVE10 for 10% off.',
  },
  coupons: [
    { code: 'SAVE10', discountPercent: 10, active: true },
    { code: 'WELCOME20', discountPercent: 20, active: true },
  ],
  currency: {
    primary: 'USD',
    bdtRate: 120,
  },
  support: {
    email: 'support@shopmate.com',
    phone: '+880 9600 123456',
    whatsapp: '+880 1700 998877',
  },
  paymentGateways: [
    { id: 'bkash', name: 'bKash', enabled: true, merchantNumber: '01712-345678' },
    { id: 'nagad', name: 'Nagad', enabled: true, merchantNumber: '01812-987654' },
    { id: 'cards', name: 'Credit/Debit Cards', enabled: true },
    { id: 'cod', name: 'Cash on Delivery', enabled: true },
  ],
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: STORE_DATA,
      timestamp: new Date().toISOString(),
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json(
      {
        success: true,
        message: 'Storefront sync received',
        received: body,
      },
      { headers: CORS_HEADERS }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message || 'Invalid request body' },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}
