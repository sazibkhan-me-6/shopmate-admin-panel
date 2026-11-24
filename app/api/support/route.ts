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

export interface SyncedProductInfo {
  name: string;
  category: string;
  brand?: string;
  price: number;
  oldPrice?: number;
  discountBadge?: string;
  stock: number;
  colors?: string[];
  sizes?: string[];
  description?: string;
}

// Complete live knowledge synced from https://shopmate-ecommerce-kohl.vercel.app/ & Admin Panel
let LIVE_CATALOG_KNOWLEDGE: {
  storeUrl: string;
  storeName: string;
  products: SyncedProductInfo[];
  categories: string[];
  coupons: { code: string; details: string }[];
  lastSyncedAt: string;
} = {
  storeUrl: 'https://shopmate-ecommerce-kohl.vercel.app/',
  storeName: 'ShopMate — Smart Shopping, Better Living',
  categories: [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Beauty & Health',
    'Sports & Fitness',
    'Books',
    'Toys & Games',
    'Accessories',
  ],
  coupons: [
    { code: 'SAVE10', details: '10% instant discount on entire cart' },
    { code: 'WELCOME20', details: '20% off (up to $20 discount) for shoppers' },
  ],
  products: [
    {
      name: 'iPhone 15 Pro Max',
      category: 'Electronics',
      brand: 'Apple',
      price: 1099,
      oldPrice: 1299,
      discountBadge: '-15%',
      stock: 24,
      colors: ['Natural Titanium', 'Black Titanium', 'Blue Titanium'],
      description: 'Titanium design, powerful camera system and all-day battery life.',
    },
    {
      name: 'Sony WH-1000XM5',
      category: 'Electronics',
      brand: 'Sony',
      price: 319,
      oldPrice: 399,
      discountBadge: '-20%',
      stock: 31,
      colors: ['Black', 'Silver'],
      description: 'Industry-leading noise cancellation, premium sound and lightweight design.',
    },
    {
      name: 'Nike Air Force 1',
      category: 'Fashion',
      brand: 'Nike',
      price: 89,
      oldPrice: 119,
      discountBadge: '-25%',
      stock: 45,
      sizes: ['39', '40', '41', '42', '43', '44'],
      colors: ['White', 'Black'],
      description: 'Iconic everyday sneakers with cushioned comfort and durable construction.',
    },
    {
      name: 'Apple Watch Series 9',
      category: 'Electronics',
      brand: 'Apple',
      price: 409,
      oldPrice: 499,
      discountBadge: '-18%',
      stock: 19,
      colors: ['Midnight', 'Starlight'],
      description: 'Powerful health, fitness and connectivity features in a sleek smartwatch.',
    },
    {
      name: 'Under Armour Backpack',
      category: 'Accessories',
      brand: 'Under Armour',
      price: 45,
      oldPrice: 58,
      discountBadge: '-22%',
      stock: 52,
      colors: ['Black'],
      description: 'Durable, spacious backpack for work, school and travel.',
    },
    {
      name: 'MacBook Air M3',
      category: 'Electronics',
      brand: 'Apple',
      price: 999,
      oldPrice: 1099,
      discountBadge: 'NEW',
      stock: 16,
      colors: ['Midnight', 'Silver', 'Starlight'],
      description: 'Thin, silent and powerful laptop with M3 chip and all-day battery.',
    },
    {
      name: 'Premium Cotton T-Shirt',
      category: 'Fashion',
      brand: 'Uniqlo',
      price: 29,
      oldPrice: 39,
      discountBadge: '-25%',
      stock: 70,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White', 'Beige', 'Black'],
      description: 'Soft premium cotton with clean regular fit.',
    },
    {
      name: 'Minimal Lounge Sofa',
      category: 'Home & Living',
      brand: 'Nordic Home',
      price: 699,
      oldPrice: 799,
      discountBadge: '-12%',
      stock: 8,
      colors: ['Cream', 'Gray'],
      description: 'Modern lounge sofa with supportive cushions.',
    },
    {
      name: 'Everyday Skincare Set',
      category: 'Beauty & Health',
      brand: 'Glow Lab',
      price: 59,
      oldPrice: 79,
      discountBadge: '-25%',
      stock: 37,
      description: 'Daily skincare essentials for cleansing, hydration and healthy glow.',
    },
    {
      name: 'Adjustable Dumbbell Set',
      category: 'Sports & Fitness',
      brand: 'FitPro',
      price: 149,
      oldPrice: 189,
      discountBadge: '-21%',
      stock: 20,
      description: 'Compact adjustable weights for home workouts.',
    },
    {
      name: 'The Creative Mind',
      category: 'Books',
      brand: 'Penguin',
      price: 19,
      oldPrice: 25,
      discountBadge: '-24%',
      stock: 100,
      description: 'Inspiring guide to creative thinking and practical habits.',
    },
    {
      name: 'Classic Teddy Bear',
      category: 'Toys & Games',
      brand: 'PlayTime',
      price: 24,
      oldPrice: 32,
      discountBadge: '-25%',
      stock: 60,
      description: 'Soft, giftable child-friendly plush teddy bear.',
    },
  ],
  lastSyncedAt: new Date().toISOString(),
};

let AI_AUTOMATION_CONFIG: AIAutomationConfig = {
  enabled: true,
  mode: 'autonomous',
  language: 'bilingual',
  tone: 'friendly',
  autoTagTickets: true,
  autoEscalateKeywords: ['refund', 'damaged', 'broken', 'fraud', 'manager', 'cancel', 'রিফান্ড', 'নষ্ট', 'ক্যানসেল'],
  fallbackReplyEn:
    '✨ Hi! Welcome to ShopMate (shopmate-ecommerce-kohl.vercel.app). We offer 12+ authentic products across 8 categories (Electronics, Fashion, Home & Living, Beauty, Sports, Books, Toys, Accessories) with FREE shipping on $50+ orders & promo codes SAVE10 / WELCOME20! Ask me about any product price, stock, delivery, or order — or call/WhatsApp +880 1614703406.',
  fallbackReplyBn:
    '✨ আসসালামু আলাইকুম! ShopMate-এ স্বাগতম (shopmate-ecommerce-kohl.vercel.app)। আমাদের ৮টি ক্যাটাগরিতে (Electronics, Fashion, Home & Living, Beauty, Sports, Books, Toys, Accessories) ১০০% অরিজিনাল প্রোডাক্ট, $50+ অর্ডারে ফ্রি ডেলিভারি এবং SAVE10 / WELCOME20 কুপন ডিসকাউন্ট রয়েছে! যেকোনো প্রোডাক্টের দাম, স্টক, ডেলিভারি বা অর্ডার সম্পর্কে জানতে লিখুন অথবা কল/হোয়াটসঅ্যাপ করুন: +880 1614703406।',
  knowledgeRules: [
    {
      id: 'rule-coupons',
      title: 'Active Coupons, Promo Codes & Big Sale Offers',
      keywords: ['coupon', 'promo', 'discount', 'offer', 'sale', 'save10', 'welcome20', 'কুপন', 'ডিসকাউন্ট', 'অফার', 'ছাড়'],
      reply:
        '🎉 ShopMate লাইভ অফার ও কুপন কোড: চেকআউটে "SAVE10" কোড দিলে ১০% ডিসকাউন্ট এবং "WELCOME20" কোড দিলে ২০% (সর্বোচ্চ $20) ছাড় পাবেন! এছাড়াও নির্বাচিত পণ্যে Up to 50% OFF এবং All Electronics-এ ৩০% পর্যন্ত ছাড় চলছে!',
      active: true,
      hitCount: 54,
    },
    {
      id: 'rule-delivery',
      title: 'Delivery Time & Shipping Charge ($50+ Free)',
      keywords: ['delivery', 'shipping', 'courier', 'charge', 'dhaka', 'chattogram', 'sylhet', 'কবে', 'ডেলিভারি', 'চার্জ', 'কুরিয়ার', 'ঢাকা', 'সিলেট', 'চট্টগ্রাম'],
      reply:
        '🚚 ShopMate ডেলিভারি ও চার্জ: $50 বা তার বেশি অর্ডারে ডেলিভারি সম্পূর্ণ ফ্রি! $50-এর কম অর্ডারে ফ্ল্যাট শিপিং চার্জ মাত্র $7.99। ঢাকার ভিতরে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ২-৩ কার্যদিবসের মধ্যে Steadfast/Pathao কুরিয়ারে ডেলিভারি করা হয়।',
      active: true,
      hitCount: 48,
    },
    {
      id: 'rule-payment',
      title: 'Payment Methods (bKash, Nagad, VISA, Mastercard & COD)',
      keywords: ['bkash', 'nagad', 'visa', 'mastercard', 'trxid', 'payment', 'cod', 'cash on delivery', 'বিকাশ', 'নগদ', 'পেমেন্ট', 'কার্ড', 'ক্যাশ অন'],
      reply:
        '💳 পেমেন্ট অপশন: ShopMate-এ bKash, Nagad, VISA, Mastercard এবং সারা বাংলাদেশে Cash on Delivery (COD) সুবিধা রয়েছে। bKash/Nagad পেমেন্ট করলে TrxID শেয়ার করুন, আমাদের টিম সাথে সাথে ভেরিফাই করে অর্ডার কনফার্ম করে দেবে।',
      active: true,
      hitCount: 36,
    },
    {
      id: 'rule-categories',
      title: 'Storefront Categories & Product Catalog Overview',
      keywords: ['category', 'categories', 'catalog', 'product list', 'what do you sell', 'ক্যাটাগরি', 'কি কি পাওয়া যায়', 'কি কি আছে', 'প্রোডাক্ট লিস্ট'],
      reply:
        '🛍️ ShopMate-এ আমাদের ৮টি ক্যাটাগরি রয়েছে: Electronics (iPhone 15 Pro Max $1099, MacBook Air M3 $999, Apple Watch S9 $409, Sony WH-1000XM5 $319), Fashion (Nike Air Force 1 $89, Cotton T-Shirt $29), Home & Living (Lounge Sofa $699), Beauty & Health (Skincare Set $59), Sports & Fitness (Dumbbell Set $149), Books ($19), Toys & Games ($24) এবং Accessories (Under Armour Backpack $45)। কোন প্রোডাক্টটির বিস্তারিত জানতে চান?',
      active: true,
      hitCount: 29,
    },
    {
      id: 'rule-contact',
      title: 'Official Hotline, WhatsApp, Email & Banani Address',
      keywords: ['contact', 'phone', 'number', 'hotline', 'whatsapp', 'email', 'address', 'location', 'banani', 'ঠিকানা', 'নম্বর', 'ফোন', 'হোয়াটসঅ্যাপ', 'অফিস'],
      reply:
        '📞 ShopMate যোগাযোগের ঠিকানা: ফোন ও WhatsApp: +880 1614703406 | ইমেইল: support@shopmate.com | অফিস: House 42, Road 11, Block D, Banani, Dhaka - 1213, Bangladesh | লাইভ চ্যাট ২৪/৭ এবং হটলাইন সকাল ৯টা – রাত ১১টা পর্যন্ত খোলা থাকে।',
      active: true,
      hitCount: 23,
    },
    {
      id: 'rule-authenticity',
      title: '100% Authentic Products & Manufacturer Warranty',
      keywords: ['authentic', 'original', 'warranty', 'genuine', 'fake', 'জেনুইন', 'অরিজিনাল', 'ওয়ারেন্টি', 'আসল'],
      reply:
        '✅ ১০০% অরিজিনাল ও ওয়ারেন্টি গ্যারান্টি: ShopMate-এর প্রতিটি প্রোডাক্ট (Apple, Sony, Nike, Uniqlo ইত্যাদি) ১০০% ব্র্যান্ড-অথেন্টিক, সিলপ্যাক বক্স এবং ইলেকট্রনিক্স পণ্যে অফিসিয়াল ম্যানুফ্যাকচারার ওয়ারেন্টি সহ দেওয়া হয়।',
      active: true,
      hitCount: 21,
    },
    {
      id: 'rule-return',
      title: '7-Day Return, Replacement & Size Exchange Policy',
      keywords: ['return', 'exchange', 'size', 'replace', 'রিটার্ন', 'এক্সচেঞ্জ', 'বদল', 'সাইজ'],
      reply:
        '🔄 ৭ দিনের সহজ রিটার্ন ও এক্সচেঞ্জ: প্রোডাক্ট হাতে পাওয়ার ৭ দিনের মধ্যে অরিজিনাল প্যাকেজিং ও ট্যাগ অক্ষত থাকলে বিনামূল্যে রিটার্ন বা সাইজ এক্সচেঞ্জ করা যাবে। আপনার অর্ডার আইডি দিলে আমরা এখনই প্রসেস শুরু করছি!',
      active: true,
      hitCount: 18,
    },
    {
      id: 'rule-order',
      title: 'Order Tracking & Status Verification',
      keywords: ['track', 'order', 'status', 'অর্ডার', 'ট্র্যাক', 'স্ট্যাটাস'],
      reply:
        '📦 অর্ডার ট্র্যাকিং: অনুগ্রহ করে আপনার অর্ডার আইডি (যেমন: #SM-1048) অথবা অর্ডারে ব্যবহৃত ফোন নম্বরটি দিন, আমাদের AI ও অ্যাডমিন টিম এখনই আপনার অর্ডারের লাইভ স্ট্যাটাস জানিয়ে দেবে।',
      active: true,
      hitCount: 30,
    },
  ],
  stats: {
    totalAutoReplies: 259,
    resolvedByAi: 214,
    avgResponseTimeSec: 1.1,
    escalatedToHuman: 16,
  },
  lastUpdated: new Date().toISOString(),
};

function hasBengaliChars(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

function findMatchingCatalogProduct(lowerText: string): SyncedProductInfo | null {
  const aliases: Record<string, string[]> = {
    'iPhone 15 Pro Max': ['iphone', 'আইফোন', '15 pro', 'apple phone'],
    'Sony WH-1000XM5': ['sony', 'wh-1000xm5', 'headphone', 'হেডফোন'],
    'Nike Air Force 1': ['nike', 'air force', 'sneaker', 'shoe', 'জুতা', 'স্নিকার'],
    'Apple Watch Series 9': ['apple watch', 'watch', 'smartwatch', 'স্মার্টওয়াচ', 'ঘড়ি'],
    'Under Armour Backpack': ['backpack', 'under armour', 'bag', 'ব্যাগ', 'ব্যাকপ্যাক'],
    'MacBook Air M3': ['macbook', 'laptop', 'm3', 'ম্যাকবুক', 'ল্যাপটপ'],
    'Premium Cotton T-Shirt': ['t-shirt', 'tshirt', 'shirt', 'uniqlo', 'টি-শার্ট', 'টিশার্ট'],
    'Minimal Lounge Sofa': ['sofa', 'furniture', 'সোফা', 'ফার্নিচার'],
    'Everyday Skincare Set': ['skincare', 'skin', 'beauty', 'glow lab', 'স্কিনকেয়ার'],
    'Adjustable Dumbbell Set': ['dumbbell', 'gym', 'fitness', 'ডাম্বেল', 'ফিটনেস'],
    'The Creative Mind': ['creative mind', 'book', 'penguin', 'বই'],
    'Classic Teddy Bear': ['teddy', 'bear', 'toy', 'টেডি', 'খেলনা'],
  };

  for (const prod of LIVE_CATALOG_KNOWLEDGE.products) {
    const prodLower = prod.name.toLowerCase();
    if (lowerText.includes(prodLower)) return prod;
    const kwList = aliases[prod.name] || prodLower.split(/\s+/).filter(w => w.length >= 4);
    if (kwList.some(k => lowerText.includes(k.toLowerCase()))) {
      return prod;
    }
  }
  return null;
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
  if (/(bkash|nagad|trxid|payment|visa|mastercard|card|পেমেন্ট|বিকাশ|নগদ)/i.test(lower)) {
    detectedCategory = 'Payment Gateway';
  } else if (/(delivery|shipping|courier|track|cod|ডেলিভারি|কুরিয়ার|অর্ডার)/i.test(lower)) {
    detectedCategory = 'Orders & Shipping';
  } else if (/(return|refund|exchange|damaged|রিটার্ন|রিফান্ড|বদল)/i.test(lower)) {
    detectedCategory = 'Returns & Refunds';
  } else if (/(authentic|original|warranty|size|stock|price|কত|দাম|স্টক|জেনুইন|অরিজিনাল|ওয়ারেন্টি)/i.test(lower)) {
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

  // 1. Live Product Catalog Lookup (Synced from Website + Admin Panel)
  const matchedProduct = findMatchingCatalogProduct(lower);
  if (matchedProduct && !/(refund|damaged|broken|রিফান্ড|নষ্ট)/i.test(lower)) {
    detectedCategory = 'Product Inquiry';
    const colorsStr = matchedProduct.colors?.length ? matchedProduct.colors.join(', ') : '';
    const sizesStr = matchedProduct.sizes?.length ? matchedProduct.sizes.join(', ') : '';
    const discountStr = matchedProduct.oldPrice && matchedProduct.oldPrice > matchedProduct.price
      ? ` (রেগুলার $${matchedProduct.oldPrice}, ${matchedProduct.discountBadge || 'অফার'} ছাড়!)`
      : '';
    const discountStrEn = matchedProduct.oldPrice && matchedProduct.oldPrice > matchedProduct.price
      ? ` (Regular $${matchedProduct.oldPrice}, ${matchedProduct.discountBadge || 'Sale'}!)`
      : '';

    const prodReply = isBn
      ? `🛍️ ${matchedProduct.name} (${matchedProduct.category}): বর্তমান দাম মাত্র $${matchedProduct.price}${discountStr}। স্টকে আছে: ${matchedProduct.stock > 0 ? `${matchedProduct.stock}টি ইন-স্টক ✅` : 'স্টক আউট ❌'}।${colorsStr ? ` কালার: ${colorsStr}।` : ''}${sizesStr ? ` সাইজ: ${sizesStr}।` : ''} চেকআউটে "SAVE10" কোডে আরও ১০% ছাড় এবং $50+ অর্ডারে ফ্রি ডেলিভারি পাবেন!`
      : `🛍️ ${matchedProduct.name} (${matchedProduct.category}): Live Price $${matchedProduct.price}${discountStrEn}. Availability: ${matchedProduct.stock > 0 ? `${matchedProduct.stock} in stock ✅` : 'Out of stock ❌'}.${colorsStr ? ` Colors: ${colorsStr}.` : ''}${sizesStr ? ` Sizes: ${sizesStr}.` : ''} Use code "SAVE10" for an extra 10% off — plus FREE shipping on orders $50+!`;

    return {
      reply: `${greeting}${prodReply}${escalationNote}`,
      matchedRuleTitle: `Live Catalog Match: ${matchedProduct.name}`,
      escalated,
      detectedCategory,
      detectedUrgency,
    };
  }

  // 2. Order ID pattern match (#SM-XXXX)
  const orderMatch = text.match(/#?SM-\d{3,6}/i);
  if (orderMatch) {
    detectedCategory = 'Orders & Shipping';
    const orderId = orderMatch[0].toUpperCase().startsWith('#') ? orderMatch[0].toUpperCase() : '#' + orderMatch[0].toUpperCase();
    const orderReply = isBn
      ? `📦 আপনার অর্ডার ${orderId} আমাদের অ্যাডমিন সিস্টেমে চেক করার জন্য রেকর্ড হয়েছে। পেমেন্ট ভেরিফিকেশন ও কুরিয়ার ট্র্যাকিং আপডেট ২ মিনিটের মধ্যে আপনার ফোন/ইমেইলে জানানো হবে। জরুরি প্রয়োজনে WhatsApp: +880 1614703406।`
      : `📦 We have located your inquiry for Order ${orderId} and flagged it in our Admin Order Desk. Payment verification & Steadfast/Pathao courier tracking will be confirmed shortly. Need urgent help? WhatsApp +880 1614703406.`;
    return {
      reply: `${greeting}${orderReply}${escalationNote}`,
      matchedRuleTitle: `Order Lookup: ${orderId}`,
      escalated,
      detectedCategory,
      detectedUrgency,
    };
  }

  // 3. Find matching active knowledge rule
  for (const rule of AI_AUTOMATION_CONFIG.knowledgeRules) {
    if (!rule.active) continue;
    const matched = rule.keywords.some(kw => kw.trim() && lower.includes(kw.trim().toLowerCase()));
    if (matched) {
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
    reply: `${greeting}${fallback}${escalationNote}`,
    matchedRuleTitle: 'ShopMate Storefront AI Assistant',
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
      catalogKnowledge: {
        storeUrl: LIVE_CATALOG_KNOWLEDGE.storeUrl,
        storeName: LIVE_CATALOG_KNOWLEDGE.storeName,
        productsCount: LIVE_CATALOG_KNOWLEDGE.products.length,
        categoriesCount: LIVE_CATALOG_KNOWLEDGE.categories.length,
        categories: LIVE_CATALOG_KNOWLEDGE.categories,
        coupons: LIVE_CATALOG_KNOWLEDGE.coupons,
        products: LIVE_CATALOG_KNOWLEDGE.products,
        lastSyncedAt: LIVE_CATALOG_KNOWLEDGE.lastSyncedAt,
      },
      timestamp: new Date().toISOString(),
    },
    { headers: CORS_HEADERS }
  );
}

// Receive incoming support message or ticket from the live storefront
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Sync live products & categories from Admin Panel into AI Knowledge Base
    if (body.action === 'sync_admin_knowledge') {
      if (Array.isArray(body.products) && body.products.length > 0) {
        LIVE_CATALOG_KNOWLEDGE.products = body.products.map((p: any) => ({
          name: p.name,
          category: p.category || 'General',
          brand: p.brand,
          price: Number(p.discountedPrice ?? p.price ?? 0),
          oldPrice: p.discountedPrice && p.price > p.discountedPrice ? Number(p.price) : p.oldPrice ? Number(p.oldPrice) : undefined,
          discountBadge: p.discountPercent ? `-${p.discountPercent}%` : p.badge,
          stock: Number(p.stock ?? 0),
          colors: p.colors,
          sizes: p.sizes,
          description: p.description,
        }));
      }
      if (Array.isArray(body.categories) && body.categories.length > 0) {
        LIVE_CATALOG_KNOWLEDGE.categories = body.categories.map((c: any) => (typeof c === 'string' ? c : c.name));
      }
      LIVE_CATALOG_KNOWLEDGE.lastSyncedAt = new Date().toISOString();

      return NextResponse.json(
        {
          success: true,
          message: `Synced ${LIVE_CATALOG_KNOWLEDGE.products.length} products & ${LIVE_CATALOG_KNOWLEDGE.categories.length} categories into AI Automation Knowledge Base!`,
          catalogKnowledge: {
            storeUrl: LIVE_CATALOG_KNOWLEDGE.storeUrl,
            storeName: LIVE_CATALOG_KNOWLEDGE.storeName,
            productsCount: LIVE_CATALOG_KNOWLEDGE.products.length,
            categoriesCount: LIVE_CATALOG_KNOWLEDGE.categories.length,
            categories: LIVE_CATALOG_KNOWLEDGE.categories,
            coupons: LIVE_CATALOG_KNOWLEDGE.coupons,
            products: LIVE_CATALOG_KNOWLEDGE.products,
            lastSyncedAt: LIVE_CATALOG_KNOWLEDGE.lastSyncedAt,
          },
        },
        { headers: CORS_HEADERS }
      );
    }

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
