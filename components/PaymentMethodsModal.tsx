'use client';
import { useState } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Settings2,
  DollarSign,
  Smartphone,
  Banknote,
  Globe,
  Sliders,
} from 'lucide-react';

export interface PaymentMethodItem {
  id: string;
  name: string;
  provider: string;
  type: 'mobile_banking' | 'card' | 'cod' | 'digital_wallet';
  enabled: boolean;
  isSandbox: boolean;
  feePercent: number;
  iconColor: string;
  accountNumber?: string;
  description: string;
}

const DEFAULT_METHODS: PaymentMethodItem[] = [
  {
    id: 'bkash',
    name: 'bKash (বিকাশ)',
    provider: 'bKash PGW API v1.2',
    type: 'mobile_banking',
    enabled: true,
    isSandbox: false,
    feePercent: 1.5,
    iconColor: '#e2136e',
    accountNumber: '01712-345678 (Merchant)',
    description: 'Instant automated checkout & mobile wallet payment in Bangladesh',
  },
  {
    id: 'nagad',
    name: 'Nagad (নগদ)',
    provider: 'Nagad Direct Gateway',
    type: 'mobile_banking',
    enabled: true,
    isSandbox: false,
    feePercent: 1.2,
    iconColor: '#f7941d',
    accountNumber: '01812-987654 (Merchant)',
    description: 'Direct mobile banking & QR payments via Bangladesh Post Office',
  },
  {
    id: 'cards',
    name: 'Credit / Debit Cards',
    provider: 'Stripe & Visa / Mastercard',
    type: 'card',
    enabled: true,
    isSandbox: false,
    feePercent: 2.5,
    iconColor: '#6b5ce7',
    description: 'Accept Visa, Mastercard, American Express with 3D Secure verification',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery (COD)',
    provider: 'In-house courier settlement',
    type: 'cod',
    enabled: true,
    isSandbox: false,
    feePercent: 0,
    iconColor: '#22966b',
    description: 'Allow customers to pay cash when product arrives at their doorstep',
  },
  {
    id: 'rocket',
    name: 'DBBL Rocket',
    provider: 'Dutch Bangla Rocket PGW',
    type: 'mobile_banking',
    enabled: false,
    isSandbox: true,
    feePercent: 1.5,
    iconColor: '#8b1f8f',
    description: 'Dutch-Bangla Bank mobile financial service integration',
  },
  {
    id: 'stripe_intl',
    name: 'International PayPal / Stripe',
    provider: 'Global Multi-currency Gateway',
    type: 'digital_wallet',
    enabled: false,
    isSandbox: true,
    feePercent: 3.4,
    iconColor: '#0070ba',
    description: 'Accept international payments in USD, EUR, and GBP',
  },
];

interface PaymentMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (methods: PaymentMethodItem[]) => void;
}

export default function PaymentMethodsModal({
  isOpen,
  onClose,
  onSave,
}: PaymentMethodsModalProps) {
  const [methods, setMethods] = useState<PaymentMethodItem[]>(DEFAULT_METHODS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleMethod = (id: string) => {
    setMethods(prev =>
      prev.map(m => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const toggleSandbox = (id: string) => {
    setMethods(prev =>
      prev.map(m => (m.id === id ? { ...m, isSandbox: !m.isSandbox } : m))
    );
  };

  const updateFee = (id: string, fee: number) => {
    setMethods(prev =>
      prev.map(m => (m.id === id ? { ...m, feePercent: fee } : m))
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave(methods);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const activeCount = methods.filter(m => m.enabled).length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
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
              <CreditCard size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0 }}>Payment Method Control</h2>
                <span
                  style={{
                    background: '#eef2ff',
                    color: '#4f46e5',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  {activeCount} Active Gateways
                </span>
              </div>
              <p style={{ margin: '2px 0 0' }}>Configure, enable, or disable checkout payment gateways</p>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {saveSuccess && (
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
              marginBottom: '14px',
            }}
          >
            <CheckCircle2 size={16} /> Payment settings saved successfully!
          </div>
        )}

        {/* Payment Gateways List */}
        <div style={{ display: 'grid', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
          {methods.map(method => (
            <div
              key={method.id}
              style={{
                padding: '13px 15px',
                borderRadius: '10px',
                border: method.enabled ? '1px solid #dcd8fc' : '1px solid #eeedf3',
                background: method.enabled ? '#faf9ff' : '#fff',
                transition: 'all .15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: `${method.iconColor}18`,
                      color: method.iconColor,
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                      flexShrink: 0,
                    }}
                  >
                    {method.type === 'mobile_banking' ? <Smartphone size={18} /> : method.type === 'cod' ? <Banknote size={18} /> : <CreditCard size={18} />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <b style={{ fontSize: '13px', color: '#1e1e2d' }}>{method.name}</b>
                      {method.enabled ? (
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            color: '#22966b',
                            background: '#e9f8f1',
                            padding: '2px 6px',
                            borderRadius: '10px',
                          }}
                        >
                          ACTIVE
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            color: '#888',
                            background: '#f2f2f5',
                            padding: '2px 6px',
                            borderRadius: '10px',
                          }}
                        >
                          DISABLED
                        </span>
                      )}
                      {method.enabled && method.isSandbox && (
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            color: '#d97706',
                            background: '#fef3c7',
                            padding: '2px 6px',
                            borderRadius: '10px',
                          }}
                        >
                          TEST SANDBOX
                        </span>
                      )}
                    </div>
                    <small style={{ color: '#888', fontSize: '11px', display: 'block', marginTop: '2px' }}>
                      {method.description}
                    </small>
                  </div>
                </div>

                {/* Right controls: Toggle & Settings */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingId(editingId === method.id ? null : method.id)}
                    style={{
                      border: '1px solid #eeedf3',
                      background: '#fff',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      color: '#666',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Sliders size={13} /> Config
                  </button>

                  {/* Toggle switch */}
                  <label
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '42px',
                      height: '24px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={method.enabled}
                      onChange={() => toggleMethod(method.id)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: method.enabled ? '#6b5ce7' : '#e0dfe7',
                        borderRadius: '24px',
                        transition: 'background-color .2s',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: method.enabled ? '20px' : '3px',
                          bottom: '3px',
                          backgroundColor: '#fff',
                          borderRadius: '50%',
                          transition: 'left .2s',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      />
                    </span>
                  </label>
                </div>
              </div>

              {/* Sub-config drawer if open */}
              {editingId === method.id && (
                <div
                  style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid #eeedf3',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    fontSize: '11px',
                  }}
                >
                  <label>
                    <span style={{ fontWeight: 600, color: '#555' }}>Mode</span>
                    <select
                      value={method.isSandbox ? 'sandbox' : 'live'}
                      onChange={e => toggleSandbox(method.id)}
                      style={{ height: '32px', fontSize: '11px', marginTop: '4px' }}
                    >
                      <option value="live">🟢 Live Production</option>
                      <option value="sandbox">🟡 Sandbox Testing</option>
                    </select>
                  </label>

                  <label>
                    <span style={{ fontWeight: 600, color: '#555' }}>Transaction Fee (%)</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={method.feePercent}
                      onChange={e => updateFee(method.id, parseFloat(e.target.value) || 0)}
                      style={{ height: '32px', fontSize: '11px', marginTop: '4px' }}
                    />
                  </label>

                  <label>
                    <span style={{ fontWeight: 600, color: '#555' }}>Account / Info</span>
                    <input
                      defaultValue={method.accountNumber || method.provider}
                      style={{ height: '32px', fontSize: '11px', marginTop: '4px' }}
                    />
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="modal-actions" style={{ marginTop: '18px' }}>
          <button type="button" className="btn secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn primary" onClick={handleSave}>
            <CheckCircle2 size={15} /> Save & Apply Gateways
          </button>
        </div>
      </div>
    </div>
  );
}
