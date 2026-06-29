import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService } from '@/services/user.service';
import type { Address } from '@shared/types/user';
import type { AxiosError } from 'axios';

interface ErrorResponse { message?: string }
const errMsg = (e: AxiosError<ErrorResponse>) => e.response?.data?.message || 'Something went wrong';

// ─── Profile ─────────────────────────────────────────────────────────────────

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: userService.getProfile,
    select: (res) => res.data.data,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated');
    },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => toast.success('Password changed'),
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

// ─── Addresses ───────────────────────────────────────────────────────────────

export function useAddAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Address, '_id'>) => userService.addAddress(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Address added');
    },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Address, '_id'>> }) =>
      userService.updateAddress(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Address updated');
    },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.deleteAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Address deleted');
    },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useSetDefaultAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.setDefaultAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Default address updated');
    },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

// ─── Wallet ──────────────────────────────────────────────────────────────────

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: userService.getWallet,
    select: (res) => res.data.data,
  });
}

export function useWalletTransactions(params: { page?: number }) {
  return useQuery({
    queryKey: ['walletTransactions', params],
    queryFn: () => userService.getWalletTransactions(params),
    select: (res) => res.data.data,
  });
}

// ─── Referrals ───────────────────────────────────────────────────────────────

export function useReferrals() {
  return useQuery({
    queryKey: ['referrals'],
    queryFn: userService.getReferrals,
    select: (res) => res.data.data,
  });
}
