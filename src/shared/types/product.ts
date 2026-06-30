export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand?: string;
  category: { _id: string; name: string } | string;
  gender: 'Men' | 'Women' | 'Unisex';
  images: string[];
  basePrice: number;
  discountedPrice?: number | null;
  gstRate: number;
  status: 'Active' | 'Inactive' | 'Out of Stock';
  averageRating: number;
  totalReviews: number;
  totalSold: number;
  createdAt: string;
}

export interface Variant {
  _id: string;
  product: string;
  size: string;
  color: string;
  stock: number;
  sku?: string;
  price?: number;
}

export interface ProductDetail {
  product: Product;
  variants: Variant[];
  offer: ProductOffer | null;
  discountedPrice: number | null;
  relatedProducts: Product[];
}

export interface ProductOffer {
  type: 'product' | 'category';
  discountType: 'percentage' | 'flat';
  discountValue: number;
  startDate: string;
  endDate: string;
}

export interface ProductFilters {
  category?: string;
  gender?: 'Men' | 'Women' | 'Unisex';
  status?: 'Active' | 'Inactive' | 'Out of Stock' | 'all';
  minPrice?: string;
  maxPrice?: string;
  size?: string;
  color?: string;
  rating?: string;
  availability?: 'instock' | 'outofstock';
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popularity' | 'rating';
  page?: string;
  limit?: string;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
