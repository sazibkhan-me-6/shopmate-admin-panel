'use client';
import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Award } from 'lucide-react';

export interface CustomerData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  ordersCount: number;
  totalSpent: number;
  status: 'Active' | 'VIP' | 'Inactive';
  avatar: string;
}

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CustomerData | null;
  onSaveCustomer: (customer: CustomerData) => void;
}

export default function CustomerModal({
  isOpen,
  onClose,
  initialData,
  onSaveCustomer,
}: CustomerModalProps) {
  const isEditMode = !!initialData?.id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [ordersCount, setOrdersCount] = useState('0');
  const [totalSpent, setTotalSpent] = useState('0.00');
  const [status, setStatus] = useState<'Active' | 'VIP' | 'Inactive'>('Active');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setAddress(initialData.address || '');
      setOrdersCount(String(initialData.ordersCount || 0));
      setTotalSpent(String(initialData.totalSpent || '0.00'));
      setStatus(initialData.status || 'Active');
    } else {
      setName('');
      setEmail('');
      setPhone('+880 1');
      setAddress('');
      setOrdersCount('0');
      setTotalSpent('0.00');
      setStatus('Active');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const initials = name
      .trim()
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const customerItem: CustomerData = {
      id: initialData?.id || Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+880 1700-000000',
      address: address.trim() || 'Dhaka, Bangladesh',
      ordersCount: parseInt(ordersCount, 10) || 0,
      totalSpent: parseFloat(totalSpent) || 0,
      status,
      avatar: initials || 'CU',
    };

    onSaveCustomer(customerItem);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal modal-lg" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
        <div className="panel-head">
          <div>
            <h2>{isEditMode ? 'Update Customer Information' : 'Add New Customer'}</h2>
            <p>{isEditMode ? 'Edit contact details, address, and account status' : 'Register a new customer profile'}</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Name and Email */}
        <div className="form-row">
          <label>
            Full Name *
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Olivia Martin"
            />
          </label>
          <label>
            Email Address *
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="olivia@example.com"
            />
          </label>
        </div>

        {/* Phone and Status */}
        <div className="form-row">
          <label>
            Phone Number *
            <input
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+880 1712-345678"
            />
          </label>
          <label>
            Customer Status
            <select value={status} onChange={e => setStatus(e.target.value as any)}>
              <option value="Active">Active</option>
              <option value="VIP">⭐ VIP Customer</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>

        {/* Shipping Address */}
        <label>
          Delivery / Shipping Address *
          <textarea
            required
            rows={3}
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="e.g. House 42, Road 11, Block D, Banani, Dhaka - 1213"
            style={{
              width: '100%',
              border: '1px solid var(--line)',
              borderRadius: '7px',
              padding: '10px 12px',
              font: '12px "DM Sans", sans-serif',
              outlineColor: '#b9b1ff',
              resize: 'vertical',
            }}
          />
        </label>

        {/* Orders & Total Spent (Admin view/update) */}
        <div className="form-row">
          <label>
            Total Orders Placed
            <input
              type="number"
              min="0"
              value={ordersCount}
              onChange={e => setOrdersCount(e.target.value)}
            />
          </label>
          <label>
            Total Spent ($)
            <input
              type="number"
              min="0"
              step="0.01"
              value={totalSpent}
              onChange={e => setTotalSpent(e.target.value)}
            />
          </label>
        </div>

        <div className="modal-actions" style={{ marginTop: '22px' }}>
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" type="submit">
            {isEditMode ? 'Save Customer Info' : 'Add Customer'}
          </button>
        </div>
      </form>
    </div>
  );
}
