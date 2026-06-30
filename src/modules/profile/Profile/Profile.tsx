import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Package, MapPin, Heart, Gift, Wallet, Settings, User, LogOut } from 'lucide-react';
import { useProfile } from '@/hooks/useUser';
import { useLogout } from '@/hooks/useAuth';
import { Button, Skeleton, ConfirmDialog } from '@shared/components';
import styles from './Profile.module.css';

const NAV_CARDS = [
  {
    to: '/orders',
    icon: Package,
    title: 'My Orders',
    desc: 'Track, return, or review your purchases',
  },
  {
    to: '/profile/addresses',
    icon: MapPin,
    title: 'Addresses',
    desc: 'Manage your saved delivery addresses',
  },
  {
    to: '/wallet',
    icon: Wallet,
    title: 'Wallet',
    desc: 'Check balance, transactions & top-up',
  },
  {
    to: '/referrals',
    icon: Gift,
    title: 'Referrals',
    desc: 'Invite friends and earn rewards',
  },
  {
    to: '/wishlist',
    icon: Heart,
    title: 'Wishlist',
    desc: 'Items you saved for later',
  },
  {
    to: '/profile/settings',
    icon: Settings,
    title: 'Account Settings',
    desc: 'Update password, email & preferences',
  },
];

export default function Profile() {
  const { data: profile, isLoading } = useProfile();
  const { mutate: logout } = useLogout();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Skeleton width="4.5rem" height="4.5rem" borderRadius="var(--radius-full)" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Skeleton width="140px" height="1.25rem" />
            <Skeleton width="200px" height="0.875rem" />
          </div>
        </div>
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} width="100%" height="7rem" borderRadius="var(--radius-lg)" />
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
        {/* Profile Header */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            {profile.avatar
              ? <img src={profile.avatar} alt="" className={styles.avatarImg} />
              : <User size={32} />
            }
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.email}>{profile.email}</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className={styles.grid}>
          {NAV_CARDS.map(({ to, icon: Icon, title, desc }, index) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Link to={to} className={styles.card}>
                <div className={styles.cardIcon}>
                  <Icon size={20} />
                </div>
                <span className={styles.cardTitle}>{title}</span>
                <span className={styles.cardDesc}>{desc}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Logout */}
        <motion.div
          className={styles.logoutSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Button
            variant="ghost"
            leftIcon={<LogOut size={16} />}
            onClick={() => setShowLogoutConfirm(true)}
          >
            Log out
          </Button>
        </motion.div>
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
