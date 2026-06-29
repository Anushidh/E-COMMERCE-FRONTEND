import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { useAdminUsers, useBlockUser, useUnblockUser } from '@/hooks/useAdmin';
import { useDebounce } from '@/hooks/useDebounce';
import { Button, Badge, TableSkeleton, Input } from '@shared/components';
import styles from './Users.module.css';
import { getUserStatusBadgeVariant } from '@/shared/utils/badge';

export default function Users() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useAdminUsers({ page, search: debouncedSearch || undefined });
  const { mutate: block } = useBlockUser();
  const { mutate: unblock } = useUnblockUser();

  return (
    <>
      <Helmet><title>Users — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Users</h1>
          <div className={styles.search}>
            <Input placeholder="Search by name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
        </div>

        {isLoading ? <TableSkeleton columns={7} gridTemplate="1fr 1fr 130px 80px 80px 100px 100px" /> : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Name</span>
              <span>Email</span>
              <span>Phone</span>
              <span>Verified</span>
              <span>Status</span>
              <span>Joined</span>
              <span>Action</span>
            </div>
            {data?.users.map((user) => (
              <div key={user._id} className={styles.tableRow}>
                <Link to={`/admin/users/${user._id}`} className={styles.name}>{user.name}</Link>
                <span className={styles.email}>{user.email}</span>
                <span className={styles.phone}>{user.phone || '—'}</span>
                <Badge variant={user.isVerified ? 'success' : 'default'}>{user.isVerified ? 'Yes' : 'No'}</Badge>
                <Badge variant={getUserStatusBadgeVariant(user.isBlocked)}>{user.isBlocked ? 'Blocked' : 'Active'}</Badge>
                <span>{new Date(user.createdAt).toLocaleDateString('en-IN')}</span>
                <div>
                  {user.isBlocked
                    ? <Button size="sm" variant="secondary" onClick={() => unblock(user._id)}>Unblock</Button>
                    : <Button size="sm" variant="danger" onClick={() => block(user._id)}>Block</Button>
                  }
                </div>
              </div>
            ))}
          </div>
        )}

        {data && data.pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <span className={styles.pageInfo}>Page {page} of {data.pagination.totalPages}</span>
            <Button variant="secondary" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        )}
      </div>
    </>
  );
}
