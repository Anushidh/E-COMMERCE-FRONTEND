import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Minus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button, Input, Badge } from '@shared/components';
import { adminService } from '@/services/admin.service';
import type { Variant } from '@shared/types/product';
import styles from './Tabs.module.css';

const variantSchema = z.object({
  size: z.string().min(1, 'Size required'),
  color: z.string().min(1, 'Color required'),
  stock: z.coerce.number().int().min(0),
  price: z.coerce.number().min(0).optional(),
  sku: z.string().optional(),
});

type VariantForm = z.infer<typeof variantSchema>;

interface VariantsTabProps {
  productId: string;
  variants: Variant[];
}

export function VariantsTab({ productId, variants }: VariantsTabProps) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [adjusting, setAdjusting] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VariantForm>({
    resolver: zodResolver(variantSchema),
  });

  const onAdd = async (data: VariantForm) => {
    try {
      await adminService.addVariant(productId, data);
      qc.invalidateQueries({ queryKey: ['product'] });
      toast.success('Variant added');
      reset();
      setShowForm(false);
    } catch {
      toast.error('Failed to add variant');
    }
  };

  const onDelete = async (variantId: string) => {
    setDeleting(variantId);
    try {
      await adminService.deleteVariant(variantId);
      qc.invalidateQueries({ queryKey: ['product'] });
      toast.success('Variant deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const onAdjust = async (variantId: string, amount: number) => {
    setAdjusting(variantId);
    try {
      await adminService.adjustStock(variantId, amount);
      qc.invalidateQueries({ queryKey: ['product'] });
      toast.success(`Stock ${amount > 0 ? 'increased' : 'decreased'}`);
    } catch {
      toast.error('Failed to adjust stock');
    } finally {
      setAdjusting(null);
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.variantHeader}>
        <span className={styles.variantCount}>{variants.length} variant{variants.length !== 1 ? 's' : ''}</span>
        <Button size="sm" variant="secondary" leftIcon={<Plus size={14} />} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Variant'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onAdd)} className={styles.variantForm}>
          <div className={styles.variantFormGrid}>
            <Input label="Size" placeholder="M" error={errors.size?.message} {...register('size')} />
            <Input label="Color" placeholder="Black" error={errors.color?.message} {...register('color')} />
            <Input label="Stock" type="number" placeholder="0" error={errors.stock?.message} {...register('stock')} />
            <Input label="Price (optional)" type="number" placeholder="Override" {...register('price')} />
            <Input label="SKU (optional)" placeholder="SKU-001" {...register('sku')} />
          </div>
          <Button type="submit" size="sm">Add</Button>
        </form>
      )}

      {variants.length === 0 ? (
        <p className={styles.empty}>No variants yet. Add size/color combinations above.</p>
      ) : (
        <div className={styles.variantTable}>
          <div className={styles.variantTableHeader}>
            <span>Size</span><span>Color</span><span>Stock</span><span>Price</span><span>Actions</span>
          </div>
          {variants.map((v) => (
            <div key={v._id} className={styles.variantRow}>
              <span className={styles.variantCell}>{v.size}</span>
              <span className={styles.variantCell}>{v.color}</span>
              <Badge variant={v.stock === 0 ? 'error' : v.stock <= 5 ? 'warning' : 'success'}>{v.stock}</Badge>
              <span className={styles.variantCell}>{v.price ? `₹${v.price}` : '—'}</span>
              <div className={styles.variantActions}>
                <button
                  className={styles.stockBtn}
                  onClick={() => onAdjust(v._id, -1)}
                  disabled={v.stock === 0 || adjusting === v._id}
                  aria-label="Decrease stock"
                >
                  <Minus size={12} />
                </button>
                <button
                  className={styles.stockBtn}
                  onClick={() => onAdjust(v._id, 1)}
                  disabled={adjusting === v._id}
                  aria-label="Increase stock"
                >
                  <Plus size={12} />
                </button>
                <button
                  className={styles.deleteVariantBtn}
                  onClick={() => onDelete(v._id)}
                  disabled={deleting === v._id}
                  aria-label="Delete variant"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
