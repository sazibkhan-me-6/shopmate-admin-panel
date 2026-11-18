import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export interface SupportMessage {
  id: string;
  sender: 'customer' | 'admin' | 'bot';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subject: string;
  category: 'Orders & Shipping' | 'Payment Gateway' | 'Product Inquiry' | 'Returns & Refunds' | 'Technical Support' | 'General';
  urgency: 'Urgent' | 'High' | 'Normal';
  status: 'New' | 'In Progress' | 'Resolved' | 'Closed';
  source: 'Storefront Live Chat' | 'Contact Form' | 'WhatsApp Request' | 'Admin Portal';
  createdAt: string;
  messages: SupportMessage[];
  unread: boolean;
}

// Global in-memory support tickets connecting storefront and admin
let LIVE_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: '#TKT-8841',
    customerName: 'Tanvir Hasan',
    customerEmail: 'tanvir.hasan@gmail.com',
    customerPhone: '+880 1711-223344',
    subject: 'bKash Payment Verification for Order #SM-1048',
    category: 'Payment Gateway',
    urgency: 'Urgent',
    status: 'New',
    source: 'Storefront Live Chat',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    unread: true,
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Tanvir Hasan',
        text: 'Hello, I just placed an order for iPhone 15 Pro Max and paid via bKash TrxID: 9J8A7B6C5D. Can you verify if the payment is received?',
        timestamp: '12 mins ago',
      },
    ],
  },
  {
    id: '#TKT-8840',
    customerName: 'Farhana Akter',
    customerEmail: 'farhana.akter@yahoo.com',
    customerPhone: '+880 1822-334455',
    subject: 'Delivery time & courier charge to Chattogram',
    category: 'Orders & Shipping',
    urgency: 'High',
    status: 'In Progress',
    source: 'Contact Form',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    unread: false,
    messages: [
      {
        id: 'msg-2',
        sender: 'customer',
        senderName: 'Farhana Akter',
        text: 'Hi! I want to order the Sony WH-1000XM5 headphones. How many days will delivery take to GEC Circle, Nasirabad, Chattogram?',
        timestamp: '45 mins ago',
      },
      {
        id: 'msg-3',
        sender: 'admin',
        senderName: 'ShopMate Support Agent',
        text: 'Hello Farhana! Outside Dhaka delivery takes 2 to 3 business days via Steadfast courier. Shipping is 100% free since your order exceeds $50!',
        timestamp: '35 mins ago',
      },
    ],
  },
  {
    id: '#TKT-8839',
    customerName: 'Rahim Chowdhury',
    customerEmail: 'rahim.chy@hotmail.com',
    customerPhone: '+880 1933-445566',
    subject: 'Nike Air Force 1 Size 42 authenticity check',
    category: 'Product Inquiry',
    urgency: 'Normal',
    status: 'Resolved',
    source: 'Storefront Live Chat',
    createdAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    unread: false,
    messages: [
      {
        id: 'msg-4',
        sender: 'customer',
        senderName: 'Rahim Chowdhury',
        text: 'Are the Nike Air Force 1 sneakers 100% authentic with original box and SKU barcode?',
        timestamp: '2 hours ago',
      },
      {
        id: 'msg-5',
        sender: 'admin',
        senderName: 'ShopMate Support Agent',
        text: 'Yes Rahim, all products in ShopMate are 100% brand original with manufacturer warranty and barcode verification.',
        timestamp: '1 hour ago',
      },
    ],
  },
];

let SUPPORT_CONFIG = {
  hotline: '+880 1614703406',
  whatsapp: '+880 1614703406',
  email: 'support@shopmate.com',
  address: 'House 42, Road 11, Block D, Banani, Dhaka - 1213, Bangladesh',
  operatingHours: '24/7 Live Chat · Phone Hotline: 9:00 AM – 11:00 PM BST',
  chatStatus: 'online', // 'online' | 'busy' | 'away'
  autoWelcomeMessage: '👋 Welcome to ShopMate 24/7 Support! Our support team is online and ready to assist you.',
  lastUpdated: new Date().toISOString(),
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      tickets: LIVE_SUPPORT_TICKETS,
      unreadCount: LIVE_SUPPORT_TICKETS.filter(t => t.unread).length,
      config: SUPPORT_CONFIG,
      timestamp: new Date().toISOString(),
    },
    { headers: CORS_HEADERS }
  );
}

// Receive incoming support message or ticket from the live storefront
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // If updating support configuration
    if (body.action === 'update_config') {
      SUPPORT_CONFIG = {
        ...SUPPORT_CONFIG,
        ...body.config,
        lastUpdated: new Date().toISOString(),
      };
      return NextResponse.json(
        {
          success: true,
          message: 'Customer support configuration updated successfully',
          config: SUPPORT_CONFIG,
        },
        { headers: CORS_HEADERS }
      );
    }

    // Creating a new support ticket / message from storefront
    const newTicketId = body.id || '#TKT-' + Math.floor(1000 + Math.random() * 9000);
    const newTicket: SupportTicket = {
      id: newTicketId,
      customerName: body.customerName || body.name || 'Storefront Visitor',
      customerEmail: body.customerEmail || body.email || 'customer@example.com',
      customerPhone: body.customerPhone || body.phone || '+880 1614-703406',
      subject: body.subject || 'Live Chat Inquiry from Website',
      category: body.category || 'General',
      urgency: body.urgency || 'High',
      status: 'New',
      source: body.source || 'Storefront Live Chat',
      createdAt: new Date().toISOString(),
      unread: true,
      messages: body.message
        ? [
            {
              id: 'msg-' + Date.now(),
              sender: 'customer',
              senderName: body.customerName || body.name || 'Storefront Visitor',
              text: body.message,
              timestamp: 'Just now',
            },
          ]
        : body.messages || [],
    };

    LIVE_SUPPORT_TICKETS.unshift(newTicket);

    console.log(`[ShopMate Support] New inquiry ${newTicket.id} received from ${newTicket.customerName}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Support ticket submitted to admin desk successfully',
        ticket: newTicket,
      },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message || 'Failed to submit support request' },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}

// Admin replying to customer or updating ticket status
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { ticketId, replyMessage, status, senderName } = body;

    const ticketIndex = LIVE_SUPPORT_TICKETS.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const ticket = LIVE_SUPPORT_TICKETS[ticketIndex];

    if (replyMessage) {
      ticket.messages.push({
        id: 'msg-' + Date.now(),
        sender: 'admin',
        senderName: senderName || 'ShopMate Admin Support',
        text: replyMessage,
        timestamp: 'Just now',
      });
      ticket.status = status || 'In Progress';
      ticket.unread = false;
    }

    if (status) {
      ticket.status = status;
    }

    if (body.markRead !== undefined) {
      ticket.unread = !body.markRead;
    }

    LIVE_SUPPORT_TICKETS[ticketIndex] = ticket;

    return NextResponse.json(
      {
        success: true,
        message: 'Ticket updated successfully',
        ticket,
      },
      { headers: CORS_HEADERS }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message || 'Failed to update ticket' },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}
