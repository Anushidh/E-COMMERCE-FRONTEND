import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ordersService } from '@/services/orders.service';
import type { PlaceOrderPayload } from '@shared/types/order';
import type { AxiosError } from 'axios';

interface ErrorResponse { message?: string }
const errMsg = (e: AxiosError<ErrorResponse>) => e.response?.data?.message || 'Something went wrong';

export function useOrders(params: { page?: number }) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersService.getOrders(params),
    select: (res) => res.data.data,
  });
}

export function useInfiniteOrders() {
  return useInfiniteQuery({
    queryKey: ['orders', 'infinite'],
    queryFn: ({ pageParam = 1 }) => ordersService.getOrders({ page: pageParam }),
    getNextPageParam: (lastPage) => {
      const data = lastPage.data.data as any;
      if (data?.pagination?.page < data?.pagination?.totalPages) {
        return data.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.getOrderById(id),
    select: (res) => res.data.data,
    enabled: !!id,
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PlaceOrderPayload) => ordersService.placeOrder(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      qc.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order placed successfully!');
    },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useVerifyPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ordersService.verifyPayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['order'] });
      toast.success('Payment verified!');
    },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useRetryPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ordersService.retryPayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['order'] });
    },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => ordersService.cancelOrder(id, reason),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['order'] });
      toast.success(res.data.message || 'Order cancelled');
    },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useRequestReturn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => ordersService.requestReturn(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Return request submitted');
    },
    onError: (e: AxiosError<ErrorResponse>) => toast.error(errMsg(e)),
  });
}

export function useOrderInvoice(id: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => ordersService.getInvoice(id),
    select: (res) => res.data.data,
    enabled: !!id,
  });
}
