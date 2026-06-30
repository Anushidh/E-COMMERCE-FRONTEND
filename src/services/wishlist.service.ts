import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type { ApiResponse } from '@shared/types/api';
import type { WishlistProduct } from '@shared/types/user';

interface WishlistResponse {
  _id: string;
  user: string;
  products: WishlistProduct[];
}

export const wishlistService = {
  getWishlist: () =>
    apiClient.get<ApiResponse<WishlistResponse>>(ENDPOINTS.WISHLIST.GET),

  addToWishlist: (productId: string) =>
    apiClient.post<ApiResponse>(ENDPOINTS.WISHLIST.ADD, { productId }),

  removeFromWishlist: (productId: string) =>
    apiClient.delete<ApiResponse>(ENDPOINTS.WISHLIST.REMOVE(productId)),

  clearWishlist: () =>
    apiClient.delete<ApiResponse>(ENDPOINTS.WISHLIST.CLEAR),

  moveToCart: (productId: string, variantId: string) =>
    apiClient.post<ApiResponse>(ENDPOINTS.WISHLIST.MOVE_TO_CART, { productId, variantId }),
};
