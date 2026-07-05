import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@shared/stores/authStore';
import type { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
}

const getErrorMessage = (error: AxiosError<ErrorResponse>): string => {
  return error.response?.data?.message || 'Something went wrong';
};

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data!;
      // Refresh token is in the HttpOnly cookie — not exposed in response body
      setAuth({ id: user.id, name: user.name, email: user.email }, accessToken, 'user');
      toast.success('Welcome back!');
      navigate('/');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: authService.signup,
    onSuccess: () => {
      toast.success('OTP sent to your email');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useVerifyOTP() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.verifyOTP,
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data!;
      setAuth({ id: user.id, name: user.name, email: user.email }, accessToken, 'user');
      toast.success('Account created!');
      navigate('/');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast.success('If the email exists, an OTP has been sent');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successful. Please login.');
      navigate('/login');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useResendOTP() {
  return useMutation({
    mutationFn: authService.resendOTP,
    onSuccess: () => {
      toast.success('OTP resent');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return useMutation({
    // No body needed — backend reads refresh token from the HttpOnly cookie
    mutationFn: () => authService.logout(),
    onSettled: () => {
      logout();
      navigate('/login');
    },
  });
}

export function useAdminLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.adminLogin,
    onSuccess: (res) => {
      const { admin, accessToken } = res.data.data!;
      setAuth({ id: admin.id, name: admin.name, email: admin.email }, accessToken, 'admin');
      toast.success('Welcome, Admin');
      navigate('/admin');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useAdminLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.adminLogout(),
    onSettled: () => {
      logout();
      navigate('/admin/login');
    },
  });
}
