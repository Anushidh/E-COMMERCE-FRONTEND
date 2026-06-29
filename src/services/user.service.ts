import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type { ApiResponse } from '@shared/types/api';
import type { UserProfile, Address, WalletInfo, WalletTransaction, ReferralInfo } from '@shared/types/user';

interface WalletTransactionsResponse {
  transactions: WalletTransaction[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export const userService = {
  // Profile
  getProfile: () =>
    apiClient.get<ApiResponse<UserProfile>>(ENDPOINTS.USER.PROFILE),

  updateProfile: (data: FormData) =>
    apiClient.put<ApiResponse<UserProfile>>(ENDPOINTS.USER.PROFILE, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put<ApiResponse>(ENDPOINTS.USER.CHANGE_PASSWORD, data),

  // Addresses
  addAddress: (data: Omit<Address, '_id'>) =>
    apiClient.post<ApiResponse<Address[]>>(ENDPOINTS.USER.ADDRESSES, data),

  updateAddress: (addressId: string, data: Partial<Omit<Address, '_id'>>) =>
    apiClient.put<ApiResponse<Address[]>>(`${ENDPOINTS.USER.ADDRESSES}/${addressId}`, data),

  deleteAddress: (addressId: string) =>
    apiClient.delete<ApiResponse<Address[]>>(`${ENDPOINTS.USER.ADDRESSES}/${addressId}`),

  setDefaultAddress: (addressId: string) =>
    apiClient.patch<ApiResponse<Address[]>>(`${ENDPOINTS.USER.ADDRESSES}/${addressId}/default`),

  // Wallet
  getWallet: () =>
    apiClient.get<ApiResponse<WalletInfo>>(ENDPOINTS.WALLET.GET),

  getWalletTransactions: (params: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<WalletTransactionsResponse>>(ENDPOINTS.WALLET.TRANSACTIONS, { params }),

  // Referrals
  getReferrals: () =>
    apiClient.get<ApiResponse<ReferralInfo>>(ENDPOINTS.REFERRALS.GET),
};
