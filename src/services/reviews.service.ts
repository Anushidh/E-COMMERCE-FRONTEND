import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type { ApiResponse } from '@shared/types/api';

export interface Review {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  rating: number;
  review: string;
  createdAt: string;
}

interface ReviewListResponse {
  reviews: Review[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

interface CreateReviewPayload {
  product: string;
  order: string;
  rating: number;
  review: string;
}

export const reviewsService = {
  getProductReviews: (productId: string, params: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<ReviewListResponse>>(ENDPOINTS.REVIEWS.PRODUCT(productId), { params }),

  createReview: (data: CreateReviewPayload) =>
    apiClient.post<ApiResponse<Review>>(ENDPOINTS.REVIEWS.CREATE, data),
};
