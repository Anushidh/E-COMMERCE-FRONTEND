import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type { ApiResponse } from '@shared/types/api';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  referralCode?: string;
}

interface VerifyOTPPayload {
  email: string;
  otp: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

interface ResendOTPPayload {
  email: string;
  type: 'signup' | 'forgot_password';
}

export const authService = {
  signup: (data: SignupPayload) =>
    apiClient.post<ApiResponse>(ENDPOINTS.AUTH.SIGNUP, data),

  verifyOTP: (data: VerifyOTPPayload) =>
    apiClient.post<ApiResponse<LoginResponse>>(ENDPOINTS.AUTH.VERIFY_OTP, data),

  login: (data: LoginPayload) =>
    apiClient.post<ApiResponse<LoginResponse>>(ENDPOINTS.AUTH.LOGIN, data),

  forgotPassword: (data: ForgotPasswordPayload) =>
    apiClient.post<ApiResponse>(ENDPOINTS.AUTH.FORGOT_PASSWORD, data),

  resetPassword: (data: ResetPasswordPayload) =>
    apiClient.post<ApiResponse>(ENDPOINTS.AUTH.RESET_PASSWORD, data),

  resendOTP: (data: ResendOTPPayload) =>
    apiClient.post<ApiResponse>(ENDPOINTS.AUTH.RESEND_OTP, data),

  logout: (refreshToken: string | null) =>
    apiClient.post(ENDPOINTS.AUTH.LOGOUT, { refreshToken }),

  adminLogin: (data: LoginPayload) =>
    apiClient.post<ApiResponse<{ admin: { id: string; name: string; email: string }; accessToken: string; refreshToken: string }>>(
      ENDPOINTS.ADMIN.LOGIN,
      data,
    ),

  adminLogout: (refreshToken: string | null) =>
    apiClient.post(ENDPOINTS.ADMIN.LOGOUT, { refreshToken }),
};
