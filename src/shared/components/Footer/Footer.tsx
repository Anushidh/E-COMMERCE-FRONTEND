import { Link } from 'react-router';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>STORE</Link>
            <p className={styles.tagline}>Premium fashion & lifestyle. Curated with intention.</p>
          </div>

          {/* Shop */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Shop</h4>
            <Link to="/shop?gender=Women" className={styles.link}>Women</Link>
            <Link to="/shop?gender=Men" className={styles.link}>Men</Link>
            <Link to="/shop" className={styles.link}>All Products</Link>
          </div>

          {/* Account */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Account</h4>
            <Link to="/profile" className={styles.link}>My Profile</Link>
            <Link to="/orders" className={styles.link}>Orders</Link>
            <Link to="/wishlist" className={styles.link}>Wishlist</Link>
            <Link to="/wallet" className={styles.link}>Wallet</Link>
          </div>

          {/* Info */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Info</h4>
            <span className={styles.link}>About Us</span>
            <span className={styles.link}>Contact</span>
            <span className={styles.link}>Shipping Policy</span>
            <span className={styles.link}>Returns & Refunds</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} STORE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
