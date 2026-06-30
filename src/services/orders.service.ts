import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type { ApiResponse } from '@shared/types/api';
import type { Order, PlaceOrderPayload, Invoice } from '@shared/types/order';

interface OrderListResponse {
  orders: Order[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

interface RazorpayOrderResponse {
  order: Order;
  razorpayOrder: { id: string; amount: number; currency: string };
}

export const ordersService = {
  placeOrder: (data: PlaceOrderPayload) =>
    apiClient.post<ApiResponse<{ order: Order } | RazorpayOrderResponse>>(ENDPOINTS.ORDERS.PLACE, data),

  verifyPayment: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    apiClient.post<ApiResponse>(ENDPOINTS.ORDERS.VERIFY_PAYMENT, data),

  getOrders: (params: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<OrderListResponse>>(ENDPOINTS.ORDERS.LIST, { params }),

  getOrderById: (id: string) =>
    apiClient.get<ApiResponse<Order>>(ENDPOINTS.ORDERS.DETAIL(id)),

  cancelOrder: (id: string, reason: string) =>
    apiClient.post<ApiResponse>(ENDPOINTS.ORDERS.CANCEL(id), { reason }),

  requestReturn: (id: string, reason: string) =>
    apiClient.post<ApiResponse>(ENDPOINTS.ORDERS.RETURN(id), { reason }),

  getInvoice: (id: string) =>
    apiClient.get<ApiResponse<Invoice>>(ENDPOINTS.ORDERS.INVOICE(id)),

  retryPayment: (id: string) =>
    apiClient.post<ApiResponse<RazorpayOrderResponse>>(ENDPOINTS.ORDERS.RETRY_PAYMENT(id)),
};
