import { useSearchParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ProductCard, ProductCardSkeleton, Button, Select } from '@shared/components';
import { useProducts } from '@/hooks/useProducts';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { useAuthStore } from '@shared/stores/authStore';
import { ShopFilters } from '../components/ShopFilters/ShopFilters';
import type { ProductFilters } from '@shared/types/product';
import styles from './Shop.module.css';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters: ProductFilters = {
    category: searchParams.get('category') || undefined,
    gender: (searchParams.get('gender') as ProductFilters['gender']) || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    size: searchParams.get('size') || undefined,
    color: searchParams.get('color') || undefined,
    rating: searchParams.get('rating') || undefined,
    availability: (searchParams.get('availability') as ProductFilters['availability']) || undefined,
    search: searchParams.get('search') || undefined,
    sort: (searchParams.get('sort') as ProductFilters['sort']) || undefined,
    page: searchParams.get('page') || '1',
    limit: '12',
  };

  const { data, isLoading } = useProducts(filters);
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { data: wishlistData } = useWishlist();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const wishlistIds = new Set(wishlistData?.products?.map((item: any) => item._id) || []);

  const updateFilter = (key: string, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 on filter change
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <>
      <Helmet>
        <title>Shop — STORE</title>
      </Helmet>

      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Shop</h1>
          <div className={styles.headerActions}>
            <div className={styles.sortWrapper}>
              <Select
                options={[
                  { label: 'Newest', value: 'newest' },
                  { label: 'Price: Low to High', value: 'price_asc' },
                  { label: 'Price: High to Low', value: 'price_desc' },
                  { label: 'Popularity', value: 'popularity' },
                  { label: 'Rating', value: 'rating' },
                ]}
                value={filters.sort || ''}
                onChange={(v) => updateFilter('sort', v || undefined)}
                placeholder="Sort by"
                fullWidth={false}
              />
            </div>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<SlidersHorizontal size={14} />}
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={styles.filterBtn}
            >
              Filters
            </Button>
          </div>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {filtersOpen && (
            <ShopFilters
              filters={filters}
              onFilterChange={updateFilter}
              onClear={clearFilters}
              onClose={() => setFiltersOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Product grid */}
        <div className={styles.grid}>
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : data?.products.map((product) => (
                <ProductCard
                  key={product._id}
                  slug={product.slug}
                  name={product.name}
                  price={product.basePrice}
                  discountedPrice={product.discountedPrice}
                  image={product.images[0] || '/placeholder.svg'}
                  isWishlisted={wishlistIds.has(product._id)}
                  onWishlistToggle={isAuthenticated ? () => {
                    if (wishlistIds.has(product._id)) {
                      removeFromWishlist(product._id);
                    } else {
                      addToWishlist(product._id);
                    }
                  } : undefined}
                />
              ))}
        </div>

        {/* Empty state */}
        {!isLoading && data?.products.length === 0 && (
          <div className={styles.empty}>
            <p>No products found</p>
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <Button
              variant="secondary"
              size="sm"
              disabled={data.pagination.page <= 1}
              onClick={() => updateFilter('page', String(data.pagination.page - 1))}
            >
              Previous
            </Button>
            <span className={styles.pageInfo}>
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={data.pagination.page >= data.pagination.totalPages}
              onClick={() => updateFilter('page', String(data.pagination.page + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
