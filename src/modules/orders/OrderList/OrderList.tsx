import { useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { Package } from 'lucide-react';
import { useInfiniteOrders } from '@/hooks/useOrders';
import { Button, Badge, Skeleton, Spinner } from '@shared/components';
import styles from './OrderList.module.css';

const statusVariant = (s: string) => {
  if (s === 'Delivered') return 'success';
  if (s === 'Cancelled' || s === 'Returned') return 'error';
  if (s === 'Return Requested') return 'warning';
  return 'default';
};

export default function OrderList() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteOrders();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection observer for infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const allOrders = data?.pages.flatMap((page) => (page.data.data as any)?.orders || []) || [];

  return (
    <>
      <Helmet><title>Orders — Wearhaus</title></Helmet>
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
        ) : allOrders.length === 0 ? (
          <div className={styles.empty}>
            <Package size={48} strokeWidth={1} />
            <p>No orders yet</p>
            <Link to="/shop"><Button>Start Shopping</Button></Link>
          </div>
        ) : (
          <div className={styles.list}>
            {allOrders.map((order) => (
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

            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className={styles.loadMore}>
              {isFetchingNextPage && <Spinner size="sm" />}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
