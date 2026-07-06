import { Outlet, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@shared/components/Navbar';
import { Footer } from '@shared/components/Footer';
import { PageTransition } from '@shared/components/PageTransition';
import { OfferBanner } from '@shared/components/OfferBanner';
import styles from './PublicLayout.module.css';

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className={styles.layout}>
      {location.pathname === '/' && <OfferBanner />}
      <Navbar />
      <main className={styles.main}>
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
