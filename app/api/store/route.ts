import { NextResponse } from 'next/server';
import { INITIAL_200_PRODUCTS } from '../../../data/catalog200';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Electronics', count: '25 products', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80', featured: true },
  { id: 2, name: 'Fashion', count: '25 products', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80', featured: true },
  { id: 3, name: 'Home & Living', count: '25 products', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80', featured: true },
  { id: 4, name: 'Beauty & Health', count: '25 products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80', featured: true },
  { id: 5, name: 'Sports & Fitness', count: '25 products', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80', featured: true },
  { id: 6, name: 'Books', count: '25 products', image: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=500&q=80', featured: true },
  { id: 7, name: 'Toys & Games', count: '25 products', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=500&q=80', featured: true },
  { id: 8, name: 'Accessories', count: '25 products', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80', featured: true },
];

// Central store data synchronized with shopmate-ecommerce storefront (200 live products)
let STORE_DATA: any = {
  storeName: 'ShopMate E-commerce',
  storeUrl: 'https://shopmate-ecommerce-kohl.vercel.app/',
  adminUrl: 'https://shopmate-admin-panel.vercel.app/',
  status: 'online',
  productsCount: INITIAL_200_PRODUCTS.length,
  products: INITIAL_200_PRODUCTS,
  categories: DEFAULT_CATEGORIES,
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
      productsCount: Array.isArray(body.products) ? body.products.length : STORE_DATA.productsCount,
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
