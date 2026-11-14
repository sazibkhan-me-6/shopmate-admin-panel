'use client';
import { useState } from 'react';
import {
  X,
  Globe,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Tag,
  DollarSign,
  Share2,
  Download,
  Copy,
  Radio,
  Sparkles,
} from 'lucide-react';

export interface StorefrontConfig {
  storeUrl: string;
  storeName: string;
  status: 'online' | 'maintenance';
  bannerActive: boolean;
  bannerText: string;
  coupons: { code: string; discountPercent: number; active: boolean }[];
  primaryCurrency: 'USD' | 'BDT';
  bdtExchangeRate: number;
  lastSyncedAt?: string;
}

const DEFAULT_CONFIG: StorefrontConfig = {
  storeUrl: 'https://shopmate-ecommerce-kohl.vercel.app/',
  storeName: 'ShopMate E-commerce',
  status: 'online',
  bannerActive: true,
  bannerText: '🎉 Free shipping on orders over $100! Use code SAVE10 for 10% off.',
  coupons: [
    { code: 'SAVE10', discountPercent: 10, active: true },
    { code: 'WELCOME20', discountPercent: 20, active: true },
    { code: 'SHOPMATE15', discountPercent: 15, active: false },
  ],
  primaryCurrency: 'USD',
  bdtExchangeRate: 120,
  lastSyncedAt: 'Just now',
};

interface StorefrontControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  productsCount: number;
  categoriesCount: number;
  onSyncStorefront?: (config: StorefrontConfig) => void;
}

export default function StorefrontControlModal({
  isOpen,
  onClose,
  productsCount,
  categoriesCount,
  onSyncStorefront,
}: StorefrontControlModalProps) {
  const [config, setConfig] = useState<StorefrontConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('shopmate_storefront_config');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_CONFIG;
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleToggleCoupon = (code: string) => {
    setConfig(prev => ({
      ...prev,
      coupons: prev.coupons.map(c => (c.code === code ? { ...c, active: !c.active } : c)),
    }));
  };

  const handleSync = () => {
    setIsSyncing(true);
    setSyncNotice('');

    setTimeout(() => {
      const updated = {
        ...config,
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setConfig(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('shopmate_storefront_config', JSON.stringify(updated));
      }
      if (onSyncStorefront) {
        onSyncStorefront(updated);
      }
      setIsSyncing(false);
      setSyncNotice('Storefront synced successfully with latest catalog & configurations!');
    }, 700);
  };

  const handleExportConfig = () => {
    const payload = {
      storeUrl: config.storeUrl,
      timestamp: new Date().toISOString(),
      storefrontSettings: config,
      apiEndpoint: '/api/store',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'shopmate-storefront-config.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const copyApiUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}/api/store`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal modal-lg"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="panel-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#f0edff',
                color: '#6b5ce7',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Globe size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0 }}>Live Storefront Control Center</h2>
                <span
                  style={{
                    background: config.status === 'online' ? '#e9f8f1' : '#fef3c7',
                    color: config.status === 'online' ? '#22966b' : '#d97706',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: config.status === 'online' ? '#22966b' : '#d97706',
                    }}
                  />
                  {config.status === 'online' ? 'LIVE & ONLINE' : 'MAINTENANCE'}
                </span>
              </div>
              <p style={{ margin: '2px 0 0' }}>Control and synchronize the live Vercel storefront</p>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Live Storefront Status Banner */}
        <div
          style={{
            padding: '14px 16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f3f0ff 0%, #ede7ff 100%)',
            border: '1px solid #dcd3fc',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b5ce7', fontSize: '11px', fontWeight: 700 }}>
              <Radio size={14} className="pulse" /> TARGET STOREFRONT
            </div>
            <a
              href={config.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#202033',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                marginTop: '3px',
              }}
            >
              shopmate-ecommerce-kohl.vercel.app <ExternalLink size={14} color="#6b5ce7" />
            </a>
            <small style={{ display: 'block', color: '#777', fontSize: '11px', marginTop: '2px' }}>
              Connected with {productsCount} products and {categoriesCount} categories
            </small>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href={config.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn secondary"
              style={{
                height: '34px',
                fontSize: '11px',
                padding: '0 12px',
                textDecoration: 'none',
                gap: '6px',
              }}
            >
              <ExternalLink size={13} /> Visit Storefront
            </a>
            <button
              type="button"
              className="btn primary"
              onClick={handleSync}
              disabled={isSyncing}
              style={{ height: '34px', fontSize: '11px', padding: '0 12px', gap: '6px' }}
            >
              <RefreshCw size={13} className={isSyncing ? 'spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Sync Storefront'}
            </button>
          </div>
        </div>

        {syncNotice && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#e9f8f1',
              color: '#22966b',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '16px',
            }}
          >
            <CheckCircle2 size={16} /> {syncNotice}
          </div>
        )}

        {/* 1. Storefront Operation Status */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>
            Store Operation Status
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setConfig({ ...config, status: 'online' })}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: config.status === 'online' ? '2px solid #22966b' : '1px solid #eeedf3',
                background: config.status === 'online' ? '#f0fbf5' : '#fff',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <b style={{ fontSize: '12px', color: '#22966b', display: 'block' }}>🟢 Live & Open</b>
              <small style={{ color: '#666', fontSize: '10px' }}>Storefront accepting orders and payments normally</small>
            </button>

            <button
              type="button"
              onClick={() => setConfig({ ...config, status: 'maintenance' })}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: config.status === 'maintenance' ? '2px solid #d97706' : '1px solid #eeedf3',
                background: config.status === 'maintenance' ? '#fefce8' : '#fff',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <b style={{ fontSize: '12px', color: '#d97706', display: 'block' }}>🟡 Maintenance Mode</b>
              <small style={{ color: '#666', fontSize: '10px' }}>Display "Under Maintenance" on the live site</small>
            </button>
          </div>
        </div>

        {/* 2. Announcement Banner Control */}
        <div
          style={{
            padding: '14px',
            borderRadius: '9px',
            border: '1px solid #eeedf3',
            background: '#faf9fe',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>
              <b style={{ fontSize: '12px' }}>Storefront Top Announcement Bar</b>
              <small style={{ display: 'block', color: '#888', fontSize: '10px' }}>
                Promotional announcement displayed across the top of the storefront
              </small>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={config.bannerActive}
                onChange={e => setConfig({ ...config, bannerActive: e.target.checked })}
              />
              Show Banner
            </label>
          </div>

          <input
            value={config.bannerText}
            onChange={e => setConfig({ ...config, bannerText: e.target.value })}
            placeholder="e.g. Free shipping on all orders over $50! Use code SAVE10"
            disabled={!config.bannerActive}
            style={{ width: '100%', opacity: config.bannerActive ? 1 : 0.6 }}
          />
        </div>

        {/* 3. Promo Coupons Management */}
        <div
          style={{
            padding: '14px',
            borderRadius: '9px',
            border: '1px solid #eeedf3',
            background: '#fff',
            marginBottom: '16px',
          }}
        >
          <b style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Active Checkout Coupons</b>
          <small style={{ color: '#888', fontSize: '10px', display: 'block', marginBottom: '10px' }}>
            Coupons customers can apply at checkout on the live store
          </small>

          <div style={{ display: 'grid', gap: '8px' }}>
            {config.coupons.map(coupon => (
              <div
                key={coupon.code}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '7px',
                  border: coupon.active ? '1px solid #c5edd7' : '1px solid #eeedf3',
                  background: coupon.active ? '#f0fbf5' : '#f9f9fb',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <code style={{ background: '#6b5ce715', color: '#6b5ce7', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    {coupon.code}
                  </code>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{coupon.discountPercent}% Instant Discount</span>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={coupon.active}
                    onChange={() => handleToggleCoupon(coupon.code)}
                  />
                  <span>{coupon.active ? 'Active' : 'Disabled'}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Currency & Bangladeshi Exchange Rate */}
        <div className="form-row" style={{ marginBottom: '16px' }}>
          <label>
            Primary Storefront Currency
            <select
              value={config.primaryCurrency}
              onChange={e => setConfig({ ...config, primaryCurrency: e.target.value as any })}
            >
              <option value="USD">USD ($) - International</option>
              <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
            </select>
          </label>

          <label>
            BDT Exchange Rate (1 USD = ? BDT)
            <input
              type="number"
              value={config.bdtExchangeRate}
              onChange={e => setConfig({ ...config, bdtExchangeRate: parseFloat(e.target.value) || 120 })}
              placeholder="120"
            />
          </label>
        </div>

        {/* 5. Live REST API Endpoint & Sync Box */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '9px',
            border: '1px dashed #d5d3e8',
            background: '#faf9fe',
            fontSize: '11px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: '#555' }}>Live Storefront REST API Endpoint:</span>
            <button
              type="button"
              onClick={copyApiUrl}
              style={{
                border: 'none',
                background: 'none',
                color: '#6b5ce7',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Copy size={12} /> {copied ? 'Copied!' : 'Copy API URL'}
            </button>
          </div>
          <code
            style={{
              display: 'block',
              background: '#fff',
              border: '1px solid #eeedf3',
              padding: '6px 10px',
              borderRadius: '6px',
              marginTop: '6px',
              fontFamily: 'monospace',
              color: '#333',
            }}
          >
            /api/store
          </code>
          <p style={{ margin: '6px 0 0', color: '#888', fontSize: '10px' }}>
            Allows the live storefront to fetch products, categories, coupons, and submit orders automatically.
          </p>
        </div>

        {/* Modal actions */}
        <div
          className="modal-actions"
          style={{
            position: 'sticky',
            bottom: '-22px',
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
            padding: '12px 0 0',
            marginTop: '16px',
            borderTop: '1px solid #eeedf3',
            zIndex: 3,
          }}
        >
          <button type="button" className="btn secondary" onClick={handleExportConfig}>
            <Download size={14} /> Export Config JSON
          </button>
          <button type="button" className="btn primary" onClick={handleSync} disabled={isSyncing}>
            <RefreshCw size={14} className={isSyncing ? 'spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Save & Sync to Live Store'}
          </button>
        </div>
      </div>
    </div>
  );
}
