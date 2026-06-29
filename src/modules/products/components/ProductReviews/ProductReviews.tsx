import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star } from 'lucide-react';
import { useProductReviews, useCreateReview } from '@/hooks/useReviews';
import { useAuthStore } from '@shared/stores/authStore';
import { Button, Input, Spinner } from '@shared/components';
import styles from './ProductReviews.module.css';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Select a rating').max(5),
  review: z.string().min(5, 'Review must be at least 5 characters'),
  order: z.string().min(1, 'Order ID required'),
});

type ReviewForm = z.infer<typeof reviewSchema>;

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

export function ProductReviews({ productId, averageRating, totalReviews }: ProductReviewsProps) {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isLoading } = useProductReviews(productId, { page });
  const { mutate: createReview, isPending } = useCreateReview();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, review: '', order: '' },
  });

  const selectedRating = watch('rating');

  const onSubmit = (data: ReviewForm) => {
    createReview({ product: productId, ...data }, {
      onSuccess: () => { reset(); setShowForm(false); },
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Reviews</h2>
          <div className={styles.summary}>
            <div className={styles.rating}>
              <Star size={16} fill="currentColor" className={styles.starFilled} />
              <span>{averageRating.toFixed(1)}</span>
            </div>
            <span className={styles.count}>{totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>
          </div>
        </div>
        {isAuthenticated && !showForm && (
          <Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>Write a Review</Button>
        )}
      </div>

      {/* Write review form */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.ratingInput}>
            <span className={styles.ratingLabel}>Rating</span>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue('rating', star)}
                  className={styles.starBtn}
                  aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                >
                  <Star size={20} fill={star <= selectedRating ? 'currentColor' : 'none'} className={star <= selectedRating ? styles.starFilled : styles.starEmpty} />
                </button>
              ))}
            </div>
            {errors.rating && <p className={styles.error}>{errors.rating.message}</p>}
          </div>
          <Input label="Order ID" placeholder="Your delivered order ID" error={errors.order?.message} {...register('order')} hint="You can only review products from delivered orders" />
          <div className={styles.textareaWrap}>
            <label className={styles.ratingLabel}>Your Review</label>
            <textarea className={styles.textarea} rows={3} placeholder="Share your experience..." {...register('review')} />
            {errors.review && <p className={styles.error}>{errors.review.message}</p>}
          </div>
          <div className={styles.formActions}>
            <Button type="button" variant="ghost" size="sm" onClick={() => { reset(); setShowForm(false); }}>Cancel</Button>
            <Button type="submit" size="sm" loading={isPending}>Submit Review</Button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {isLoading ? <Spinner /> : (
        <div className={styles.list}>
          {data?.reviews.map((r) => (
            <div key={r._id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewUser}>{r.user.name}</span>
                <div className={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} fill={s <= r.rating ? 'currentColor' : 'none'} className={s <= r.rating ? styles.starFilled : styles.starEmpty} />
                  ))}
                </div>
              </div>
              <p className={styles.reviewText}>{r.review}</p>
              <span className={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
          ))}
          {data?.reviews.length === 0 && <p className={styles.noReviews}>No reviews yet. Be the first!</p>}
        </div>
      )}

      {data && data.pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <Button variant="ghost" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}
    </section>
  );
}
