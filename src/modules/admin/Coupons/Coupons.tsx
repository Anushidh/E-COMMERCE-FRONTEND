import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminCoupons, useCreateCoupon, useDeleteCoupon } from '@/hooks/useAdmin';
import { Button, Badge, Spinner, Input, Modal } from '@shared/components';
import styles from './Coupons.module.css';

const couponSchema = z.object({
  code: z.string().min(3).max(20),
  discountType: z.enum(['percentage', 'flat']),
  discountValue: z.coerce.number().min(1),
  minOrderValue: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  usageLimitPerUser: z.coerce.number().int().min(1).optional(),
  totalUsageLimit: z.coerce.number().int().min(1),
  expiryDate: z.string().min(1, 'Required'),
});

type CouponForm = z.infer<typeof couponSchema>;

export default function Coupons() {
  const [showCreate, setShowCreate] = useState(false);
  const { data: coupons, isLoading } = useAdminCoupons();
  const { mutate: create, isPending: creating } = useCreateCoupon();
  const { mutate: deleteCoupon } = useDeleteCoupon();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CouponForm>({
    resolver: zodResolver(couponSchema),
  });

  const onSubmit = (data: CouponForm) => {
    create(data, { onSuccess: () => { reset(); setShowCreate(false); } });
  };

  return (
    <>
      <Helmet><title>Coupons — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Coupons</h1>
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowCreate(true)}>Create</Button>
        </div>

        {isLoading ? <Spinner size="lg" /> : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Code</span><span>Type</span><span>Value</span><span>Used</span><span>Expiry</span><span>Status</span><span></span>
            </div>
            {coupons?.map((c) => (
              <div key={c._id} className={styles.tableRow}>
                <span className={styles.code}>{c.code}</span>
                <span>{c.discountType}</span>
                <span>{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</span>
                <span>{c.totalUsed}/{c.totalUsageLimit}</span>
                <span>{new Date(c.expiryDate).toLocaleDateString('en-IN')}</span>
                <Badge variant={c.isActive && new Date(c.expiryDate) > new Date() ? 'success' : 'error'}>
                  {c.isActive && new Date(c.expiryDate) > new Date() ? 'Active' : 'Expired'}
                </Badge>
                <button className={styles.deleteBtn} onClick={() => deleteCoupon(c._id)} aria-label="Delete"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Coupon" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input label="Code" placeholder="SAVE20" error={errors.code?.message} {...register('code')} />
          <div className={styles.row}>
            <div className={styles.selectWrapper}>
              <label className={styles.label}>Type</label>
              <select className={styles.select} {...register('discountType')}>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
            </div>
            <Input label="Value" type="number" error={errors.discountValue?.message} {...register('discountValue')} />
          </div>
          <div className={styles.row}>
            <Input label="Min Order Value" type="number" {...register('minOrderValue')} />
            <Input label="Max Discount" type="number" {...register('maxDiscount')} />
          </div>
          <div className={styles.row}>
            <Input label="Per User Limit" type="number" {...register('usageLimitPerUser')} />
            <Input label="Total Limit" type="number" error={errors.totalUsageLimit?.message} {...register('totalUsageLimit')} />
          </div>
          <Input label="Expiry Date" type="date" error={errors.expiryDate?.message} {...register('expiryDate')} />
          <Button type="submit" fullWidth loading={creating}>Create Coupon</Button>
        </form>
      </Modal>
    </>
  );
}
