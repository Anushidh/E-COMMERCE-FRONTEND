import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategoryOffers, useCreateCategoryOffer, useDeleteCategoryOffer } from '@/hooks/useAdmin';
import { useCategories } from '@/hooks/useCategories';
import { Badge, TableSkeleton, Button, Input, Modal, ConfirmDialog, DatePicker, Select } from '@shared/components';
import { getOfferStatusBadgeVariant } from '@/shared/utils/badge';
import styles from './Offers.module.css';

const offerSchema = z.object({
  category: z.string().min(1, 'Select category'),
  discountType: z.enum(['percentage', 'flat']),
  discountValue: z.coerce.number().min(1),
  startDate: z.string().min(1, 'Required'),
  endDate: z.string().min(1, 'Required'),
});

type CategoryOfferForm = z.infer<typeof offerSchema>;

export default function CategoryOffers() {
  const [showCreate, setShowCreate] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: categoryOffers, isLoading } = useCategoryOffers();
  const { mutate: createCO, isPending: creating } = useCreateCategoryOffer();
  const { mutate: deleteCO } = useDeleteCategoryOffer();
  const { data: categories } = useCategories();

  const form = useForm<CategoryOfferForm>({ resolver: zodResolver(offerSchema), defaultValues: { discountType: 'percentage' } });

  const formValues = form.watch();
  const isFormDirty = !!(formValues.category || formValues.discountValue || formValues.startDate || formValues.endDate) || formValues.discountType !== 'percentage';

  const onSubmit = (data: CategoryOfferForm) => {
    createCO(data, { onSuccess: () => { form.reset(); setShowCreate(false); } });
  };

  return (
    <>
      <Helmet><title>Category Offers — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.sectionHeader}>
          <h1 className={styles.title}>Category Offers</h1>
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowCreate(true)}>Add</Button>
        </div>

        {isLoading ? <TableSkeleton columns={5} gridTemplate="1fr 100px 180px 80px 40px" /> : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Category</span><span>Discount</span><span>Period</span><span>Status</span><span></span>
            </div>
            {categoryOffers?.map((o) => {
              const name = typeof o.category === 'object' ? o.category.name : o.category;
              const active = o.isActive && new Date(o.endDate) > new Date();
              return (
                <div key={o._id} className={styles.tableRow}>
                  <span className={styles.name}>{name}</span>
                  <span>{o.discountType === 'percentage' ? `${o.discountValue}%` : `₹${o.discountValue}`}</span>
                  <span className={styles.dates}>{new Date(o.startDate).toLocaleDateString('en-IN')} — {new Date(o.endDate).toLocaleDateString('en-IN')}</span>
                  <Badge variant={getOfferStatusBadgeVariant(active)}>{active ? 'Active' : 'Expired'}</Badge>
                  <button className={styles.deleteBtn} onClick={() => setDeleteTarget({ id: o._id, name: typeof name === 'string' ? name : '' })}><Trash2 size={14} /></button>
                </div>
              );
            })}
            {categoryOffers?.length === 0 && <div className={styles.empty}>No category offers</div>}
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => {
        if (isFormDirty) { setConfirmClose(true); } else { setShowCreate(false); form.reset(); }
      }} title="Create Category Offer" size="md">
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <Controller name="category" control={form.control} render={({ field }) => (
            <Select label="Category" placeholder="Select category" options={categories?.map((c) => ({ label: c.name, value: c._id })) || []} value={field.value} onChange={field.onChange} error={form.formState.errors.category?.message} />
          )} />
          <div className={styles.row}>
            <Controller name="discountType" control={form.control} render={({ field }) => (
              <Select label="Type" options={[{ label: 'Percentage', value: 'percentage' }, { label: 'Flat', value: 'flat' }]} value={field.value} onChange={field.onChange} />
            )} />
            <Input label="Value" type="number" error={form.formState.errors.discountValue?.message} {...form.register('discountValue')} />
          </div>
          <div className={styles.row}>
            <Controller name="startDate" control={form.control} render={({ field }) => (
              <DatePicker label="Start Date" value={field.value} onChange={field.onChange} error={form.formState.errors.startDate?.message} />
            )} />
            <Controller name="endDate" control={form.control} render={({ field }) => (
              <DatePicker label="End Date" value={field.value} onChange={field.onChange} error={form.formState.errors.endDate?.message} />
            )} />
          </div>
          <Button type="submit" fullWidth loading={creating}>Create Offer</Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmClose}
        title="Discard changes?"
        description="You have unsaved changes in the offer form. Are you sure you want to close?"
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        variant="warning"
        onConfirm={() => { setConfirmClose(false); form.reset(); setShowCreate(false); }}
        onCancel={() => setConfirmClose(false)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete offer?"
        description={`This will permanently delete the category offer${deleteTarget?.name ? ` for "${deleteTarget.name}"` : ''}. This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => { if (deleteTarget) deleteCO(deleteTarget.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
