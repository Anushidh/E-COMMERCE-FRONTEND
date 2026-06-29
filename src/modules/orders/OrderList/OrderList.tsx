import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { Package } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { Button, Badge, Skeleton } from '@shared/components';
import styles from './OrderList.module.css';

const statusVariant = (s: string) => {
  if (s === 'Delivered') return 'success';
  if (s === 'Cancelled' || s === 'Returned') return 'error';
  if (s === 'Return Requested') return 'warning';
  return 'default';
};

export default function OrderList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders({ page });

  return (
    <>
      <Helmet><title>Orders — STORE</title></Helmet>
      <div className={styles.page}>
        <h1 className={styles.title}>Your Orders</h1>

        {isLoading ? (
          <div className={styles.list}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.card} style={{ padding: 'var(--space-5)' }}>
                <Skeleton width="40%" height="0.75rem" />
                <Skeleton width="60%" height="1rem" />
                <Skeleton width="25%" height="0.75rem" />
              </div>
            ))}
          </div>
        ) : data?.orders.length === 0 ? (
          <div className={styles.empty}>
            <Package size={48} strokeWidth={1} />
            <p>No orders yet</p>
            <Link to="/shop"><Button>Start Shopping</Button></Link>
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {data?.orders.map((order) => (
                <Link to={`/orders/${order._id}`} key={order._id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.orderId}>{order.orderId}</span>
                    <Badge variant={statusVariant(order.orderStatus)}>{order.orderStatus}</Badge>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.itemCount}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                    <span className={styles.total}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <span className={styles.date}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </Link>
              ))}
            </div>

            {data && data.pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <span className={styles.pageInfo}>Page {page} of {data.pagination.totalPages}</span>
                <Button variant="secondary" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
