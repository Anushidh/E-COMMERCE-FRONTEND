import { Helmet } from 'react-helmet-async';
import { ShoppingCart, Send } from 'lucide-react';
import { useAbandonedCarts, useProcessAbandonedCarts } from '@/hooks/useAdmin';
import { Button, Badge, TableSkeleton } from '@shared/components';
import styles from './AbandonedCarts.module.css';

export default function AbandonedCarts() {
  const { data, isLoading } = useAbandonedCarts();
  const { mutate: process, isPending } = useProcessAbandonedCarts();

  return (
    <>
      <Helmet><title>Abandoned Carts — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Abandoned Carts</h1>
            {data && (
              <p className={styles.subtitle}>
                {data.totalAbandoned} carts · ₹{data.totalValue.toLocaleString('en-IN')} potential revenue
              </p>
            )}
          </div>
          <Button size="sm" leftIcon={<Send size={14} />} loading={isPending} onClick={() => process()}>
            Send Reminders
          </Button>
        </div>

        {isLoading ? <TableSkeleton columns={4} gridTemplate="1fr 80px 100px 120px" /> : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Customer</span><span>Items</span><span>Value</span><span>Inactive Since</span>
            </div>
            {data?.carts.map((cart) => (
              <div key={cart._id} className={styles.tableRow}>
                <div className={styles.customer}>
                  <span className={styles.customerName}>{cart.user.name}</span>
                  <span className={styles.customerEmail}>{cart.user.email}</span>
                </div>
                <Badge variant="default">{cart.items.length} items</Badge>
                <span>₹{cart.totalAmount.toLocaleString('en-IN')}</span>
                <span className={styles.date}>{new Date(cart.lastActivityAt).toLocaleDateString('en-IN')}</span>
              </div>
            ))}
            {data?.carts.length === 0 && (
              <div className={styles.empty}>
                <ShoppingCart size={32} strokeWidth={1} />
                <p>No abandoned carts</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
