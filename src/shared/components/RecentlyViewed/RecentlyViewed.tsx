import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { productsService } from '@/services/products.service';
import { useAuthStore } from '@shared/stores/authStore';
import styles from './RecentlyViewed.module.css';

export function RecentlyViewed() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data } = useQuery({
    queryKey: ['recentlyViewed'],
    queryFn: productsService.getRecentlyViewed,
    select: (res) => res.data.data as { product: { _id: string; name: string; images: string[]; basePrice: number; slug: string; status: string } }[],
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  if (!data || data.length === 0) return null;

  const products = data.filter((item) => item.product).slice(0, 8);
  if (products.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Recently Viewed</h2>
      <div className={styles.grid}>
        {products.map((item) => (
          <Link to={`/shop/${item.product.slug || item.product._id}`} key={item.product._id} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={item.product.images[0] || '/placeholder.svg'} alt={item.product.name} className={styles.image} loading="lazy" />
            </div>
            <div className={styles.info}>
              <span className={styles.name}>{item.product.name}</span>
              <span className={styles.price}>₹{item.product.basePrice.toLocaleString('en-IN')}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
