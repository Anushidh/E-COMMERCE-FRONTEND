import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type { ApiResponse } from '@shared/types/api';
import type { Cart } from '@shared/types/cart';

interface AddToCartPayload {
  product: string;
  variant: string;
  quantity: number;
}

interface UpdateCartItemPayload {
  quantity: number;
}

export const cartService = {
  getCart: () =>
    apiClient.get<ApiResponse<Cart>>(ENDPOINTS.CART.GET),

  addToCart: (data: AddToCartPayload) =>
    apiClient.post<ApiResponse<Cart>>(ENDPOINTS.CART.ADD, data),

  updateItem: (itemId: string, data: UpdateCartItemPayload) =>
    apiClient.put<ApiResponse<Cart>>(ENDPOINTS.CART.UPDATE_ITEM(itemId), data),

  removeItem: (itemId: string) =>
    apiClient.delete<ApiResponse<Cart>>(ENDPOINTS.CART.REMOVE_ITEM(itemId)),

  clearCart: () =>
    apiClient.delete<ApiResponse>(ENDPOINTS.CART.CLEAR),
};
