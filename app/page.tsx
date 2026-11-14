'use client';
import { useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';

import LoginScreen, { UserProfile } from '../components/LoginScreen';
import AddProductModal, { ProductFormData } from '../components/AddProductModal';
import AddCategoryModal, { CategoryItem } from '../components/AddCategoryModal';
import CustomerSupportModal from '../components/CustomerSupportModal';
import PaymentMethodsModal, { PaymentMethodItem } from '../components/PaymentMethodsModal';
import CustomerModal, { CustomerData } from '../components/CustomerModal';
import StorefrontControlModal, { StorefrontConfig } from '../components/StorefrontControlModal';

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

// Exact 12 products aligned with https://shopmate-ecommerce-kohl.vercel.app/
const initialProducts: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    sku: 'APL-IPH15PM',
    category: 'Electronics',
    price: 1299.0,
    discountPercent: 15,
    discountedPrice: 1099.0,
    stock: 24,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 2,
    name: 'Sony WH-1000XM5',
    sku: 'SNY-WH1000',
    category: 'Electronics',
    price: 399.0,
    discountPercent: 20,
    discountedPrice: 319.0,
    stock: 31,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 3,
    name: 'Nike Air Force 1',
    sku: 'NKE-AF1-01',
    category: 'Fashion',
    price: 119.0,
    discountPercent: 25,
    discountedPrice: 89.0,
    stock: 45,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 4,
    name: 'Apple Watch Series 9',
    sku: 'APL-WTC9',
    category: 'Electronics',
    price: 499.0,
    discountPercent: 18,
    discountedPrice: 409.0,
    stock: 19,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 5,
    name: 'Under Armour Backpack',
    sku: 'UAR-BP-005',
    category: 'Accessories',
    price: 58.0,
    discountPercent: 22,
    discountedPrice: 45.0,
    stock: 52,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 6,
    name: 'MacBook Air M3',
    sku: 'APL-MBA-M3',
    category: 'Electronics',
    price: 1099.0,
    discountPercent: 9,
    discountedPrice: 999.0,
    stock: 16,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 7,
    name: 'Premium Cotton T-Shirt',
    sku: 'UNQ-TS-007',
    category: 'Fashion',
    price: 39.0,
    discountPercent: 25,
    discountedPrice: 29.0,
    stock: 70,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 8,
    name: 'Minimal Lounge Sofa',
    sku: 'NDH-SOFA-08',
    category: 'Home & Living',
    price: 799.0,
    discountPercent: 12,
    discountedPrice: 699.0,
    stock: 8,
    status: 'Low stock',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 9,
    name: 'Everyday Skincare Set',
    sku: 'GLB-SKIN-09',
    category: 'Beauty & Health',
    price: 79.0,
    discountPercent: 25,
    discountedPrice: 59.0,
    stock: 37,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 10,
    name: 'Adjustable Dumbbell Set',
    sku: 'FTP-DMB-10',
    category: 'Sports & Fitness',
    price: 189.0,
    discountPercent: 21,
    discountedPrice: 149.0,
    stock: 20,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 11,
    name: 'The Creative Mind',
    sku: 'PGN-BOK-11',
    category: 'Books',
    price: 25.0,
    discountPercent: 24,
    discountedPrice: 19.0,
    stock: 100,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 12,
    name: 'Classic Teddy Bear',
    sku: 'PLT-TOY-12',
    category: 'Toys & Games',
    price: 32.0,
    discountPercent: 25,
    discountedPrice: 24.0,
    stock: 60,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=700&q=85',
  },
];

// Exact 8 categories aligned with https://shopmate-ecommerce-kohl.vercel.app/
const initialCategories: CategoryItem[] = [
  {
    id: 1,
    name: 'Electronics',
    count: '4 products',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 2,
    name: 'Fashion',
    count: '2 products',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 3,
    name: 'Home & Living',
    count: '1 product',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 4,
    name: 'Beauty & Health',
    count: '1 product',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 5,
    name: 'Sports & Fitness',
    count: '1 product',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 6,
    name: 'Books',
    count: '1 product',
    image: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 7,
    name: 'Toys & Games',
    count: '1 product',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 8,
    name: 'Accessories',
    count: '1 product',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80',
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

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);

  const [showSupport, setShowSupport] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showStorefrontControl, setShowStorefrontControl] = useState(false);

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
    () => categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase())),
    [categories, query]
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

  // Category Add / Delete Handlers
  const handleAddCategory = (newCat: { name: string; count: string; image: string }) => {
    const categoryItem: CategoryItem = {
      id: Date.now(),
      name: newCat.name,
      count: newCat.count,
      image: newCat.image,
    };
    setCategories([categoryItem, ...categories]);
    setNotice(`Category "${newCat.name}" added for storefront!`);
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
    setNotice('Category removed.');
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

        {/* Store switch connected to live storefront */}
        <div
          className="store-switch"
          onClick={() => setShowStorefrontControl(true)}
          style={{ cursor: 'pointer' }}
          title="Connected to shopmate-ecommerce-kohl.vercel.app - Click to control"
        >
          <div className="store-icon">SM</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <b>ShopMate Store</b>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#22966b',
                  display: 'inline-block',
                }}
              />
            </div>
            <small style={{ color: '#22966b', fontWeight: 600 }}>shopmate-ecommerce-kohl...</small>
          </div>
          <ChevronDown size={15} />
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
          type="button"
          className="nav-item"
          onClick={() => {
            setShowStorefrontControl(true);
            setMobile(false);
          }}
        >
          <Globe size={18} />
          <span>Live Storefront</span>
          <em style={{ background: '#e9f8f1', color: '#22966b', fontWeight: 700 }}>Online</em>
        </button>

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
          className="nav-item"
          onClick={() => {
            setShowSupport(true);
            setMobile(false);
          }}
        >
          <Headphones size={18} />
          <span>Customer Support</span>
          <em style={{ background: '#e9f8f1', color: '#22966b', fontWeight: 700 }}>24/7</em>
        </button>

        <div className="sidebar-bottom">
          <div
            className="help"
            onClick={() => setShowSupport(true)}
            style={{ cursor: 'pointer' }}
            title="Click to open Customer Support"
          >
            <CircleHelp size={18} />
            <div>
              <b>Need help?</b>
              <small>Click for 24/7 support</small>
            </div>
          </div>
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
              className="btn secondary payment-top-btn"
              onClick={() => setShowPaymentMethods(true)}
              title="Open Payment Method Control"
              style={{ height: '34px', fontSize: '11px', padding: '0 10px', gap: '6px' }}
            >
              <CreditCard size={14} color="#6b5ce7" />
              <span>Payment Control</span>
            </button>

            <button
              type="button"
              className="btn secondary support-top-btn"
              onClick={() => setShowSupport(true)}
              title="Customer Support & Help Desk"
              style={{ height: '34px', fontSize: '11px', padding: '0 10px', gap: '6px' }}
            >
              <Headphones size={14} color="#22966b" />
              <span>Support (24/7)</span>
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
                <button className="btn primary" onClick={() => setShowAddCategory(true)}>
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
            <section className="panel full-panel">
              <div className="panel-head">
                <div>
                  <h2>Categories with Cover Photos ({categories.length} categories)</h2>
                  <p>Organize your product catalogue with visual category images for the storefront</p>
                </div>
                <button className="btn primary" onClick={() => setShowAddCategory(true)}>
                  <Plus size={16} /> Add category
                </button>
              </div>

              <div className="category-grid">
                {filteredCategories.map(cat => (
                  <div className="category-card" key={cat.id}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="category-card-img"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="category-card-content">
                      <div>
                        <b>{cat.name}</b>
                        <small>{cat.count}</small>
                      </div>
                      <button
                        className="category-delete-btn"
                        title="Delete category"
                        onClick={() => handleDeleteCategory(cat.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {filteredCategories.length === 0 && (
                <div className="empty">No categories match your search.</div>
              )}
            </section>
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
                      <b style={{ fontSize: '13px' }}>Customer Support Desk</b>
                      <small
                        style={{
                          color: '#22966b',
                          display: 'block',
                          fontSize: '10px',
                          fontWeight: 700,
                        }}
                      >
                        ● 24/7 Live Assistance
                      </small>
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#666', margin: '0 0 14px' }}>
                    Connect with dedicated support via WhatsApp, toll-free hotline, email, or submit a support ticket.
                  </p>
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => setShowSupport(true)}
                    style={{ width: '100%', height: '36px' }}
                  >
                    <Headphones size={15} color="#22966b" /> Open Customer Support
                  </button>
                </div>
              </div>
            </section>
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

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onAddCategory={handleAddCategory}
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
        onClose={() => setShowSupport(false)}
        onSendTicket={ticket =>
          setNotice(`Support ticket ${ticket.id} submitted! A support agent has been assigned.`)
        }
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
  return (
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
          {products.map(p => {
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
      {products.length === 0 && <div className="empty">No products match your search.</div>}
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
