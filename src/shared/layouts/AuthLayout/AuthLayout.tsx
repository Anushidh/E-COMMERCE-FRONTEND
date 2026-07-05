import { Outlet, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '@shared/components/PageTransition';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  const location = useLocation();

  return (
    <div className={styles.layout}>
      {/* Left brand panel — hidden on mobile */}
      <div className={styles.brandPanel}>
        <div className={styles.brandPattern} />
        <div className={styles.brandContent}>
          <a href="/" className={styles.brandLogo}>Wearhaus</a>
          <div className={styles.brandMessage}>
            <h1 className={styles.brandHeadline}>
              Your style,<br />delivered.
            </h1>
            <p className={styles.brandSubtext}>
              Discover curated collections, exclusive deals, and a seamless shopping experience — all in one place.
            </p>
            <ul className={styles.brandFeatures}>
              <li>Free shipping on orders over ₹499</li>
              <li>Easy 7-day returns & exchanges</li>
              <li>Secure payments with multiple options</li>
              <li>New arrivals added every week</li>
            </ul>
          </div>
          <p className={styles.brandFooter}>&copy; {new Date().getFullYear()} Wearhaus. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <a href="/" className={styles.mobileLogo}>Wearhaus</a>
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
