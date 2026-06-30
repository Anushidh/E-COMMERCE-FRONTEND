import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { wishlistService } from '@/services/wishlist.service';
import { useAuthStore } from '@shared/stores/authStore';
import type { AxiosError } from 'axios';

interface ErrorResponse { message?: string }

const WISHLIST_KEY = ['wishlist'];

export function useWishlist() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: wishlistService.getWishlist,
    select: (res) => res.data.data,
    enabled: isAuthenticated,
  });
}

export function useAddToWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wishlistService.addToWishlist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WISHLIST_KEY });
      toast.success('Added to wishlist');
    },
    onError: (e: AxiosError<ErrorResponse>) => {
      toast.error(e.response?.data?.message || 'Failed to add to wishlist');
    },
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wishlistService.removeFromWishlist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WISHLIST_KEY });
      toast.success('Removed from wishlist');
    },
    onError: (e: AxiosError<ErrorResponse>) => {
      toast.error(e.response?.data?.message || 'Failed to remove');
    },
  });
}

export function useMoveToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId }: { productId: string; variantId: string }) =>
      wishlistService.moveToCart(productId, variantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WISHLIST_KEY });
      qc.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Moved to cart');
    },
    onError: (e: AxiosError<ErrorResponse>) => {
      toast.error(e.response?.data?.message || 'Failed to move to cart');
    },
  });
}

export function useClearWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wishlistService.clearWishlist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WISHLIST_KEY });
      toast.success('Wishlist cleared');
    },
    onError: (e: AxiosError<ErrorResponse>) => {
      toast.error(e.response?.data?.message || 'Failed to clear wishlist');
    },
  });
}
