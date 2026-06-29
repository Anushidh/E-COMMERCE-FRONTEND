import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import type { ProductFilters } from '@shared/types/product';

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.getProducts(filters),
    select: (res) => res.data.data,
  });
}

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsService.getProductBySlug(slug),
    select: (res) => res.data.data,
    enabled: !!slug,
  });
}
