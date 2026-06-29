/** Standard API response wrapper */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

/** Paginated response */
export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  } & T;
}
