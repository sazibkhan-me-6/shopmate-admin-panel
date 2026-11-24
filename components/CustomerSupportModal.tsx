'use client';
import { useState, useEffect, useRef } from 'react';
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
  Radio,
  User,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Check,
  ArrowRight,
  Bell,
  Bot,
  Zap,
  Plus,
  Trash2,
  Wand2,
  Play,
  Cpu,
  Globe,
} from 'lucide-react';

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
}

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendTicket?: (ticket: { id: string; subject: string; category: string; message: string }) => void;
  onNotice?: (msg: string) => void;
  initialTicketId?: string | null;
  initialTab?: 'inbox' | 'ai' | 'config' | 'create' | 'faq';
  onSimulateKnock?: () => void;
  onAiStatusChange?: (enabled: boolean) => void;
}

const FAQS = [
  {
    q: 'How does live customer support connect to the main website?',
    a: 'Customer inquiries submitted via the live chat widget and contact form on https://shopmate-ecommerce-kohl.vercel.app/ are routed directly to this admin hub via CORS REST API (/api/support).',
  },
  {
    q: 'What is the official ShopMate support hotline and WhatsApp?',
    a: 'Phone & WhatsApp: +880 1614703406 (Banani, Dhaka). Customers can call directly or launch WhatsApp chat with 1 click.',
  },
  {
    q: 'How to verify bKash or Nagad transactions when customer inquires?',
    a: 'Match the TrxID provided by the customer against the Orders page under the TrxID column, then confirm order status.',
  },
  {
    q: 'How do customers get returns and refunds?',
    a: 'ShopMate provides a 7-day hassle-free money-back policy. Agents can mark tickets resolved once courier return is picked up.',
  },
];

const INITIAL_TICKETS: SupportTicket[] = [
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

export default function CustomerSupportModal({
  isOpen,
  onClose,
  onSendTicket,
  onNotice,
  initialTicketId,
  initialTab,
  onSimulateKnock,
  onAiStatusChange,
}: CustomerSupportModalProps) {
  const [tab, setTab] = useState<'inbox' | 'ai' | 'config' | 'create' | 'faq'>('inbox');
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('#TKT-8841');

  useEffect(() => {
    if (isOpen && initialTab) {
      setTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (initialTicketId) {
      setSelectedTicketId(initialTicketId);
      setTab('inbox');
    }
  }, [initialTicketId]);
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Storefront Support Configuration State
  const [supportPhone, setSupportPhone] = useState('+880 1614703406');
  const [supportWhatsapp, setSupportWhatsapp] = useState('+880 1614703406');
  const [supportEmail, setSupportEmail] = useState('support@shopmate.com');
  const [supportAddress, setSupportAddress] = useState('House 42, Road 11, Block D, Banani, Dhaka - 1213, Bangladesh');
  const [operatingHours, setOperatingHours] = useState('24/7 Live Chat · Phone Hotline: 9:00 AM – 11:00 PM BST');
  const [chatStatus, setChatStatus] = useState<'online' | 'busy' | 'away'>('online');
  const [autoWelcomeMessage, setAutoWelcomeMessage] = useState('👋 Welcome to ShopMate 24/7 Support! Our support team is online and ready to assist you.');
  const [savedNotice, setSavedNotice] = useState('');

  // AI Automation State
  const [aiConfig, setAiConfig] = useState<AIAutomationConfig>({
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
        keywords: ['delivery', 'shipping', 'courier', 'dhaka', 'chattogram', 'sylhet', 'কবে', 'ডেলিভারি'],
        reply: '🚚 ShopMate ডেলিভারি তথ্য: ঢাকার ভিতরে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ২-৩ কার্যদিবসের মধ্যে Steadfast/Pathao কুরিয়ারে ডেলিভারি করা হয়। $50+ অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!',
        active: true,
        hitCount: 42,
      },
      {
        id: 'rule-payment',
        title: 'bKash / Nagad & Cash on Delivery',
        keywords: ['bkash', 'nagad', 'trxid', 'payment', 'cod', 'বিকাশ', 'নগদ', 'পেমেন্ট'],
        reply: '💳 পেমেন্ট ও ভেরিফিকেশন: আমরা bKash, Nagad, SSLCommerz এবং সারা বাংলাদেশে Cash on Delivery (COD) সাপোর্ট করি। আপনার TrxID শেয়ার করলে আমাদের টিম ২ মিনিটের মধ্যে অর্ডার কনফার্ম করে দেবে।',
        active: true,
        hitCount: 31,
      },
    ],
    stats: {
      totalAutoReplies: 134,
      resolvedByAi: 98,
      avgResponseTimeSec: 1.2,
      escalatedToHuman: 14,
    },
  });
  const [aiSavedNotice, setAiSavedNotice] = useState('');
  const [isSavingAi, setIsSavingAi] = useState(false);
  const [escalateInput, setEscalateInput] = useState('refund, damaged, broken, fraud, manager, cancel, রিফান্ড, নষ্ট, ক্যানসেল');

  // New AI Rule Form
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleKeywords, setNewRuleKeywords] = useState('');
  const [newRuleReply, setNewRuleReply] = useState('');

  // AI Sandbox Tester State
  const [sandboxPrompt, setSandboxPrompt] = useState('');
  const [sandboxResult, setSandboxResult] = useState<{
    reply: string;
    matchedRuleTitle: string | null;
    escalated: boolean;
    detectedCategory: string;
    detectedUrgency: string;
  } | null>(null);
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [isDraftingAi, setIsDraftingAi] = useState(false);

  // Ticket creation form
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'Orders & Shipping' | 'Payment Gateway' | 'Product Inquiry' | 'Returns & Refunds' | 'Technical Support' | 'General'>('Payment Gateway');
  const [urgency, setUrgency] = useState<'Urgent' | 'High' | 'Normal'>('High');
  const [message, setMessage] = useState('');
  const [customerName, setCustomerName] = useState('Storefront Customer');
  const [customerPhone, setCustomerPhone] = useState('+880 1614-703406');
  const [submitted, setSubmitted] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load live support tickets & AI automation config from API
  const fetchLiveSupport = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/support');
      if (res.ok) {
        const json = await res.json();
        if (json.tickets && Array.isArray(json.tickets)) {
          setTickets(json.tickets);
        }
        if (json.config) {
          setSupportPhone(json.config.hotline || '+880 1614703406');
          setSupportWhatsapp(json.config.whatsapp || '+880 1614703406');
          setSupportEmail(json.config.email || 'support@shopmate.com');
          setSupportAddress(json.config.address || 'House 42, Road 11, Block D, Banani, Dhaka');
          setOperatingHours(json.config.operatingHours || '24/7 Live Assistance');
          setChatStatus(json.config.chatStatus || 'online');
          setAutoWelcomeMessage(json.config.autoWelcomeMessage || '');
        }
        if (json.aiAutomation) {
          setAiConfig(json.aiAutomation);
          setEscalateInput((json.aiAutomation.autoEscalateKeywords || []).join(', '));
          onAiStatusChange?.(Boolean(json.aiAutomation.enabled));
        }
      }
    } catch (e) {
      // quiet fallback
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLiveSupport();
      const timer = setInterval(fetchLiveSupport, 10000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicketId, tickets]);

  if (!isOpen) return null;

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const replyMsg = replyText.trim();
    setReplyText('');

    // Optimistic update
    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: t.status === 'New' ? ('In Progress' as const) : t.status,
          unread: false,
          messages: [
            ...t.messages,
            {
              id: 'msg-' + Date.now(),
              sender: 'admin' as const,
              senderName: 'ShopMate Admin Support',
              text: replyMsg,
              timestamp: 'Just now',
            },
          ],
        };
      }
      return t;
    });

    setTickets(updatedTickets);

    try {
      await fetch('/api/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          replyMessage: replyMsg,
          status: 'In Progress',
          senderName: 'ShopMate Admin Support',
        }),
      });
      if (onNotice) {
        onNotice(`Reply sent to ${selectedTicket.customerName} for ticket ${selectedTicket.id}!`);
      }
    } catch (e) {
      console.error('Failed to post reply to API', e);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status: newStatus, unread: false } : t))
    );

    try {
      await fetch('/api/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          status: newStatus,
        }),
      });
      if (onNotice) {
        onNotice(`Ticket ${ticketId} marked as ${newStatus}!`);
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleSaveSupportConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cfg = {
        hotline: supportPhone,
        whatsapp: supportWhatsapp,
        email: supportEmail,
        address: supportAddress,
        operatingHours,
        chatStatus,
        autoWelcomeMessage,
      };

      await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_config', config: cfg }),
      });

      // Also sync to store endpoint
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          support: {
            email: supportEmail,
            phone: supportPhone,
            whatsapp: supportWhatsapp,
            hours: operatingHours,
            status: chatStatus,
          },
        }),
      });

      setSavedNotice('Support configuration synced successfully with storefront!');
      setTimeout(() => setSavedNotice(''), 4000);
      if (onNotice) {
        onNotice('Support hotline, WhatsApp & live chat settings updated on storefront!');
      }
    } catch (e) {
      alert('Failed to save support settings.');
    }
  };

  const persistAiConfig = async (nextConfig: AIAutomationConfig, noticeText?: string) => {
    setAiConfig(nextConfig);
    onAiStatusChange?.(nextConfig.enabled);
    setIsSavingAi(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_ai_config',
          aiConfig: nextConfig,
        }),
      });
      if (res.ok) {
        const msg = noticeText || '✨ AI Automation settings saved & synced to live storefront!';
        setAiSavedNotice(msg);
        setTimeout(() => setAiSavedNotice(''), 4000);
        onNotice?.(msg);
      }
    } catch (e) {
      // fallback
    } finally {
      setIsSavingAi(false);
    }
  };

  const handleSaveAiConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const keywords = escalateInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const updated: AIAutomationConfig = {
      ...aiConfig,
      autoEscalateKeywords: keywords,
    };
    await persistAiConfig(updated);
  };

  const handleToggleAiMaster = async () => {
    const nextEnabled = !aiConfig.enabled;
    const updated: AIAutomationConfig = { ...aiConfig, enabled: nextEnabled };
    await persistAiConfig(
      updated,
      nextEnabled
        ? '🤖 Customer Support AI Automation is now ACTIVE!'
        : '⏸️ Customer Support AI Automation paused (Manual Mode).'
    );
  };

  const handleAddAiRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTitle.trim() || !newRuleKeywords.trim() || !newRuleReply.trim()) return;
    const rule: AIKnowledgeRule = {
      id: 'rule-' + Date.now(),
      title: newRuleTitle.trim(),
      keywords: newRuleKeywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean),
      reply: newRuleReply.trim(),
      active: true,
      hitCount: 0,
    };
    const updated: AIAutomationConfig = {
      ...aiConfig,
      knowledgeRules: [rule, ...aiConfig.knowledgeRules],
    };
    setNewRuleTitle('');
    setNewRuleKeywords('');
    setNewRuleReply('');
    setShowAddRule(false);
    await persistAiConfig(updated, `✨ AI Rule "${rule.title}" added & activated!`);
  };

  const handleToggleAiRule = async (ruleId: string) => {
    const updated: AIAutomationConfig = {
      ...aiConfig,
      knowledgeRules: aiConfig.knowledgeRules.map(r =>
        r.id === ruleId ? { ...r, active: !r.active } : r
      ),
    };
    await persistAiConfig(updated, 'AI rule status updated.');
  };

  const handleDeleteAiRule = async (ruleId: string) => {
    const updated: AIAutomationConfig = {
      ...aiConfig,
      knowledgeRules: aiConfig.knowledgeRules.filter(r => r.id !== ruleId),
    };
    await persistAiConfig(updated, 'AI rule removed.');
  };

  const handleTestAiSandbox = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sandboxPrompt.trim()) return;
    setIsTestingAi(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_ai_prompt',
          prompt: sandboxPrompt.trim(),
          customerName: 'Valued Customer',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSandboxResult({
          reply: data.reply,
          matchedRuleTitle: data.matchedRuleTitle,
          escalated: data.escalated,
          detectedCategory: data.detectedCategory,
          detectedUrgency: data.detectedUrgency,
        });
      }
    } catch (err) {
      // fallback
    } finally {
      setIsTestingAi(false);
    }
  };

  const handleAiSmartDraft = async () => {
    if (!selectedTicket) return;
    const customerMsgs = selectedTicket.messages.filter(m => m.sender === 'customer');
    const latestText =
      customerMsgs.length > 0
        ? customerMsgs[customerMsgs.length - 1].text
        : selectedTicket.subject;

    setIsDraftingAi(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_ai_prompt',
          prompt: latestText,
          customerName: selectedTicket.customerName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setReplyText(data.reply);
        }
      }
    } catch (err) {
      // fallback
    } finally {
      setIsDraftingAi(false);
    }
  };

  const handleCreateTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newId = '#TKT-' + Math.floor(1000 + Math.random() * 9000);
    const newTkt: SupportTicket = {
      id: newId,
      customerName: customerName.trim(),
      customerEmail: 'customer@example.com',
      customerPhone: customerPhone.trim(),
      subject: subject.trim(),
      category,
      urgency,
      status: 'New',
      source: 'Admin Portal',
      createdAt: new Date().toISOString(),
      unread: true,
      messages: [
        {
          id: 'msg-' + Date.now(),
          sender: 'customer',
          senderName: customerName.trim(),
          text: message.trim(),
          timestamp: 'Just now',
        },
      ],
    };

    setTickets([newTkt, ...tickets]);
    setSelectedTicketId(newId);
    setCreatedTicketId(newId);
    setSubmitted(true);

    try {
      await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTkt),
      });
      if (onSendTicket) {
        onSendTicket({
          id: newId,
          subject,
          category,
          message,
        });
      }
    } catch (e) {}
  };

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filterStatus === 'all' || t.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      (t.customerName + ' ' + t.customerPhone + ' ' + t.subject + ' ' + t.id)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = tickets.filter(t => t.unread).length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        style={{
          width: 'min(940px, 96%)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 24px',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="panel-head"
          style={{
            marginBottom: '16px',
            borderBottom: '1px solid #eeedf3',
            paddingBottom: '14px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#f2f0ff',
                color: '#6b5ce7',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 2px 8px rgba(107, 92, 231, 0.15)',
              }}
            >
              <Headphones size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                  Customer Support Center
                </h2>
                <span
                  style={{
                    background: '#e9f8f1',
                    color: '#22966b',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid #c2ebd5',
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
                  Connected to shopmate-ecommerce-kohl.vercel.app
                </span>
                <button
                  type="button"
                  onClick={() => setTab('ai')}
                  title="Click to configure Customer Support AI Automation"
                  style={{
                    background: aiConfig.enabled ? 'linear-gradient(135deg, #6b5ce7 0%, #8b5cf6 100%)' : '#f1f5f9',
                    color: aiConfig.enabled ? '#fff' : '#64748b',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: aiConfig.enabled ? 'none' : '1px solid #cbd5e1',
                    cursor: 'pointer',
                    boxShadow: aiConfig.enabled ? '0 2px 8px rgba(107,92,231,0.3)' : 'none',
                  }}
                >
                  <Bot size={11} />
                  AI Automation: {aiConfig.enabled ? 'ON' : 'OFF'}
                </button>
                {unreadCount > 0 && (
                  <span
                    style={{
                      background: '#fee2e2',
                      color: '#ef4444',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '10px',
                    }}
                  >
                    {unreadCount} New Inquiry
                  </span>
                )}
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
                Real-time customer inquiries, live chat messages, and official hotline & WhatsApp control
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onSimulateKnock && (
              <button
                type="button"
                className="btn secondary"
                onClick={onSimulateKnock}
                title="Simulate a live customer inquiry from the website to test chime & pop-up alert"
                style={{
                  height: '30px',
                  fontSize: '11px',
                  padding: '0 10px',
                  gap: '5px',
                  background: '#fef3c7',
                  borderColor: '#fde68a',
                  color: '#b45309',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <Bell size={13} />
                <span>Test Live Knock</span>
              </button>
            )}
            <button
              type="button"
              className="icon-btn"
              onClick={fetchLiveSupport}
              title="Refresh support messages"
              style={{ padding: '6px', color: '#6b5ce7' }}
            >
              <RefreshCw size={16} className={isSyncing ? 'spin-animation' : ''} />
            </button>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Official Contact Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '10px',
            marginBottom: '16px',
            flexShrink: 0,
          }}
        >
          <a
            href={`https://wa.me/${supportWhatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: 'none',
              padding: '10px 12px',
              borderRadius: '9px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'inherit',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#22c55e',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <MessageCircle size={16} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '10px', color: '#166534', fontWeight: 700 }}>
                Live WhatsApp Desk ↗
              </div>
              <b style={{ fontSize: '12px', color: '#14532d' }}>{supportWhatsapp}</b>
            </div>
          </a>

          <a
            href={`tel:${supportPhone}`}
            style={{
              textDecoration: 'none',
              padding: '10px 12px',
              borderRadius: '9px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'inherit',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#6366f1',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Phone size={16} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '10px', color: '#4338ca', fontWeight: 700 }}>
                Hotline (Call Direct)
              </div>
              <b style={{ fontSize: '12px', color: '#1e1b4b' }}>{supportPhone}</b>
            </div>
          </a>

          <div
            style={{
              padding: '10px 12px',
              borderRadius: '9px',
              background: '#faf5ff',
              border: '1px solid #e9d5ff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#a855f7',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Mail size={16} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '10px', color: '#7e22ce', fontWeight: 700 }}>
                Official Email Desk
              </div>
              <b style={{ fontSize: '12px', color: '#581c87' }}>{supportEmail}</b>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            borderBottom: '1px solid #eeedf3',
            paddingBottom: '8px',
            flexShrink: 0,
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            className={`tab-pill ${tab === 'inbox' ? 'active' : ''}`}
            onClick={() => setTab('inbox')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <MessageCircle size={14} /> Live Customer Inquiries ({tickets.length})
            {unreadCount > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '9px',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`tab-pill ${tab === 'ai' ? 'active' : ''}`}
            onClick={() => setTab('ai')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: tab === 'ai' ? '#6b5ce7' : '#f4f1ff',
              color: tab === 'ai' ? '#fff' : '#6b5ce7',
              borderColor: '#ddd6fe',
              fontWeight: 700,
            }}
          >
            <Sparkles size={14} /> AI Automation
            <span
              style={{
                background: aiConfig.enabled ? '#22c55e' : '#94a3b8',
                color: '#fff',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '9px',
                fontWeight: 800,
              }}
            >
              {aiConfig.enabled ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            type="button"
            className={`tab-pill ${tab === 'config' ? 'active' : ''}`}
            onClick={() => setTab('config')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Radio size={14} /> Storefront Support Controls
          </button>

          <button
            type="button"
            className={`tab-pill ${tab === 'create' ? 'active' : ''}`}
            onClick={() => {
              setSubmitted(false);
              setTab('create');
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Send size={14} /> Log Support Ticket
          </button>

          <button
            type="button"
            className={`tab-pill ${tab === 'faq' ? 'active' : ''}`}
            onClick={() => setTab('faq')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <HelpCircle size={14} /> Support FAQs ({FAQS.length})
          </button>
        </div>

        {/* TAB 1: LIVE INQUIRIES & CHAT STREAM */}
        {tab === 'inbox' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 340px) 1fr',
              gap: '16px',
              flex: 1,
              minHeight: '420px',
            }}
          >
            {/* Left: Ticket list */}
            <div
              style={{
                border: '1px solid #eeedf3',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              {/* Search & Status Filters */}
              <div style={{ padding: '10px', borderBottom: '1px solid #eeedf3', background: '#faf9fe' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '5px 8px',
                    marginBottom: '8px',
                  }}
                >
                  <Search size={13} color="#94a3b8" />
                  <input
                    type="text"
                    placeholder="Search inquiries, phone, id..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '11px',
                      fontFamily: 'inherit',
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  {['all', 'new', 'in progress', 'resolved'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFilterStatus(st)}
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '3px 7px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        background: filterStatus === st ? '#6b5ce7' : '#eee',
                        color: filterStatus === st ? '#fff' : '#64748b',
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tickets Scroll List */}
              <div style={{ overflowY: 'auto', flex: 1, maxHeight: '380px' }}>
                {filteredTickets.map(tkt => {
                  const isSelected = selectedTicket?.id === tkt.id;
                  return (
                    <div
                      key={tkt.id}
                      onClick={() => {
                        setSelectedTicketId(tkt.id);
                        if (tkt.unread) {
                          setTickets(prev =>
                            prev.map(t => (t.id === tkt.id ? { ...t, unread: false } : t))
                          );
                        }
                      }}
                      style={{
                        padding: '12px 14px',
                        borderBottom: '1px solid #f1f0f7',
                        cursor: 'pointer',
                        background: isSelected ? '#f5f3ff' : tkt.unread ? '#faf8fe' : '#fff',
                        borderLeft: isSelected ? '3px solid #6b5ce7' : tkt.unread ? '3px solid #ef4444' : '3px solid transparent',
                        transition: 'all .15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <b style={{ fontSize: '12px', color: '#1e293b' }}>{tkt.customerName}</b>
                          {tkt.unread && (
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#ef4444',
                              }}
                            />
                          )}
                        </div>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>{tkt.id}</span>
                      </div>

                      <div
                        style={{
                          fontSize: '11px',
                          color: '#475569',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginBottom: '6px',
                        }}
                      >
                        {tkt.subject}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background:
                              tkt.status === 'New'
                                ? '#fee2e2'
                                : tkt.status === 'In Progress'
                                ? '#fef3c7'
                                : '#dcfce7',
                            color:
                              tkt.status === 'New'
                                ? '#dc2626'
                                : tkt.status === 'In Progress'
                                ? '#d97706'
                                : '#16a34a',
                          }}
                        >
                          {tkt.status}
                        </span>

                        <span
                          style={{
                            fontSize: '9px',
                            color: '#64748b',
                            background: '#f1f5f9',
                            padding: '2px 5px',
                            borderRadius: '4px',
                          }}
                        >
                          {tkt.source}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredTickets.length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                    No customer inquiries found.
                  </div>
                )}
              </div>
            </div>

            {/* Right: Selected Ticket Chat & Action Area */}
            {selectedTicket ? (
              <div
                style={{
                  border: '1px solid #eeedf3',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: '#fff',
                }}
              >
                {/* Detail Header */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #eeedf3',
                    background: '#faf9fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <b style={{ fontSize: '14px', color: '#0f172a' }}>{selectedTicket.subject}</b>
                      <span
                        style={{
                          fontSize: '10px',
                          color: '#6b5ce7',
                          background: '#f0edff',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 700,
                        }}
                      >
                        {selectedTicket.id}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '3px' }}>
                      <span>👤 {selectedTicket.customerName}</span>
                      <span>📞 {selectedTicket.customerPhone}</span>
                      <span>✉️ {selectedTicket.customerEmail}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <a
                      href={`https://wa.me/${selectedTicket.customerPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '5px 9px',
                        background: '#22c55e',
                        color: '#fff',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="Open WhatsApp chat with customer"
                    >
                      <MessageCircle size={12} /> WhatsApp
                    </a>

                    {selectedTicket.status !== 'Resolved' ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedTicket.id, 'Resolved')}
                        style={{
                          padding: '5px 9px',
                          background: '#e9f8f1',
                          color: '#22966b',
                          border: '1px solid #bbf7d0',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Check size={12} /> Resolve
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedTicket.id, 'In Progress')}
                        style={{
                          padding: '5px 9px',
                          background: '#f1f5f9',
                          color: '#475569',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Re-open
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages Thread */}
                <div
                  style={{
                    padding: '16px',
                    overflowY: 'auto',
                    flex: 1,
                    maxHeight: '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    background: '#fcfbfe',
                  }}
                >
                  {selectedTicket.messages.map(msg => {
                    const isAdmin = msg.sender === 'admin';
                    const isBot = msg.sender === 'bot';
                    const alignRight = isAdmin || isBot;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: alignRight ? 'flex-end' : 'flex-start',
                          maxWidth: '82%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: alignRight ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '10px',
                            color: isBot ? '#7c3aed' : '#94a3b8',
                            marginBottom: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {isBot && <Bot size={11} color="#7c3aed" />}
                          <b>{msg.senderName}</b>
                          <span>· {msg.timestamp}</span>
                        </div>
                        <div
                          style={{
                            padding: '10px 14px',
                            borderRadius: '12px',
                            background: isBot
                              ? 'linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%)'
                              : isAdmin
                                ? '#6b5ce7'
                                : '#fff',
                            color: isBot ? '#4c1d95' : isAdmin ? '#fff' : '#1e293b',
                            fontSize: '12px',
                            lineHeight: 1.5,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                            border: isBot
                              ? '1px solid #d8b4fe'
                              : isAdmin
                                ? 'none'
                                : '1px solid #e2e8f0',
                            borderBottomRightRadius: alignRight ? '2px' : '12px',
                            borderBottomLeftRadius: alignRight ? '12px' : '2px',
                          }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick Response Templates */}
                <div
                  style={{
                    padding: '6px 12px',
                    background: '#faf9fe',
                    borderTop: '1px solid #f1f0f7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    overflowX: 'auto',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleAiSmartDraft}
                    disabled={isDraftingAi}
                    title="Let AI draft a context-aware reply based on customer's message"
                    style={{
                      border: '1px solid #c4b5fd',
                      background: 'linear-gradient(135deg, #6b5ce7 0%, #8b5cf6 100%)',
                      borderRadius: '12px',
                      padding: '4px 10px',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#fff',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(107,92,231,0.25)',
                    }}
                  >
                    <Wand2 size={11} /> {isDraftingAi ? 'Drafting...' : 'AI Smart Draft'}
                  </button>
                  <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, flexShrink: 0 }}>
                    Quick Reply:
                  </span>
                  {[
                    'Payment verified & order processing! 📦',
                    'Delivery takes 2-3 days via courier. 🚚',
                    'Product is 100% authentic with warranty. ✅',
                    'Refund has been initiated to your account. 💳',
                  ].map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReplyText(preset)}
                      style={{
                        border: '1px solid #e2e8f0',
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '3px 8px',
                        fontSize: '10px',
                        color: '#475569',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Reply Form */}
                <form
                  onSubmit={handleSendReply}
                  style={{
                    padding: '10px 12px',
                    borderTop: '1px solid #eeedf3',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#fff',
                  }}
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={`Reply to ${selectedTicket.customerName}...`}
                    style={{
                      flex: 1,
                      height: '38px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '0 12px',
                      fontSize: '12px',
                      fontFamily: 'inherit',
                      outlineColor: '#b9b1ff',
                    }}
                  />
                  <button
                    type="submit"
                    className="btn primary"
                    style={{ height: '38px', padding: '0 16px', gap: '6px' }}
                    disabled={!replyText.trim()}
                  >
                    <Send size={14} /> Send
                  </button>
                </form>
              </div>
            ) : (
              <div
                style={{
                  border: '1px solid #eeedf3',
                  borderRadius: '10px',
                  display: 'grid',
                  placeItems: 'center',
                  padding: '30px',
                  color: '#94a3b8',
                }}
              >
                Select an inquiry from the list to view conversation.
              </div>
            )}
          </div>
        )}

        {/* TAB AI: CUSTOMER SUPPORT AI AUTOMATION */}
        {tab === 'ai' && (
          <div style={{ display: 'grid', gap: '16px', flex: 1 }}>
            {/* Master AI Automation Switch & Hero Card */}
            <div
              style={{
                background: aiConfig.enabled
                  ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
                  : '#f8fafc',
                border: aiConfig.enabled ? '1px solid #c4b5fd' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 18px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: aiConfig.enabled
                      ? 'linear-gradient(135deg, #6b5ce7 0%, #8b5cf6 100%)'
                      : '#94a3b8',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: aiConfig.enabled ? '0 4px 12px rgba(107,92,231,0.3)' : 'none',
                  }}
                >
                  <Bot size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <b style={{ fontSize: '15px', color: '#1e1b4b' }}>
                      Customer Support AI Automation Engine
                    </b>
                    <span
                      style={{
                        background: aiConfig.enabled ? '#22c55e' : '#94a3b8',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '12px',
                      }}
                    >
                      {aiConfig.enabled ? '● ACTIVE' : '○ PAUSED'}
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#5b5b76' }}>
                    Automatically replies to website customer knocks in Bangla &amp; English, categorizes tickets, and escalates urgent cases to admin.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleAiMaster}
                disabled={isSavingAi}
                style={{
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  background: aiConfig.enabled ? '#ef4444' : '#22c55e',
                  color: '#fff',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
                }}
              >
                <Zap size={14} />
                {aiConfig.enabled ? 'Turn OFF AI Auto-Reply' : 'Turn ON AI Auto-Reply'}
              </button>
            </div>

            {aiSavedNotice && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#e9f8f1',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={15} /> {aiSavedNotice}
              </div>
            )}

            {/* AI Live Stats Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '10px',
              }}
            >
              <div style={{ background: '#fff', border: '1px solid #eeedf3', borderRadius: '10px', padding: '12px' }}>
                <small style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>AI Auto-Replies Sent</small>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#6b5ce7', marginTop: '4px' }}>
                  {aiConfig.stats.totalAutoReplies}
                </div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #eeedf3', borderRadius: '10px', padding: '12px' }}>
                <small style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>Resolved by AI</small>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#22966b', marginTop: '4px' }}>
                  {aiConfig.stats.resolvedByAi}{' '}
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
                    ({Math.round((aiConfig.stats.resolvedByAi / Math.max(1, aiConfig.stats.totalAutoReplies)) * 100)}%)
                  </span>
                </div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #eeedf3', borderRadius: '10px', padding: '12px' }}>
                <small style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>Avg AI Response Speed</small>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0ea5e9', marginTop: '4px' }}>
                  {aiConfig.stats.avgResponseTimeSec}s
                </div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #eeedf3', borderRadius: '10px', padding: '12px' }}>
                <small style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>Escalated to Human</small>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                  {aiConfig.stats.escalatedToHuman}
                </div>
              </div>
            </div>

            {/* Two-column layout: Settings & Live AI Sandbox */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '16px',
              }}
            >
              {/* Left: AI Behavior & Mode Configuration */}
              <form
                onSubmit={handleSaveAiConfig}
                style={{
                  background: '#fff',
                  border: '1px solid #eeedf3',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'grid',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f0f7', paddingBottom: '10px' }}>
                  <Cpu size={16} color="#6b5ce7" />
                  <b style={{ fontSize: '13px', color: '#1e293b' }}>AI Behavior &amp; Automation Controls</b>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Automation Mode
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {[
                      { id: 'autonomous', label: '24/7 Autonomous', desc: 'Replies to all knocks' },
                      { id: 'hybrid', label: 'Smart Hybrid', desc: 'FAQs + Admin Escalation' },
                      { id: 'after_hours', label: 'After-Hours', desc: '11 PM – 9 AM BST' },
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setAiConfig(prev => ({ ...prev, mode: m.id as AIAutomationConfig['mode'] }))}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: aiConfig.mode === m.id ? '2px solid #6b5ce7' : '1px solid #e2e8f0',
                          background: aiConfig.mode === m.id ? '#f5f3ff' : '#fff',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontSize: '11px', fontWeight: 700, color: aiConfig.mode === m.id ? '#6b5ce7' : '#334155' }}>
                          {m.label}
                        </div>
                        <small style={{ fontSize: '9px', color: '#64748b' }}>{m.desc}</small>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      <Globe size={11} style={{ display: 'inline', marginRight: '4px' }} />
                      Reply Language
                    </label>
                    <select
                      value={aiConfig.language}
                      onChange={e =>
                        setAiConfig(prev => ({ ...prev, language: e.target.value as AIAutomationConfig['language'] }))
                      }
                      style={{
                        width: '100%',
                        height: '34px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        padding: '0 8px',
                        fontSize: '12px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="bilingual">Auto-Detect (Bangla + English)</option>
                      <option value="bengali">Bengali Only (বাংলা)</option>
                      <option value="english">English Only</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      AI Tone / Style
                    </label>
                    <select
                      value={aiConfig.tone}
                      onChange={e =>
                        setAiConfig(prev => ({ ...prev, tone: e.target.value as AIAutomationConfig['tone'] }))
                      }
                      style={{
                        width: '100%',
                        height: '34px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        padding: '0 8px',
                        fontSize: '12px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="friendly">Friendly &amp; Warm</option>
                      <option value="professional">Formal &amp; Professional</option>
                      <option value="concise">Short &amp; Direct</option>
                    </select>
                  </div>
                </div>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#334155',
                    background: '#f8fafc',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={aiConfig.autoTagTickets}
                    onChange={e => setAiConfig(prev => ({ ...prev, autoTagTickets: e.target.checked }))}
                  />
                  <span>
                    <b>Auto-Categorize &amp; Set Priority:</b> AI automatically tags Payment, Shipping, Returns &amp; Urgent tickets.
                  </span>
                </label>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Human Escalation Trigger Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={escalateInput}
                    onChange={e => setEscalateInput(e.target.value)}
                    placeholder="refund, damaged, cancel, manager, রিফান্ড..."
                    style={{
                      width: '100%',
                      height: '34px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      padding: '0 10px',
                      fontSize: '11px',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn primary"
                  disabled={isSavingAi}
                  style={{ height: '36px', width: '100%', justifyContent: 'center', gap: '6px' }}
                >
                  <Sparkles size={14} /> {isSavingAi ? 'Syncing AI Settings...' : 'Save & Sync AI Automation'}
                </button>
              </form>

              {/* Right: Live Interactive AI Sandbox Tester */}
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #eeedf3',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f0f7', paddingBottom: '10px' }}>
                  <Play size={15} color="#22966b" />
                  <b style={{ fontSize: '13px', color: '#1e293b' }}>Live AI Response Simulator (Test Sandbox)</b>
                </div>

                <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
                  Test how your Customer Support AI will instantly reply when a shopper knocks on the website in Bangla or English.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {[
                    'ঢাকার বাইরে ডেলিভারি কবে পাবো?',
                    'bKash TrxID verify please',
                    'Product ki original warranty shoho?',
                    'I received a damaged item, want refund',
                  ].map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSandboxPrompt(sample)}
                      style={{
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        padding: '4px 9px',
                        fontSize: '10px',
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      “{sample}”
                    </button>
                  ))}
                </div>

                <form onSubmit={handleTestAiSandbox} style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={sandboxPrompt}
                    onChange={e => setSandboxPrompt(e.target.value)}
                    placeholder="Type a sample customer message..."
                    style={{
                      flex: 1,
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      padding: '0 10px',
                      fontSize: '12px',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    type="submit"
                    className="btn primary"
                    disabled={isTestingAi || !sandboxPrompt.trim()}
                    style={{ height: '36px', padding: '0 14px', gap: '5px' }}
                  >
                    <Wand2 size={13} /> {isTestingAi ? 'Testing...' : 'Test AI'}
                  </button>
                </form>

                {sandboxResult ? (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                      border: '1px solid #d8b4fe',
                      borderRadius: '10px',
                      padding: '12px',
                      display: 'grid',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b21a8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Bot size={13} /> ShopMate AI Instant Reply
                      </span>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '9px', background: '#fff', color: '#6b5ce7', padding: '2px 6px', borderRadius: '8px', fontWeight: 700 }}>
                          {sandboxResult.detectedCategory}
                        </span>
                        <span
                          style={{
                            fontSize: '9px',
                            background: sandboxResult.escalated ? '#fee2e2' : '#dcfce7',
                            color: sandboxResult.escalated ? '#dc2626' : '#166534',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontWeight: 700,
                          }}
                        >
                          {sandboxResult.escalated ? '⚠️ Escalated to Admin' : '✅ AI Handled'}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#3b0764', lineHeight: 1.5 }}>
                      {sandboxResult.reply}
                    </div>
                    <small style={{ fontSize: '10px', color: '#7e22ce' }}>
                      Matched Rule: <b>{sandboxResult.matchedRuleTitle || 'Smart Bilingual Fallback'}</b>
                    </small>
                  </div>
                ) : (
                  <div
                    style={{
                      flex: 1,
                      minHeight: '95px',
                      border: '1px dashed #cbd5e1',
                      borderRadius: '10px',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#94a3b8',
                      fontSize: '11px',
                      textAlign: 'center',
                      padding: '12px',
                    }}
                  >
                    Click a sample message above or type your own to preview the instant AI response.
                  </div>
                )}
              </div>
            </div>

            {/* AI Knowledge Base & Auto-Reply Rules Manager */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #eeedf3',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div>
                  <b style={{ fontSize: '13px', color: '#1e293b' }}>
                    AI Knowledge &amp; Auto-Reply Rules ({aiConfig.knowledgeRules.length})
                  </b>
                  <small style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>
                    Train your AI assistant with custom keyword triggers and instant automated answers.
                  </small>
                </div>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowAddRule(!showAddRule)}
                  style={{ height: '32px', fontSize: '11px', padding: '0 12px', gap: '5px', color: '#6b5ce7', borderColor: '#ddd6fe' }}
                >
                  <Plus size={14} /> {showAddRule ? 'Cancel' : 'Add New AI Rule'}
                </button>
              </div>

              {showAddRule && (
                <form
                  onSubmit={handleAddAiRule}
                  style={{
                    background: '#faf9fe',
                    border: '1px solid #ddd6fe',
                    borderRadius: '10px',
                    padding: '12px',
                    marginBottom: '14px',
                    display: 'grid',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                      type="text"
                      required
                      value={newRuleTitle}
                      onChange={e => setNewRuleTitle(e.target.value)}
                      placeholder="Rule Title (e.g., Discount & Coupon Info)"
                      style={{
                        height: '34px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        padding: '0 10px',
                        fontSize: '12px',
                      }}
                    />
                    <input
                      type="text"
                      required
                      value={newRuleKeywords}
                      onChange={e => setNewRuleKeywords(e.target.value)}
                      placeholder="Trigger Keywords (comma separated: coupon, discount, অফার)"
                      style={{
                        height: '34px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        padding: '0 10px',
                        fontSize: '12px',
                      }}
                    />
                  </div>
                  <textarea
                    required
                    rows={2}
                    value={newRuleReply}
                    onChange={e => setNewRuleReply(e.target.value)}
                    placeholder="Exact AI auto-reply message to send when customer mentions these keywords..."
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      padding: '8px 10px',
                      fontSize: '12px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn primary" style={{ height: '32px', fontSize: '11px', padding: '0 14px' }}>
                      <Plus size={13} /> Save AI Rule
                    </button>
                  </div>
                </form>
              )}

              <div style={{ display: 'grid', gap: '8px' }}>
                {aiConfig.knowledgeRules.map(rule => (
                  <div
                    key={rule.id}
                    style={{
                      border: '1px solid #eeedf3',
                      borderRadius: '9px',
                      padding: '10px 12px',
                      background: rule.active ? '#fff' : '#f8fafc',
                      opacity: rule.active ? 1 : 0.65,
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <b style={{ fontSize: '12px', color: '#1e293b' }}>{rule.title}</b>
                        <span
                          style={{
                            fontSize: '10px',
                            background: '#f0edff',
                            color: '#6b5ce7',
                            padding: '1px 7px',
                            borderRadius: '10px',
                            fontWeight: 700,
                          }}
                        >
                          {rule.hitCount} auto-replies
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '5px 0' }}>
                        {rule.keywords.slice(0, 8).map((kw, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '9px',
                              background: '#f1f5f9',
                              color: '#475569',
                              padding: '1px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', color: '#475569', lineHeight: 1.45 }}>
                        {rule.reply}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleToggleAiRule(rule.id)}
                        style={{
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontSize: '10px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: rule.active ? '#dcfce7' : '#e2e8f0',
                          color: rule.active ? '#166534' : '#475569',
                        }}
                      >
                        {rule.active ? 'Active' : 'Paused'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAiRule(rule.id)}
                        title="Delete AI rule"
                        style={{
                          border: '1px solid #fecaca',
                          background: '#fff',
                          color: '#ef4444',
                          borderRadius: '6px',
                          padding: '5px',
                          cursor: 'pointer',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STOREFRONT SUPPORT CONTROLS */}
        {tab === 'config' && (
          <form onSubmit={handleSaveSupportConfig} style={{ display: 'grid', gap: '14px', flex: 1 }}>
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <b style={{ fontSize: '13px', color: '#0f172a' }}>
                  Live Storefront Support Connection
                </b>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>
                  Changes saved here immediately update the customer service info on{' '}
                  <b>shopmate-ecommerce-kohl.vercel.app</b>
                </p>
              </div>
              <span
                style={{
                  background: '#ecfdf5',
                  color: '#15803d',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  border: '1px solid #bbf7d0',
                }}
              >
                ● Connected & Active
              </span>
            </div>

            {savedNotice && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  color: '#166534',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={16} /> {savedNotice}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label>
                Customer Support Hotline (Phone)
                <input
                  required
                  value={supportPhone}
                  onChange={e => setSupportPhone(e.target.value)}
                  placeholder="+880 1614703406"
                />
              </label>

              <label>
                WhatsApp Live Desk Number
                <input
                  required
                  value={supportWhatsapp}
                  onChange={e => setSupportWhatsapp(e.target.value)}
                  placeholder="+880 1614703406"
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label>
                Support Email Address
                <input
                  required
                  type="email"
                  value={supportEmail}
                  onChange={e => setSupportEmail(e.target.value)}
                  placeholder="support@shopmate.com"
                />
              </label>

              <label>
                Storefront Live Chat Status
                <select
                  value={chatStatus}
                  onChange={e => setChatStatus(e.target.value as any)}
                >
                  <option value="online">🟢 Online (Instant replies active)</option>
                  <option value="busy">🟡 Busy (Moderate reply times)</option>
                  <option value="away">⚪ Away (Auto-response with WhatsApp link)</option>
                </select>
              </label>
            </div>

            <label>
              Operating Hours / Availability
              <input
                value={operatingHours}
                onChange={e => setOperatingHours(e.target.value)}
                placeholder="24/7 Live Chat · Phone Hotline: 9:00 AM – 11:00 PM BST"
              />
            </label>

            <label>
              Head Office / Customer Care Address
              <input
                value={supportAddress}
                onChange={e => setSupportAddress(e.target.value)}
                placeholder="House 42, Road 11, Block D, Banani, Dhaka - 1213"
              />
            </label>

            <label>
              Auto-Greeting Message (Storefront Floating Chat)
              <textarea
                rows={2}
                value={autoWelcomeMessage}
                onChange={e => setAutoWelcomeMessage(e.target.value)}
                placeholder="Message shown when visitor opens live chat..."
                style={{
                  width: '100%',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  outlineColor: '#b9b1ff',
                }}
              />
            </label>

            <div className="modal-actions" style={{ marginTop: '10px' }}>
              <button type="button" className="btn secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn primary" type="submit">
                <Check size={15} /> Save & Broadcast to Main Website
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: CREATE INTERNAL SUPPORT TICKET */}
        {tab === 'create' && (
          <div>
            {submitted ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '30px 16px',
                  background: '#f9fefb',
                  borderRadius: '10px',
                  border: '1px solid #c8eedb',
                }}
              >
                <CheckCircle2 size={46} color="#22966b" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ margin: '0 0 6px', fontSize: '18px', color: '#1f2937' }}>
                  Support Ticket Logged!
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#555' }}>
                  Ticket <b>{createdTicketId}</b> has been queued into the customer support stream.
                </p>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => setTab('inbox')}
                  style={{ display: 'inline-flex' }}
                >
                  View in Support Inquiries
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateTicketSubmit} style={{ display: 'grid', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <label>
                    Customer Name *
                    <input
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Sazib Khan"
                    />
                  </label>
                  <label>
                    Customer Phone / WhatsApp *
                    <input
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="+880 1614-703406"
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    Issue Category
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as any)}
                    >
                      <option value="Payment Gateway">Payment Gateway & bKash/Nagad</option>
                      <option value="Orders & Shipping">Orders & Courier Delivery</option>
                      <option value="Product Inquiry">Product Inquiry & Stock</option>
                      <option value="Returns & Refunds">Returns & Refunds</option>
                      <option value="Technical Support">Technical & Website Support</option>
                      <option value="General">General Inquiry</option>
                    </select>
                  </label>
                  <label>
                    Urgency Level
                    <select
                      value={urgency}
                      onChange={e => setUrgency(e.target.value as any)}
                    >
                      <option value="Urgent">🚨 Urgent (Immediate assistance)</option>
                      <option value="High">⚡ High priority</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </label>
                </div>

                <label>
                  Ticket Subject *
                  <input
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. bKash payment verification inquiry"
                  />
                </label>

                <label>
                  Customer Message / Inquiry Details *
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Enter message details..."
                    style={{
                      width: '100%',
                      border: '1px solid var(--line)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      font: '12px "DM Sans", sans-serif',
                      outlineColor: '#b9b1ff',
                    }}
                  />
                </label>

                <div className="modal-actions" style={{ marginTop: '10px' }}>
                  <button type="button" className="btn secondary" onClick={onClose}>
                    Close
                  </button>
                  <button className="btn primary" type="submit">
                    <Send size={15} /> Submit Support Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 4: SUPPORT FAQS */}
        {tab === 'faq' && (
          <div style={{ display: 'grid', gap: '10px', overflowY: 'auto' }}>
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
                <b
                  style={{
                    fontSize: '13px',
                    color: '#2d2d42',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
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
