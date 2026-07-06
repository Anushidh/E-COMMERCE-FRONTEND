import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { MapPin, Tag, Wallet, CreditCard, Truck, Plus } from 'lucide-react';
import { Button, Badge, Input, AddressFormModal } from '@shared/components';
import { useCart } from '@/hooks/useCart';
import { useProfile } from '@/hooks/useUser';
import { useAvailableCoupons, useApplyCoupon } from '@/hooks/useCoupons';
import { useWallet } from '@/hooks/useUser';
import { usePlaceOrder, useVerifyPayment } from '@/hooks/useOrders';
import styles from './Checkout.module.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: wallet } = useWallet();
  const { data: coupons } = useAvailableCoupons();
  const { mutate: applyCoupon, data: couponResult } = useApplyCoupon();
  const { mutate: placeOrder, isPending: placing } = usePlaceOrder();
  const { mutateAsync: verifyPaymentAsync } = useVerifyPayment();

  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod' | 'wallet'>('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Set default address when profile loads
  useEffect(() => {
    if (profile?.addresses && !selectedAddress) {
      const defaultAddr = profile.addresses.find((a) => a.isDefault) || profile.addresses[0];
      if (defaultAddr) setSelectedAddress(defaultAddr._id);
    }
  }, [profile?.addresses, selectedAddress]);

  if (cartLoading || profileLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.title} style={{ width: '30%', height: '2rem', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-sm)' }} />
        <div className={styles.layout}>
          <div className={styles.left}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.section} style={{ height: '120px', background: 'var(--color-gray-50)' }} />
            ))}
          </div>
          <div className={styles.summary} style={{ height: '300px', background: 'var(--color-gray-50)' }} />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const addresses = profile?.addresses || [];

  const subtotal = cart.totalAmount;
  const offerSavings = cart.items.reduce((sum, item) => {
    if (item.discountedPrice) {
      return sum + (item.price - item.discountedPrice) * item.quantity;
    }
    return sum;
  }, 0);
  const afterOffers = subtotal - offerSavings;
  const discount = couponResult?.data.data?.discount || 0;
  const shipping = (afterOffers - discount) >= 499 ? 0 : 40;
  const walletBalance = wallet?.balance || 0;
  const walletDeduction = paymentMethod === 'wallet'
    ? afterOffers - discount + shipping
    : useWalletBalance ? Math.min(walletBalance, afterOffers - discount + shipping) : 0;
  const total = Math.max(afterOffers - discount - walletDeduction + shipping, 0);

  const effectivePaymentMethod = (useWalletBalance && total === 0 && paymentMethod !== 'wallet') ? 'wallet' : paymentMethod;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      applyCoupon({ code: couponCode.trim(), orderTotal: afterOffers });
    }
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) return;
    placeOrder({
      addressId: selectedAddress,
      paymentMethod: effectivePaymentMethod,
      couponCode: couponResult?.data.data?.code || undefined,
      useWallet: useWalletBalance,
    }, {
      onSuccess: (res) => {
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
              } catch {}
              navigate(`/orders/${data.order._id}`);
            },
            modal: {
              ondismiss: () => {
                navigate(`/orders/${data.order._id}`);
              },
            },
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } else {
          navigate(`/orders/${data.order._id}`);
        }
      },
    });
  };

  return (
    <>
      <Helmet><title>Checkout — Wearhaus</title></Helmet>
      <div className={styles.page}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.layout}>
          <div className={styles.left}>
            {/* Address */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}><MapPin size={16} /> Delivery Address</h2>
                <Button size="sm" variant="secondary" leftIcon={<Plus size={14} />} onClick={() => setShowAddAddress(true)}>Add Address</Button>
              </div>
              
              {addresses.length === 0 ? (
                <p className={styles.noAddress}>No addresses saved.</p>
              ) : (
                <div className={styles.addressList}>
                  {addresses.map((addr) => (
                    <label key={addr._id} className={`${styles.addressCard} ${selectedAddress === addr._id ? styles.addressActive : ''}`}>
                      <input type="radio" name="address" value={addr._id} checked={selectedAddress === addr._id} onChange={() => setSelectedAddress(addr._id)} className="sr-only" />
                      <span className={styles.addressLabel}>{addr.label}</span>
                      <span className={styles.addressText}>{addr.fullName}, {addr.addressLine1}, {addr.city}, {addr.state} — {addr.pincode}</span>
                      {addr.isDefault && <Badge variant="success">Default</Badge>}
                    </label>
                  ))}
                </div>
              )}
            </section>

            {/* Coupon */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 'var(--space-4)' }}><Tag size={16} /> Coupon</h2>
              <div className={styles.couponRow}>
                <Input placeholder="Enter code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                <Button variant="secondary" size="sm" onClick={handleApplyCoupon}>Apply</Button>
              </div>
              {couponResult?.data.data && (
                <p className={styles.couponSuccess}>-₹{couponResult.data.data.discount.toFixed(2)} applied!</p>
              )}
              {coupons && coupons.length > 0 && (
                <div className={styles.couponList}>
                  {coupons.slice(0, 3).map((c) => (
                    <button key={c._id} className={styles.couponChip} onClick={() => setCouponCode(c.code)}>
                      {c.code} — {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`} off
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Wallet */}
            {wallet && wallet.balance > 0 && paymentMethod !== 'wallet' && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: 'var(--space-4)' }}><Wallet size={16} /> Wallet</h2>
                <label className={styles.walletToggle}>
                  <input type="checkbox" checked={useWalletBalance} onChange={(e) => setUseWalletBalance(e.target.checked)} />
                  <span>Use wallet balance (₹{wallet.balance.toLocaleString('en-IN')})</span>
                </label>
              </section>
            )}

            {/* Payment */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 'var(--space-4)' }}><CreditCard size={16} /> Payment Method</h2>
              {useWalletBalance && total === 0 ? (
                <p className={styles.walletCovers}>Wallet balance covers the full amount. No additional payment needed.</p>
              ) : (
                <div className={styles.paymentOptions}>
                  <label className={`${styles.paymentOption} ${paymentMethod === 'razorpay' ? styles.paymentActive : ''}`}>
                    <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="sr-only" />
                    <span>Pay Online (UPI / Card / Netbanking)</span>
                  </label>
                  {wallet && wallet.balance > 0 && walletBalance >= (subtotal - discount + shipping) && (
                    <label className={`${styles.paymentOption} ${paymentMethod === 'wallet' ? styles.paymentActive : ''}`}>
                      <input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => { setPaymentMethod('wallet'); setUseWalletBalance(false); }} className="sr-only" />
                      <span>Pay with Wallet (₹{wallet.balance.toLocaleString('en-IN')} available)</span>
                    </label>
                  )}
                  <label className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.paymentActive : ''}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="sr-only" />
                    <span>Cash on Delivery</span>
                    {total < 500 && paymentMethod === 'cod' && <span className={styles.codWarning}>Min ₹500 for COD</span>}
                  </label>
                </div>
              )}
            </section>
          </div>

          {/* Summary */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryItems}>
              {cart.items.map((item) => (
                <div key={item._id} className={styles.summaryItem}>
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>₹{((item.discountedPrice || item.price) * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
              {offerSavings > 0 && <div className={styles.summaryRow}><span>Offer Discount</span><span className={styles.green}>-₹{offerSavings.toFixed(2)}</span></div>}
              {discount > 0 && <div className={styles.summaryRow}><span>Coupon</span><span className={styles.green}>-₹{discount.toFixed(2)}</span></div>}
              {walletDeduction > 0 && <div className={styles.summaryRow}><span>Wallet</span><span className={styles.green}>-₹{walletDeduction.toFixed(2)}</span></div>}
              <div className={styles.summaryRow}><span><Truck size={14} /> Delivery</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <Button size="lg" fullWidth loading={placing} disabled={!selectedAddress || (paymentMethod === 'cod' && total < 500) || (paymentMethod === 'wallet' && walletBalance < (subtotal - discount + shipping))} onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </aside>
        </div>
      </div>

      <AddressFormModal 
        open={showAddAddress} 
        onClose={() => setShowAddAddress(false)} 
        onSuccess={() => {
          // If it's their first address, it will automatically become default and selected
          // via the useEffect above when the profile data refreshes.
        }}
      />
    </>
  );
}
