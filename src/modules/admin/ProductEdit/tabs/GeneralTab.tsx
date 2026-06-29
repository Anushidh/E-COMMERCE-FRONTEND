import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select } from '@shared/components';
import { useCategories } from '@/hooks/useCategories';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { Product } from '@shared/types/product';
import styles from './Tabs.module.css';
import { useFocusTrap } from '@/hooks/useFocusTrap';

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

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
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

  const { ref: formRef, handleKeyDown } = useFocusTrap<HTMLFormElement>();

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
    <form ref={formRef} onKeyDown={handleKeyDown} onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.grid}>
        <Input label="Name" error={errors.name?.message} autoFocus {...register('name')} />
        <Input label="Brand" {...register('brand')} />
      </div>
      <div className={styles.fieldWrap}>
        <label className={styles.label}>Description</label>
        <textarea className={styles.textarea} rows={4} {...register('description')} />
        {errors.description && <p className={styles.error}>{errors.description.message}</p>}
      </div>
      <div className={styles.grid}>
        <Controller name="category" control={control} render={({ field }) => (
          <Select label="Category" options={categories?.map((c) => ({ label: c.name, value: c._id })) || []} value={field.value} onChange={field.onChange} />
        )} />
        <Controller name="gender" control={control} render={({ field }) => (
          <Select label="Gender" options={[{ label: 'Men', value: 'Men' }, { label: 'Women', value: 'Women' }, { label: 'Unisex', value: 'Unisex' }]} value={field.value} onChange={field.onChange} />
        )} />
      </div>
      <div className={styles.grid}>
        <Input label="Base Price (₹)" type="number" error={errors.basePrice?.message} {...register('basePrice')} />
        <Controller name="gstRate" control={control} render={({ field }) => (
          <Select label="GST Rate" options={[{ label: '0%', value: '0' }, { label: '5%', value: '5' }, { label: '12%', value: '12' }, { label: '18%', value: '18' }, { label: '28%', value: '28' }]} value={String(field.value)} onChange={(v) => field.onChange(Number(v))} />
        )} />
      </div>
      <div className={styles.actions}>
        <Button type="submit" loading={saving}>Save Changes</Button>
      </div>
    </form>
  );
}
