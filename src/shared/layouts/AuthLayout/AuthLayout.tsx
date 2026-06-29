import { Outlet, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '@shared/components/PageTransition';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  const location = useLocation();

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>STORE</a>
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </div>
    </div>
  );
}
