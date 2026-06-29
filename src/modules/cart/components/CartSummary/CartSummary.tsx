import { Link } from 'react-router';
import { Button } from '@shared/components';
import styles from './CartSummary.module.css';

interface CartSummaryProps {
  totalAmount: number;
  itemCount: number;
}

export function CartSummary({ totalAmount, itemCount }: CartSummaryProps) {
  const isFreeDelivery = totalAmount >= 499;

  return (
    <aside className={styles.summary}>
      <h2 className={styles.title}>Order Summary</h2>

      <div className={styles.rows}>
        <div className={styles.row}>
          <span>Subtotal ({itemCount} items)</span>
          <span>₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>
        <div className={styles.row}>
          <span>Delivery</span>
          <span className={isFreeDelivery ? styles.free : ''}>
            {isFreeDelivery ? 'Free' : '₹40'}
          </span>
        </div>
        {!isFreeDelivery && (
          <p className={styles.hint}>
            Add ₹{(499 - totalAmount).toLocaleString('en-IN')} more for free delivery
          </p>
        )}
      </div>

      <div className={styles.total}>
        <span>Total</span>
        <span>₹{(isFreeDelivery ? totalAmount : totalAmount + 40).toLocaleString('en-IN')}</span>
      </div>

      <Link to="/checkout" className={styles.checkoutLink}>
        <Button size="lg" fullWidth>
          Proceed to Checkout
        </Button>
      </Link>

      <p className={styles.note}>Taxes calculated at checkout</p>
    </aside>
  );
}
