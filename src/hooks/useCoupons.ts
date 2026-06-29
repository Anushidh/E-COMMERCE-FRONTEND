import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { couponsService } from '@/services/coupons.service';
import type { AxiosError } from 'axios';

interface ErrorResponse { message?: string }

export function useAvailableCoupons() {
  return useQuery({
    queryKey: ['coupons', 'available'],
    queryFn: couponsService.getAvailable,
    select: (res) => res.data.data,
  });
}

export function useApplyCoupon() {
  return useMutation({
    mutationFn: ({ code, orderTotal }: { code: string; orderTotal: number }) =>
      couponsService.apply(code, orderTotal),
    onSuccess: () => toast.success('Coupon applied!'),
    onError: (e: AxiosError<ErrorResponse>) => {
      toast.error(e.response?.data?.message || 'Invalid coupon');
    },
  });
}
