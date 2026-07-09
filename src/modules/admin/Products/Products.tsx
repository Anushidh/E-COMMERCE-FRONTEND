import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { Plus, Search } from 'lucide-react';
import { useAdminProducts, useDeleteProduct, useRestoreProduct } from '@/hooks/useAdmin';
import { useDebounce } from '@/hooks/useDebounce';
import { adminService } from '@/services/admin.service';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button, Badge, TableSkeleton, Input, ConfirmDialog } from '@shared/components';
import styles from './Products.module.css';
import { getStatusBadgeVariant } from '@/shared/utils/badge';

export default function Products() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const debouncedSearch = useDebounce(search);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<{ id: string; name: string } | null>(null);
  
  const { data, isLoading } = useAdminProducts({ 
    page: String(page), 
    limit: '20', 
    search: debouncedSearch || undefined, 
    status: 'all',
    includeDeleted: showDeleted
  });
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: restoreProduct } = useRestoreProduct();
  const qc = useQueryClient();

  const toggleStatus = async (e: React.MouseEvent, productId: string, currentStatus: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const formData = new FormData();
    formData.append('status', newStatus);
    try {
      await adminService.updateProduct(productId, formData);
      qc.invalidateQueries({ queryKey: ['adminProducts'] });
      toast.success(`Product ${newStatus === 'Active' ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const confirmDelete = (
    e: React.MouseEvent,
    productId: string,
    productName: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTarget({ id: productId, name: productName });
  };

  const confirmRestore = (
    e: React.MouseEvent,
    productId: string,
    productName: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setRestoreTarget({ id: productId, name: productName });
  };

  return (
    <>
      <Helmet><title>Products — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Products</h1>
          <label className={styles.deletedCheckbox}>
            <input type="checkbox" checked={showDeleted} onChange={(e) => { setShowDeleted(e.target.checked); setPage(1); }} />
            Show Deleted
          </label>
          <div className={styles.searchWrapper}>
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              leftIcon={<Search size={14} />}
            />
          </div>
          <Link to="/admin/products/new">
            <Button className={styles.addBtn} size="sm" leftIcon={<Plus size={14} />}>Add Product</Button>
          </Link>
        </div>

        {isLoading ? (
          <TableSkeleton columns={8} gridTemplate="60px 1.5fr 100px 90px 80px 60px 100px 200px" minWidth="900px" />
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span></span>
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Rating</span>
              <span>Sold</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {data?.products.map((p) => (
              <Link to={`/admin/products/${p._id}`} key={p._id} className={styles.tableRow} style={{ opacity: p.isDeleted ? 0.5 : 1 }}>
                <div className={styles.imgCell}>
                  {p.images[0] && <img src={p.images[0]} alt="" className={styles.thumb} />}
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.productName}>{p.name}</span>
                  <span className={styles.productBrand}>{p.brand || '—'}</span>
                </div>
                <span className={styles.category}>{typeof p.category === 'object' ? p.category.name : '—'}</span>
                <span>₹{p.basePrice.toLocaleString('en-IN')}</span>
                <span className={styles.rating}>{p.averageRating > 0 ? `★ ${p.averageRating.toFixed(1)}` : '—'}</span>
                <span>{p.totalSold}</span>
                {p.isDeleted ? (
                  <Badge variant="error">Deleted</Badge>
                ) : (
                  <Badge variant={getStatusBadgeVariant(p.status)}>
                    {p.status}
                  </Badge>
                )}
                <div className={styles.actions}>
                  {p.isDeleted ? (
                    <Button size="sm" variant="primary" onClick={(e) => confirmRestore(e, p._id, p.name)}>Restore</Button>
                  ) : (
                    <>
                      {p.status === 'Active'
                        ? <Button size="sm" variant="secondary" onClick={(e) => toggleStatus(e, p._id, p.status)}>Deactivate</Button>
                        : <Button size="sm" variant="secondary" onClick={(e) => toggleStatus(e, p._id, p.status)}>Activate</Button>
                      }
                      <Button size="sm" variant="danger" onClick={(e) => confirmDelete(e, p._id, p.name)}>Delete</Button>
                    </>
                  )}
                </div>
              </Link>
            ))}
            {data?.products.length === 0 && (
              <div className={styles.empty}>No products found</div>
            )}
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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product?"
        description={`This will delete "${deleteTarget?.name}".`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => { if (deleteTarget) deleteProduct(deleteTarget.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
      
      <ConfirmDialog
        open={!!restoreTarget}
        title="Restore product?"
        description={`This will restore "${restoreTarget?.name}" and make its active variants available on the shop again.`}
        confirmLabel="Restore"
        cancelLabel="Cancel"
        variant="primary"
        onConfirm={() => { if (restoreTarget) restoreProduct(restoreTarget.id); setRestoreTarget(null); }}
        onCancel={() => setRestoreTarget(null)}
      />
    </>
  );
}
