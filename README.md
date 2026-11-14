# ShopMate Admin Panel 🛍️

A modern, responsive e-commerce admin control panel built with **Next.js 14 (App Router)**, **TypeScript**, **React 18**, and **Lucide Icons**. Designed to manage products with photo uploads, price discount controls, product editing, customer profiles with address & phone updates, order delivery tracking with shipping info, payment gateway toggles, and 24/7 customer support.

## ✨ Features

- **📑 Order Tracking with Phone & Shipping Address:**
  - View each order's customer name, **direct contact phone number**, and **complete delivery address**.
  - Live status tracking (`Processing`, `Shipped`, `Delivered`, `Cancelled`).
  - Search orders by ID, customer name, phone number, or delivery address.
  - Enhanced CSV export (`shopmate-orders.csv`) including Customer Phone and Full Address.

- **🏷️ Product Pricing, Discounts & Full Editing System:**
  - **Regular Price & Discount Rate (%)**: Set regular price and discount percentage with instant live preview of the final selling price.
  - **Discount Badges**: Struck-through original price and green discount percentage tag (e.g. `-15% OFF`).
  - **Product Editing**: Click the Edit icon on any product to update name, category, SKU, regular price, discount %, stock, status, or photo.
  - **Photo Upload**: Local image upload (with instant FileReader preview) or direct image URL, plus quick sample preset photos.
  - Live stock status badges (`Active`, `Low stock`, `Draft`).

- **👥 Customer Directory & Information Update:**
  - Registered customer profiles with avatar, email, direct phone number, and delivery address.
  - Order frequency and total lifetime spent tracking.
  - Account status tags (`VIP`, `Active`, `Inactive`).
  - **Update Customer Information**: Edit modal to update name, email, phone number, shipping address, and VIP status.
  - **Add New Customer**: Fast customer registration modal.

- **💳 Payment Method Control System:**
  - One-click control buttons in the topbar, sidebar, and store settings.
  - Full toggle controls (Active / Disabled) for checkout gateways:
    - **bKash (বিকাশ)** - Automated merchant checkout & mobile wallet payments.
    - **Nagad (নগদ)** - Direct gateway & personal merchant payment.
    - **Credit / Debit Cards** - Visa, Mastercard, AMEX with 3D Secure verification.
    - **Cash on Delivery (COD)** - In-house courier doorstep cash settlement.
    - **DBBL Rocket** - Dutch-Bangla mobile banking integration.
    - **International Gateways** - PayPal & global Stripe multi-currency processing.
  - Per-gateway configuration: Sandbox Test Mode vs Live Production, transaction fees (%), and merchant account info.

- **🎧 24/7 Customer Support & Help Desk:**
  - Dedicated Support button in the topbar, sidebar management menu, and sidebar bottom help card.
  - **Support Channels**:
    - Direct Email support (`support@shopmate.com`)
    - Toll-free Hotline (`+880 9600-123456`)
    - WhatsApp Live Chat Desk (`+880 1700-998877`)
  - **Support Ticket System**: Submit categorized tickets (Payment Gateway, Orders & Shipping, Catalogue, Account) with priority levels (Urgent, High, Normal) and auto-generated ticket IDs (`#TKT-XXXX`).
  - **Knowledgebase / FAQs**: Instant answers to common store configuration questions.

- **🏷️ Visual Category Management with Cover Photos:**
  - Visual category grid displaying category cover images, titles, and item counts.
  - **Add Category Modal with Photo Support**:
    - Category name, product count, and photo upload / URL.
    - Category cover presets for fast setup.
  - Delete categories directly from the dashboard.
  - Newly created categories are automatically available when adding or editing products.

- **🔐 Administrator Login System:**
  - Secure authentication flow with session persistence via `localStorage`.
  - Password visibility toggle (Show/Hide).
  - Quick 1-Click Demo Login (`admin@shopmate.com` / `admin123`).
  - Session logout controls in both the sidebar profile area and the topbar.

- **📊 Comprehensive Dashboard Overview:**
  - KPI metric cards (Total Revenue, Total Orders, Active Products, Customers) with trends.
  - Interactive revenue chart with period filters (7 days, 30 days, 12 months).
  - Sales by channel breakdown (Online store, Social media, Direct).
  - Quick access to recent orders with shipping phone & address, and top products with photos.

- **📈 Store Analytics & Settings:**
  - Key business health metrics: Conversion Rate, Average Order Value (AOV), Returning Customer Rate, and Refund Rate.
  - Store configuration controls (Store Name, Support Email, Currency, Timezone).

- **📱 Fully Responsive Design:**
  - Mobile slide-out navigation with overlay scrim.
  - Desktop fixed sidebar with collapse/expand support.
  - Keyboard shortcut (`⌘ K` / `Ctrl + K`) to focus universal search.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or newer
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sazibkhan-me-6/shopmate-admin-panel.git
cd shopmate-admin-panel
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials
- **Email:** `admin@shopmate.com`
- **Password:** `admin123`
*(Or click "⚡ One-Click Demo Sign In" on the login screen)*

## 🛠️ Available Scripts

- `npm run dev` - Starts the development server with Hot Module Replacement.
- `npm run build` - Compiles and builds the production application.
- `npm run start` - Runs the built production server.
- `npm run lint` - Runs Next.js ESLint checks.

## 🗂️ Project Structure

```
shopmate-admin-panel/
├── app/
│   ├── globals.css                 # Custom design system & responsive styling
│   ├── layout.tsx                  # Root Next.js layout & metadata
│   └── page.tsx                    # Dashboard & authentication state orchestrator
├── components/
│   ├── LoginScreen.tsx             # Login authentication view & credentials handler
│   ├── AddProductModal.tsx         # Modal for adding & editing products with discount & photos
│   ├── CustomerModal.tsx           # Modal for updating customer info, address & phone
│   ├── AddCategoryModal.tsx        # Modal for adding categories with cover photos
│   ├── CustomerSupportModal.tsx    # Customer support desk, ticket submission & FAQs
│   └── PaymentMethodsModal.tsx     # Payment method control (bKash, Nagad, Cards, COD)
├── .gitignore                      # Standard Next.js gitignore
├── next.config.mjs                 # Next.js configuration
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
