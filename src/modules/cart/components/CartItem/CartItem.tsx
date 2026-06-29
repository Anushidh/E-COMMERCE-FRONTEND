import { Minus, Plus, X } from 'lucide-react';
import { useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart';
import type { CartItem as CartItemType } from '@shared/types/cart';
import styles from './CartItem.module.css';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { mutate: updateQty, isPending: updating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: removing } = useRemoveCartItem();

  const image = item.product.images[0] || '/placeholder.svg';
  const maxQty = Math.min(item.variant.stock, 10);

  return (
    <div className={styles.item}>
      <a href={`/shop/${item.product._id}`} className={styles.imageLink}>
        <img src={image} alt={item.product.name} className={styles.image} />
      </a>

      <div className={styles.details}>
        <div className={styles.top}>
          <div className={styles.info}>
            <h3 className={styles.name}>{item.product.name}</h3>
            <p className={styles.variant}>
              {item.variant.size} / {item.variant.color}
            </p>
          </div>
          <button
            className={styles.removeBtn}
            onClick={() => removeItem(item._id)}
            disabled={removing}
            aria-label="Remove item"
          >
            <X size={16} />
          </button>
        </div>

        <div className={styles.bottom}>
          <div className={styles.quantity}>
            <button
              className={styles.qtyBtn}
              onClick={() => updateQty({ itemId: item._id, quantity: item.quantity - 1 })}
              disabled={item.quantity <= 1 || updating}
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className={styles.qtyValue}>{item.quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => updateQty({ itemId: item._id, quantity: item.quantity + 1 })}
              disabled={item.quantity >= maxQty || updating}
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>
          <span className={styles.price}>
            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}
