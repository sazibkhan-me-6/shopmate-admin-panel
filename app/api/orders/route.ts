import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: 'Orders endpoint ready to receive orders from shopmate-ecommerce-kohl.vercel.app',
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: Request) {
  try {
    const orderData = await req.json();

    return NextResponse.json(
      {
        success: true,
        orderId: orderData?.id || '#SM-' + Math.floor(1000 + Math.random() * 9000),
        message: 'Order received successfully by ShopMate Admin Panel',
        receivedAt: new Date().toISOString(),
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process order' },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}
