import { useState } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';
import { useOrderDetail, useCancelOrder, useRequestReturn, useOrderInvoice, useRetryPayment, useVerifyPayment } from '@/hooks/useOrders';
import { Button, Badge, Spinner, Input, Modal } from '@shared/components';
import styles from './OrderDetail.module.css';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrderDetail(id || '');
  const { data: invoice } = useOrderInvoice(id || '');
  const { mutate: cancelOrder, isPending: cancelling } = useCancelOrder();
  const { mutate: requestReturn, isPending: returning } = useRequestReturn();
  const { mutateAsync: retryPayment, isPending: retrying } = useRetryPayment();
  const { mutateAsync: verifyPaymentAsync } = useVerifyPayment();

  const [showCancel, setShowCancel] = useState(false);
  const [showReturn, setShowReturn] = useState(false);
  const [reason, setReason] = useState('');

  if (isLoading) return <div className={styles.loader}><Spinner size="lg" /></div>;
  if (!order) return <div className={styles.loader}>Order not found</div>;

  const canCancel = ['Placed', 'Confirmed', 'Shipped'].includes(order.orderStatus);
  const canReturn = order.orderStatus === 'Delivered';

  return (
    <>
      <Helmet><title>Order {order.orderId} — Wearhaus</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.orderId}>{order.orderId}</h1>
            <p className={styles.date}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <Badge variant={order.orderStatus === 'Delivered' ? 'success' : order.orderStatus === 'Cancelled' ? 'error' : 'default'}>
            {order.orderStatus}
          </Badge>
        </div>

        {/* Timeline */}
        {order.statusHistory.length > 0 && (
          <section className={styles.timeline}>
            {order.statusHistory.map((entry, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <div>
                  <span className={styles.timelineStatus}>{entry.status}</span>
                  <span className={styles.timelineDate}>{new Date(entry.timestamp).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Items */}
        <section className={styles.items}>
          <h2 className={styles.sectionTitle}>Items</h2>
          {order.items.map((item, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.productName}</span>
                <span className={styles.itemVariant}>{item.variantInfo} · Qty: {item.quantity}</span>
              </div>
              <span className={styles.itemPrice}>₹{item.finalPrice.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </section>

        {/* Pricing */}
        <section className={styles.pricing}>
          <div className={styles.pricingRow}><span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
          {order.offerDiscount > 0 && <div className={styles.pricingRow}><span>Offer Discount</span><span>-₹{order.offerDiscount}</span></div>}
          {order.couponDiscount > 0 && <div className={styles.pricingRow}><span>Coupon ({order.couponCode})</span><span>-₹{order.couponDiscount}</span></div>}
          {order.walletAmountUsed > 0 && <div className={styles.pricingRow}><span>Wallet</span><span>-₹{order.walletAmountUsed}</span></div>}
          {order.shippingCharge > 0 && <div className={styles.pricingRow}><span>Shipping</span><span>₹{order.shippingCharge}</span></div>}
          <div className={styles.pricingRow}><span>Tax (incl.)</span><span>₹{order.totalTax.toFixed(2)}</span></div>
          <div className={styles.pricingTotal}><span>Total</span><span>₹{order.totalAmount.toLocaleString('en-IN')}</span></div>
        </section>

        {/* Address */}
        <section className={styles.address}>
          <h2 className={styles.sectionTitle}>Shipping Address</h2>
          <p>{order.shippingAddress.fullName}, {order.shippingAddress.phone}</p>
          <p>{order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
        </section>

        {/* Actions */}
        <div className={styles.actions}>
          {invoice?.pdfUrl && (
            <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" leftIcon={<FileText size={14} />}>Download Invoice</Button>
            </a>
          )}
          {order.paymentMethod === 'razorpay' && ['Pending', 'Failed'].includes(order.paymentStatus) && order.orderStatus !== 'Cancelled' && (
            <Button size="sm" loading={retrying} onClick={async () => {
              try {
                const res = await retryPayment(order._id);
                const data = res.data.data as any;
                if (data?.razorpayOrder) {
                  const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
                    amount: data.razorpayOrder.amount,
                    currency: data.razorpayOrder.currency,
                    order_id: data.razorpayOrder.id,
                    handler: async (response: any) => {
                      try {
                        await verifyPaymentAsync({
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature,
                        });
                      } catch { /* will show on page refresh */ }
                      window.location.reload();
                    },
                  };
                  const rzp = new (window as any).Razorpay(options);
                  rzp.open();
                }
              } catch { /* error toast handled by hook */ }
            }}>
              Retry Payment
            </Button>
          )}
          {canCancel && <Button variant="danger" size="sm" onClick={() => setShowCancel(true)}>Cancel Order</Button>}
          {order.orderStatus === 'Cancel Requested' && <Badge variant="warning">Cancellation Pending Approval</Badge>}
          {canReturn && <Button variant="secondary" size="sm" onClick={() => setShowReturn(true)}>Request Return</Button>}
        </div>
      </div>

      {/* Cancel modal */}
      <Modal open={showCancel} onClose={() => setShowCancel(false)} title="Cancel Order" size="sm">
        <div className={styles.modalForm}>
          <Input label="Reason for cancellation" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why are you cancelling?" />
          <Button fullWidth loading={cancelling} disabled={reason.length < 5} onClick={() => cancelOrder({ id: order._id, reason }, { onSuccess: () => setShowCancel(false) })}>
            Confirm Cancellation
          </Button>
        </div>
      </Modal>

      {/* Return modal */}
      <Modal open={showReturn} onClose={() => setShowReturn(false)} title="Request Return" size="sm">
        <div className={styles.modalForm}>
          <Input label="Reason for return" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why are you returning?" />
          <Button fullWidth loading={returning} disabled={reason.length < 5} onClick={() => requestReturn({ id: order._id, reason }, { onSuccess: () => setShowReturn(false) })}>
            Submit Return Request
          </Button>
        </div>
      </Modal>
    </>
  );
}
