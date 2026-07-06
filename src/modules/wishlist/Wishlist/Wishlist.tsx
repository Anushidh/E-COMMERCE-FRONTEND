import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingBag, Share2, Trash2 } from 'lucide-react';
import { useWishlist, useRemoveFromWishlist, useClearWishlist } from '@/hooks/useWishlist';
import { Button, Badge, Skeleton, ConfirmDialog } from '@shared/components';
import { Link } from 'react-router';
import styles from './Wishlist.module.css';

function WishlistSkeleton() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={styles.card}>
          <Skeleton height="" className={styles.skeletonImage} />
          <div className={styles.info}>
            <Skeleton width="65%" height="0.875rem" />
            <Skeleton width="30%" height="0.875rem" />
          </div>
          <div className={styles.actions}>
            <Skeleton width="100%" height="2rem" borderRadius="var(--radius-sm)" />
            <Skeleton width="100%" height="2rem" borderRadius="var(--radius-sm)" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Wishlist() {
  const { data, isLoading } = useWishlist();
  const { mutate: remove } = useRemoveFromWishlist();
  const { mutate: clearAll, isPending: clearing } = useClearWishlist();

  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; type: 'single' | 'all'; productId?: string }>({
    open: false,
    type: 'all',
  });

  const products = data?.products || [];

  const shareWishlist = () => {
    const names = products.slice(0, 5).map((p) => p.name).join(', ');
    const message = `Check out my wishlist on Wearhaus: ${names}${products.length > 5 ? ` and ${products.length - 5} more` : ''}!\n\n${window.location.origin}/shop`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleConfirm = () => {
    if (confirmDialog.type === 'all') {
      clearAll();
    } else if (confirmDialog.type === 'single' && confirmDialog.productId) {
      remove(confirmDialog.productId);
    }
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  return (
    <>
      <Helmet><title>Wishlist — Wearhaus</title></Helmet>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Wishlist <Heart size={20} /></h1>
          </div>
          {products.length > 0 && (
            <div className={styles.headerActions}>
              <Button size="sm" variant="secondary" leftIcon={<Share2 size={14} />} onClick={shareWishlist}>
                Share Wishlist
              </Button>
              <Button size="sm" variant="danger" leftIcon={<Trash2 size={14} />} loading={clearing} onClick={() => setConfirmDialog({ open: true, type: 'all' })}>
                Delete All
              </Button>
            </div>
          )}
        </div>

        {isLoading ? <WishlistSkeleton /> : products.length === 0 ? (
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
                  <div className={styles.priceRow}>
                    {product.discountedPrice ? (
                      <>
                        <span className={styles.price}>₹{product.discountedPrice.toLocaleString('en-IN')}</span>
                        <span className={styles.originalPrice}>₹{product.basePrice.toLocaleString('en-IN')}</span>
                      </>
                    ) : (
                      <span className={styles.price}>₹{product.basePrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>
                <div className={styles.actions}>
                  <Link to={`/shop/${product._id}`}>
                    <Button size="sm" variant="secondary" leftIcon={<ShoppingBag size={13} />} disabled={!product.inStock}>
                      {product.inStock ? 'Select Variant' : 'Unavailable'}
                    </Button>
                  </Link>
                  <Button size="sm" variant="danger" onClick={() => setConfirmDialog({ open: true, type: 'single', productId: product._id })}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.type === 'all' ? 'Clear Wishlist?' : 'Remove Item?'}
        description={confirmDialog.type === 'all' ? 'Are you sure you want to remove all items from your wishlist? This cannot be undone.' : 'Are you sure you want to remove this item from your wishlist?'}
        confirmLabel={confirmDialog.type === 'all' ? 'Clear All' : 'Remove'}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
    </>
  );
}
