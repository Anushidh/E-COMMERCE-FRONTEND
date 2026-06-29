import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reviewsService } from '@/services/reviews.service';
import type { AxiosError } from 'axios';

interface ErrorResponse { message?: string }

export function useProductReviews(productId: string, params: { page?: number }) {
  return useQuery({
    queryKey: ['reviews', productId, params],
    queryFn: () => reviewsService.getProductReviews(productId, params),
    select: (res) => res.data.data,
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reviewsService.createReview,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['reviews', variables.product] });
      qc.invalidateQueries({ queryKey: ['product'] });
      toast.success('Review submitted!');
    },
    onError: (e: AxiosError<ErrorResponse>) => {
      toast.error(e.response?.data?.message || 'Failed to submit review');
    },
  });
}
