import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import { Button, Badge, Spinner } from '@shared/components';
import { Link } from 'react-router';
import styles from './Wishlist.module.css';

export default function Wishlist() {
  const { data, isLoading } = useWishlist();
  const { mutate: remove } = useRemoveFromWishlist();

  const products = data?.products || [];

  return (
    <>
      <Helmet><title>Wishlist — STORE</title></Helmet>
      <div className={styles.page}>
        <h1 className={styles.title}>Wishlist</h1>

        {isLoading ? <Spinner size="lg" /> : products.length === 0 ? (
          <div className={styles.empty}>
            <Heart size={48} strokeWidth={1} />
            <p>Your wishlist is empty</p>
            <Link to="/shop"><Button>Explore Collection</Button></Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <div key={product._id} className={styles.card}>
                <Link to={`/shop/${product._id}`} className={styles.imageLink}>
                  <img src={product.images[0] || '/placeholder.svg'} alt={product.name} className={styles.image} />
                  {!product.inStock && <div className={styles.oos}><Badge variant="error">Out of Stock</Badge></div>}
                </Link>
                <div className={styles.info}>
                  <Link to={`/shop/${product._id}`} className={styles.name}>{product.name}</Link>
                  <span className={styles.price}>₹{product.basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.actions}>
                  <Link to={`/shop/${product._id}`}>
                    <Button size="sm" variant="secondary" leftIcon={<ShoppingBag size={13} />} disabled={!product.inStock}>
                      {product.inStock ? 'View & Add' : 'Unavailable'}
                    </Button>
                  </Link>
                  <button className={styles.removeBtn} onClick={() => remove(product._id)} aria-label="Remove from wishlist">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
