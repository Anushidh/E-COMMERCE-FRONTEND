import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { useUpdateOrderStatus, useHandleReturn, useHandleCancellation } from '@/hooks/useAdmin';
import { Button, Badge, Skeleton, BackButton } from '@shared/components';
import { getOrderStatusBadgeVariant, getPaymentStatusBadgeVariant } from '@/shared/utils/badge';
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
  const { mutate: updateStatus, isPending: updating, variables: updateVariables } = useUpdateOrderStatus();
  const { mutate: handleReturn } = useHandleReturn();
  const { mutate: handleCancellation } = useHandleCancellation();

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin', 'order', id],
    queryFn: () => apiClient.get<ApiResponse<Order>>(`/admin/orders/${id}`),
    select: (res) => res.data.data,
    enabled: !!id,
  });

  const { data: invoice } = useQuery({
    queryKey: ['admin', 'order', id, 'invoice'],
    queryFn: () => apiClient.get<ApiResponse<{ invoiceId: string; pdfUrl: string }>>(`/admin/orders/${id}/invoice`),
    select: (res) => res.data.data,
    enabled: !!id && !!order && !['Cancelled', 'Returned'].includes(order.orderStatus),
  });

  if (isLoading) return (
    <div className={styles.page}>
      <Skeleton width="140px" height="1rem" />
      <div className={styles.header}>
        <div>
          <Skeleton width="220px" height="1.5rem" />
          <Skeleton width="160px" height="0.875rem" />
        </div>
        <Skeleton width="80px" height="1.5rem" borderRadius="var(--radius-sm)" />
      </div>
      <div className={styles.actions}>
        <Skeleton width="120px" height="2rem" borderRadius="var(--radius-sm)" />
        <Skeleton width="120px" height="2rem" borderRadius="var(--radius-sm)" />
      </div>
      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.section}>
            <Skeleton width="100px" height="0.75rem" />
            <Skeleton width="100%" height="3rem" />
            <Skeleton width="100%" height="3rem" />
          </div>
          <div className={styles.section}>
            <Skeleton width="120px" height="0.75rem" />
            <Skeleton width="100%" height="1rem" />
            <Skeleton width="100%" height="1rem" />
            <Skeleton width="100%" height="1rem" />
            <Skeleton width="60%" height="1.25rem" />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.section}>
            <Skeleton width="130px" height="0.75rem" />
            <Skeleton width="100%" height="1rem" />
            <Skeleton width="80%" height="1rem" />
            <Skeleton width="70%" height="1rem" />
          </div>
          <div className={styles.section}>
            <Skeleton width="110px" height="0.75rem" />
            <Skeleton width="100%" height="2rem" />
            <Skeleton width="100%" height="2rem" />
          </div>
        </div>
      </div>
    </div>
  );
  if (!order) return <div className={styles.loader}>Order not found</div>;

  return (
    <>
      <Helmet><title>Order {order.orderId} — Admin</title></Helmet>
      <div className={styles.page}>
        <BackButton to="/admin/orders" label="Back to Orders" />

        <div className={styles.header}>
          <div>
            <h1 className={styles.orderId}>{order.orderId}</h1>
            <p className={styles.date}>{new Date(order.createdAt).toLocaleString('en-IN')}</p>
          </div>
          <Badge variant={getOrderStatusBadgeVariant(order.orderStatus)}>{order.orderStatus}</Badge>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {NEXT_STATUS[order.orderStatus]?.map((s) => (
            <Button key={s} size="sm" variant="secondary" loading={updating && updateVariables?.status === s}
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
          {order.orderStatus === 'Cancel Requested' && (
            <>
              <Button size="sm" onClick={() => handleCancellation({ id: order._id, action: 'approve' })}>Approve Cancellation</Button>
              <Button size="sm" variant="ghost" onClick={() => handleCancellation({ id: order._id, action: 'reject' })}>Reject Cancellation</Button>
            </>
          )}
          {invoice?.pdfUrl && (
            <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="secondary" leftIcon={<FileText size={14} />}>
                Download Invoice
              </Button>
            </a>
          )}
        </div>

        {/* Two-column grid */}
        <div className={styles.grid}>
          {/* Left column */}
          <div className={styles.left}>
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
              <h2 className={styles.sectionTitle}>Payment Summary</h2>
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
                  <span>Payment Status</span><Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>{order.paymentStatus}</Badge>
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className={styles.right}>
            {/* Shipping Address */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Shipping Address</h2>
              <p className={styles.addressText}>{order.shippingAddress.fullName}</p>
              <p className={styles.addressText}>{order.shippingAddress.phone}</p>
              <p className={styles.addressText}>{order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}</p>
              <p className={styles.addressText}>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
            </section>

            {/* Timeline */}
            {order.statusHistory.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Order Timeline</h2>
                <div className={styles.timeline}>
                  {[...order.statusHistory].reverse().map((entry, i) => (
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
          </div>
        </div>
      </div>
    </>
  );
}
