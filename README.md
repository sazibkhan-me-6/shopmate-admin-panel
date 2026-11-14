# ShopMate Admin Panel 🛍️

A modern, responsive e-commerce admin control panel built with **Next.js 14 (App Router)**, **TypeScript**, **React 18**, and **Lucide Icons**. Designed to manage products, monitor sales performance, track orders, and configure store settings seamlessly.

## ✨ Features

- **📊 Comprehensive Dashboard Overview:**
  - KPI metric cards (Total Revenue, Total Orders, Active Products, Customers) with trends.
  - Interactive revenue chart with period filters (7 days, 30 days, 12 months).
  - Sales by channel breakdown (Online store, Social media, Direct).
  - Quick access to recent orders and top-performing products.

- **📦 Product Management:**
  - Full product catalogue with live search filtering by name, SKU, and category.
  - Quick product creation modal (Name, Price, Stock).
  - Instant stock status indicators (`Active`, `Low stock`, `Draft`).
  - Delete / remove catalogue items.

- **📑 Order Tracking:**
  - Live order search and status management (`Processing`, `Shipped`, `Delivered`, `Cancelled`).
  - One-click CSV export of order data (`shopmate-orders.csv`).

- **👥 Customer Directory:**
  - Customer overview with order count, total spend, and contact emails.

- **🏷️ Category Management:**
  - Visual category grid with product count breakdown.

- **📈 Store Analytics:**
  - Key business health metrics: Conversion Rate, Average Order Value (AOV), Returning Customer Rate, and Refund Rate.

- **⚙️ Store Settings:**
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

## 🛠️ Available Scripts

- `npm run dev` - Starts the development server with Hot Module Replacement.
- `npm run build` - Compiles and builds the production application.
- `npm run start` - Runs the built production server.
- `npm run lint` - Runs Next.js ESLint checks.

## 🗂️ Project Structure

```
shopmate-admin-panel/
├── app/
│   ├── globals.css      # Custom design system & responsive styling
│   ├── layout.tsx       # Root Next.js layout & metadata
│   └── page.tsx         # Dashboard page with interactive views & state
├── components/          # Reusable React components
├── .gitignore           # Standard Next.js gitignore
├── next.config.mjs      # Next.js configuration
├── package.json         # Dependencies & scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # Documentation
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
