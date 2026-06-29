import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAdminUsers, useBlockUser, useUnblockUser } from '@/hooks/useAdmin';
import { Button, Badge, Spinner, Input } from '@shared/components';
import styles from './Users.module.css';

export default function Users() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAdminUsers({ page, search: search || undefined });
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

        {isLoading ? <Spinner size="lg" /> : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Name</span>
              <span>Email</span>
              <span>Status</span>
              <span>Joined</span>
              <span>Action</span>
            </div>
            {data?.users.map((user) => (
              <div key={user._id} className={styles.tableRow}>
                <span className={styles.name}>{user.name}</span>
                <span className={styles.email}>{user.email}</span>
                <Badge variant={user.isBlocked ? 'error' : 'success'}>{user.isBlocked ? 'Blocked' : 'Active'}</Badge>
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
