import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminCoupons, useCreateCoupon, useDeleteCoupon, useUpdateCoupon } from '@/hooks/useAdmin';
import { Button, Badge, TableSkeleton, Input, Modal, ConfirmDialog, DatePicker, Select } from '@shared/components';
import { getOfferStatusBadgeVariant } from '@/shared/utils/badge';
import styles from './Coupons.module.css';

const couponSchema = z.object({
  code: z.string().min(3).max(20),
  discountType: z.enum(['percentage', 'flat']),
  discountValue: z.coerce.number().min(1),
  minOrderValue: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  usageLimitPerUser: z.coerce.number().int().min(1).optional(),
  totalUsageLimit: z.coerce.number().int().min(1),
  expiryDate: z.string().min(1, 'Required').refine((val) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(val) >= today;
  }, { message: 'Expiry date cannot be in the past' }),
});

type CouponForm = z.infer<typeof couponSchema>;

export default function Coupons() {
  const [showCreate, setShowCreate] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; code: string } | null>(null);
  const { data, isLoading } = useAdminCoupons();
  const { mutate: create, isPending: creating } = useCreateCoupon();
  const { mutate: update, isPending: updating } = useUpdateCoupon();
  const { mutate: deleteCoupon } = useDeleteCoupon();

  const { register, handleSubmit, reset, control, formState: { errors, isDirty } } = useForm<CouponForm>({
    resolver: zodResolver(couponSchema),
  });

  const onSubmit = (data: CouponForm) => {
    if (editTargetId) {
      update({ id: editTargetId, data }, { onSuccess: () => { reset(); setShowCreate(false); setEditTargetId(null); } });
    } else {
      create(data, { onSuccess: () => { reset(); setShowCreate(false); } });
    }
  };

  return (
    <>
      <Helmet><title>Coupons — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Coupons</h1>
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowCreate(true)}>Create</Button>
        </div>

        {isLoading ? <TableSkeleton columns={7} gridTemplate="1fr 100px 100px 100px 120px 90px 160px" /> : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Code</span><span>Type</span><span>Value</span><span>Used</span><span>Expiry</span><span>Status</span><span>Actions</span>
            </div>
            {data?.coupons?.map((c) => (
              <div key={c._id} className={styles.tableRow}>
                <span className={styles.code}>{c.code}</span>
                <span>{c.discountType}</span>
                <span>{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</span>
                <span>{c.totalUsed}/{c.totalUsageLimit}</span>
                <span>{new Date(c.expiryDate).toLocaleDateString('en-IN')}</span>
                <Badge variant={getOfferStatusBadgeVariant(c.isActive && new Date(c.expiryDate) > new Date())}>
                  {c.isActive && new Date(c.expiryDate) > new Date() ? 'Active' : 'Expired'}
                </Badge>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {c.isActive ? (
                    <Button size="sm" variant="secondary" onClick={() => update({ id: c._id, data: { isActive: false } })}>Pause</Button>
                  ) : (
                    <Button size="sm" variant="primary" onClick={() => update({ id: c._id, data: { isActive: true } })}>Activate</Button>
                  )}
                  <button className={styles.deleteBtn} onClick={() => {
                    setEditTargetId(c._id);
                    reset({
                      code: c.code,
                      discountType: c.discountType as any,
                      discountValue: c.discountValue,
                      minOrderValue: c.minOrderValue,
                      maxDiscount: c.maxDiscount,
                      usageLimitPerUser: c.usageLimitPerUser,
                      totalUsageLimit: c.totalUsageLimit,
                      expiryDate: new Date(c.expiryDate).toISOString().split('T')[0],
                    });
                    setShowCreate(true);
                  }} aria-label="Edit"><Edit size={14} /></button>
                  <button className={styles.deleteBtn} onClick={() => setDeleteTarget({ id: c._id, code: c.code })} aria-label="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => {
        if (isDirty) { setConfirmClose(true); } else { setShowCreate(false); setEditTargetId(null); reset(); }
      }} title={editTargetId ? "Edit Coupon" : "Create Coupon"} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input label="Code" placeholder="SAVE20" error={errors.code?.message} {...register('code')} />
          <div className={styles.row}>
            <Controller name="discountType" control={control} render={({ field }) => (
              <Select label="Type" options={[{ label: 'Percentage', value: 'percentage' }, { label: 'Flat', value: 'flat' }]} value={field.value} onChange={field.onChange} />
            )} />
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
          <Controller name="expiryDate" control={control} render={({ field }) => (
            <DatePicker label="Expiry Date" value={field.value} onChange={field.onChange} error={errors.expiryDate?.message} />
          )} />
          <Button type="submit" fullWidth loading={creating || updating}>{editTargetId ? 'Update Coupon' : 'Create Coupon'}</Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmClose}
        title="Discard changes?"
        description="You have unsaved changes in the coupon form. Are you sure you want to close?"
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        variant="warning"
        onConfirm={() => { setConfirmClose(false); reset(); setEditTargetId(null); setShowCreate(false); }}
        onCancel={() => setConfirmClose(false)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete coupon?"
        description={`This will permanently delete coupon "${deleteTarget?.code}". This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => { if (deleteTarget) deleteCoupon(deleteTarget.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
