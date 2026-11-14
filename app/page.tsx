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
} from 'lucide-react';

import LoginScreen, { UserProfile } from '../components/LoginScreen';
import AddProductModal from '../components/AddProductModal';
import AddCategoryModal, { CategoryItem } from '../components/AddCategoryModal';
import CustomerSupportModal from '../components/CustomerSupportModal';
import PaymentMethodsModal, { PaymentMethodItem } from '../components/PaymentMethodsModal';

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Low stock' | 'Draft';
  image?: string;
  emoji?: string;
};

type Order = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Everyday Backpack',
    sku: 'BAG-001',
    category: 'Accessories',
    price: 49.99,
    stock: 38,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
    emoji: '🎒',
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    sku: 'ELC-014',
    category: 'Electronics',
    price: 89.00,
    stock: 7,
    status: 'Low stock',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    emoji: '🎧',
  },
  {
    id: 3,
    name: 'Ceramic Coffee Set',
    sku: 'HOM-008',
    category: 'Home & Living',
    price: 34.50,
    stock: 24,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    emoji: '☕',
  },
  {
    id: 4,
    name: 'Classic Running Shoes',
    sku: 'SHO-021',
    category: 'Fashion & Apparel',
    price: 72.00,
    stock: 0,
    status: 'Draft',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    emoji: '👟',
  },
  {
    id: 5,
    name: 'Minimal Desk Lamp',
    sku: 'HOM-012',
    category: 'Home & Living',
    price: 41.25,
    stock: 13,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
    emoji: '💡',
  },
];

const initialCategories: CategoryItem[] = [
  {
    id: 1,
    name: 'Electronics',
    count: '24 products',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: 'Fashion & Apparel',
    count: '38 products',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Home & Living',
    count: '19 products',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    name: 'Accessories',
    count: '16 products',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
  },
];

const initialOrders: Order[] = [
  { id: '#SM-1048', customer: 'Olivia Martin', date: 'Nov 14, 2026', total: 138.99, status: 'Processing' },
  { id: '#SM-1047', customer: 'Noah Williams', date: 'Nov 14, 2026', total: 89.00, status: 'Shipped' },
  { id: '#SM-1046', customer: 'Emma Brown', date: 'Nov 13, 2026', total: 72.00, status: 'Delivered' },
  { id: '#SM-1045', customer: 'Liam Davis', date: 'Nov 13, 2026', total: 34.50, status: 'Cancelled' },
  { id: '#SM-1044', customer: 'Ava Wilson', date: 'Nov 12, 2026', total: 91.24, status: 'Delivered' },
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
  const [query, setQuery] = useState('');
  const [mobile, setMobile] = useState(false);
  const [notice, setNotice] = useState('');

  // Modals
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

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
        (o.id + ' ' + o.customer + ' ' + o.status).toLowerCase().includes(query.toLowerCase())
      ),
    [orders, query]
  );

  const filteredCategories = useMemo(
    () =>
      categories.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase())
      ),
    [categories, query]
  );

  const handleAddProduct = (newProd: {
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: 'Active' | 'Low stock' | 'Draft';
    image: string;
  }) => {
    const productItem: Product = {
      id: Date.now(),
      ...newProd,
      emoji: '📦',
    };
    setProducts([productItem, ...products]);
    setNotice(`Product "${newProd.name}" added successfully with photo!`);
  };

  const handleAddCategory = (newCat: {
    name: string;
    count: string;
    image: string;
  }) => {
    const categoryItem: CategoryItem = {
      id: Date.now(),
      name: newCat.name,
      count: newCat.count,
      image: newCat.image,
    };
    setCategories([categoryItem, ...categories]);
    setNotice(`Category "${newCat.name}" added with cover photo!`);
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
    setNotice('Category removed.');
  };

  function updateOrder(id: string, status: Order['status']) {
    setOrders(orders.map(o => (o.id === id ? { ...o, status } : o)));
    setNotice(`${id} marked ${status.toLowerCase()}.`);
  }

  function exportOrders() {
    const csv = [
      'Order,Customer,Date,Total,Status',
      ...orders.map(o => [o.id, o.customer, o.date, o.total, o.status].join(',')),
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
          <button className="mobile-close" onClick={() => setMobile(false)} aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        <div className="store-switch">
          <div className="store-icon">SM</div>
          <div>
            <b>ShopMate Store</b>
            <small>Online store</small>
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
            </button>
          ))}
        </nav>

        <div className="nav-label management">MANAGEMENT</div>
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
                placeholder="Search products, orders, categories..."
              />
              <kbd>⌘ K</kbd>
            </div>
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
              onClick={() => setNotice('You are all caught up!')}
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
          {/* Page Heading */}
          <div className="page-heading">
            <div>
              <div className="eyebrow">SATURDAY, NOVEMBER 14, 2026</div>
              <h1>{section === 'Overview' ? `Good morning, ${user.name.split(' ')[0]} 👋` : section}</h1>
              <p>
                {section === 'Overview'
                  ? "Here's what's happening with your store today."
                  : `Manage your store ${section.toLowerCase()} with live photo updates.`}
              </p>
            </div>
            <div className="heading-actions">
              <button className="btn secondary" onClick={exportOrders}>
                <Download size={16} /> Export
              </button>
              {section === 'Categories' ? (
                <button className="btn primary" onClick={() => setShowAddCategory(true)}>
                  <Plus size={17} /> Add category
                </button>
              ) : (
                <button
                  className="btn primary"
                  onClick={() => {
                    setSection('Products');
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
                <Stat title="Products" value={String(products.length)} change="4.5%" up />
                <Stat title="Customers" value="892" change="2.4%" up={false} />
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
                      <svg viewBox="0 0 700 210" preserveAspectRatio="none" aria-label="Revenue trend chart">
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
                    <h2>Recent orders</h2>
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
                    <h2>Top products with photos</h2>
                    <p>Your most popular catalogue items</p>
                  </div>
                  <button className="text-btn" onClick={() => setSection('Products')}>
                    Manage products →
                  </button>
                </div>
                <ProductTable products={products.slice(0, 4)} setProducts={setProducts} />
              </section>
            </>
          )}

          {/* SECTION: Products */}
          {section === 'Products' && (
            <section className="panel full-panel">
              <div className="panel-head">
                <div>
                  <h2>Product catalogue</h2>
                  <p>{products.length} products with photo support</p>
                </div>
                <button className="btn primary" onClick={() => setShowAddProduct(true)}>
                  <Plus size={16} /> Add product
                </button>
              </div>
              <ProductTable products={filteredProducts} setProducts={setProducts} />
            </section>
          )}

          {/* SECTION: Orders */}
          {section === 'Orders' && (
            <section className="panel full-panel">
              <div className="panel-head">
                <div>
                  <h2>All orders</h2>
                  <p>Review and update customer orders</p>
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
                  <h2>Customers</h2>
                  <p>Customer directory · sample data</p>
                </div>
              </div>
              <div className="customer-list">
                {[
                  'Olivia Martin',
                  'Noah Williams',
                  'Emma Brown',
                  'Liam Davis',
                  'Ava Wilson',
                  'Sophia Taylor',
                ].map((n, i) => (
                  <div className="customer" key={n}>
                    <div className="avatar">
                      {n
                        .split(' ')
                        .map(x => x[0])
                        .join('')}
                    </div>
                    <div>
                      <b>{n}</b>
                      <small>{n.toLowerCase().replace(' ', '.')}@example.com</small>
                    </div>
                    <span>{[12, 8, 5, 3, 9, 2][i]} orders</span>
                    <b>{money([482, 329, 216, 134, 391, 88][i])}</b>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION: Categories */}
          {section === 'Categories' && (
            <section className="panel full-panel">
              <div className="panel-head">
                <div>
                  <h2>Categories with Cover Photos</h2>
                  <p>Organize your product catalogue with visual category images</p>
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
                  <p>Performance snapshot · sample metrics</p>
                </div>
              </div>
              <div className="stats analytics-stats">
                <Stat title="Conversion rate" value="3.42%" change="0.6%" up />
                <Stat title="Average order value" value="$58.40" change="5.1%" up />
                <Stat title="Returning customers" value="32.8%" change="1.2%" up />
                <Stat title="Refund rate" value="1.4%" change="0.3%" up={false} />
              </div>
              <p className="disclaimer">
                Analytics are illustrative demo values. Connect your store database to display real metrics.
              </p>
            </section>
          )}

          {/* SECTION: Settings */}
          {section === 'Settings' && (
            <section className="panel full-panel">
              <div className="panel-head">
                <div>
                  <h2>Store settings</h2>
                  <p>Basic configuration for your ShopMate store</p>
                </div>
              </div>
              <div className="settings-form">
                <label>
                  Store name
                  <input defaultValue="ShopMate Store" />
                </label>
                <label>
                  Support email
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
                <label>
                  Timezone
                  <select defaultValue="Asia/Dhaka">
                    <option>Asia/Dhaka</option>
                    <option>UTC</option>
                  </select>
                </label>
                <button className="btn primary" onClick={() => setNotice('Settings saved locally for this demo.')}>
                  Save changes
                </button>
              </div>

              {/* Payment Gateway & Support Control Cards inside Settings */}
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
                <div
                  style={{
                    padding: '18px',
                    borderRadius: '10px',
                    border: '1px solid var(--line)',
                    background: '#fcfbfe',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
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

                <div
                  style={{
                    padding: '18px',
                    borderRadius: '10px',
                    border: '1px solid var(--line)',
                    background: '#f9fefe',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
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
                      <small style={{ color: '#22966b', display: 'block', fontSize: '10px', fontWeight: 700 }}>
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
            © 2026 ShopMate Admin. <span>Logged in as {user.name} ({user.email})</span>
          </footer>
        </div>
      </main>

      {/* Add Product Modal with Photo Upload */}
      <AddProductModal
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        categories={categories}
        onAddProduct={handleAddProduct}
      />

      {/* Add Category Modal with Photo Upload */}
      <AddCategoryModal
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onAddCategory={handleAddCategory}
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
}: {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>SKU</th>
            <th>CATEGORY</th>
            <th>PRICE</th>
            <th>STOCK</th>
            <th>STATUS</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
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
                <b>{money(p.price)}</b>
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
                <button
                  className="row-action"
                  title="Remove product"
                  onClick={() => setProducts(old => old.filter(x => x.id !== p.id))}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
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
              <td>{o.customer}</td>
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
