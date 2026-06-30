import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { User, MapPin, Lock, Gift, Wallet, Settings } from 'lucide-react';
import { useProfile } from '@/hooks/useUser';
import { useLogout } from '@/hooks/useAuth';
import { Button, Skeleton, ConfirmDialog } from '@shared/components';
import styles from './Profile.module.css';

export default function Profile() {
  const { data: profile, isLoading } = useProfile();
  const { mutate: logout } = useLogout();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Skeleton width="4rem" height="4rem" borderRadius="var(--radius-full)" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Skeleton width="140px" height="1.25rem" />
            <Skeleton width="200px" height="0.875rem" />
          </div>
        </div>
        <div className={styles.nav}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} width="100%" height="3.5rem" borderRadius="var(--radius-md)" />
          ))}
        </div>
      </div>
    );
  }
  if (!profile) return null;

  return (
    <>
      <Helmet><title>Profile — STORE</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            {profile.avatar ? <img src={profile.avatar} alt="" className={styles.avatarImg} /> : <User size={32} />}
          </div>
          <div>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.email}>{profile.email}</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link to="/orders" className={styles.navItem}><User size={16} /> My Orders</Link>
          <Link to="/profile/addresses" className={styles.navItem}><MapPin size={16} /> Addresses</Link>
          <Link to="/wallet" className={styles.navItem}><Wallet size={16} /> Wallet</Link>
          <Link to="/referrals" className={styles.navItem}><Gift size={16} /> Referrals</Link>
          <Link to="/wishlist" className={styles.navItem}><Lock size={16} /> Wishlist</Link>
          <Link to="/profile/settings" className={styles.navItem}><Settings size={16} /> Account Settings</Link>
        </nav>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={() => setShowLogoutConfirm(true)}>Logout</Button>
        </div>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Log out?"
        description="Are you sure you want to log out of your account?"
        confirmLabel="Log out"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
