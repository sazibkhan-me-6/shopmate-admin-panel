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
  aiHandled?: boolean;
}

export interface AIKnowledgeRule {
  id: string;
  title: string;
  keywords: string[];
  reply: string;
  active: boolean;
  hitCount: number;
}

export interface AIAutomationConfig {
  enabled: boolean;
  mode: 'autonomous' | 'hybrid' | 'after_hours';
  language: 'bilingual' | 'bengali' | 'english';
  tone: 'friendly' | 'professional' | 'concise';
  autoTagTickets: boolean;
  autoEscalateKeywords: string[];
  fallbackReplyEn: string;
  fallbackReplyBn: string;
  knowledgeRules: AIKnowledgeRule[];
  stats: {
    totalAutoReplies: number;
    resolvedByAi: number;
    avgResponseTimeSec: number;
    escalatedToHuman: number;
  };
  lastUpdated: string;
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

let AI_AUTOMATION_CONFIG: AIAutomationConfig = {
  enabled: true,
  mode: 'hybrid',
  language: 'bilingual',
  tone: 'friendly',
  autoTagTickets: true,
  autoEscalateKeywords: ['refund', 'damaged', 'broken', 'fraud', 'manager', 'cancel', 'রিফান্ড', 'নষ্ট', 'ক্যানসেল'],
  fallbackReplyEn:
    '✨ Hi! Thanks for contacting ShopMate Support. Our AI Assistant has logged your inquiry and notified a live specialist to assist you shortly. For urgent help, call +880 1614703406.',
  fallbackReplyBn:
    '✨ আসসালামু আলাইকুম! ShopMate সাপোর্টে যোগাযোগ করার জন্য ধন্যবাদ। আপনার মেসেজটি আমাদের AI সিস্টেমে রেকর্ড হয়েছে এবং একজন সাপোর্ট এজেন্ট খুব শীঘ্রই আপনাকে রিপ্লাই দেবেন। জরুরি প্রয়োজনে কল করুন: +880 1614703406।',
  knowledgeRules: [
    {
      id: 'rule-delivery',
      title: 'Delivery Time & Shipping Charge',
      keywords: ['delivery', 'shipping', 'courier', 'dhaka', 'chattogram', 'sylhet', 'কবে', 'ডেলিভারি', 'কুরিয়ার', 'ঢাকা', 'সিলেট', 'চট্টগ্রাম'],
      reply:
        '🚚 ShopMate ডেলিভারি তথ্য: ঢাকার ভিতরে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ২-৩ কার্যদিবসের মধ্যে Steadfast/Pathao কুরিয়ারে ডেলিভারি করা হয়। $50+ অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!',
      active: true,
      hitCount: 42,
    },
    {
      id: 'rule-payment',
      title: 'bKash / Nagad & Cash on Delivery',
      keywords: ['bkash', 'nagad', 'trxid', 'payment', 'cod', 'cash on delivery', 'বিকাশ', 'নগদ', 'পেমেন্ট', 'ক্যাশ অন'],
      reply:
        '💳 পেমেন্ট ও ভেরিফিকেশন: আমরা bKash, Nagad, SSLCommerz এবং সারা বাংলাদেশে Cash on Delivery (COD) সাপোর্ট করি। আপনার TrxID শেয়ার করলে আমাদের টিম ২ মিনিটের মধ্যে অর্ডার কনফার্ম করে দেবে।',
      active: true,
      hitCount: 31,
    },
    {
      id: 'rule-authenticity',
      title: 'Product Authenticity & Warranty',
      keywords: ['authentic', 'original', 'warranty', 'genuine', 'fake', 'জেনুইন', 'অরিজিনাল', 'ওয়ারেন্টি', 'আসল'],
      reply:
        '✅ ১০০% অরিজিনাল গ্যারান্টি: ShopMate-এর প্রতিটি প্রোডাক্ট ব্র্যান্ড-অথেন্টিক, সিলপ্যাক বক্স এবং অফিসিয়াল ওয়ারেন্টি সহ সরবরাহ করা হয়।',
      active: true,
      hitCount: 19,
    },
    {
      id: 'rule-return',
      title: '7-Day Return & Size Exchange',
      keywords: ['return', 'exchange', 'size', 'replace', 'রিটার্ন', 'এক্সচেঞ্জ', 'বদল', 'সাইজ'],
      reply:
        '🔄 ৭ দিনের সহজ রিটার্ন ও এক্সচেঞ্জ: প্রোডাক্ট হাতে পাওয়ার ৭ দিনের মধ্যে সাইজ বা যেকোনো সমস্যায় বিনামূল্যে এক্সচেঞ্জ অথবা রিফান্ড সুবিধা পাবেন। অর্ডার আইডি শেয়ার করুন, আমরা এখনই প্রসেস শুরু করছি!',
      active: true,
      hitCount: 15,
    },
    {
      id: 'rule-order',
      title: 'Order Tracking & Status',
      keywords: ['track', 'order', 'status', 'অর্ডার', 'ট্র্যাক', 'স্ট্যাটাস'],
      reply:
        '📦 অর্ডার ট্র্যাকিং: অনুগ্রহ করে আপনার অর্ডার আইডি (যেমন: #SM-1048) অথবা ফোন নম্বরটি দিন, আমাদের AI ও সাপোর্ট টিম এখনই লাইভ স্ট্যাটাস জানিয়ে দেবে।',
      active: true,
      hitCount: 27,
    },
  ],
  stats: {
    totalAutoReplies: 134,
    resolvedByAi: 98,
    avgResponseTimeSec: 1.2,
    escalatedToHuman: 14,
  },
  lastUpdated: new Date().toISOString(),
};

function hasBengaliChars(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

function generateAIAutoReply(
  text: string,
  customerName: string
): {
  reply: string;
  matchedRuleTitle: string | null;
  escalated: boolean;
  detectedCategory: SupportTicket['category'];
  detectedUrgency: SupportTicket['urgency'];
} {
  const lower = text.toLowerCase();
  const isBn =
    AI_AUTOMATION_CONFIG.language === 'bengali' ||
    (AI_AUTOMATION_CONFIG.language === 'bilingual' && hasBengaliChars(text));

  // Auto-detect category & urgency
  let detectedCategory: SupportTicket['category'] = 'General';
  if (/(bkash|nagad|trxid|payment|card|পেমেন্ট|বিকাশ|নগদ)/i.test(lower)) {
    detectedCategory = 'Payment Gateway';
  } else if (/(delivery|shipping|courier|track|cod|ডেলিভারি|কুরিয়ার|অর্ডার)/i.test(lower)) {
    detectedCategory = 'Orders & Shipping';
  } else if (/(return|refund|exchange|damaged|রিটার্ন|রিফান্ড|বদল)/i.test(lower)) {
    detectedCategory = 'Returns & Refunds';
  } else if (/(authentic|original|warranty|size|stock|price|জেনুইন|অরিজিনাল|ওয়ারেন্টি)/i.test(lower)) {
    detectedCategory = 'Product Inquiry';
  }

  const escalated = AI_AUTOMATION_CONFIG.autoEscalateKeywords.some(kw =>
    kw.trim() && lower.includes(kw.trim().toLowerCase())
  );

  const detectedUrgency: SupportTicket['urgency'] = escalated
    ? 'Urgent'
    : detectedCategory === 'Payment Gateway'
      ? 'High'
      : 'Normal';

  // Find matching active rule
  for (const rule of AI_AUTOMATION_CONFIG.knowledgeRules) {
    if (!rule.active) continue;
    const matched = rule.keywords.some(kw => kw.trim() && lower.includes(kw.trim().toLowerCase()));
    if (matched) {
      const greeting =
        AI_AUTOMATION_CONFIG.tone === 'concise'
          ? ''
          : isBn
            ? `হ্যালো ${customerName}! `
            : `Hi ${customerName}! `;
      const escalationNote = escalated
        ? isBn
          ? ' (⚠️ একজন হিউম্যান সাপোর্ট এজেন্টকেও প্রায়োরিটি নোটিফিকেশন পাঠানো হয়েছে।)'
          : ' (⚠️ Priority alert has also been escalated to a human specialist.)'
        : '';
      return {
        reply: `${greeting}${rule.reply}${escalationNote}`,
        matchedRuleTitle: rule.title,
        escalated,
        detectedCategory,
        detectedUrgency,
      };
    }
  }

  const fallback = isBn ? AI_AUTOMATION_CONFIG.fallbackReplyBn : AI_AUTOMATION_CONFIG.fallbackReplyEn;
  return {
    reply: fallback,
    matchedRuleTitle: null,
    escalated,
    detectedCategory,
    detectedUrgency,
  };
}

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
      aiAutomation: AI_AUTOMATION_CONFIG,
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

    // If updating AI Automation configuration
    if (body.action === 'update_ai_config') {
      AI_AUTOMATION_CONFIG = {
        ...AI_AUTOMATION_CONFIG,
        ...body.aiConfig,
        stats: body.aiConfig?.stats || AI_AUTOMATION_CONFIG.stats,
        lastUpdated: new Date().toISOString(),
      };
      return NextResponse.json(
        {
          success: true,
          message: 'Customer Support AI Automation settings updated and synced!',
          aiAutomation: AI_AUTOMATION_CONFIG,
        },
        { headers: CORS_HEADERS }
      );
    }

    // Interactive AI Sandbox test prompt
    if (body.action === 'test_ai_prompt') {
      const result = generateAIAutoReply(body.prompt || '', body.customerName || 'Customer');
      return NextResponse.json(
        {
          success: true,
          ...result,
        },
        { headers: CORS_HEADERS }
      );
    }

    // Creating a new support ticket / message from storefront
    const newTicketId = body.id || '#TKT-' + Math.floor(1000 + Math.random() * 9000);
    const customerName = body.customerName || body.name || 'Storefront Visitor';
    const customerText = body.message || (body.messages?.[0]?.text ?? body.subject ?? '');

    const initialMessages: SupportMessage[] = body.message
      ? [
          {
            id: 'msg-' + Date.now(),
            sender: 'customer',
            senderName: customerName,
            text: body.message,
            timestamp: 'Just now',
          },
        ]
      : body.messages || [];

    let finalCategory: SupportTicket['category'] = body.category || 'General';
    let finalUrgency: SupportTicket['urgency'] = body.urgency || 'High';
    let aiHandled = false;

    // Trigger AI Automation instant response if enabled
    if (AI_AUTOMATION_CONFIG.enabled && customerText) {
      const aiResult = generateAIAutoReply(customerText, customerName);

      if (AI_AUTOMATION_CONFIG.autoTagTickets) {
        finalCategory = aiResult.detectedCategory;
        finalUrgency = aiResult.detectedUrgency;
      }

      // In hybrid mode, always reply to matched FAQs or give acknowledgment
      const shouldAutoReply =
        AI_AUTOMATION_CONFIG.mode === 'autonomous' ||
        AI_AUTOMATION_CONFIG.mode === 'after_hours' ||
        (AI_AUTOMATION_CONFIG.mode === 'hybrid' && (aiResult.matchedRuleTitle !== null || !aiResult.escalated));

      if (shouldAutoReply) {
        initialMessages.push({
          id: 'msg-ai-' + (Date.now() + 1),
          sender: 'bot',
          senderName: 'ShopMate AI Assistant ✨',
          text: aiResult.reply,
          timestamp: 'Just now (AI Auto-Reply)',
        });
        aiHandled = true;
        AI_AUTOMATION_CONFIG.stats.totalAutoReplies += 1;
        if (aiResult.matchedRuleTitle) {
          const ruleObj = AI_AUTOMATION_CONFIG.knowledgeRules.find(r => r.title === aiResult.matchedRuleTitle);
          if (ruleObj) ruleObj.hitCount += 1;
          if (!aiResult.escalated) {
            AI_AUTOMATION_CONFIG.stats.resolvedByAi += 1;
          }
        }
      }

      if (aiResult.escalated) {
        AI_AUTOMATION_CONFIG.stats.escalatedToHuman += 1;
      }
    }

    const newTicket: SupportTicket = {
      id: newTicketId,
      customerName,
      customerEmail: body.customerEmail || body.email || 'customer@example.com',
      customerPhone: body.customerPhone || body.phone || '+880 1614-703406',
      subject: body.subject || 'Live Chat Inquiry from Website',
      category: finalCategory,
      urgency: finalUrgency,
      status: aiHandled && AI_AUTOMATION_CONFIG.mode === 'autonomous' ? 'In Progress' : 'New',
      source: body.source || 'Storefront Live Chat',
      createdAt: new Date().toISOString(),
      unread: true,
      aiHandled,
      messages: initialMessages,
    };

    LIVE_SUPPORT_TICKETS.unshift(newTicket);

    console.log(`[ShopMate Support] New inquiry ${newTicket.id} received from ${newTicket.customerName} (AI Handled: ${aiHandled})`);

    return NextResponse.json(
      {
        success: true,
        message: 'Support ticket submitted to admin desk successfully',
        ticket: newTicket,
        aiHandled,
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
