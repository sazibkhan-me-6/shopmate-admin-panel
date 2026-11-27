'use client';
import { useEffect, useMemo, useState, useRef } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tags,
  BarChart3,
  Settings,
  Search,
  Bell,
  Plus,
  Download,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  ChevronDown,
  Trash2,
  CircleHelp,
  LogOut,
  Image as ImageIcon,
  Headphones,
  CreditCard,
  ShieldCheck,
  Pencil,
  Phone,
  MapPin,
  Tag,
  Award,
  Globe,
  ExternalLink,
  Radio,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Edit3,
  Star,
  Filter,
  Sparkles,
  LayoutGrid,
  List,
} from 'lucide-react';

import LoginScreen, { UserProfile } from '../components/LoginScreen';
import AddProductModal, { ProductFormData } from '../components/AddProductModal';
import AddCategoryModal, { CategoryItem } from '../components/AddCategoryModal';
import CustomerSupportModal from '../components/CustomerSupportModal';
import PaymentMethodsModal, { PaymentMethodItem } from '../components/PaymentMethodsModal';
import CustomerModal, { CustomerData } from '../components/CustomerModal';
import StorefrontControlModal, { StorefrontConfig } from '../components/StorefrontControlModal';
import { INITIAL_200_PRODUCTS } from '../data/catalog200';

export type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  discountPercent?: number;
  discountedPrice?: number;
  stock: number;
  status: 'Active' | 'Low stock' | 'Draft';
  image?: string;
  emoji?: string;
};

export type Order = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  date: string;
  total: number;
  paymentMethod: string;
  trxId?: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
};

// Full 200-product live catalogue (12 flagship + 188 curated products across 8 categories)
const initialProducts: Product[] = INITIAL_200_PRODUCTS;

// Exact 8 categories aligned with https://shopmate-ecommerce-kohl.vercel.app/ (25 products each = 200 total)
const initialCategories: CategoryItem[] = [
  {
    id: 1,
    name: 'Electronics',
    count: '25 products',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80',
    featured: true,
  },
  {
    id: 2,
    name: 'Fashion',
    count: '25 products',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80',
    featured: true,
  },
  {
    id: 3,
    name: 'Home & Living',
    count: '25 products',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80',
    featured: true,
  },
  {
    id: 4,
    name: 'Beauty & Health',
    count: '25 products',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80',
    featured: true,
  },
  {
    id: 5,
    name: 'Sports & Fitness',
    count: '25 products',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80',
    featured: true,
  },
  {
    id: 6,
    name: 'Books',
    count: '25 products',
    image: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=500&q=80',
    featured: true,
  },
  {
    id: 7,
    name: 'Toys & Games',
    count: '25 products',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=500&q=80',
    featured: true,
  },
  {
    id: 8,
    name: 'Accessories',
    count: '25 products',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80',
    featured: true,
  },
];

// Live orders with Bangladeshi payment gateways matching storefront checkout
const initialOrders: Order[] = [
  {
    id: '#SM-1048',
    customer: 'Olivia Martin',
    phone: '+880 1712-345678',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    date: 'Nov 14, 2026',
    total: 1099.0,
    paymentMethod: 'bKash (Automated PGW)',
    trxId: 'BK9A873F21',
    status: 'Processing',
  },
  {
    id: '#SM-1047',
    customer: 'Noah Williams',
    phone: '+880 1823-456789',
    address: 'Plot 15, Sector 7, Uttara Model Town, Dhaka',
    date: 'Nov 14, 2026',
    total: 319.0,
    paymentMethod: 'Nagad Direct Gateway',
    trxId: 'NG77291B4C',
    status: 'Shipped',
  },
  {
    id: '#SM-1046',
    customer: 'Emma Brown',
    phone: '+880 1934-567890',
    address: 'Flat 4B, GEC Circle, Nasirabad, Chattogram',
    date: 'Nov 13, 2026',
    total: 89.0,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Delivered',
  },
  {
    id: '#SM-1045',
    customer: 'Liam Davis',
    phone: '+880 1545-678901',
    address: 'East Zindabazar, Sylhet Sadar, Sylhet',
    date: 'Nov 13, 2026',
    total: 45.0,
    paymentMethod: 'Credit / Debit Card (Stripe)',
    trxId: 'STR_ch_3M4k9...',
    status: 'Cancelled',
  },
  {
    id: '#SM-1044',
    customer: 'Ava Wilson',
    phone: '+880 1656-789012',
    address: 'House 14, Road 27, Dhanmondi, Dhaka',
    date: 'Nov 12, 2026',
    total: 409.0,
    paymentMethod: 'bKash Merchant Pay',
    trxId: 'BK6X432190',
    status: 'Delivered',
  },
];

const initialCustomers: CustomerData[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@example.com',
    phone: '+880 1712-345678',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    ordersCount: 12,
    totalSpent: 1482.0,
    status: 'VIP',
    avatar: 'OM',
  },
  {
    id: 2,
    name: 'Noah Williams',
    email: 'noah.williams@example.com',
    phone: '+880 1823-456789',
    address: 'Plot 15, Sector 7, Uttara Model Town, Dhaka',
    ordersCount: 8,
    totalSpent: 629.0,
    status: 'Active',
    avatar: 'NW',
  },
  {
    id: 3,
    name: 'Emma Brown',
    email: 'emma.brown@example.com',
    phone: '+880 1934-567890',
    address: 'Flat 4B, GEC Circle, Nasirabad, Chattogram',
    ordersCount: 5,
    totalSpent: 386.0,
    status: 'Active',
    avatar: 'EB',
  },
  {
    id: 4,
    name: 'Liam Davis',
    email: 'liam.davis@example.com',
    phone: '+880 1545-678901',
    address: 'East Zindabazar, Sylhet Sadar, Sylhet',
    ordersCount: 3,
    totalSpent: 134.0,
    status: 'Inactive',
    avatar: 'LD',
  },
  {
    id: 5,
    name: 'Ava Wilson',
    email: 'ava.wilson@example.com',
    phone: '+880 1656-789012',
    address: 'House 14, Road 27, Dhanmondi, Dhaka',
    ordersCount: 9,
    totalSpent: 891.0,
    status: 'VIP',
    avatar: 'AW',
  },
  {
    id: 6,
    name: 'Sophia Taylor',
    email: 'sophia.taylor@example.com',
    phone: '+880 1367-890123',
    address: 'Khilgaon Chowdhury Para, Dhaka - 1219',
    ordersCount: 2,
    totalSpent: 148.0,
    status: 'Active',
    avatar: 'ST',
  },
];

const nav = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'Orders', icon: ShoppingBag },
  { name: 'Products', icon: Package },
  { name: 'Customers', icon: Users },
  { name: 'Categories', icon: Tags },
  { name: 'Analytics', icon: BarChart3 },
];

const money = (n: number) => '$' + n.toFixed(2);

export default function Home() {
  // Authentication state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // App UI state
  const [section, setSection] = useState('Overview');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<CustomerData[]>(initialCustomers);
  const [query, setQuery] = useState('');
  const [mobile, setMobile] = useState(false);
  const [notice, setNotice] = useState('');

  // Modals
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [activeCategoryProductFilter, setActiveCategoryProductFilter] = useState<string | null>(null);
  const [categoryFilterTab, setCategoryFilterTab] = useState<'all' | 'featured'>('all');
  const [categoryViewLayout, setCategoryViewLayout] = useState<'showcase' | 'grid'>('showcase');

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);

  const [showSupport, setShowSupport] = useState(false);
  const [supportInitialTab, setSupportInitialTab] = useState<'inbox' | 'ai' | 'config' | 'create' | 'faq'>('inbox');
  const [aiSupportEnabled, setAiSupportEnabled] = useState(true);
  const [unreadSupportCount, setUnreadSupportCount] = useState(1);

  // Social Media Links state (persisted in localStorage & synced live to storefront footer)
  const [socialLinks, setSocialLinks] = useState<
    { id: string; platform: string; url: string; active: boolean }[]
  >([
    { id: 'facebook', platform: 'Facebook', url: 'https://facebook.com', active: true },
    { id: 'whatsapp', platform: 'WhatsApp', url: 'https://wa.me/8801614703406', active: true },
    { id: 'instagram', platform: 'Instagram', url: 'https://instagram.com', active: true },
    { id: 'youtube', platform: 'YouTube', url: 'https://youtube.com', active: true },
    { id: 'twitter', platform: 'X (Twitter)', url: 'https://x.com', active: true },
    { id: 'linkedin', platform: 'LinkedIn', url: 'https://linkedin.com', active: true },
  ]);
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('shopmate_social_links');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSocialLinks(parsed);
        }
      }
    } catch {}
  }, []);

  const syncSocialLinksToStore = async (
    nextLinks: { id: string; platform: string; url: string; active: boolean }[],
    successMsg?: string
  ) => {
    setSocialLinks(nextLinks);
    try {
      localStorage.setItem('shopmate_social_links', JSON.stringify(nextLinks));
    } catch {}
    try {
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socialLinks: nextLinks }),
      });
    } catch {}
    if (successMsg) setNotice(successMsg);
  };
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showStorefrontControl, setShowStorefrontControl] = useState(false);

  // Real-time support knock alert state
  const [incomingKnock, setIncomingKnock] = useState<{
    id: string;
    customerName: string;
    customerPhone?: string;
    subject: string;
    message: string;
    time: string;
  } | null>(null);
  const [targetSupportTicketId, setTargetSupportTicketId] = useState<string | null>(null);
  const isInitialSupportSyncRef = useRef<boolean>(true);
  const knownTicketIdsRef = useRef<Set<string>>(new Set());

  // Web Audio API Synthesizer - Melodic notification chime for incoming customer knock
  const playSupportKnockChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Tone 1: 784 Hz (G5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, ctx.currentTime);
      gain1.gain.setValueAtTime(0.25, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.35);

      // Tone 2: 1046.5 Hz (C6) - Higher melodic ring
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.12);
      gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.12);
      osc2.stop(ctx.currentTime + 0.55);
    } catch (e) {
      // AudioContext fallback
    }
  };

  // Browser desktop notification trigger
  const triggerDesktopNotification = (customerName: string, subject: string, message: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(`🔔 Customer Knock: ${customerName}`, {
            body: `${subject}\n"${message}"`,
            icon: '/favicon.ico',
          });
        } catch (e) {}
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  };

  // Check saved login on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('shopmate_auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to parse saved user', e);
    } finally {
      setIsAuthReady(true);
    }
  }, []);

  // Request browser notification permission gently on first interaction
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      const askPermission = () => {
        Notification.requestPermission();
        window.removeEventListener('click', askPermission);
      };
      window.addEventListener('click', askPermission, { once: true });
      return () => window.removeEventListener('click', askPermission);
    }
  }, []);

  // Load saved categories from localStorage on mount
  useEffect(() => {
    try {
      const savedCats = localStorage.getItem('shopmate_categories');
      if (savedCats) {
        setCategories(JSON.parse(savedCats));
      }
    } catch (e) {}
  }, []);

  // Sync categories to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('shopmate_categories', JSON.stringify(categories));
    } catch (e) {}
  }, [categories]);

  // Automatic Real-Time Broadcast to Main Website (https://shopmate-ecommerce-kohl.vercel.app/)
  // Whenever products or categories are added, edited, or deleted in Admin Panel,
  // instantly push to /api/store AND /api/support AI Knowledge Base!
  const hasMountedStoreSyncRef = useRef<boolean>(false);
  useEffect(() => {
    if (!hasMountedStoreSyncRef.current) {
      hasMountedStoreSyncRef.current = true;
      return;
    }

    const pushToLiveWebsite = async () => {
      try {
        await Promise.all([
          fetch('/api/store', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              products,
              categories,
              productsCount: products.length,
            }),
          }),
          fetch('/api/support', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'sync_admin_knowledge',
              products,
              categories,
            }),
          }),
        ]);
      } catch (err) {
        // silent fallback
      }
    };

    pushToLiveWebsite();
  }, [products, categories]);

  // Real-time synchronization with incoming orders from the website
  useEffect(() => {
    const syncLiveOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const json = await res.json();
          if (json.orders && Array.isArray(json.orders) && json.orders.length > 0) {
            setOrders(prev => {
              const existingIds = new Set(prev.map(o => o.id));
              const freshOrders = json.orders.filter((o: Order) => !existingIds.has(o.id));
              if (freshOrders.length > 0) {
                return [...freshOrders, ...prev];
              }
              return prev;
            });
          }
        }
      } catch (err) {
        // quiet fallback
      }
    };

    syncLiveOrders();
    const timer = setInterval(syncLiveOrders, 8000);
    return () => clearInterval(timer);
  }, []);

  // Real-time synchronization & instant notification when customer knocks on support from the website
  useEffect(() => {
    const syncLiveSupport = async () => {
      try {
        const res = await fetch('/api/support');
        if (!res.ok) return;
        const json = await res.json();
        if (json.unreadCount !== undefined) {
          setUnreadSupportCount(json.unreadCount);
        }
        if (json.aiAutomation && typeof json.aiAutomation.enabled === 'boolean') {
          setAiSupportEnabled(json.aiAutomation.enabled);
        }

        const tickets = json.tickets as any[];
        if (Array.isArray(tickets)) {
          if (isInitialSupportSyncRef.current) {
            // First run: record initial ticket IDs without ringing chime
            tickets.forEach(t => knownTicketIdsRef.current.add(t.id));
            isInitialSupportSyncRef.current = false;
          } else {
            // Subsequent poll: detect brand new inquiries from customer knocks
            const brandNewTickets = tickets.filter(t => !knownTicketIdsRef.current.has(t.id) && t.unread);
            if (brandNewTickets.length > 0) {
              const newest = brandNewTickets[0];
              brandNewTickets.forEach(t => knownTicketIdsRef.current.add(t.id));

              // 1. Play audio chime
              playSupportKnockChime();

              // 2. Trigger browser notification
              const lastMsg =
                newest.messages && newest.messages.length > 0
                  ? newest.messages[newest.messages.length - 1].text
                  : newest.subject;
              triggerDesktopNotification(newest.customerName, newest.subject, lastMsg);

              // 3. Show floating pop-up card
              setIncomingKnock({
                id: newest.id,
                customerName: newest.customerName,
                customerPhone: newest.customerPhone,
                subject: newest.subject,
                message: lastMsg,
                time: 'Just now',
              });
            }
          }
        }
      } catch (err) {
        // quiet fallback
      }
    };

    syncLiveSupport();
    const timer = setInterval(syncLiveSupport, 3500);
    return () => clearInterval(timer);
  }, []);

  // Simulate a live customer knock from the website to test sound & pop-up
  const handleSimulateCustomerKnock = async () => {
    const dummyKnocks = [
      {
        name: 'Tanvir Hasan',
        phone: '+880 1711-889922',
        message: 'আসসালামু আলাইকুম, আমি একটা স্মার্টওয়াচ অর্ডার করতে চাই, কত দিনে ডেলিভারি পাবো?',
        subject: 'Delivery time inquiry for Smartwatch',
        category: 'Product Inquiry',
      },
      {
        name: 'Arifa Sultana',
        phone: '+880 1819-334455',
        message: 'Hi! I made a payment via bKash TrxID: 9X7B2M4K8P. Could you please confirm?',
        subject: 'bKash Payment Verification',
        category: 'Payment Gateway',
      },
      {
        name: 'Mehedi Hasan',
        phone: '+880 1912-778899',
        message: 'Hello ShopMate Support! Is cash on delivery available in Sylhet Sadar?',
        subject: 'Cash on delivery in Sylhet inquiry',
        category: 'Orders & Shipping',
      },
      {
        name: 'Sumaiya Akter',
        phone: '+880 1614-223344',
        message: 'Do you have return or replacement if size 42 does not fit properly?',
        subject: 'Exchange and return policy inquiry',
        category: 'Returns & Refunds',
      },
    ];

    const pick = dummyKnocks[Math.floor(Math.random() * dummyKnocks.length)];
    try {
      await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: pick.name,
          customerPhone: pick.phone,
          customerEmail: `${pick.name.toLowerCase().replace(/\s+/g, '.')}${Math.floor(Math.random() * 90 + 10)}@gmail.com`,
          subject: pick.subject,
          category: pick.category,
          urgency: 'Urgent',
          source: 'Storefront Live Chat',
          message: pick.message,
        }),
      });
      setNotice('🔔 Simulation: New customer knock sent from live website! Watch for instant notification.');
    } catch (e) {
      setNotice('Failed to simulate customer knock');
    }
  };

  // Keyboard shortcut (⌘ K / Ctrl + K) for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>('.searchbox input');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('shopmate_auth_user');
    } catch (e) {}
    setUser(null);
  };

  const filteredProducts = useMemo(
    () =>
      products.filter(p =>
        (p.name + ' ' + p.sku + ' ' + p.category).toLowerCase().includes(query.toLowerCase())
      ),
    [products, query]
  );

  const filteredOrders = useMemo(
    () =>
      orders.filter(o =>
        (o.id + ' ' + o.customer + ' ' + o.phone + ' ' + o.address + ' ' + o.status)
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [orders, query]
  );

  const filteredCustomers = useMemo(
    () =>
      customers.filter(c =>
        (c.name + ' ' + c.email + ' ' + c.phone + ' ' + c.address + ' ' + c.status)
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [customers, query]
  );

  const filteredCategories = useMemo(
    () =>
      categories.filter(c => {
        const matchesQuery = (c.name + ' ' + (c.count || '')).toLowerCase().includes(query.toLowerCase());
        if (categoryFilterTab === 'featured') {
          return matchesQuery && c.featured !== false;
        }
        return matchesQuery;
      }),
    [categories, query, categoryFilterTab]
  );

  // Product Add / Edit Handler
  const handleSaveProduct = (prodData: ProductFormData) => {
    if (prodData.id) {
      setProducts(prev =>
        prev.map(p =>
          p.id === prodData.id
            ? {
                ...p,
                name: prodData.name,
                sku: prodData.sku || p.sku,
                category: prodData.category,
                price: prodData.price,
                discountPercent: prodData.discountPercent || 0,
                discountedPrice: prodData.discountedPrice || prodData.price,
                stock: prodData.stock,
                status: prodData.status,
                image: prodData.image || p.image,
              }
            : p
        )
      );
      setNotice(`Product "${prodData.name}" updated and saved for storefront!`);
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name: prodData.name,
        sku: prodData.sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000),
        category: prodData.category,
        price: prodData.price,
        discountPercent: prodData.discountPercent || 0,
        discountedPrice: prodData.discountedPrice || prodData.price,
        stock: prodData.stock,
        status: prodData.status,
        image: prodData.image,
        emoji: '📦',
      };
      setProducts([newProduct, ...products]);
      setNotice(`Product "${newProduct.name}" added to catalogue!`);
    }
    setEditingProduct(null);
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      discountPercent: product.discountPercent,
      discountedPrice: product.discountedPrice,
      stock: product.stock,
      status: product.status,
      image: product.image || '',
    });
    setShowAddProduct(true);
  };

  // Category Add / Edit / Delete Handlers
  const handleSaveCategory = (catData: {
    id?: number;
    name: string;
    count: string;
    image: string;
    featured?: boolean;
  }) => {
    if (catData.id) {
      setCategories(prev =>
        prev.map(c =>
          c.id === catData.id
            ? {
                ...c,
                name: catData.name,
                count: catData.count,
                image: catData.image,
                featured: catData.featured !== undefined ? catData.featured : c.featured,
              }
            : c
        )
      );
      setNotice(`Category "${catData.name}" updated successfully!`);
    } else {
      const newCategory: CategoryItem = {
        id: Date.now(),
        name: catData.name,
        count: catData.count,
        image: catData.image,
        featured: catData.featured !== undefined ? catData.featured : true,
      };
      setCategories(prev => [newCategory, ...prev]);
      setNotice(`Category "${newCategory.name}" added to storefront catalogue!`);
    }
    setEditingCategory(null);
  };

  const handleEditCategoryClick = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setShowAddCategory(true);
  };

  const handleToggleFeaturedCategory = (id: number) => {
    setCategories(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextFeatured = !c.featured;
          setNotice(
            nextFeatured
              ? `"${c.name}" featured on storefront homepage strip!`
              : `"${c.name}" removed from storefront featured strip.`
          );
          return { ...c, featured: nextFeatured };
        }
        return c;
      })
    );
  };

  const handleDeleteCategory = (id: number) => {
    const cat = categories.find(c => c.id === id);
    if (confirm(`Are you sure you want to delete category "${cat?.name || 'this category'}"?`)) {
      setCategories(prev => prev.filter(c => c.id !== id));
      if (activeCategoryProductFilter === cat?.name) {
        setActiveCategoryProductFilter(null);
      }
      setNotice('Category removed.');
    }
  };

  // Customer Add / Edit / Delete Handlers
  const handleSaveCustomer = (custData: CustomerData) => {
    const exists = customers.some(c => c.id === custData.id);
    if (exists) {
      setCustomers(customers.map(c => (c.id === custData.id ? custData : c)));
      setNotice(`Customer "${custData.name}" details updated successfully!`);
    } else {
      setCustomers([custData, ...customers]);
      setNotice(`Customer "${custData.name}" added to directory!`);
    }
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (id: number) => {
    setCustomers(customers.filter(c => c.id !== id));
    setNotice('Customer profile removed.');
  };

  function updateOrder(id: string, status: Order['status']) {
    setOrders(orders.map(o => (o.id === id ? { ...o, status } : o)));
    setNotice(`${id} marked ${status.toLowerCase()}.`);
    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: id, status }),
    }).catch(() => {});
  }

  function exportOrders() {
    const csv = [
      'Order ID,Customer,Phone,Shipping Address,Date,Total,Payment Method,TrxID,Status',
      ...orders.map(o =>
        [
          o.id,
          `"${o.customer}"`,
          `"${o.phone}"`,
          `"${o.address.replace(/"/g, '""')}"`,
          `"${o.date}"`,
          o.total,
          `"${o.paymentMethod}"`,
          `"${o.trxId || 'N/A'}"`,
          o.status,
        ].join(',')
      ),
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'shopmate-orders.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // Wait until localStorage check is done
  if (!isAuthReady) {
    return null;
  }

  // If not logged in, show Login Screen
  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <div className="shell">
      {/* Sidebar */}
      <aside className={`sidebar ${mobile ? 'open' : ''}`}>
        <div className="brand">
          <div className="brandmark">S</div>
          <div>
            <b>ShopMate</b>
            <small>ADMIN CONSOLE</small>
          </div>
          <button
            className="mobile-close"
            onClick={() => setMobile(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="nav-label">WORKSPACE</div>
        <nav>
          {nav.map(n => (
            <button
              key={n.name}
              className={section === n.name ? 'nav-item active' : 'nav-item'}
              onClick={() => {
                setSection(n.name);
                setMobile(false);
                setQuery('');
              }}
            >
              <n.icon size={18} />
              <span>{n.name}</span>
              {n.name === 'Orders' && <em>{orders.length}</em>}
              {n.name === 'Products' && <em>{products.length}</em>}
              {n.name === 'Customers' && <em>{customers.length}</em>}
            </button>
          ))}
        </nav>

        <div className="nav-label management">STOREFRONT CONTROL</div>
        <button
          className={section === 'Settings' ? 'nav-item active' : 'nav-item'}
          onClick={() => {
            setSection('Settings');
            setMobile(false);
          }}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button
          type="button"
          className="nav-item"
          onClick={() => {
            setShowPaymentMethods(true);
            setMobile(false);
          }}
        >
          <CreditCard size={18} />
          <span>Payment Methods</span>
          <em style={{ background: '#f0edff', color: '#6b5ce7', fontWeight: 700 }}>Control</em>
        </button>

        <button
          type="button"
          className={section === 'Customer Support' ? 'nav-item active' : 'nav-item'}
          onClick={() => {
            setSupportInitialTab('inbox');
            setSection('Customer Support');
            setShowSupport(false);
            setMobile(false);
          }}
          title="Customer Support & AI Automation"
        >
          <Headphones size={18} />
          <span>Customer Support</span>
          {unreadSupportCount > 0 ? (
            <em style={{ background: '#fee2e2', color: '#ef4444', fontWeight: 800 }}>
              {unreadSupportCount} New
            </em>
          ) : (
            <em style={{ background: '#e9f8f1', color: '#22966b', fontWeight: 700 }}>
              {aiSupportEnabled ? 'AI Live' : 'Live'}
            </em>
          )}
        </button>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">{user.avatar}</div>
            <div>
              <b>{user.name}</b>
              <small>{user.email}</small>
            </div>
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Log out of admin"
              aria-label="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {mobile && <div className="scrim" onClick={() => setMobile(false)} />}

      {/* Main Content Area */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <button className="hamburger" onClick={() => setMobile(true)} aria-label="Open sidebar">
            <Menu />
          </button>
          <div className="crumb">
            ShopMate <span>/</span> <b>{section}</b>
          </div>
          <div className="top-actions">
            <div className="searchbox">
              <Search size={17} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products, orders, customers..."
              />
              <kbd>⌘ K</kbd>
            </div>

            {/* Visit Live Storefront Link */}
            <a
              href="https://shopmate-ecommerce-kohl.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn secondary live-store-top-btn"
              title="Open live storefront website (shopmate-ecommerce-kohl.vercel.app)"
              style={{
                height: '34px',
                fontSize: '11px',
                padding: '0 10px',
                gap: '6px',
                textDecoration: 'none',
                color: '#22966b',
                borderColor: '#ccebdc',
                background: '#f2fcf7',
              }}
            >
              <Globe size={14} color="#22966b" />
              <span>Live Store ↗</span>
            </a>

            {/* Storefront Control Center Button */}
            <button
              type="button"
              className="btn secondary storefront-sync-btn"
              onClick={() => setShowStorefrontControl(true)}
              title="Control live storefront announcements, sync & coupons"
              style={{ height: '34px', fontSize: '11px', padding: '0 10px', gap: '6px' }}
            >
              <Radio size={14} color="#6b5ce7" />
              <span>Storefront Control</span>
            </button>

            <button
              type="button"
              className="btn secondary support-top-btn"
              onClick={() => {
                setSupportInitialTab('inbox');
                setSection('Customer Support');
              }}
              title="Customer Support & AI Automation (Connected to Main Website)"
              style={{
                height: '34px',
                fontSize: '11px',
                padding: '0 10px',
                gap: '6px',
                position: 'relative',
              }}
            >
              <Headphones size={14} color="#22966b" />
              <span>Customer Support</span>
              {unreadSupportCount > 0 ? (
                <span
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '1px 5px',
                    fontSize: '9px',
                    fontWeight: 700,
                  }}
                >
                  {unreadSupportCount}
                </span>
              ) : (
                <span style={{ color: '#22966b', fontSize: '9px', fontWeight: 700 }}>24/7</span>
              )}
            </button>

            <button
              className="icon-btn notification"
              onClick={() => setNotice('Connected to live store: shopmate-ecommerce-kohl.vercel.app')}
              title="Notifications"
            >
              <Bell size={19} />
              <i />
            </button>
            <div className="top-avatar" title={`Logged in as ${user.name}`}>
              {user.avatar}
            </div>
            <button
              className="icon-btn"
              onClick={handleLogout}
              title="Log out"
              style={{ color: '#aaa9b8' }}
            >
              <LogOut size={17} />
            </button>
          </div>
        </header>

        <div className="content">
          {/* Live Storefront Status Banner */}
          <div
            style={{
              padding: '10px 16px',
              borderRadius: '9px',
              background: '#f0fbf5',
              border: '1px solid #d4f2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              fontSize: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22966b',
                }}
              />
              <span style={{ color: '#267b58', fontWeight: 600 }}>
                Live Storefront Connected:
              </span>
              <a
                href="https://shopmate-ecommerce-kohl.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontWeight: 700,
                  color: '#1b6446',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                shopmate-ecommerce-kohl.vercel.app <ExternalLink size={12} />
              </a>
            </div>
            <button
              type="button"
              onClick={() => setShowStorefrontControl(true)}
              style={{
                border: 'none',
                background: '#22966b',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Manage Storefront ⚙️
            </button>
          </div>

          {/* Page Heading */}
          <div className="page-heading">
            <div>
              <div className="eyebrow">CONTROLLING LIVE STOREFRONT</div>
              <h1>
                {section === 'Overview' ? `Good morning, ${user.name.split(' ')[0]} 👋` : section}
              </h1>
              <p>
                {section === 'Overview'
                  ? 'Real-time sales, order streams, and storefront catalogue metrics.'
                  : section === 'Orders'
                  ? 'Manage customer orders, addresses, and contact phone numbers.'
                  : section === 'Products'
                  ? 'Manage product catalogue, edit pricing, discounts and photos for the live storefront.'
                  : section === 'Customers'
                  ? 'View and update complete customer profiles and addresses.'
                  : `Manage your store ${section.toLowerCase()} from one place.`}
              </p>
            </div>
            <div className="heading-actions">
              <button className="btn secondary" onClick={exportOrders}>
                <Download size={16} /> Export CSV
              </button>
              {section === 'Categories' ? (
                <button
                  className="btn primary"
                  onClick={() => {
                    setEditingCategory(null);
                    setShowAddCategory(true);
                  }}
                >
                  <Plus size={17} /> Add category
                </button>
              ) : section === 'Customers' ? (
                <button
                  className="btn primary"
                  onClick={() => {
                    setEditingCustomer(null);
                    setShowCustomerModal(true);
                  }}
                >
                  <Plus size={17} /> Add customer
                </button>
              ) : (
                <button
                  className="btn primary"
                  onClick={() => {
                    setSection('Products');
                    setEditingProduct(null);
                    setShowAddProduct(true);
                  }}
                >
                  <Plus size={17} /> Add product
                </button>
              )}
            </div>
          </div>

          {/* Flash Notice */}
          {notice && (
            <div className="notice" onClick={() => setNotice('')}>
              <span>{notice}</span>
              <button aria-label="Dismiss notice">
                <X size={14} />
              </button>
            </div>
          )}

          {/* SECTION: Overview */}
          {section === 'Overview' && (
            <>
              <div className="stats">
                <Stat title="Total revenue" value="$24,580.00" change="12.8%" up />
                <Stat title="Total orders" value={String(orders.length + 1243)} change="8.2%" up />
                <Stat title="Live Products" value={String(products.length)} change="4.5%" up />
                <Stat title="Registered Customers" value={String(customers.length)} change="2.4%" up={false} />
              </div>

              <div className="dashboard-grid">
                <section className="panel revenue-panel">
                  <div className="panel-head">
                    <div>
                      <h2>Revenue overview</h2>
                      <p>Track your store’s performance</p>
                    </div>
                    <select defaultValue="7 days">
                      <option>7 days</option>
                      <option>30 days</option>
                      <option>12 months</option>
                    </select>
                  </div>
                  <div className="revenue-total">
                    <strong>$24,580.00</strong>
                    <span>
                      <TrendingUp size={14} /> 12.8%
                    </span>
                    <small>vs. previous period</small>
                  </div>
                  <div className="chart">
                    <div className="y-labels">
                      <span>$8k</span>
                      <span>$6k</span>
                      <span>$4k</span>
                      <span>$2k</span>
                      <span>$0</span>
                    </div>
                    <div className="chart-area">
                      <div className="gridlines">
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                      <svg
                        viewBox="0 0 700 210"
                        preserveAspectRatio="none"
                        aria-label="Revenue trend chart"
                      >
                        <defs>
                          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6b5ce7" stopOpacity=".22" />
                            <stop offset="100%" stopColor="#6b5ce7" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 164 C45 150 50 126 100 139 S155 115 200 124 S255 83 300 104 S355 120 400 78 S455 91 500 67 S555 86 600 42 S655 53 700 20 L700 210 L0 210Z"
                          fill="url(#fill)"
                        />
                        <path
                          d="M0 164 C45 150 50 126 100 139 S155 115 200 124 S255 83 300 104 S355 120 400 78 S455 91 500 67 S555 86 600 42 S655 53 700 20"
                          fill="none"
                          stroke="#6b5ce7"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="x-labels">
                        <span>Nov 08</span>
                        <span>Nov 09</span>
                        <span>Nov 10</span>
                        <span>Nov 11</span>
                        <span>Nov 12</span>
                        <span>Nov 13</span>
                        <span>Nov 14</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="panel source-panel">
                  <div className="panel-head">
                    <div>
                      <h2>Sales by channel</h2>
                      <p>Where your orders come from</p>
                    </div>
                    <MoreHorizontal size={19} />
                  </div>
                  <div className="donut-wrap">
                    <div className="donut">
                      <div>
                        <b>1,248</b>
                        <small>Orders</small>
                      </div>
                    </div>
                  </div>
                  <div className="legend">
                    <Legend color="#6b5ce7" label="Online store" value="68%" />
                    <Legend color="#a69cf4" label="Social media" value="22%" />
                    <Legend color="#e7e5f4" label="Direct" value="10%" />
                  </div>
                </section>
              </div>

              <section className="panel orders-panel">
                <div className="panel-head">
                  <div>
                    <h2>Recent orders (with address, phone & payment gateway)</h2>
                    <p>You have {orders.length} recent orders</p>
                  </div>
                  <button className="text-btn" onClick={() => setSection('Orders')}>
                    View all orders →
                  </button>
                </div>
                <OrderTable orders={orders.slice(0, 4)} updateOrder={updateOrder} />
              </section>

              <section className="panel products-panel">
                <div className="panel-head">
                  <div>
                    <h2>Live storefront products ({products.length} items)</h2>
                    <p>Connected to shopmate-ecommerce-kohl.vercel.app</p>
                  </div>
                  <button className="text-btn" onClick={() => setSection('Products')}>
                    Manage all products →
                  </button>
                </div>
                <ProductTable
                  products={products.slice(0, 5)}
                  setProducts={setProducts}
                  onEditProduct={handleEditProductClick}
                />
              </section>
            </>
          )}

          {/* SECTION: Products */}
          {section === 'Products' && (
            <section className="panel full-panel">
              <div className="panel-head">
                <div>
                  <h2>Live Storefront Product Catalogue</h2>
                  <p>
                    {products.length} active products · Syncs directly with shopmate-ecommerce-kohl.vercel.app
                  </p>
                </div>
                <button
                  className="btn primary"
                  onClick={() => {
                    setEditingProduct(null);
                    setShowAddProduct(true);
                  }}
                >
                  <Plus size={16} /> Add product
                </button>
              </div>
              <ProductTable
                products={filteredProducts}
                setProducts={setProducts}
                onEditProduct={handleEditProductClick}
              />
            </section>
          )}

          {/* SECTION: Orders */}
          {section === 'Orders' && (
            <section className="panel full-panel">
              <div className="panel-head">
                <div>
                  <h2>Customer Orders & Gateway Settlements</h2>
                  <p>Review customer shipping addresses, phone numbers, and bKash / Nagad / Card transactions</p>
                </div>
                <button className="btn secondary" onClick={exportOrders}>
                  <Download size={16} /> Export CSV
                </button>
              </div>
              <OrderTable orders={filteredOrders} updateOrder={updateOrder} />
            </section>
          )}

          {/* SECTION: Customers */}
          {section === 'Customers' && (
            <section className="panel full-panel">
              <div className="panel-head">
                <div>
                  <h2>Customer Directory & Information Management</h2>
                  <p>
                    {customers.length} registered customers · Update contact info, phone, and delivery addresses
                  </p>
                </div>
                <button
                  className="btn primary"
                  onClick={() => {
                    setEditingCustomer(null);
                    setShowCustomerModal(true);
                  }}
                >
                  <Plus size={16} /> Add customer
                </button>
              </div>

              {/* Enhanced Customer Table */}
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>CUSTOMER</th>
                      <th>PHONE</th>
                      <th>DELIVERY ADDRESS</th>
                      <th>ORDERS</th>
                      <th>TOTAL SPENT</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map(cust => (
                      <tr key={cust.id}>
                        <td>
                          <div className="product-cell">
                            <div className="avatar" style={{ flexShrink: 0 }}>
                              {cust.avatar}
                            </div>
                            <div>
                              <b>{cust.name}</b>
                              <small style={{ display: 'block', color: '#85859a', fontSize: '11px' }}>
                                {cust.email}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <a
                            href={`tel:${cust.phone}`}
                            style={{
                              color: 'inherit',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontWeight: 600,
                            }}
                          >
                            <Phone size={13} color="#6b5ce7" />
                            {cust.phone}
                          </a>
                        </td>
                        <td style={{ maxWidth: '240px', whiteSpace: 'normal' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                            <MapPin size={14} color="#e17d70" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ fontSize: '11px', color: '#555' }}>{cust.address}</span>
                          </div>
                        </td>
                        <td>
                          <b>{cust.ordersCount}</b> orders
                        </td>
                        <td>
                          <b>{money(cust.totalSpent)}</b>
                        </td>
                        <td>
                          <span
                            className={`status ${
                              cust.status === 'VIP'
                                ? 'green'
                                : cust.status === 'Active'
                                ? 'blue'
                                : 'gray'
                            }`}
                          >
                            {cust.status === 'VIP' ? '⭐ VIP' : cust.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              className="btn secondary"
                              style={{
                                height: '28px',
                                padding: '0 8px',
                                fontSize: '11px',
                                gap: '4px',
                              }}
                              onClick={() => {
                                setEditingCustomer(cust);
                                setShowCustomerModal(true);
                              }}
                              title="Update customer information"
                            >
                              <Pencil size={12} /> Edit Info
                            </button>
                            <button
                              type="button"
                              className="row-action"
                              title="Delete customer"
                              onClick={() => handleDeleteCustomer(cust.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCustomers.length === 0 && (
                  <div className="empty">No customers found matching your search.</div>
                )}
              </div>
            </section>
          )}

          {/* SECTION: Categories */}
          {section === 'Categories' && (
            <div style={{ display: 'grid', gap: '22px' }}>
              {/* FEATURED CATEGORIES SHOWCASE (Exact Replica of Storefront Strip) */}
              <section className="featured-showcase-panel">
                <div className="featured-showcase-head">
                  <div className="featured-showcase-title-box">
                    <h2>Featured Categories</h2>
                    <p>Shop by category and find exactly what you need.</p>
                  </div>
                  <div className="featured-showcase-actions">
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#10b981',
                        background: '#ecfdf5',
                        border: '1px solid #d1fae5',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#10b981',
                        }}
                      />
                      Live on shopmate-ecommerce-kohl.vercel.app
                    </span>
                    <a
                      href="https://shopmate-ecommerce-kohl.vercel.app/categories"
                      target="_blank"
                      rel="noreferrer"
                      className="featured-view-all-link"
                      title="View all categories on live store"
                    >
                      View All <ArrowRight size={14} />
                    </a>
                    <button
                      className="btn primary"
                      style={{ height: '36px', padding: '0 12px', fontSize: '12px' }}
                      onClick={() => {
                        setEditingCategory(null);
                        setShowAddCategory(true);
                      }}
                    >
                      <Plus size={15} /> Add Category
                    </button>
                  </div>
                </div>

                {/* 8 Featured Category Cards Grid (Matching the Screenshot) */}
                <div className="featured-categories-strip">
                  {categories
                    .filter(c => c.featured !== false)
                    .map(cat => {
                      const isActive = activeCategoryProductFilter === cat.name;
                      return (
                        <div
                          className={`featured-category-pill ${isActive ? 'active-filter' : ''}`}
                          key={cat.id}
                          onClick={() => {
                            if (activeCategoryProductFilter === cat.name) {
                              setActiveCategoryProductFilter(null);
                            } else {
                              setActiveCategoryProductFilter(cat.name);
                            }
                          }}
                          title={`Click to filter products by ${cat.name}`}
                        >
                          <div className="featured-star-badge" title="Featured on Storefront Strip">
                            <Star size={11} fill="#f59e0b" color="#f59e0b" />
                          </div>

                          <div className="featured-pill-img-wrap">
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="featured-pill-img"
                              onError={e => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80';
                              }}
                            />
                          </div>

                          <b className="featured-pill-name">{cat.name}</b>
                          <small className="featured-pill-count">{cat.count}</small>

                          {/* Quick Admin Hover Controls */}
                          <div
                            className="featured-pill-quick-actions"
                            onClick={e => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="featured-pill-btn"
                              title="Edit category"
                              onClick={() => handleEditCategoryClick(cat)}
                            >
                              <Edit3 size={11} />
                            </button>
                            <button
                              type="button"
                              className="featured-pill-btn"
                              title="Toggle featured visibility"
                              onClick={() => handleToggleFeaturedCategory(cat.id)}
                            >
                              <Star
                                size={11}
                                fill={cat.featured ? '#f59e0b' : 'none'}
                                color="#f59e0b"
                              />
                            </button>
                            <button
                              type="button"
                              className="featured-pill-btn delete"
                              title="Delete category"
                              onClick={() => handleDeleteCategory(cat.id)}
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>

              {/* ACTIVE FILTER DRAWER (If admin clicked a category pill) */}
              {activeCategoryProductFilter && (
                <section
                  className="panel full-panel"
                  style={{
                    background: '#f8f7ff',
                    border: '1px solid #d9d5f7',
                    padding: '18px 22px',
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <span
                        style={{
                          background: '#6b5ce7',
                          color: '#fff',
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '13px',
                        }}
                      >
                        🏷️
                      </span>
                      <div>
                        <b style={{ fontSize: '14px', color: '#1e293b' }}>
                          Products in Category: {activeCategoryProductFilter}
                        </b>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>
                          Showing products assigned to this category on the storefront
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn secondary"
                        style={{ height: '30px', fontSize: '11px', padding: '0 10px' }}
                        onClick={() => {
                          setSection('Products');
                          setQuery(activeCategoryProductFilter);
                        }}
                      >
                        Open in Products View ↗
                      </button>
                      <button
                        type="button"
                        className="btn secondary"
                        style={{ height: '30px', fontSize: '11px', padding: '0 10px' }}
                        onClick={() => setActiveCategoryProductFilter(null)}
                      >
                        <X size={12} /> Clear Filter
                      </button>
                    </div>
                  </div>

                  {/* Filtered Products Horizontal Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    {products
                      .filter(
                        p =>
                          p.category.toLowerCase() ===
                          activeCategoryProductFilter.toLowerCase()
                      )
                      .map(p => (
                        <div
                          key={p.id}
                          style={{
                            background: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '12px',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                          }}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              background: '#f1f5f9',
                              flexShrink: 0,
                            }}
                            onError={e => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80';
                            }}
                          />
                          <div style={{ overflow: 'hidden', flex: 1 }}>
                            <b
                              style={{
                                display: 'block',
                                fontSize: '12px',
                                color: '#1e293b',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {p.name}
                            </b>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginTop: '3px',
                              }}
                            >
                              <strong style={{ fontSize: '12px', color: '#6b5ce7' }}>
                                ${p.discountedPrice || p.price}
                              </strong>
                              {p.discountPercent ? (
                                <span
                                  style={{
                                    fontSize: '9px',
                                    color: '#10b981',
                                    fontWeight: 700,
                                  }}
                                >
                                  -{p.discountPercent}%
                                </span>
                              ) : null}
                            </div>
                            <small
                              style={{
                                fontSize: '10px',
                                color: '#64748b',
                                display: 'block',
                                marginTop: '2px',
                              }}
                            >
                              Stock: {p.stock} units
                            </small>
                          </div>
                          <button
                            type="button"
                            className="btn secondary"
                            style={{
                              height: '28px',
                              padding: '0 8px',
                              fontSize: '11px',
                              flexShrink: 0,
                            }}
                            onClick={() => handleEditProductClick(p)}
                            title="Edit product"
                          >
                            <Pencil size={11} />
                          </button>
                        </div>
                      ))}
                    {products.filter(
                      p =>
                        p.category.toLowerCase() ===
                        activeCategoryProductFilter.toLowerCase()
                    ).length === 0 && (
                      <div
                        style={{
                          gridColumn: '1 / -1',
                          padding: '16px',
                          textAlign: 'center',
                          color: '#64748b',
                          fontSize: '12px',
                          background: '#fff',
                          borderRadius: '8px',
                        }}
                      >
                        No products are currently assigned to "{activeCategoryProductFilter}".
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* CATEGORY DIRECTORY & MANAGEMENT PANEL */}
              <section className="panel full-panel">
                <div className="panel-head">
                  <div>
                    <h2>Category Directory & Photo Management</h2>
                    <p>
                      Organize categories, upload cover photos, and toggle storefront featured strip
                      visibility ({categories.length} total categories)
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="tab-pills">
                      <button
                        type="button"
                        className={`tab-pill ${categoryFilterTab === 'all' ? 'active' : ''}`}
                        onClick={() => setCategoryFilterTab('all')}
                      >
                        All ({categories.length})
                      </button>
                      <button
                        type="button"
                        className={`tab-pill ${categoryFilterTab === 'featured' ? 'active' : ''}`}
                        onClick={() => setCategoryFilterTab('featured')}
                      >
                        ★ Featured ({categories.filter(c => c.featured !== false).length})
                      </button>
                    </div>

                    <button
                      className="btn primary"
                      onClick={() => {
                        setEditingCategory(null);
                        setShowAddCategory(true);
                      }}
                    >
                      <Plus size={16} /> Add Category
                    </button>
                  </div>
                </div>

                {/* Category Grid */}
                <div className="category-grid">
                  {filteredCategories.map(cat => (
                    <div className="category-card" key={cat.id}>
                      <div style={{ position: 'relative' }}>
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="category-card-img"
                          onError={e => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleToggleFeaturedCategory(cat.id)}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: cat.featured ? '#6b5ce7' : 'rgba(255,255,255,0.9)',
                            color: cat.featured ? '#fff' : '#64748b',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '4px 8px',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          }}
                          title="Toggle featured status"
                        >
                          <Star
                            size={11}
                            fill={cat.featured ? '#fff' : 'none'}
                            color={cat.featured ? '#fff' : '#64748b'}
                          />
                          {cat.featured ? 'Featured' : 'Standard'}
                        </button>
                      </div>

                      <div className="category-card-content">
                        <div>
                          <b>{cat.name}</b>
                          <small>{cat.count}</small>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            type="button"
                            className="btn secondary"
                            style={{
                              height: '28px',
                              padding: '0 8px',
                              fontSize: '11px',
                              gap: '4px',
                            }}
                            onClick={() => handleEditCategoryClick(cat)}
                            title="Edit category"
                          >
                            <Pencil size={11} /> Edit
                          </button>
                          <button
                            type="button"
                            className="category-delete-btn"
                            title="Delete category"
                            onClick={() => handleDeleteCategory(cat.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredCategories.length === 0 && (
                  <div className="empty">No categories match your search or filter.</div>
                )}
              </section>
            </div>
          )}

          {/* SECTION: Analytics */}
          {section === 'Analytics' && (
            <section className="panel full-panel">
              <div className="panel-head">
                <div>
                  <h2>Store analytics</h2>
                  <p>Performance snapshot · Live storefront metrics</p>
                </div>
              </div>
              <div className="stats analytics-stats">
                <Stat title="Conversion rate" value="3.42%" change="0.6%" up />
                <Stat title="Average order value" value="$58.40" change="5.1%" up />
                <Stat title="Returning customers" value="32.8%" change="1.2%" up />
                <Stat title="Refund rate" value="1.4%" change="0.3%" up={false} />
              </div>
              <p className="disclaimer">
                Connected to shopmate-ecommerce-kohl.vercel.app. Real-time metrics computed from current catalogue orders.
              </p>
            </section>
          )}

          {/* SECTION: Settings */}
          {section === 'Settings' && (
            <section className="panel full-panel">
              <div className="panel-head">
                <div>
                  <h2>Store Settings & Live Control</h2>
                  <p>Configuration for ShopMate Store (shopmate-ecommerce-kohl.vercel.app)</p>
                </div>
              </div>
              <div className="settings-form">
                <label>
                  Store Name
                  <input defaultValue="ShopMate Store" />
                </label>
                <label>
                  Storefront URL
                  <input defaultValue="https://shopmate-ecommerce-kohl.vercel.app/" readOnly />
                </label>
                <label>
                  Support Email
                  <input defaultValue="support@shopmate.com" />
                </label>
                <label>
                  Currency
                  <select defaultValue="USD">
                    <option>USD ($)</option>
                    <option>BDT (৳)</option>
                    <option>EUR (€)</option>
                  </select>
                </label>
                <button
                  className="btn primary"
                  onClick={() => setNotice('Settings saved locally and applied to storefront!')}
                >
                  Save changes
                </button>
              </div>

              {/* Storefront, Payment Gateway & Support Control Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px',
                  marginTop: '28px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--line)',
                }}
              >
                {/* Storefront card */}
                <div
                  style={{
                    padding: '18px',
                    borderRadius: '10px',
                    border: '1px solid #d5d0fa',
                    background: '#f8f6ff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: '#6b5ce7',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <Globe size={18} />
                    </div>
                    <div>
                      <b style={{ fontSize: '13px' }}>Storefront Control Hub</b>
                      <small style={{ color: '#22966b', display: 'block', fontSize: '10px', fontWeight: 700 }}>
                        ● Live on Vercel
                      </small>
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#666', margin: '0 0 14px' }}>
                    Control announcement banners, checkout discount coupons, maintenance mode, and sync live catalogue.
                  </p>
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() => setShowStorefrontControl(true)}
                    style={{ width: '100%', height: '36px' }}
                  >
                    <Radio size={15} /> Storefront Control Center
                  </button>
                </div>

                {/* Payment card */}
                <div
                  style={{
                    padding: '18px',
                    borderRadius: '10px',
                    border: '1px solid var(--line)',
                    background: '#fcfbfe',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: '#f0edff',
                        color: '#6b5ce7',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <b style={{ fontSize: '13px' }}>Payment Gateways</b>
                      <small style={{ color: '#888', display: 'block', fontSize: '10px' }}>
                        bKash, Nagad, Cards & COD
                      </small>
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#666', margin: '0 0 14px' }}>
                    Control checkout payment methods, toggle sandbox test mode, and set transaction charges.
                  </p>
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() => setShowPaymentMethods(true)}
                    style={{ width: '100%', height: '36px' }}
                  >
                    <CreditCard size={15} /> Payment Method Control
                  </button>
                </div>

                {/* Support card */}
                <div
                  style={{
                    padding: '18px',
                    borderRadius: '10px',
                    border: '1px solid var(--line)',
                    background: '#f9fefe',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: '#e9f8f1',
                        color: '#22966b',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <Headphones size={18} />
                    </div>
                    <div>
                      <b style={{ fontSize: '13px' }}>Customer Support &amp; AI Automation</b>
                      <small
                        style={{
                          color: '#22966b',
                          display: 'block',
                          fontSize: '10px',
                          fontWeight: 700,
                        }}
                      >
                        ● 24/7 Live Assistance · AI Auto-Reply: {aiSupportEnabled ? 'ON' : 'OFF'}
                      </small>
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#666', margin: '0 0 14px' }}>
                    Manage live customer chats, WhatsApp &amp; hotline desk, and configure AI automated responses in Bangla &amp; English.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn secondary"
                      onClick={() => {
                        setSupportInitialTab('inbox');
                        setSection('Customer Support');
                      }}
                      style={{ width: '100%', height: '36px', fontSize: '11px' }}
                    >
                      <Headphones size={14} color="#22966b" /> Support Inbox
                    </button>
                    <button
                      type="button"
                      className="btn primary"
                      onClick={() => {
                        setSupportInitialTab('ai');
                        setSection('Customer Support');
                      }}
                      style={{ width: '100%', height: '36px', fontSize: '11px', gap: '5px' }}
                    >
                      <Sparkles size={14} /> AI Automation
                    </button>
                  </div>
                </div>
              </div>

              {/* Social Media Links Manager */}
              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--line)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginBottom: '14px',
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#202033' }}>
                      🌐 Social Media Links
                    </h3>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
                      Add, edit, or toggle your store&apos;s social media profiles — syncs live to the website footer.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn primary"
                    style={{ height: '34px', fontSize: '11px', padding: '0 14px' }}
                    onClick={() =>
                      syncSocialLinksToStore(
                        socialLinks,
                        '✅ Social media links saved & synced to live website!'
                      )
                    }
                  >
                    <CheckCircle2 size={14} /> Save &amp; Sync Social Links
                  </button>
                </div>

                {/* Add New Social Media Link Form */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(150px, 210px) 1fr auto',
                    gap: '10px',
                    marginBottom: '14px',
                    padding: '12px',
                    background: '#f8f7ff',
                    border: '1px dashed #d5cef7',
                    borderRadius: '10px',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Platform (e.g. TikTok, Telegram)"
                    value={newSocialPlatform}
                    onChange={e => setNewSocialPlatform(e.target.value)}
                    style={{
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      padding: '0 10px',
                      fontSize: '12px',
                      background: '#fff',
                      fontFamily: 'inherit',
                    }}
                  />
                  <input
                    type="url"
                    placeholder="https://tiktok.com/@shopmate"
                    value={newSocialUrl}
                    onChange={e => setNewSocialUrl(e.target.value)}
                    style={{
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      padding: '0 10px',
                      fontSize: '12px',
                      background: '#fff',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    type="button"
                    className="btn primary"
                    style={{ height: '36px', padding: '0 14px', fontSize: '12px' }}
                    onClick={() => {
                      const plat = newSocialPlatform.trim();
                      const rawUrl = newSocialUrl.trim();
                      if (!plat || !rawUrl) {
                        setNotice('Please enter both platform name and link URL.');
                        return;
                      }
                      const normalizedUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
                      const next = [
                        ...socialLinks,
                        {
                          id: `${plat.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now()}`,
                          platform: plat,
                          url: normalizedUrl,
                          active: true,
                        },
                      ];
                      setNewSocialPlatform('');
                      setNewSocialUrl('');
                      syncSocialLinksToStore(next, `✅ ${plat} link added & synced to live website!`);
                    }}
                  >
                    <Plus size={15} /> Add Link
                  </button>
                </div>

                {/* Existing Social Media Links List */}
                <div style={{ display: 'grid', gap: '10px' }}>
                  {socialLinks.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(120px, 150px) 1fr auto',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--line)',
                        background: item.active ? '#fff' : '#f8fafc',
                        opacity: item.active ? 1 : 0.65,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={15} color={item.active ? '#6b5ce7' : '#94a3b8'} />
                        <b style={{ fontSize: '12px', color: '#202033' }}>{item.platform}</b>
                      </div>
                      <input
                        type="url"
                        value={item.url}
                        onChange={e => {
                          const val = e.target.value;
                          setSocialLinks(prev =>
                            prev.map(x => (x.id === item.id ? { ...x, url: val } : x))
                          );
                        }}
                        placeholder={`https://${item.platform.toLowerCase()}.com/...`}
                        style={{
                          height: '34px',
                          borderRadius: '7px',
                          border: '1px solid #e2e8f0',
                          padding: '0 10px',
                          fontSize: '12px',
                          fontFamily: 'inherit',
                          width: '100%',
                        }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          title={`Open ${item.platform}`}
                          className="row-action"
                          style={{ color: '#6b5ce7', display: 'grid', placeItems: 'center' }}
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            const next = socialLinks.map(x =>
                              x.id === item.id ? { ...x, active: !x.active } : x
                            );
                            syncSocialLinksToStore(
                              next,
                              `${item.platform} ${!item.active ? 'enabled' : 'hidden'} on storefront.`
                            );
                          }}
                          style={{
                            border: 'none',
                            borderRadius: '6px',
                            padding: '5px 10px',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: item.active ? '#dcfce7' : '#e2e8f0',
                            color: item.active ? '#166534' : '#475569',
                          }}
                        >
                          {item.active ? 'Active' : 'Hidden'}
                        </button>
                        <button
                          type="button"
                          className="row-action"
                          title={`Remove ${item.platform}`}
                          onClick={() => {
                            const next = socialLinks.filter(x => x.id !== item.id);
                            syncSocialLinksToStore(next, `${item.platform} link removed.`);
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* SECTION: Customer Support & AI Automation Full Page */}
          {section === 'Customer Support' && (
            <CustomerSupportModal
              isOpen={true}
              embedded={true}
              onClose={() => setSection('Overview')}
              initialTicketId={targetSupportTicketId}
              initialTab={supportInitialTab}
              onSimulateKnock={handleSimulateCustomerKnock}
              onAiStatusChange={setAiSupportEnabled}
              adminProducts={products}
              adminCategories={categories}
              onSendTicket={ticket =>
                setNotice(`Support ticket ${ticket.id} submitted! A support agent has been assigned.`)
              }
              onNotice={msg => setNotice(msg)}
            />
          )}

          <footer>
            © 2026 ShopMate Admin. <span>Controlling https://shopmate-ecommerce-kohl.vercel.app/ · Logged in as {user.name}</span>
          </footer>
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      <AddProductModal
        isOpen={showAddProduct}
        onClose={() => {
          setShowAddProduct(false);
          setEditingProduct(null);
        }}
        categories={categories}
        initialData={editingProduct}
        onSaveProduct={handleSaveProduct}
      />

      {/* Add / Edit Category Modal */}
      <AddCategoryModal
        isOpen={showAddCategory}
        onClose={() => {
          setShowAddCategory(false);
          setEditingCategory(null);
        }}
        onSaveCategory={handleSaveCategory}
        initialData={editingCategory}
      />

      {/* Customer Modal (Add & Edit) */}
      <CustomerModal
        isOpen={showCustomerModal}
        onClose={() => {
          setShowCustomerModal(false);
          setEditingCustomer(null);
        }}
        initialData={editingCustomer}
        onSaveCustomer={handleSaveCustomer}
      />

      {/* Customer Support Modal */}
      <CustomerSupportModal
        isOpen={showSupport}
        onClose={() => {
          setShowSupport(false);
          setTargetSupportTicketId(null);
        }}
        initialTicketId={targetSupportTicketId}
        initialTab={supportInitialTab}
        onSimulateKnock={handleSimulateCustomerKnock}
        onAiStatusChange={setAiSupportEnabled}
        adminProducts={products}
        adminCategories={categories}
        onSendTicket={ticket =>
          setNotice(`Support ticket ${ticket.id} submitted! A support agent has been assigned.`)
        }
        onNotice={msg => setNotice(msg)}
      />

      {/* Payment Methods Control Modal */}
      <PaymentMethodsModal
        isOpen={showPaymentMethods}
        onClose={() => setShowPaymentMethods(false)}
        onSave={() => setNotice('Payment gateway configurations saved and applied to checkout!')}
      />

      {/* Storefront Control Modal */}
      <StorefrontControlModal
        isOpen={showStorefrontControl}
        onClose={() => setShowStorefrontControl(false)}
        productsCount={products.length}
        categoriesCount={categories.length}
        onSyncStorefront={async cfg => {
          try {
            await fetch('/api/store', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...cfg,
                products,
                categories,
              }),
            });
          } catch (e) {
            console.error('Failed to broadcast to /api/store', e);
          }
          setNotice(`Storefront "${cfg.storeName}" synced! Announcement, products & coupons updated.`);
        }}
      />

      {/* Floating Real-Time Knock Notification Alert */}
      {incomingKnock && (
        <aside
          aria-label="Incoming Customer Knock Alert"
          className="support-knock-alert"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="knock-bell-icon">
                <Bell size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="knock-pulse-badge">
                    <span /> LIVE KNOCK
                  </span>
                  <small style={{ color: '#64748b', fontSize: '11px' }}>{incomingKnock.time}</small>
                </div>
                <b style={{ fontSize: '14px', color: '#1e293b', display: 'block', marginTop: '2px' }}>
                  {incomingKnock.customerName}
                </b>
              </div>
            </div>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setIncomingKnock(null)}
              style={{ padding: '4px', color: '#94a3b8' }}
              title="Dismiss alert"
            >
              <X size={16} />
            </button>
          </div>

          <div
            style={{
              background: '#f8fafc',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>
              {incomingKnock.subject}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '12px',
                color: '#64748b',
                fontStyle: 'italic',
                lineHeight: 1.4,
              }}
            >
              &ldquo;{incomingKnock.message}&rdquo;
            </p>
            {incomingKnock.customerPhone && (
              <small style={{ fontSize: '11px', color: '#0ea5e9', display: 'block', marginTop: '5px', fontWeight: 600 }}>
                📞 {incomingKnock.customerPhone}
              </small>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '2px' }}>
            <button
              type="button"
              onClick={() => setIncomingKnock(null)}
              style={{
                background: 'transparent',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
            <button
              type="button"
              className="knock-action-btn"
              onClick={() => {
                setTargetSupportTicketId(incomingKnock.id);
                setSupportInitialTab('inbox');
                setSection('Customer Support');
                setShowSupport(false);
                setIncomingKnock(null);
              }}
            >
              <Headphones size={13} /> Open &amp; Reply to Customer &rarr;
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

function Stat({
  title,
  value,
  change,
  up,
}: {
  title: string;
  value: string;
  change: string;
  up: boolean;
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <span className="stat-icon">{up ? <TrendingUp size={17} /> : <TrendingDown size={17} />}</span>
      </div>
      <strong>{value}</strong>
      <div className="stat-change">
        {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <b className={up ? 'positive' : 'negative'}>{change}</b>
        <span>vs last month</span>
      </div>
    </div>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="legend-row">
      <i style={{ background: color }} />
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function ProductTable({
  products,
  setProducts,
  onEditProduct,
}: {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onEditProduct: (p: Product) => void;
}) {
  const [catFilter, setCatFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);

  const uniqueCategories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      counts.set(p.category, (counts.get(p.category) || 0) + 1);
    }
    return Array.from(counts.entries());
  }, [products]);

  const categoryFiltered = useMemo(() => {
    if (catFilter === 'All') return products;
    return products.filter(p => p.category === catFilter);
  }, [products, catFilter]);

  const totalPages = Math.max(1, Math.ceil(categoryFiltered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedProducts = useMemo(() => {
    if (pageSize >= categoryFiltered.length) return categoryFiltered;
    const start = (safePage - 1) * pageSize;
    return categoryFiltered.slice(start, start + pageSize);
  }, [categoryFiltered, safePage, pageSize]);

  return (
    <div>
      {/* Category Filter Pills, Grid/List Switcher & Page Size Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <button
            type="button"
            onClick={() => {
              setCatFilter('All');
              setPage(1);
            }}
            style={{
              padding: '5px 11px',
              borderRadius: '16px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              border: catFilter === 'All' ? '1px solid #6b5ce7' : '1px solid #e2e8f0',
              background: catFilter === 'All' ? '#6b5ce7' : '#fff',
              color: catFilter === 'All' ? '#fff' : '#475569',
            }}
          >
            All ({products.length})
          </button>
          {uniqueCategories.map(([cat, count]) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCatFilter(cat);
                setPage(1);
              }}
              style={{
                padding: '5px 11px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                border: catFilter === cat ? '1px solid #6b5ce7' : '1px solid #e2e8f0',
                background: catFilter === cat ? '#f0edff' : '#fff',
                color: catFilter === cat ? '#6b5ce7' : '#475569',
              }}
            >
              {cat} ({count})
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748b' }}>
          <span>
            Showing <b>{pagedProducts.length}</b> of <b>{categoryFiltered.length}</b>
          </span>
          <div className="tab-pills" role="group" aria-label="Product layout view">
            <button
              type="button"
              className={`tab-pill ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid Layout View"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <LayoutGrid size={13} /> Grid
            </button>
            <button
              type="button"
              className={`tab-pill ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table List View"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <List size={13} /> List
            </button>
          </div>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            style={{
              height: '28px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              padding: '0 8px',
              fontSize: '11px',
              fontFamily: 'inherit',
            }}
          >
            <option value={24}>24 / page</option>
            <option value={48}>48 / page</option>
            <option value={96}>96 / page</option>
            <option value={500}>Show All</option>
          </select>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <>
          <div className="admin-products-grid">
            {pagedProducts.map(p => {
              const hasDiscount = (p.discountPercent || 0) > 0;
              const salePrice =
                p.discountedPrice ||
                (hasDiscount ? p.price * (1 - (p.discountPercent || 0) / 100) : p.price);
              const statusBg =
                p.status === 'Active'
                  ? 'rgba(220, 252, 231, 0.94)'
                  : p.status === 'Low stock'
                  ? 'rgba(254, 243, 199, 0.94)'
                  : 'rgba(241, 245, 249, 0.94)';
              const statusColor =
                p.status === 'Active'
                  ? '#15803d'
                  : p.status === 'Low stock'
                  ? '#b45309'
                  : '#475569';

              return (
                <article key={p.id} className="admin-product-card">
                  <div className="admin-product-media">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        onError={e => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '42px' }}>{p.emoji || '📦'}</span>
                    )}
                    {hasDiscount && (
                      <span className="admin-product-discount-badge">-{p.discountPercent}% OFF</span>
                    )}
                    <span
                      className="admin-product-status-badge"
                      style={{ background: statusBg, color: statusColor }}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="admin-product-body">
                    <div className="admin-product-meta">
                      <span className="admin-product-cat">{p.category}</span>
                      <span className="admin-product-sku">{p.sku}</span>
                    </div>
                    <h3 className="admin-product-title" title={p.name}>
                      {p.name}
                    </h3>
                    <div className="admin-product-price-row">
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                        <b style={{ fontSize: '16px', color: hasDiscount ? '#15803d' : '#202033' }}>
                          {money(salePrice)}
                        </b>
                        {hasDiscount && (
                          <span
                            style={{
                              textDecoration: 'line-through',
                              color: '#9998aa',
                              fontSize: '11px',
                            }}
                          >
                            {money(p.price)}
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: p.stock <= 12 ? '#d97706' : '#64748b',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Stock: {p.stock}
                      </span>
                    </div>
                  </div>

                  <div className="admin-product-actions">
                    <button
                      type="button"
                      className="admin-product-edit-btn"
                      onClick={() => onEditProduct(p)}
                      title="Edit product details"
                    >
                      <Pencil size={13} /> Edit Product
                    </button>
                    <button
                      type="button"
                      className="admin-product-del-btn"
                      onClick={() => setProducts(old => old.filter(x => x.id !== p.id))}
                      title="Remove product"
                      aria-label={`Remove ${p.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          {pagedProducts.length === 0 && <div className="empty">No products match your search.</div>}
        </>
      ) : (
        <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>SKU</th>
              <th>CATEGORY</th>
              <th>PRICE & DISCOUNT</th>
              <th>STOCK</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {pagedProducts.map(p => {
              const hasDiscount = (p.discountPercent || 0) > 0;
              const salePrice =
                p.discountedPrice ||
                (hasDiscount ? p.price * (1 - (p.discountPercent || 0) / 100) : p.price);

              return (
                <tr key={p.id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-thumb">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="product-img"
                            onError={e => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span>{p.emoji || '📦'}</span>
                        )}
                      </div>
                      <b>{p.name}</b>
                    </div>
                  </td>
                  <td className="muted">{p.sku}</td>
                  <td>{p.category}</td>
                  <td>
                    <div>
                      <b style={{ color: hasDiscount ? '#1b7d56' : '#202033' }}>
                        {money(salePrice)}
                      </b>
                      {hasDiscount && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginTop: '2px',
                          }}
                        >
                          <span
                            style={{
                              textDecoration: 'line-through',
                              color: '#9998aa',
                              fontSize: '11px',
                            }}
                          >
                            {money(p.price)}
                          </span>
                          <span
                            style={{
                              background: '#e3f7ed',
                              color: '#1b7d56',
                              fontWeight: 700,
                              fontSize: '9px',
                              padding: '1px 5px',
                              borderRadius: '8px',
                            }}
                          >
                            -{p.discountPercent}%
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{p.stock}</td>
                  <td>
                    <span
                      className={`status ${
                        p.status === 'Active' ? 'green' : p.status === 'Low stock' ? 'orange' : 'gray'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        className="row-action"
                        title="Edit product"
                        onClick={() => onEditProduct(p)}
                        style={{ color: '#6b5ce7' }}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="row-action"
                        title="Remove product"
                        onClick={() => setProducts(old => old.filter(x => x.id !== p.id))}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pagedProducts.length === 0 && <div className="empty">No products match your search.</div>}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid #eeedf3',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Page <b>{safePage}</b> of <b>{totalPages}</b> ({categoryFiltered.length} products)
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn secondary"
              disabled={safePage <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              style={{ height: '30px', padding: '0 10px', fontSize: '11px' }}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: safePage === n ? '1px solid #6b5ce7' : '1px solid #e2e8f0',
                  background: safePage === n ? '#6b5ce7' : '#fff',
                  color: safePage === n ? '#fff' : '#475569',
                }}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              className="btn secondary"
              disabled={safePage >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              style={{ height: '30px', padding: '0 10px', fontSize: '11px' }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderTable({
  orders,
  updateOrder,
}: {
  orders: Order[];
  updateOrder: (id: string, status: Order['status']) => void;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ORDER</th>
            <th>CUSTOMER</th>
            <th>PHONE</th>
            <th>SHIPPING ADDRESS</th>
            <th>PAYMENT METHOD</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>STATUS</th>
            <th>UPDATE</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>
                <b>{o.id}</b>
              </td>
              <td>
                <b>{o.customer}</b>
              </td>
              <td>
                <a
                  href={`tel:${o.phone}`}
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                  }}
                >
                  <Phone size={12} color="#6b5ce7" />
                  {o.phone}
                </a>
              </td>
              <td style={{ maxWidth: '230px', whiteSpace: 'normal' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                  <MapPin size={13} color="#e17d70" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '11px', color: '#555' }}>{o.address}</span>
                </div>
              </td>
              <td>
                <div>
                  <b style={{ fontSize: '11px', color: '#333' }}>{o.paymentMethod}</b>
                  {o.trxId && (
                    <small
                      style={{
                        display: 'block',
                        color: '#6b5ce7',
                        fontFamily: 'monospace',
                        fontSize: '10px',
                      }}
                    >
                      TrxID: {o.trxId}
                    </small>
                  )}
                </div>
              </td>
              <td className="muted">{o.date}</td>
              <td>
                <b>{money(o.total)}</b>
              </td>
              <td>
                <span
                  className={`status ${
                    o.status === 'Delivered'
                      ? 'green'
                      : o.status === 'Shipped'
                      ? 'blue'
                      : o.status === 'Cancelled'
                      ? 'gray'
                      : 'orange'
                  }`}
                >
                  {o.status}
                </span>
              </td>
              <td>
                <select
                  className="status-select"
                  value={o.status}
                  onChange={e => updateOrder(o.id, e.target.value as Order['status'])}
                >
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <div className="empty">No orders match your search.</div>}
    </div>
  );
}
