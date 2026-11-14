# ShopMate Admin Panel 🛍️

A modern, responsive e-commerce admin control panel built with **Next.js 14 (App Router)**, **TypeScript**, **React 18**, and **Lucide Icons**. Directly controls and synchronizes with the live e-commerce website: [**https://shopmate-ecommerce-kohl.vercel.app/**](https://shopmate-ecommerce-kohl.vercel.app/). Designed to manage products with photo uploads, price discount controls, product editing, customer profiles with address & phone updates, order delivery tracking with shipping info, payment gateway toggles, live storefront announcement & coupon controls, and CORS-enabled REST APIs.

## 🌐 Live Storefront Integration (`shopmate-ecommerce-kohl.vercel.app`)

This admin panel serves as the central command hub for the live customer-facing store at [https://shopmate-ecommerce-kohl.vercel.app/](https://shopmate-ecommerce-kohl.vercel.app/):

- **Storefront Control Center Modal**:
  - Live Store Status toggle: Switch storefront between `Online (Live)` and `Maintenance Mode`.
  - Top Announcement Banner editor: Customize promotional banner text (e.g. *"🎉 Flash Sale! Flat 15% OFF across all tech & fashion — Code: SHOPMATE15"*).
  - Promo Coupons Manager: Control active discount coupon codes (`SAVE10`, `WELCOME20`, `SHOPMATE15`).
  - Currency & Exchange Rate: Multi-currency control (USD, BDT, EUR, GBP) and live BDT conversion rate (default `1 USD = 120 BDT`).
  - One-click Catalog Sync: Instantly sync all 12 products, 8 categories, and active gateways to the storefront schema.
  - JSON Configuration Export: One-click copy or download of full store JSON config for deployment.
- **Cross-Origin REST APIs (CORS Enabled)**:
  - `GET /api/store` - Returns catalog items, categories, announcement banner, promo coupons, and active payment gateways.
  - `POST /api/store` - Updates storefront configuration.
  - `GET /api/orders` - Fetches submitted orders.
  - `POST /api/orders` - Receives incoming checkout orders directly from `shopmate-ecommerce-kohl.vercel.app`.
- **Aligned Catalog Data**:
  - Preloaded with the live storefront's 12 products (`iPhone 15 Pro Max`, `Sony WH-1000XM5`, `Nike Air Force 1`, `Apple Watch Series 9`, `Under Armour Backpack`, `MacBook Air M3`, `Premium Cotton T-Shirt`, `Minimal Lounge Sofa`, `Everyday Skincare Set`, `Adjustable Dumbbell Set`, `The Creative Mind`, `Classic Teddy Bear`).
  - Aligned 8 categories (`Electronics`, `Fashion`, `Home & Living`, `Beauty & Health`, `Sports & Fitness`, `Books`, `Toys & Games`, `Accessories`).

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

- **🏷️ Featured Categories Showcase & Full Category Management:**
  - **Live Storefront Showcase Strip**: Exact replica of the "Featured Categories" strip from `shopmate-ecommerce-kohl.vercel.app` with `Shop by category and find exactly what you need.` heading, "View All →" link, and interactive 8-column card grid.
  - **8 Aligned Category Presets**: Electronics (Laptop), Fashion (Streetwear sunglasses), Home & Living (Velvet sofa), Beauty & Health (Cosmetics & brushes), Sports & Fitness (Weights & athletic shoe), Books (Books on shelf), Toys & Games (Blue lego bricks), Accessories (Navy backpack).
  - **Interactive Category Filtering**: Click any category pill to instantly view all products assigned to that category with direct price, discount %, stock, and edit controls.
  - **Add & Edit Category Modal**:
    - Update category name, subtitle / product count, and photo.
    - Local file upload (FileReader preview with size check up to 5MB) or direct photo URL.
    - 8 1-click official storefront presets.
    - **Featured Toggle**: Control whether the category appears on the live storefront homepage strip (`shopmate-ecommerce-kohl.vercel.app`).
    - Live storefront card preview before saving.
  - **Persistent Storage**: Real-time sync with `localStorage` and `/api/store` REST API.

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
│   ├── api/
│   │   ├── orders/route.ts         # CORS REST API for receiving & listing store orders
│   │   └── store/route.ts          # CORS REST API for syncing products, categories & banners
│   ├── globals.css                 # Custom design system & responsive styling
│   ├── layout.tsx                  # Root Next.js layout & metadata
│   └── page.tsx                    # Dashboard & storefront state orchestrator
├── components/
│   ├── LoginScreen.tsx             # Login authentication view & credentials handler
│   ├── StorefrontControlModal.tsx  # Storefront live controls, coupons & announcements
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
