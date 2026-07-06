import { Link } from 'react-router';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copyright}>&copy; {new Date().getFullYear()} Wearhaus. All rights reserved.</p>
        <div className={styles.links}>
          <Link to="/about" className={styles.link}>About Us</Link>
          <Link to="/contact" className={styles.link}>Contact</Link>
          <Link to="/shipping-policy" className={styles.link}>Shipping Policy</Link>
          <Link to="/returns-refunds" className={styles.link}>Returns & Refunds</Link>
        </div>
      </div>
    </footer>
  );
}
