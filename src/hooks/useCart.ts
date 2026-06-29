import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cartService } from '@/services/cart.service';
import { useAuthStore } from '@shared/stores/authStore';
import type { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
}

const CART_KEY = ['cart'];

export function useCart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: CART_KEY,
    queryFn: cartService.getCart,
    select: (res) => res.data.data,
    enabled: isAuthenticated,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
      toast.success('Added to bag');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateItem(itemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
      toast.success('Item removed');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
      toast.success('Cart cleared');
    },
    onError: () => {
      toast.error('Failed to clear cart');
    },
  });
}
