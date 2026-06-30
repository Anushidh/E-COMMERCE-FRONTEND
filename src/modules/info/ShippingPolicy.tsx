import { Helmet } from 'react-helmet-async';
import { Truck, Clock, MapPin, Package, CheckCircle } from 'lucide-react';
import styles from './Info.module.css';

export default function ShippingPolicy() {
  return (
    <>
      <Helmet><title>Shipping Policy — STORE</title></Helmet>
      <div className={styles.page}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Shipping Policy</h1>
          <p className={styles.subtitle}>
            Everything you need to know about how we get your orders to your doorstep.
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Delivery Timelines</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <Clock size={16} className={styles.listIcon} />
                <span><strong>Metro cities</strong> (Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad): 2–4 business days</span>
              </li>
              <li className={styles.listItem}>
                <Clock size={16} className={styles.listIcon} />
                <span><strong>Other cities & towns:</strong> 4–7 business days</span>
              </li>
              <li className={styles.listItem}>
                <Clock size={16} className={styles.listIcon} />
                <span><strong>Remote areas:</strong> 7–10 business days</span>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping Charges</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <Truck size={16} className={styles.listIcon} />
                <span><strong>Free shipping</strong> on all orders above ₹499</span>
              </li>
              <li className={styles.listItem}>
                <Package size={16} className={styles.listIcon} />
                <span>A flat fee of <strong>₹49</strong> applies for orders below ₹499</span>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Tracking</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <CheckCircle size={16} className={styles.listIcon} />
                <span>Once your order ships, you'll receive a tracking link via email and SMS</span>
              </li>
              <li className={styles.listItem}>
                <CheckCircle size={16} className={styles.listIcon} />
                <span>Track your order anytime from the "My Orders" section in your account</span>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Delivery Coverage</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <MapPin size={16} className={styles.listIcon} />
                <span>We deliver across India via trusted courier partners including Delhivery, Blue Dart, and DTDC</span>
              </li>
              <li className={styles.listItem}>
                <MapPin size={16} className={styles.listIcon} />
                <span>PIN code availability is checked at checkout — if we can't deliver to your area, we'll let you know</span>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Important Notes</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <CheckCircle size={16} className={styles.listIcon} />
                <span>Orders placed before 2:00 PM IST on business days are typically dispatched the same day</span>
              </li>
              <li className={styles.listItem}>
                <CheckCircle size={16} className={styles.listIcon} />
                <span>Delivery timelines may be slightly longer during sales events or public holidays</span>
              </li>
              <li className={styles.listItem}>
                <CheckCircle size={16} className={styles.listIcon} />
                <span>If your order hasn't arrived within the expected timeline, reach out to us at support@store.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
