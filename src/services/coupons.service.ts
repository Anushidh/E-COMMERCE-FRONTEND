import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type { ApiResponse } from '@shared/types/api';

export interface AvailableCoupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
}

export interface CouponApplyResponse {
  code: string;
  discountType: string;
  discountValue: number;
  discount: number;
  finalAmount: number;
}

export const couponsService = {
  getAvailable: () =>
    apiClient.get<ApiResponse<AvailableCoupon[]>>(ENDPOINTS.COUPONS.AVAILABLE),

  apply: (code: string, orderTotal: number) =>
    apiClient.post<ApiResponse<CouponApplyResponse>>(ENDPOINTS.COUPONS.APPLY, { code, orderTotal }),
};
