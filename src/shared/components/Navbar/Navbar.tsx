import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { ShoppingBag, Heart, User, Menu, X, Search } from 'lucide-react';
import { useAuthStore } from '@shared/stores/authStore';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import styles from './Navbar.module.css';

export function Navbar() {
  const { isAuthenticated } = useAuthStore();
  const { data: cart } = useCart();
  const { data: wishlistData } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cart?.items.length || 0;
  const wishlistCount = wishlistData?.products?.length || 0;

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Mobile menu toggle */}
        <button className={styles.menuBtn} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Left nav links (desktop) */}
        <div className={styles.leftNav}>
          <NavLink to="/shop" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            Shop
          </NavLink>
          <NavLink to="/shop?gender=Women" className={styles.navLink}>Women</NavLink>
          <NavLink to="/shop?gender=Men" className={styles.navLink}>Men</NavLink>
        </div>

        {/* Logo */}
        <Link to="/" className={styles.logo}>Wearhaus</Link>

        {/* Right actions */}
        <div className={styles.rightNav}>
          <Link to="/shop?search=" className={styles.iconBtn} aria-label="Search">
            <Search size={18} />
          </Link>
          {isAuthenticated && (
            <Link to="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
              <Heart size={18} />
              {wishlistCount > 0 && <span className={styles.cartBadge}>{wishlistCount}</span>}
            </Link>
          )}
          <Link to="/cart" className={styles.iconBtn} aria-label="Cart">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>
          {isAuthenticated ? (
            <Link to="/profile" className={styles.iconBtn} aria-label="Profile">
              <User size={18} />
            </Link>
          ) : (
            <Link to="/login" className={styles.loginLink}>Login</Link>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <NavLink to="/shop" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Shop All</NavLink>
          <NavLink to="/shop?gender=Women" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Women</NavLink>
          <NavLink to="/shop?gender=Men" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Men</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/orders" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Orders</NavLink>
              <NavLink to="/wishlist" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Wishlist</NavLink>
              <NavLink to="/profile" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Profile</NavLink>
            </>
          )}
          {!isAuthenticated && (
            <NavLink to="/login" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Login</NavLink>
          )}
        </div>
      )}
    </header>
  );
}
