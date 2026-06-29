import { useState } from 'react';
import { Outlet, NavLink, Navigate } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@shared/stores/authStore';
import { useAdminLogout } from '@/hooks/useAuth';
import styles from './AdminLayout.module.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/coupons', label: 'Coupons' },
  { to: '/admin/offers', label: 'Offers' },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/abandoned-carts', label: 'Abandoned Carts' },
];

export default function AdminLayout() {
  const { isAuthenticated, role } = useAuthStore();
  const { mutate: logout } = useAdminLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth guard — redirect to admin login if not authenticated as admin
  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className={styles.layout}>
      {/* Mobile overlay */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>STORE ADMIN</div>
          <button className={styles.closeSidebar} onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={() => logout()}>
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className={styles.content}>
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <span className={styles.headerBrand}>STORE ADMIN</span>
        </header>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
