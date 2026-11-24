import { NextResponse } from 'next/server';
import { INITIAL_200_PRODUCTS } from '../../../data/catalog200';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Central store data synchronized with shopmate-ecommerce storefront (200 live products)
let STORE_DATA: any = {
  storeName: 'ShopMate E-commerce',
  storeUrl: 'https://shopmate-ecommerce-kohl.vercel.app/',
  adminUrl: 'https://shopmate-admin-panel.vercel.app/',
  status: 'online',
  productsCount: INITIAL_200_PRODUCTS.length,
  products: INITIAL_200_PRODUCTS,
  announcement: {
    active: true,
    text: '🎉 Flash Sale! Flat 15% OFF across all tech & fashion — Code: SHOPMATE15',
  },
  coupons: [
    { code: 'SAVE10', discountPercent: 10, active: true },
    { code: 'WELCOME20', discountPercent: 20, active: true },
    { code: 'SHOPMATE15', discountPercent: 15, active: true },
  ],
  currency: {
    primary: 'USD',
    bdtRate: 120,
  },
  support: {
    email: 'support@shopmate.com',
    phone: '+880 1614703406',
    whatsapp: '+880 1614703406',
  },
  paymentGateways: [
    { id: 'bkash', name: 'bKash', enabled: true, merchantNumber: '01712-345678' },
    { id: 'nagad', name: 'Nagad', enabled: true, merchantNumber: '01812-987654' },
    { id: 'sslcommerz', name: 'SSLCommerz', enabled: true },
    { id: 'cards', name: 'Credit/Debit Cards', enabled: true },
    { id: 'cod', name: 'Cash on Delivery', enabled: true },
  ],
  lastUpdated: new Date().toISOString(),
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

    STORE_DATA = {
      ...STORE_DATA,
      ...body,
      lastUpdated: new Date().toISOString(),
    };

    console.log('[ShopMate Admin] Storefront configuration updated successfully via POST /api/store');

    return NextResponse.json(
      {
        success: true,
        message: 'Storefront configuration updated and broadcasted successfully',
        data: STORE_DATA,
      },
      { headers: CORS_HEADERS }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message || 'Invalid request payload' },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}
