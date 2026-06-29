import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { Plus, Trash2, Search, Power } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useDeleteProduct } from '@/hooks/useAdmin';
import { adminService } from '@/services/admin.service';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button, Badge, Spinner, Input } from '@shared/components';
import styles from './Products.module.css';
import { getStatusBadgeVariant } from '@/shared/utils/badge';

export default function Products() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useProducts({ page: String(page), limit: '20', search: search || undefined });
  const { mutate: deleteProduct } = useDeleteProduct();
  const qc = useQueryClient();

  const toggleStatus = async (e: React.MouseEvent, productId: string, currentStatus: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const formData = new FormData();
    formData.append('status', newStatus);
    try {
      await adminService.updateProduct(productId, formData);
      qc.invalidateQueries({ queryKey: ['products'] });
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

  toast("Delete product?", {
    description: `This will permanently delete "${productName}".`,
    action: {
      label: "Delete",
      onClick: () => deleteProduct(productId),
    },
    cancel: {
      label: "Cancel",
      onClick: () => {},
    },
    duration: 10000,
  });
};

  return (
    <>
      <Helmet><title>Products — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Products</h1>
          <div className={styles.headerActions}>
            <div className={styles.searchWrapper}>
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                leftIcon={<Search size={14} />}
              />
            </div>
            <Link to="/admin/products/new">
              <Button size="sm" leftIcon={<Plus size={14} />}>Add Product</Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loader}><Spinner size="lg" /></div>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span></span>
              <span>Product</span>
              <span>Price</span>
              <span>GST</span>
              <span>Status</span>
              <span>Sold</span>
              <span></span>
            </div>
            {data?.products.map((p) => (
              <Link to={`/admin/products/${p._id}`} key={p._id} className={styles.tableRow}>
                <div className={styles.imgCell}>
                  {p.images[0] && <img src={p.images[0]} alt="" className={styles.thumb} />}
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.productName}>{p.name}</span>
                  <span className={styles.productBrand}>{p.brand || '—'}</span>
                </div>
                <span>₹{p.basePrice.toLocaleString('en-IN')}</span>
                <span className={styles.gst}>{p.gstRate}%</span>
                <Badge variant={getStatusBadgeVariant(p.status)}>
                  {p.status}
                </Badge>
                <span>{p.totalSold}</span>
                <button
                  className={styles.toggleBtn}
                  onClick={(e) => toggleStatus(e, p._id, p.status)}
                  aria-label={p.status === 'Active' ? 'Deactivate' : 'Activate'}
                  title={p.status === 'Active' ? 'Deactivate' : 'Activate'}
                >
                  <Power size={14} />
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={(e) => confirmDelete(e, p._id, p.name)}
                  aria-label="Delete product"
                >
                  <Trash2 size={14} />
                </button>
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
    </>
  );
}
