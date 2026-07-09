import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { useAdminOrders, useUpdateOrderStatus, useHandleReturn } from '@/hooks/useAdmin';
import { Button, Badge, TableSkeleton, Select } from '@shared/components';
import { getOrderStatusBadgeVariant } from '@/shared/utils/badge';
import styles from './Orders.module.css';

const STATUS_OPTIONS = [
  { label: 'All statuses', value: '' },
  { label: 'Placed', value: 'Placed' },
  { label: 'Confirmed', value: 'Confirmed' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Out for Delivery', value: 'Out for Delivery' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Cancelled', value: 'Cancelled' },
  { label: 'Return Requested', value: 'Return Requested' },
  { label: 'Returned', value: 'Returned' },
];

const NEXT_STATUS: Record<string, string[]> = {
  'Placed': ['Confirmed', 'Cancelled'],
  'Confirmed': ['Shipped', 'Cancelled'],
  'Shipped': ['Out for Delivery'],
  'Out for Delivery': ['Delivered'],
};

export default function Orders() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { data, isLoading } = useAdminOrders({ page, status: statusFilter || undefined });
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const { mutate: handleReturn } = useHandleReturn();

  return (
    <>
      <Helmet><title>Orders — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Orders</h1>
          <div className={styles.filterWrapper}>
            <Select
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
              placeholder="All statuses"
              fullWidth={false}
            />
          </div>
        </div>

        {isLoading ? <TableSkeleton columns={5} gridTemplate="180px 1fr 100px 140px 220px" minWidth="800px" /> : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Order ID</span>
              <span>Customer</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {data?.orders.map((order) => (
              <div key={order._id} className={styles.tableRow}>
                <Link to={`/admin/orders/${order._id}`} className={styles.orderId}>{order.orderId}</Link>
                <span>{order.user.name}</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                <Badge variant={getOrderStatusBadgeVariant(order.orderStatus)}>
                  {order.orderStatus}
                </Badge>
                <div className={styles.actions}>
                  {NEXT_STATUS[order.orderStatus]?.map((s) => (
                    <Button key={s} size="sm" variant="secondary" loading={updatingId === `${order._id}-${s}`}
                      onClick={() => {
                        setUpdatingId(`${order._id}-${s}`);
                        updateStatus({ id: order._id, status: s }, { onSettled: () => setUpdatingId(null) });
                      }}>
                      {s}
                    </Button>
                  ))}
                  {order.orderStatus === 'Return Requested' && (
                    <>
                      <Button size="sm" loading={updatingId === `${order._id}-approve`} onClick={() => {
                        setUpdatingId(`${order._id}-approve`);
                        handleReturn({ id: order._id, action: 'approve' }, { onSettled: () => setUpdatingId(null) });
                      }}>Approve</Button>
                      <Button size="sm" variant="ghost" loading={updatingId === `${order._id}-reject`} onClick={() => {
                        setUpdatingId(`${order._id}-reject`);
                        handleReturn({ id: order._id, action: 'reject' }, { onSettled: () => setUpdatingId(null) });
                      }}>Reject</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data && data.pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <span className={styles.pageInfo}>Page {page} of {data.pagination.totalPages}</span>
            <Button variant="secondary" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        )}
      </div>
    </>
  );
}
