# Wearhaus Frontend

The modern, premium storefront and admin dashboard for the Wearhaus e-commerce platform. Built with a focus on performance, accessibility, and a minimalist design aesthetic.

---

## 🚀 Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Routing:** React Router v7
- **Server State:** TanStack React Query (caching, background sync)
- **Client State:** Zustand (Auth, UI Modals, Cart)
- **API Client:** Axios (with interceptors and silent token rotation)
- **Forms & Validation:** React Hook Form + Zod
- **Styling:** Vanilla CSS Modules (Strict 8-point system, no utility classes)
- **Animations:** Framer Motion
- **UI Primitives:** Radix UI (accessible dialogs, dropdowns)
- **Carousels:** Swiper.js
- **SEO:** React Helmet Async

---

## 📐 Architecture

The application strictly follows a **Module-Based Architecture**:
- Each feature (Auth, Products, Cart, Orders, Admin) is isolated into its own module within `src/modules/`.
- Shared components (Buttons, Modals, Inputs) live in `src/shared/components/`.
- Global design tokens (colors, spacing, typography) are managed via CSS custom properties in `src/shared/styles/tokens/`.

---

## ✨ Features

### Storefront
- **Editorial UI**: Premium, mobile-first design inspired by luxury DTC brands.
- **Shop & Filtering**: Real-time product filtering (category, price, size, color) and sorting.
- **Cart & Checkout**: Variant-aware cart management with a seamless Razorpay checkout flow, including Coupon and Wallet integrations.
- **User Dashboard**: Order history tracking, Wishlist management, Wallet balances, and Referral tracking.

### Admin Panel
A fully integrated, secure management portal:
- **Dashboard**: Revenue analytics and top-selling product metrics.
- **Catalog Management**: Full CRUD for Products, Variants, and Categories with Cloudinary image management.
- **Order Processing**: Track and update order statuses (Placed → Delivered), handle returns and refunds.
- **Marketing & Promotions**: Create and manage Coupons, Product Offers, and Category-wide Offers.
- **Inventory & Operations**: Low-stock alerts, review moderation, and abandoned cart tracking.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- The backend API running locally (defaults to `http://localhost:5000/api`)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

---

## 🎨 Design System

- **Spacing**: Strict 8-point scale (4px, 8px, 16px, 24px, 32px...).
- **Typography**: `Inter` for highly readable, modern interfaces.
- **Color Palette**: High contrast (near-black on white) with a single defined accent color.
- **Animations**: Subtle 200-300ms ease-out transitions for micro-interactions.
