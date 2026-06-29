import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Star } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@shared/api/client';
import { Button, Spinner } from '@shared/components';
import { useProducts } from '@/hooks/useProducts';
import styles from './Reviews.module.css';

// Fetch reviews for a specific product
function useProductReviews(productId: string, page: number) {
  return useQuery({
    queryKey: ['admin', 'reviews', productId, page],
    queryFn: () => apiClient.get(`/reviews/product/${productId}`, { params: { page, limit: 20 } }),
    select: (res) => res.data.data as { reviews: { _id: string; user: { name: string }; rating: number; review: string; createdAt: string }[]; pagination: { total: number; totalPages: number; page: number } },
    enabled: !!productId,
  });
}

function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/reviews/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'reviews'] }); toast.success('Review deleted'); },
    onError: () => toast.error('Failed to delete review'),
  });
}

export default function Reviews() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [page, setPage] = useState(1);
  const { data: productsData } = useProducts({ limit: '100' });
  const { data: reviewsData, isLoading } = useProductReviews(selectedProduct, page);
  const { mutate: deleteReview } = useDeleteReview();

  return (
    <>
      <Helmet><title>Reviews — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Review Moderation</h1>
          <select
            className={styles.productSelect}
            value={selectedProduct}
            onChange={(e) => { setSelectedProduct(e.target.value); setPage(1); }}
          >
            <option value="">Select a product</option>
            {productsData?.products.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        {!selectedProduct ? (
          <div className={styles.empty}>Select a product to view its reviews</div>
        ) : isLoading ? (
          <Spinner size="lg" />
        ) : (
          <>
            <div className={styles.list}>
              {reviewsData?.reviews.map((r) => (
                <div key={r._id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div>
                      <span className={styles.reviewUser}>{r.user.name}</span>
                      <div className={styles.stars}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} fill={i < r.rating ? 'currentColor' : 'none'} className={i < r.rating ? styles.starFilled : styles.starEmpty} />
                        ))}
                      </div>
                    </div>
                    <div className={styles.reviewMeta}>
                      <span className={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                      <button className={styles.deleteBtn} onClick={() => deleteReview(r._id)} aria-label="Delete review">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className={styles.reviewText}>{r.review}</p>
                </div>
              ))}
              {reviewsData?.reviews.length === 0 && (
                <div className={styles.empty}>No reviews for this product</div>
              )}
            </div>

            {reviewsData && reviewsData.pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <span className={styles.pageInfo}>Page {page} of {reviewsData.pagination.totalPages}</span>
                <Button variant="secondary" size="sm" disabled={page >= reviewsData.pagination.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
