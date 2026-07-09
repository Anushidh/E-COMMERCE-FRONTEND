import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle } from 'lucide-react';
import { useLowStock, useAdjustStock } from '@/hooks/useAdmin';
import { Button, Badge, TableSkeleton } from '@shared/components';
import { getStockBadgeVariant } from '@/shared/utils/badge';
import styles from './Inventory.module.css';

export default function Inventory() {
  const { data: variants, isLoading } = useLowStock();
  const { mutate: adjust, isPending } = useAdjustStock();
  const [adjustingId, setAdjustingId] = useState<string | null>(null);

  const handleAdjust = (variantId: string, adjustment: number) => {
    setAdjustingId(variantId);
    adjust({ variantId, adjustment }, {
      onSettled: () => setAdjustingId(null),
    });
  };

  return (
    <>
      <Helmet><title>Inventory — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Low Stock Alerts</h1>
          <Badge variant="warning"><AlertTriangle size={12} /> {variants?.length || 0} items</Badge>
        </div>

        {isLoading ? <TableSkeleton columns={4} gridTemplate="minmax(200px, 1.5fr) 140px 100px 160px" minWidth="650px" /> : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Product</span><span>Variant</span><span>Stock</span><span>Action</span>
            </div>
            {variants?.map((v) => (
              <div key={v._id} className={styles.tableRow}>
                <span className={styles.product}>{v.product.name}</span>
                <span>{v.size} / {v.color}</span>
                <Badge variant={getStockBadgeVariant(v.stock)}>{v.stock}</Badge>
                <div className={styles.actions}>
                  <Button size="sm" variant="secondary" loading={isPending && adjustingId === v._id}
                    disabled={isPending && adjustingId !== v._id}
                    onClick={() => handleAdjust(v._id, 10)}>
                    +10
                  </Button>
                  <Button size="sm" variant="secondary" loading={isPending && adjustingId === v._id}
                    disabled={isPending && adjustingId !== v._id}
                    onClick={() => handleAdjust(v._id, 50)}>
                    +50
                  </Button>
                </div>
              </div>
            ))}
            {variants?.length === 0 && (
              <div className={styles.empty}>All stock levels are healthy</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
