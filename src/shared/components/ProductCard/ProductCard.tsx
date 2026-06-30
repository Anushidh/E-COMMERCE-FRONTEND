import { Heart } from 'lucide-react';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  slug: string;
  name: string;
  price: number;
  discountedPrice?: number | null;
  image: string;
  averageRating?: number;
  isWishlisted?: boolean;
  onWishlistToggle?: () => void;
  badge?: string;
}

export function ProductCard({
  slug,
  name,
  price,
  discountedPrice,
  image,
  isWishlisted = false,
  onWishlistToggle,
  badge,
}: ProductCardProps) {
  return (
    <article className={styles.card}>
      <a href={`/shop/${slug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <img src={image} alt={name} className={styles.image} loading="lazy" />
          {badge && <span className={styles.badge}>{badge}</span>}
        </div>
      </a>
      {onWishlistToggle && (
        <button
          className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ''}`}
          onClick={onWishlistToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      )}
      <a href={`/shop/${slug}`} className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.priceRow}>
          {discountedPrice ? (
            <>
              <p className={styles.price}>₹{discountedPrice.toLocaleString('en-IN')}</p>
              <p className={styles.originalPrice}>₹{price.toLocaleString('en-IN')}</p>
            </>
          ) : (
            <p className={styles.price}>₹{price.toLocaleString('en-IN')}</p>
          )}
        </div>
      </a>
    </article>
  );
}
