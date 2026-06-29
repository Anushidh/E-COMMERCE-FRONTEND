import { useParams, useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { useUpdateOrderStatus, useHandleReturn } from '@/hooks/useAdmin';
import { Button, Badge, Spinner } from '@shared/components';
import type { Order } from '@shared/types/order';
import type { ApiResponse } from '@shared/types/api';
import styles from './OrderDetail.module.css';

const NEXT_STATUS: Record<string, string[]> = {
  'Placed': ['Confirmed', 'Cancelled'],
  'Confirmed': ['Shipped', 'Cancelled'],
  'Shipped': ['Out for Delivery'],
  'Out for Delivery': ['Delivered'],
};

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutate: updateStatus, isPending: updating } = useUpdateOrderStatus();
  const { mutate: handleReturn } = useHandleReturn();

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin', 'order', id],
    queryFn: () => apiClient.get<ApiResponse<Order>>(`/orders/${id}`),
    select: (res) => res.data.data,
    enabled: !!id,
  });

  if (isLoading) return <div className={styles.loader}><Spinner size="lg" /></div>;
  if (!order) return <div className={styles.loader}>Order not found</div>;

  const statusVariant = (s: string) => {
    if (s === 'Delivered') return 'success' as const;
    if (s === 'Cancelled' || s === 'Returned') return 'error' as const;
    if (s === 'Return Requested') return 'warning' as const;
    return 'default' as const;
  };

  return (
    <>
      <Helmet><title>Order {order.orderId} — Admin</title></Helmet>
      <div className={styles.page}>
        <button className={styles.back} onClick={() => navigate('/admin/orders')}>
          <ArrowLeft size={16} /> Back to Orders
        </button>

        <div className={styles.header}>
          <div>
            <h1 className={styles.orderId}>{order.orderId}</h1>
            <p className={styles.date}>{new Date(order.createdAt).toLocaleString('en-IN')}</p>
          </div>
          <Badge variant={statusVariant(order.orderStatus)}>{order.orderStatus}</Badge>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {NEXT_STATUS[order.orderStatus]?.map((s) => (
            <Button key={s} size="sm" variant="secondary" loading={updating}
              onClick={() => updateStatus({ id: order._id, status: s })}>
              Mark as {s}
            </Button>
          ))}
          {order.orderStatus === 'Return Requested' && (
            <>
              <Button size="sm" onClick={() => handleReturn({ id: order._id, action: 'approve' })}>Approve Return</Button>
              <Button size="sm" variant="ghost" onClick={() => handleReturn({ id: order._id, action: 'reject' })}>Reject Return</Button>
            </>
          )}
        </div>

        {/* Timeline */}
        {order.statusHistory.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Timeline</h2>
            <div className={styles.timeline}>
              {order.statusHistory.map((entry, i) => (
                <div key={i} className={styles.timelineItem}>
                  <div className={styles.dot} />
                  <div>
                    <span className={styles.timelineStatus}>{entry.status}</span>
                    <span className={styles.timelineDate}>{new Date(entry.timestamp).toLocaleString('en-IN')}</span>
                    {entry.note && <span className={styles.timelineNote}>{entry.note}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Items */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Items ({order.items.length})</h2>
          <div className={styles.items}>
            {order.items.map((item, i) => (
              <div key={i} className={styles.item}>
                <div>
                  <span className={styles.itemName}>{item.productName}</span>
                  <span className={styles.itemVariant}>{item.variantInfo} · Qty: {item.quantity}</span>
                </div>
                <div className={styles.itemPricing}>
                  <span>₹{item.finalPrice.toLocaleString('en-IN')}</span>
                  <span className={styles.itemTax}>GST {item.gstRate}%: ₹{item.gstAmount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Payment</h2>
          <div className={styles.pricing}>
            <div className={styles.pricingRow}><span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
            {order.offerDiscount > 0 && <div className={styles.pricingRow}><span>Offer Discount</span><span>-₹{order.offerDiscount}</span></div>}
            {order.couponDiscount > 0 && <div className={styles.pricingRow}><span>Coupon ({order.couponCode})</span><span>-₹{order.couponDiscount}</span></div>}
            {order.walletAmountUsed > 0 && <div className={styles.pricingRow}><span>Wallet</span><span>-₹{order.walletAmountUsed}</span></div>}
            <div className={styles.pricingRow}><span>Shipping</span><span>{order.shippingCharge === 0 ? 'Free' : `₹${order.shippingCharge}`}</span></div>
            <div className={styles.pricingRow}><span>Total Tax (incl.)</span><span>₹{order.totalTax.toFixed(2)}</span></div>
            <div className={styles.pricingTotal}><span>Total</span><span>₹{order.totalAmount.toLocaleString('en-IN')}</span></div>
            <div className={styles.pricingRow}>
              <span>Method</span><Badge variant="default">{order.paymentMethod.toUpperCase()}</Badge>
            </div>
            <div className={styles.pricingRow}>
              <span>Payment Status</span><Badge variant={order.paymentStatus === 'Paid' ? 'success' : order.paymentStatus === 'Failed' ? 'error' : 'default'}>{order.paymentStatus}</Badge>
            </div>
          </div>
        </section>

        {/* Address */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Shipping Address</h2>
          <p className={styles.addressText}>{order.shippingAddress.fullName} · {order.shippingAddress.phone}</p>
          <p className={styles.addressText}>{order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}</p>
          <p className={styles.addressText}>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
        </section>
      </div>
    </>
  );
}
