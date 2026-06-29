# Frontend Memory

## Project Context
- Full-featured e-commerce frontend for an existing Node.js/Express backend
- Backend runs at `http://localhost:5000/api`
- Premium, minimal aesthetic inspired by Zara, COS, Nike, Apple, H&M, Aritzia
- NOT a marketplace — this is a single-brand DTC (direct-to-consumer) storefront

## Tech Stack
- React 19, TypeScript, Vite
- React Router v7
- TanStack Query (server state)
- Zustand (global client state: auth, cart UI, modals)
- Axios (API layer with interceptors + token rotation)
- React Hook Form + Zod (forms)
- CSS Modules (no Tailwind)
- Framer Motion (subtle animations)
- Radix UI primitives (accessible dialogs, dropdowns, etc.)
- Lucide Icons
- Sonner (toasts)
- Swiper.js (carousels)
- React Helmet Async (SEO)

## Design Decisions
- 8-point spacing system (0.5rem = 4px, 1rem = 8px base concept, but we use rem with 1rem = 16px standard)
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128
- Typography: Inter for body, optional serif for headings
- Color palette: near-black text, white background, one accent color
- Mobile-first responsive breakpoints: 480, 768, 1024, 1280, 1440+
- Animations: 200-300ms duration, ease-out, never jarring

## Architecture
- Module-based: each feature (auth, products, cart, orders, admin) is a module containing ONLY pages and page-specific components
- Services (API calls) in `/services` at src root
- Custom hooks in `/hooks` at src root
- Shared components in `/shared/components`
- Design tokens in `/shared/styles/tokens`
- API client in `/shared/api`
- Layouts in `/shared/layouts`
- Zustand stores in `/shared/stores`
- Shared types in `/shared/types`

## Current Status
- [x] Project scaffolding
- [x] Design tokens
- [x] Global styles + reset
- [x] Layouts (PublicLayout, AuthLayout, AdminLayout)
- [x] API layer (Axios client + interceptors + token rotation)
- [x] Auth store (Zustand + persist)
- [x] Core components (Button, Input, Modal, Skeleton, Badge, Spinner, ProductCard)
- [x] Home page (editorial hero, categories, highlight, values, newsletter)
- [x] Auth module COMPLETE (Login, Signup+OTP+Resend, ForgotPassword, OAuthCallback, AdminLogin)
- [x] Products module (Shop with filters/sort/pagination, ProductDetail with gallery/variants/quantity/add-to-cart)
- [x] Cart module (cart page, item management, summary, checkout link)
- [x] Checkout module (address selection, coupon, wallet, payment method, Razorpay integration)
- [x] Orders module (order list, order detail with timeline/cancel/return/invoice)
- [x] Wishlist module (grid with stock availability, remove, navigate to product)
- [x] Profile module (user info, navigation to all sections, logout)
- [x] Wallet module (balance card, transaction history with pagination)
- [x] Referrals module (referral code with copy, stats, history)
- [x] Admin module COMPLETE:
  - Dashboard (revenue, stats, top products, orders by status)
  - Products (list with search, create form, edit with tabs: General/Images/Variants)
  - Categories (card grid, create modal, edit modal, delete)
  - Orders (table with status filter, status update, return handling)
  - Users (search, block/unblock)
  - Coupons (list, create modal, delete)
  - Offers (product + category offers, create modals, delete)
  - Inventory (low stock alerts, quick restock)
  - Reviews (moderation — select product, view/delete reviews)
  - Abandoned Carts (stats, cart list, send reminders)
  - Logout button in sidebar

## All Routes
### Public (with Navbar/Footer)
/ — Home
/shop — Product listing
/shop/:slug — Product detail
/cart — Shopping cart
/checkout — Checkout
/orders — Order history
/orders/:id — Order detail
/wishlist — Wishlist
/profile — User profile
/wallet — Wallet
/referrals — Referrals

### Auth (centered layout)
/login — Login
/signup — Signup
/forgot-password — Reset password

### Standalone
/auth/callback — OAuth token capture
/admin/login — Admin login

### Admin (sidebar layout)
/admin — Dashboard
/admin/products — Product list
/admin/products/new — Create product
/admin/products/:id — Edit product (tabs)
/admin/orders — Order management
/admin/users — User management
/admin/coupons — Coupon management
/admin/offers — Offers management
/admin/categories — Category management
/admin/inventory — Low stock
/admin/reviews — Review moderation
/admin/abandoned-carts — Abandoned carts

## Folder Structure (Current)
```
src/
├── app/               # App.tsx, router.tsx, providers.tsx
├── services/          # auth.service.ts, products.service.ts, categories.service.ts
├── hooks/             # useAuth.ts, useProducts.ts, useCategories.ts
├── shared/
│   ├── api/           # client.ts, endpoints.ts
│   ├── components/    # Button, Input, Modal, Skeleton, Badge, Spinner, ProductCard
│   ├── layouts/       # PublicLayout, AuthLayout, AdminLayout
│   ├── stores/        # authStore.ts
│   ├── styles/        # tokens/, reset.css, global.css
│   └── types/         # api.ts, product.ts
├── modules/
│   ├── auth/          # Login, Signup, ForgotPassword, OAuthCallback
│   ├── home/          # Home
│   ├── products/      # Shop, ProductDetail, components/ (ShopFilters, ProductGallery, VariantSelector)
│   └── admin/         # AdminLogin
└── main.tsx
```

## Key Patterns
- Every component: Component.tsx + Component.module.css + index.ts
- No `any` types
- No inline styles
- No hardcoded colors/spacing
- CSS custom properties for tokens, consumed via CSS Modules
- Lazy loading for all route pages
- Skeleton loaders for async content
- Optimistic updates where UX benefits

## API Endpoints (from backend)
- Auth: /api/auth/* (signup, verify-otp, login, refresh-token, logout, google, forgot/reset)
- Admin: /api/admin/* (login, logout, dashboard, users, orders, inventory, carts)
- Products: /api/products/* (CRUD, variants, filters, recently-viewed)
- Categories: /api/categories/*
- Cart: /api/cart/*
- Wishlist: /api/wishlist/*
- Orders: /api/orders/* (place, verify-payment, cancel, return, invoice)
- Coupons: /api/coupons/* (available, apply)
- Offers: /api/offers/* (product, category)
- Reviews: /api/reviews/*
- Wallet: /api/wallet/*
- Referrals: /api/referrals/*

## Changes Log
- Initial setup created
