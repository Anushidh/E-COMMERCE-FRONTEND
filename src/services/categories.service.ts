import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type { ApiResponse } from '@shared/types/api';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  gender: 'Men' | 'Women' | 'Both';
}

export const categoriesService = {
  getAll: () =>
    apiClient.get<ApiResponse<Category[]>>(ENDPOINTS.CATEGORIES.LIST),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Category>>(ENDPOINTS.CATEGORIES.DETAIL(id)),
};
