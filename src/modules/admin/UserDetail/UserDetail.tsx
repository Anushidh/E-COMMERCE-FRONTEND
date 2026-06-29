import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { useBlockUser, useUnblockUser } from '@/hooks/useAdmin';
import { Button, Badge, Skeleton, BackButton } from '@shared/components';
import { getUserStatusBadgeVariant, getOrderStatusBadgeVariant } from '@/shared/utils/badge';
import type { ApiResponse } from '@shared/types/api';
import styles from './UserDetail.module.css';

interface UserDetailData {
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    isVerified: boolean;
    isBlocked: boolean;
    referralCode: string;
    createdAt: string;
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string | null;
    walletBalance: number;
  };
  recentOrders: {
    _id: string;
    orderId: string;
    orderStatus: string;
    paymentStatus: string;
    totalAmount: number;
    createdAt: string;
  }[];
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { mutate: block } = useBlockUser();
  const { mutate: unblock } = useUnblockUser();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: () => apiClient.get<ApiResponse<UserDetailData>>(`/admin/users/${id}`),
    select: (res) => res.data.data,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Skeleton width="120px" height="1rem" />
        <div className={styles.header}>
          <Skeleton width="4rem" height="4rem" borderRadius="var(--radius-full)" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Skeleton width="180px" height="1.25rem" />
            <Skeleton width="220px" height="0.875rem" />
          </div>
        </div>
        <div className={styles.statsGrid}>
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} width="100%" height="80px" borderRadius="var(--radius-md)" />)}
        </div>
      </div>
    );
  }

  if (!data) return <div className={styles.loader}>User not found</div>;

  const { user, stats, recentOrders } = data;

  return (
    <>
      <Helmet><title>{user.name} — Admin</title></Helmet>
      <div className={styles.page}>
        <BackButton to="/admin/users" label="Back to Users" />

        {/* User Header */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            {user.avatar ? <img src={user.avatar} alt="" className={styles.avatarImg} /> : <span className={styles.avatarPlaceholder}>{user.name[0]}</span>}
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>{user.name}</h1>
              <Badge variant={getUserStatusBadgeVariant(user.isBlocked)}>{user.isBlocked ? 'Blocked' : 'Active'}</Badge>
              {user.isVerified && <Badge variant="success">Verified</Badge>}
            </div>
            <p className={styles.email}>{user.email}</p>
            {user.phone && <p className={styles.phone}>{user.phone}</p>}
            <p className={styles.meta}>Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · Referral: {user.referralCode}</p>
          </div>
          <div className={styles.headerActions}>
            {user.isBlocked
              ? <Button size="sm" variant="secondary" onClick={() => unblock(user._id)}>Unblock</Button>
              : <Button size="sm" variant="danger" onClick={() => block(user._id)}>Block</Button>
            }
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.totalOrders}</span>
            <span className={styles.statLabel}>Total Orders</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>₹{stats.totalSpent.toLocaleString('en-IN')}</span>
            <span className={styles.statLabel}>Total Spent</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>₹{stats.walletBalance.toLocaleString('en-IN')}</span>
            <span className={styles.statLabel}>Wallet Balance</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.lastOrderDate ? new Date(stats.lastOrderDate).toLocaleDateString('en-IN') : '—'}</span>
            <span className={styles.statLabel}>Last Order</span>
          </div>
        </div>

        {/* Recent Orders */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className={styles.empty}>No orders yet</p>
          ) : (
            <div className={styles.ordersTable}>
              <div className={styles.ordersHeader}>
                <span>Order ID</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              {recentOrders.map((order) => (
                <div key={order._id} className={styles.ordersRow}>
                  <span className={styles.orderIdCell}>{order.orderId}</span>
                  <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  <Badge variant={getOrderStatusBadgeVariant(order.orderStatus)}>{order.orderStatus}</Badge>
                  <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
