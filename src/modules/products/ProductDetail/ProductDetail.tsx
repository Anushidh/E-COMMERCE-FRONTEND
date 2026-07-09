import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Badge, Skeleton } from '@shared/components';
import { useProductDetail } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { productsService } from '@/services/products.service';
import { useAuthStore } from '@shared/stores/authStore';
import { ProductGallery } from '../components/ProductGallery/ProductGallery';
import { VariantSelector } from '../components/VariantSelector/VariantSelector';
import { ProductReviews } from '../components/ProductReviews/ProductReviews';
import { RecentlyViewed } from '@shared/components/RecentlyViewed';
import type { Variant } from '@shared/types/product';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useProductDetail(slug || '');

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { data: wishlistData } = useWishlist();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Track product view
  useEffect(() => {
    if (data?.product._id && isAuthenticated) {
      productsService.trackView(data.product._id).catch(() => {});
    }
  }, [data?.product._id, isAuthenticated]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.layout}>
          <Skeleton height="600px" borderRadius="0" />
          <div className={styles.info}>
            <Skeleton width="60%" height="2rem" />
            <Skeleton width="30%" height="1.5rem" />
            <Skeleton width="100%" height="4rem" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>Product not found</div>
      </div>
    );
  }

  const { product, variants, discountedPrice } = data;
  const price = selectedVariant?.price || product.basePrice;
  const finalPrice = discountedPrice || price;
  const inStock = selectedVariant ? selectedVariant.stock > 0 : variants.some((v) => v.stock > 0);

  return (
    <>
      <Helmet>
        <title>{product.name} — Wearhaus</title>
        <meta name="description" content={product.description.slice(0, 160)} />
      </Helmet>

      <div className={styles.page}>
        <div className={styles.layout}>
          {/* Gallery */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Info */}
          <div className={styles.info}>
            <div className={styles.meta}>
              {product.brand && <span className={styles.brand}>{product.brand}</span>}
              <h1 className={styles.name}>{product.name}</h1>
              <div className={styles.pricing}>
                <span className={styles.price}>₹{finalPrice.toLocaleString('en-IN')}</span>
                {discountedPrice && (
                  <span className={styles.originalPrice}>
                    ₹{product.basePrice.toLocaleString('en-IN')}
                  </span>
                )}
                {data.offer && (
                  <Badge variant="success">
                    {data.offer.discountType === 'percentage'
                      ? `${data.offer.discountValue}% off`
                      : `₹${data.offer.discountValue} off`}
                  </Badge>
                )}
              </div>
              <p className={styles.tax}>Inclusive of all taxes</p>
            </div>

            {/* Variant selector */}
            <VariantSelector
              variants={variants}
              selectedVariant={selectedVariant}
              onSelect={setSelectedVariant}
            />

            {/* Quantity */}
            {selectedVariant && (
              <div className={styles.quantitySection}>
                <span className={styles.label}>Quantity</span>
                <div className={styles.quantityControl}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className={styles.qtyValue}>{quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => {
                      const maxQty = Math.min(10, selectedVariant.stock);
                      if (quantity >= maxQty) {
                        toast(`Maximum quantity reached for this item`);
                      } else {
                        setQuantity(quantity + 1);
                      }
                    }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className={styles.actions}>
              <Button
                size="lg"
                fullWidth
                disabled={!selectedVariant || !inStock}
                loading={addingToCart}
                leftIcon={<ShoppingBag size={18} />}
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error('Please log in to add items to your cart');
                    navigate('/login');
                    return;
                  }
                  if (selectedVariant) {
                    addToCart({ product: product._id, variant: selectedVariant._id, quantity });
                  }
                }}
              >
                {!selectedVariant ? 'Select a variant' : !inStock ? 'Out of Stock' : 'Add to Bag'}
              </Button>
              {(() => {
                const isInWishlist = wishlistData?.products?.some((p: any) => p._id === product._id);
                return (
                  <Button
                    variant={isInWishlist ? 'danger' : 'secondary'}
                    size="lg"
                    leftIcon={<Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />}
                    onClick={() => isInWishlist ? removeFromWishlist(product._id) : addToWishlist(product._id)}
                  >
                    {isInWishlist ? 'Wishlisted' : 'Wishlist'}
                  </Button>
                );
              })()}
            </div>

            {/* Description */}
            <div className={styles.description}>
              <h2 className={styles.descTitle}>Details</h2>
              <p className={styles.descText}>{product.description}</p>
            </div>

            {/* Reviews */}
            <ProductReviews
              productId={product._id}
              averageRating={product.averageRating}
              totalReviews={product.totalReviews}
            />
          </div>
        </div>
      </div>

      <RecentlyViewed />
    </>
  );
}
