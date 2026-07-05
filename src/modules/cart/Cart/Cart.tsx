import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { ShoppingBag } from 'lucide-react';
import { Button, Spinner } from '@shared/components';
import { useCart, useClearCart } from '@/hooks/useCart';
import { CartItem } from '../components/CartItem/CartItem';
import { CartSummary } from '../components/CartSummary/CartSummary';
import styles from './Cart.module.css';

export default function Cart() {
  const { data: cart, isLoading } = useCart();
  const { mutate: clearCart, isPending: clearing } = useClearCart();

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Spinner size="lg" />
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <>
      <Helmet>
        <title>Bag — Wearhaus</title>
      </Helmet>

      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your Bag</h1>
          {!isEmpty && (
            <span className={styles.count}>{cart.items.length} item{cart.items.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {isEmpty ? (
          <div className={styles.empty}>
            <ShoppingBag size={48} strokeWidth={1} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>Your bag is empty</h2>
            <p className={styles.emptyText}>Looks like you haven&apos;t added anything yet.</p>
            <Link to="/shop">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* Items list */}
            <div className={styles.items}>
              {cart.items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
              <div className={styles.clearAction}>
                <Button variant="ghost" size="sm" onClick={() => clearCart()} loading={clearing}>
                  Remove all items
                </Button>
              </div>
            </div>

            {/* Summary */}
            <CartSummary totalAmount={cart.totalAmount} itemCount={cart.items.length} />
          </div>
        )}
      </div>
    </>
  );
}
