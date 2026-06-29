import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@shared/components';
import { useCategories } from '@/hooks/useCategories';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { Product } from '@shared/types/product';
import styles from './Tabs.module.css';

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  brand: z.string().optional(),
  category: z.string().min(1),
  gender: z.enum(['Men', 'Women', 'Unisex']),
  basePrice: z.coerce.number().min(1),
  gstRate: z.coerce.number(),
});

type FormData = z.infer<typeof schema>;

export function GeneralTab({ product }: { product: Product }) {
  const { data: categories } = useCategories();
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);

  const categoryId = typeof product.category === 'object' ? product.category._id : product.category;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product.name,
      description: product.description,
      brand: product.brand || '',
      category: categoryId,
      gender: product.gender,
      basePrice: product.basePrice,
      gstRate: product.gstRate,
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') formData.append(key, String(value));
      });
      await adminService.updateProduct(product._id, formData);
      qc.invalidateQueries({ queryKey: ['product', product._id] });
      qc.invalidateQueries({ queryKey: ['product', product.slug] });
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated');
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.grid}>
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input label="Brand" {...register('brand')} />
      </div>
      <div className={styles.fieldWrap}>
        <label className={styles.label}>Description</label>
        <textarea className={styles.textarea} rows={4} {...register('description')} />
        {errors.description && <p className={styles.error}>{errors.description.message}</p>}
      </div>
      <div className={styles.grid}>
        <div className={styles.fieldWrap}>
          <label className={styles.label}>Category</label>
          <select className={styles.select} {...register('category')}>
            {categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className={styles.fieldWrap}>
          <label className={styles.label}>Gender</label>
          <select className={styles.select} {...register('gender')}>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
      </div>
      <div className={styles.grid}>
        <Input label="Base Price (₹)" type="number" error={errors.basePrice?.message} {...register('basePrice')} />
        <div className={styles.fieldWrap}>
          <label className={styles.label}>GST Rate</label>
          <select className={styles.select} {...register('gstRate')}>
            <option value="0">0%</option>
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18">18%</option>
            <option value="28">28%</option>
          </select>
        </div>
      </div>
      <div className={styles.actions}>
        <Button type="submit" loading={saving}>Save Changes</Button>
      </div>
    </form>
  );
}
