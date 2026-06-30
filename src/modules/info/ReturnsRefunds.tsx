import { Helmet } from 'react-helmet-async';
import { RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import styles from './Info.module.css';

export default function ReturnsRefunds() {
  return (
    <>
      <Helmet><title>Returns & Refunds — STORE</title></Helmet>
      <div className={styles.page}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Returns & Refunds</h1>
          <p className={styles.subtitle}>
            Not happy with your order? No worries — we've got a simple, no-hassle return process.
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Return Window</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <RotateCcw size={16} className={styles.listIcon} />
                <span>You can return any item within <strong>7 days</strong> of delivery</span>
              </li>
              <li className={styles.listItem}>
                <RotateCcw size={16} className={styles.listIcon} />
                <span>Items must be unused, unwashed, and in their original packaging with all tags attached</span>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Eligible for Returns</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <CheckCircle size={16} className={styles.listIcon} />
                <span>Wrong size or doesn't fit as expected</span>
              </li>
              <li className={styles.listItem}>
                <CheckCircle size={16} className={styles.listIcon} />
                <span>Product received is damaged or defective</span>
              </li>
              <li className={styles.listItem}>
                <CheckCircle size={16} className={styles.listIcon} />
                <span>Different product received from what was ordered</span>
              </li>
              <li className={styles.listItem}>
                <CheckCircle size={16} className={styles.listIcon} />
                <span>Color or material is significantly different from what was shown</span>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Not Eligible for Returns</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <XCircle size={16} className={styles.listIcon} />
                <span>Items worn, washed, or altered after delivery</span>
              </li>
              <li className={styles.listItem}>
                <XCircle size={16} className={styles.listIcon} />
                <span>Innerwear, swimwear, and personal hygiene products</span>
              </li>
              <li className={styles.listItem}>
                <XCircle size={16} className={styles.listIcon} />
                <span>Products marked as "Final Sale" or "Non-Returnable"</span>
              </li>
              <li className={styles.listItem}>
                <XCircle size={16} className={styles.listIcon} />
                <span>Items with missing tags or original packaging</span>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>How to Initiate a Return</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <CheckCircle size={16} className={styles.listIcon} />
                <span><strong>Step 1:</strong> Go to "My Orders" and select the item you want to return</span>
              </li>
              <li className={styles.listItem}>
                <CheckCircle size={16} className={styles.listIcon} />
                <span><strong>Step 2:</strong> Choose a reason for the return and submit your request</span>
              </li>
              <li className={styles.listItem}>
                <CheckCircle size={16} className={styles.listIcon} />
                <span><strong>Step 3:</strong> Our courier partner will pick up the item within 2–3 business days</span>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Refund Process</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <AlertCircle size={16} className={styles.listIcon} />
                <span>Refunds are processed within <strong>5–7 business days</strong> after we receive and inspect the returned item</span>
              </li>
              <li className={styles.listItem}>
                <AlertCircle size={16} className={styles.listIcon} />
                <span>Amount is credited back to your original payment method or STORE Wallet (your choice)</span>
              </li>
              <li className={styles.listItem}>
                <AlertCircle size={16} className={styles.listIcon} />
                <span>Wallet refunds are instant; bank/card refunds may take an additional 3–5 business days</span>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Need Help?</h2>
            <p className={styles.text}>
              If you have any questions about returns or refunds, reach out to us at <strong>support@store.com</strong> or call <strong>+91 98765 43210</strong>. We're happy to help.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
