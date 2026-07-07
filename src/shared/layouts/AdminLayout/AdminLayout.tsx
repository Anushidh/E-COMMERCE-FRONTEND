import { useState, useEffect } from 'react';
import { Outlet, NavLink, Navigate, useLocation } from 'react-router';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@shared/stores/authStore';
import { useAdminLogout } from '@/hooks/useAuth';
import { ConfirmDialog } from '@shared/components';
import styles from './AdminLayout.module.css';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

interface NavGroup {
  label: string;
  children: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return 'children' in entry;
}

const NAV_ENTRIES: NavEntry[] = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/coupons', label: 'Coupons' },
  {
    label: 'Offers',
    children: [
      { to: '/admin/offers/products', label: 'Product Offers' },
      { to: '/admin/offers/categories', label: 'Category Offers' },
    ],
  },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/abandoned-carts', label: 'Abandoned Carts' },
];

export default function AdminLayout() {
  const { isAuthenticated, role } = useAuthStore();
  const { mutate: logout } = useAdminLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();

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
          <div className={styles.brand}>Wearhaus Admin</div>
          <button className={styles.closeSidebar} onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className={styles.nav}>
          {NAV_ENTRIES.map((entry) => {
            if (isGroup(entry)) {
              const isChildActive = entry.children.some((child) => location.pathname.startsWith(child.to));
              return (
                <NavGroup
                  key={entry.label}
                  label={entry.label}
                  children={entry.children}
                  isActive={isChildActive}
                  onNavigate={() => setSidebarOpen(false)}
                />
              );
            }
            return (
              <NavLink
                key={entry.to}
                to={entry.to}
                end={entry.end}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                {entry.label}
              </NavLink>
            );
          })}
        </nav>
        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={() => setShowLogoutConfirm(true)}>
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
          <span className={styles.headerBrand}>Wearhaus Admin</span>
        </header>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Log out?"
        description="Are you sure you want to log out of the admin panel?"
        confirmLabel="Log out"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}

function NavGroup({ label, children, isActive, onNavigate }: { label: string; children: NavItem[]; isActive: boolean; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(isActive);
  const location = useLocation();

  useEffect(() => {
    setExpanded(isActive);
  }, [location.pathname, isActive]);

  return (
    <div className={styles.navGroup}>
      <button
        className={`${styles.navGroupToggle} ${isActive ? styles.navGroupActive : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <span>{label}</span>
        <ChevronDown size={14} className={`${styles.navGroupChevron} ${expanded ? styles.navGroupChevronOpen : ''}`} />
      </button>
      {expanded && (
        <div className={styles.navGroupChildren}>
          {children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end={child.end}
              className={({ isActive: active }) => `${styles.navSubItem} ${active ? styles.navSubItemActive : ''}`}
              onClick={onNavigate}
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
