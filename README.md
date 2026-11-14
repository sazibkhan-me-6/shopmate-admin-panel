# ShopMate Admin Panel 🛍️

A modern, responsive e-commerce admin control panel built with **Next.js 14 (App Router)**, **TypeScript**, **React 18**, and **Lucide Icons**. Designed to manage products with photo uploads, visual categories, monitor sales performance, track orders, configure payment methods, provide customer support, and authenticate store administrators seamlessly.

## ✨ Features

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

- **🔐 Administrator Login System:**
  - Secure authentication flow with session persistence via `localStorage`.
  - Password visibility toggle (Show/Hide).
  - Quick 1-Click Demo Login (`admin@shopmate.com` / `admin123`).
  - Session logout controls in both the sidebar profile area and the topbar.

- **📸 Photo-Enabled Product Management:**
  - Full product catalogue with live search filtering by name, SKU, and category.
  - **Add Product Modal with Photo Support**:
    - Local file upload with instant client-side preview via FileReader.
    - Image URL input mode.
    - 1-Click preset demo photos (Backpack, Headphones, Sneakers, Smartwatch, Coffee Cup, Lamp).
    - Image preview box with remove/change option.
  - Live stock status badges (`Active`, `Low stock`, `Draft`).
  - Delete / remove catalogue items.

- **🏷️ Visual Category Management with Cover Photos:**
  - Visual category grid displaying category cover images, titles, and item counts.
  - **Add Category Modal with Photo Support**:
    - Category name, product count, and photo upload / URL.
    - Category cover presets for fast setup.
  - Delete categories directly from the dashboard.
  - Newly created categories are automatically available when adding new products.

- **📊 Comprehensive Dashboard Overview:**
  - KPI metric cards (Total Revenue, Total Orders, Active Products, Customers) with trends.
  - Interactive revenue chart with period filters (7 days, 30 days, 12 months).
  - Sales by channel breakdown (Online store, Social media, Direct).
  - Quick access to recent orders and top products with photos.

- **📑 Order Tracking:**
  - Live order search and status management (`Processing`, `Shipped`, `Delivered`, `Cancelled`).
  - One-click CSV export of order data (`shopmate-orders.csv`).

- **👥 Customer Directory:**
  - Customer overview with order count, total spend, and contact emails.

- **📈 Store Analytics:**
  - Key business health metrics: Conversion Rate, Average Order Value (AOV), Returning Customer Rate, and Refund Rate.

- **⚙️ Store Settings:**
  - Store configuration controls (Store Name, Support Email, Currency, Timezone).
  - Quick panels for Payment Gateways and Customer Support.

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
│   ├── AddProductModal.tsx         # Modal for adding products with photo upload & preview
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
