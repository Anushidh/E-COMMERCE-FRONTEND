/** Centralized API endpoint constants */
export const ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/auth/signup',
    VERIFY_OTP: '/auth/verify-otp',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    RESEND_OTP: '/auth/resend-otp',
    GOOGLE: '/auth/google',
  },

  // User
  USER: {
    PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    ADDRESSES: '/users/addresses',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    VARIANTS: (productId: string) => `/products/${productId}/variants`,
    TRACK_VIEW: (productId: string) => `/products/${productId}/view`,
    RECENTLY_VIEWED: '/products/user/recently-viewed',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
  },

  // Cart
  CART: {
    GET: '/cart',
    ADD: '/cart',
    UPDATE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
    REMOVE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
    CLEAR: '/cart',
  },

  // Wishlist
  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist',
    REMOVE: (productId: string) => `/wishlist/${productId}`,
    MOVE_TO_CART: '/wishlist/move-to-cart',
  },

  // Orders
  ORDERS: {
    PLACE: '/orders',
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    RETURN: (id: string) => `/orders/${id}/return`,
    INVOICE: (id: string) => `/orders/${id}/invoice`,
    VERIFY_PAYMENT: '/orders/verify-payment',
  },

  // Coupons
  COUPONS: {
    AVAILABLE: '/coupons/available',
    APPLY: '/coupons/apply',
  },

  // Reviews
  REVIEWS: {
    PRODUCT: (productId: string) => `/reviews/product/${productId}`,
    CREATE: '/reviews',
  },

  // Wallet
  WALLET: {
    GET: '/wallet',
    TRANSACTIONS: '/wallet/transactions',
  },

  // Referrals
  REFERRALS: {
    GET: '/referrals',
  },

  // Admin
  ADMIN: {
    LOGIN: '/admin/login',
    LOGOUT: '/admin/logout',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    BLOCK_USER: (id: string) => `/admin/users/${id}/block`,
    UNBLOCK_USER: (id: string) => `/admin/users/${id}/unblock`,
    ORDERS: '/admin/orders',
    ORDER_STATUS: (id: string) => `/admin/orders/${id}/status`,
    ORDER_RETURN: (id: string) => `/admin/orders/${id}/return`,
    LOW_STOCK: '/admin/inventory/low-stock',
    ABANDONED_CARTS: '/admin/carts/abandoned',
    PROCESS_ABANDONED: '/admin/carts/abandoned/process',
  },
} as const;
