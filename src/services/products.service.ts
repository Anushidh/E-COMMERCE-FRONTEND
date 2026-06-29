import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type { ApiResponse } from '@shared/types/api';
import type { ProductDetail, ProductFilters, ProductListResponse } from '@shared/types/product';

export const productsService = {
  getProducts: (filters: ProductFilters) => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''),
    );
    return apiClient.get<ApiResponse<ProductListResponse>>(ENDPOINTS.PRODUCTS.LIST, { params });
  },

  getProductBySlug: (slug: string) =>
    apiClient.get<ApiResponse<ProductDetail>>(ENDPOINTS.PRODUCTS.DETAIL(slug)),

  getVariants: (productId: string) =>
    apiClient.get<ApiResponse<import('@shared/types/product').Variant[]>>(
      ENDPOINTS.PRODUCTS.VARIANTS(productId),
    ),

  trackView: (productId: string) =>
    apiClient.post(ENDPOINTS.PRODUCTS.TRACK_VIEW(productId)),

  getRecentlyViewed: () =>
    apiClient.get(ENDPOINTS.PRODUCTS.RECENTLY_VIEWED),
};
