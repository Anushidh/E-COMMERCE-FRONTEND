import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type { ApiResponse } from '@shared/types/api';

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  revenue: { daily: number; weekly: number; monthly: number; yearly: number };
  ordersByStatus: { _id: string; count: number }[];
  topProducts: { _id: string; name: string; totalSold: number; basePrice: number; images: string[] }[];
  topCategories: { _id: string; name: string; totalSold: number; revenue: number }[];
  newUsers: { _id: string; count: number }[];
  topCoupons: { _id: string; code: string; discountType: string; discountValue: number; totalUsed: number }[];
  revenueChart: { _id: string; revenue: number; orders: number }[];
  totals: { users: number; products: number; orders: number };
}

// ─── Users ───────────────────────────────────────────────────────────────────

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface AdminOrder {
  _id: string;
  orderId: string;
  user: { _id: string; name: string; email: string };
  items: { productName: string; variantInfo: string; quantity: number; finalPrice: number }[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

// ─── Coupons ─────────────────────────────────────────────────────────────────

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimitPerUser: number;
  totalUsageLimit: number;
  totalUsed: number;
  expiryDate: string;
  isActive: boolean;
}

export interface CreateCouponPayload {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimitPerUser?: number;
  totalUsageLimit: number;
  expiryDate: string;
  isActive?: boolean;
}

// ─── Offers ──────────────────────────────────────────────────────────────────

export interface ProductOffer {
  _id: string;
  product: { _id: string; name: string } | string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface CategoryOffer {
  _id: string;
  category: { _id: string; name: string } | string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface CreateOfferPayload {
  product?: string;
  category?: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

// ─── Inventory ───────────────────────────────────────────────────────────────

export interface LowStockVariant {
  _id: string;
  product: { _id: string; name: string; images: string[] };
  size: string;
  color: string;
  stock: number;
}

// ─── Abandoned Carts ─────────────────────────────────────────────────────────

export interface AbandonedCartStats {
  totalAbandoned: number;
  totalValue: number;
  carts: { _id: string; user: { name: string; email: string }; totalAmount: number; lastActivityAt: string; items: unknown[] }[];
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const adminService = {
  // Dashboard
  getDashboard: () =>
    apiClient.get<ApiResponse<DashboardStats>>(ENDPOINTS.ADMIN.DASHBOARD),

  // Users
  getUsers: (params: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<ApiResponse<{ users: AdminUser[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>>(
      ENDPOINTS.ADMIN.USERS, { params },
    ),
  blockUser: (id: string) =>
    apiClient.patch(ENDPOINTS.ADMIN.BLOCK_USER(id)),
  unblockUser: (id: string) =>
    apiClient.patch(ENDPOINTS.ADMIN.UNBLOCK_USER(id)),

  // Orders
  getOrders: (params: { page?: number; limit?: number; status?: string }) =>
    apiClient.get<ApiResponse<{ orders: AdminOrder[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>>(
      ENDPOINTS.ADMIN.ORDERS, { params },
    ),
  updateOrderStatus: (id: string, status: string) =>
    apiClient.patch(ENDPOINTS.ADMIN.ORDER_STATUS(id), { status }),
  handleReturn: (id: string, action: 'approve' | 'reject') =>
    apiClient.patch(ENDPOINTS.ADMIN.ORDER_RETURN(id), { action }),
  handleCancellation: (id: string, action: 'approve' | 'reject') =>
    apiClient.patch(ENDPOINTS.ADMIN.ORDER_CANCEL(id), { action }),

  // Coupons
  getCoupons: () =>
    apiClient.get<ApiResponse<{ coupons: Coupon[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>>('/coupons'),
  createCoupon: (data: CreateCouponPayload) =>
    apiClient.post<ApiResponse<Coupon>>('/coupons', data),
  updateCoupon: (id: string, data: Partial<CreateCouponPayload>) =>
    apiClient.put<ApiResponse<Coupon>>(`/coupons/${id}`, data),
  deleteCoupon: (id: string) =>
    apiClient.delete(`/coupons/${id}`),

  // Offers
  getProductOffers: () =>
    apiClient.get<ApiResponse<ProductOffer[]>>('/offers/product'),
  createProductOffer: (data: CreateOfferPayload) =>
    apiClient.post<ApiResponse<ProductOffer>>('/offers/product', data),
  updateProductOffer: (id: string, data: Partial<CreateOfferPayload>) =>
    apiClient.put<ApiResponse<ProductOffer>>(`/offers/product/${id}`, data),
  deleteProductOffer: (id: string) =>
    apiClient.delete(`/offers/product/${id}`),
  getCategoryOffers: () =>
    apiClient.get<ApiResponse<CategoryOffer[]>>('/offers/category'),
  createCategoryOffer: (data: CreateOfferPayload) =>
    apiClient.post<ApiResponse<CategoryOffer>>('/offers/category', data),
  updateCategoryOffer: (id: string, data: Partial<CreateOfferPayload>) =>
    apiClient.put<ApiResponse<CategoryOffer>>(`/offers/category/${id}`, data),
  deleteCategoryOffer: (id: string) =>
    apiClient.delete(`/offers/category/${id}`),

  // Products (admin CRUD)
  getAdminProducts: (params: { page?: string; limit?: string; search?: string; status?: string; includeDeleted?: boolean }) =>
    apiClient.get<ApiResponse<{ products: any[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>>(
      '/products/admin/all', { params }
    ),
  createProduct: (data: FormData) =>
    apiClient.post<ApiResponse>('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProduct: (id: string, data: FormData) =>
    apiClient.put<ApiResponse>(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteProduct: (id: string) =>
    apiClient.delete(`/products/${id}`),
  restoreProduct: (id: string) =>
    apiClient.patch(`/products/${id}/restore`),
  removeProductImage: (id: string, imageUrl: string) =>
    apiClient.patch(`/products/${id}/remove-image`, { imageUrl }),
  addVariant: (productId: string, data: { size: string; color: string; stock: number; sku?: string; price?: number }) =>
    apiClient.post(`/products/${productId}/variants`, data),
  updateVariant: (variantId: string, data: Partial<{ size: string; color: string; stock: number; price: number }>) =>
    apiClient.put(`/products/variants/${variantId}`, data),
  deleteVariant: (variantId: string) =>
    apiClient.delete(`/products/variants/${variantId}`),
  adjustStock: (variantId: string, adjustment: number) =>
    apiClient.patch(`/products/variants/${variantId}/stock`, { adjustment }),

  // Categories (admin CRUD)
  getAdminCategories: (params?: { includeDeleted?: boolean }) =>
    apiClient.get<ApiResponse<any[]>>('/categories/admin/all', { params }),
  createCategory: (data: FormData) =>
    apiClient.post<ApiResponse>('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateCategory: (id: string, data: FormData) =>
    apiClient.put<ApiResponse>(`/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCategory: (id: string) =>
    apiClient.delete(`/categories/${id}`),
  restoreCategory: (id: string) =>
    apiClient.patch(`/categories/${id}/restore`),

  // Inventory
  getLowStock: () =>
    apiClient.get<ApiResponse<LowStockVariant[]>>(ENDPOINTS.ADMIN.LOW_STOCK),

  // Abandoned carts
  getAbandonedCarts: () =>
    apiClient.get<ApiResponse<AbandonedCartStats>>(ENDPOINTS.ADMIN.ABANDONED_CARTS),
  processAbandonedCarts: () =>
    apiClient.post(ENDPOINTS.ADMIN.PROCESS_ABANDONED),
};
