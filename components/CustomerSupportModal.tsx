'use client';
import { useState } from 'react';
import {
  X,
  Headphones,
  Mail,
  Phone,
  MessageCircle,
  Send,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendTicket?: (ticket: { id: string; subject: string; category: string; message: string }) => void;
}

const FAQS = [
  {
    q: 'How to enable bKash or Nagad payment methods?',
    a: 'Go to Payment Methods from the sidebar or click "Payment Control" to toggle bKash/Nagad and configure merchant details.',
  },
  {
    q: 'How to upload product photos without external hosting?',
    a: 'In the Add Product modal, choose "Upload File" to browse photos directly from your device with automatic preview.',
  },
  {
    q: 'Can I export orders into an Excel/CSV file?',
    a: 'Yes, click the "Export" or "Export CSV" button at the top right of the Orders page to download the latest report.',
  },
];

export default function CustomerSupportModal({
  isOpen,
  onClose,
  onSendTicket,
}: CustomerSupportModalProps) {
  const [tab, setTab] = useState<'ticket' | 'faq'>('ticket');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Payment Gateway');
  const [urgency, setUrgency] = useState('High');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const generatedId = '#TKT-' + Math.floor(1000 + Math.random() * 9000);
    setTicketId(generatedId);
    setSubmitted(true);

    if (onSendTicket) {
      onSendTicket({
        id: generatedId,
        subject,
        category,
        message,
      });
    }

    setTimeout(() => {
      // Keep state for viewing ticket ID
    }, 200);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubject('');
    setMessage('');
  };

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
                background: '#f2f0ff',
                color: '#6b5ce7',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Headphones size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0 }}>Customer Support & Help Center</h2>
                <span
                  style={{
                    background: '#e9f8f1',
                    color: '#22966b',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 7px',
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
                      background: '#22966b',
                    }}
                  />
                  24/7 Live
                </span>
              </div>
              <p style={{ margin: '2px 0 0' }}>We are here to assist with store operations & technical queries</p>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Quick Contact Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginBottom: '18px',
          }}
        >
          <a
            href="mailto:support@shopmate.com"
            style={{
              textDecoration: 'none',
              padding: '12px',
              borderRadius: '9px',
              background: '#faf9fe',
              border: '1px solid #eeedf3',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              color: 'inherit',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b5ce7', fontSize: '11px', fontWeight: 700 }}>
              <Mail size={14} /> Email Support
            </div>
            <b style={{ fontSize: '12px' }}>support@shopmate.com</b>
            <small style={{ color: '#888', fontSize: '10px' }}>Replies in &lt; 15 mins</small>
          </a>

          <a
            href="tel:+8809600123456"
            style={{
              textDecoration: 'none',
              padding: '12px',
              borderRadius: '9px',
              background: '#faf9fe',
              border: '1px solid #eeedf3',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              color: 'inherit',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22966b', fontSize: '11px', fontWeight: 700 }}>
              <Phone size={14} /> Phone Hotline
            </div>
            <b style={{ fontSize: '12px' }}>+880 9600 123456</b>
            <small style={{ color: '#888', fontSize: '10px' }}>Toll-free 9 AM - 10 PM</small>
          </a>

          <div
            style={{
              padding: '12px',
              borderRadius: '9px',
              background: '#faf9fe',
              border: '1px solid #eeedf3',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#25D366', fontSize: '11px', fontWeight: 700 }}>
              <MessageCircle size={14} /> WhatsApp Desk
            </div>
            <b style={{ fontSize: '12px' }}>+880 1700 998877</b>
            <small style={{ color: '#888', fontSize: '10px' }}>Instant Chat Support</small>
          </div>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', borderBottom: '1px solid #eeedf3', paddingBottom: '8px' }}>
          <button
            type="button"
            className={`tab-pill ${tab === 'ticket' ? 'active' : ''}`}
            onClick={() => setTab('ticket')}
          >
            <Send size={13} style={{ marginRight: '4px' }} /> Create Support Ticket
          </button>
          <button
            type="button"
            className={`tab-pill ${tab === 'faq' ? 'active' : ''}`}
            onClick={() => setTab('faq')}
          >
            <HelpCircle size={13} style={{ marginRight: '4px' }} /> Instant FAQs ({FAQS.length})
          </button>
        </div>

        {/* Ticket Form */}
        {tab === 'ticket' && (
          <div>
            {submitted ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '24px 16px',
                  background: '#f9fefb',
                  borderRadius: '10px',
                  border: '1px solid #c8eedb',
                }}
              >
                <CheckCircle2 size={42} color="#22966b" style={{ margin: '0 auto 10px' }} />
                <h3 style={{ margin: '0 0 6px', fontSize: '17px', color: '#1f2937' }}>
                  Support Ticket Submitted!
                </h3>
                <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#555' }}>
                  Your ticket ID is <b>{ticketId}</b>. A support agent has received your request and will follow up shortly.
                </p>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={handleReset}
                  style={{ display: 'inline-flex' }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <label>
                    Issue Category
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                      <option value="Payment Gateway">Payment Gateway & Transactions</option>
                      <option value="Orders & Shipping">Orders & Shipping</option>
                      <option value="Product Catalogue">Product Photos & Catalogue</option>
                      <option value="Account & Security">Account & Security</option>
                      <option value="Other">Other Query</option>
                    </select>
                  </label>
                  <label>
                    Urgency Level
                    <select value={urgency} onChange={e => setUrgency(e.target.value)}>
                      <option value="Urgent">🚨 Urgent (Immediate assistance)</option>
                      <option value="High">⚡ High priority</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </label>
                </div>

                <label>
                  Subject *
                  <input
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Issue configuring bKash automated callback"
                  />
                </label>

                <label>
                  Describe your problem or request *
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Provide details of what you need help with..."
                    style={{
                      width: '100%',
                      border: '1px solid var(--line)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      font: '12px "DM Sans", sans-serif',
                      outlineColor: '#b9b1ff',
                      resize: 'vertical',
                    }}
                  />
                </label>

                <div className="modal-actions">
                  <button type="button" className="btn secondary" onClick={onClose}>
                    Close
                  </button>
                  <button className="btn primary" type="submit">
                    <Send size={15} /> Send Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* FAQs */}
        {tab === 'faq' && (
          <div style={{ display: 'grid', gap: '10px' }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 14px',
                  borderRadius: '9px',
                  border: '1px solid #eeedf3',
                  background: '#fff',
                }}
              >
                <b style={{ fontSize: '13px', color: '#2d2d42', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HelpCircle size={15} color="#6b5ce7" /> {faq.q}
                </b>
                <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#666', lineHeight: 1.5 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
