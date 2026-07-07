import { Link } from 'react-router';
import { Button } from '@shared/components';
import styles from './CartSummary.module.css';

interface CartSummaryProps {
  totalAmount: number;
  itemCount: number;
  offerSavings: number;
}

export function CartSummary({ totalAmount, itemCount, offerSavings }: CartSummaryProps) {
  const afterOffers = totalAmount - offerSavings;
  const isFreeDelivery = afterOffers >= 499;

  return (
    <aside className={styles.summary}>
      <h2 className={styles.title}>Order Summary</h2>

      <div className={styles.rows}>
        <div className={styles.row}>
          <span>Subtotal ({itemCount} items)</span>
          <span>₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>
        {offerSavings > 0 && (
          <div className={styles.row}>
            <span>Offer Discount</span>
            <span className={styles.free}>-₹{offerSavings.toFixed(2)}</span>
          </div>
        )}
        <div className={styles.row}>
          <span>Delivery</span>
          <span className={isFreeDelivery ? styles.free : ''}>
            {isFreeDelivery ? 'Free' : '₹40'}
          </span>
        </div>
        {!isFreeDelivery && (
          <p className={styles.hint}>
            Add ₹{(499 - afterOffers).toLocaleString('en-IN')} more for free delivery
          </p>
        )}
      </div>

      <div className={styles.total}>
        <span>Total</span>
        <span>₹{(isFreeDelivery ? afterOffers : afterOffers + 40).toLocaleString('en-IN')}</span>
      </div>

      {(isFreeDelivery ? afterOffers : afterOffers + 40) < 50 && (
        <p className={styles.hint} style={{ color: 'var(--color-danger)' }}>
          Minimum cart value is ₹50
        </p>
      )}

      <Link to={(isFreeDelivery ? afterOffers : afterOffers + 40) < 50 ? "#" : "/checkout"} className={styles.checkoutLink}>
        <Button size="lg" fullWidth disabled={(isFreeDelivery ? afterOffers : afterOffers + 40) < 50}>
          Proceed to Checkout
        </Button>
      </Link>

      <p className={styles.note}>Taxes calculated at checkout</p>
    </aside>
  );
}
