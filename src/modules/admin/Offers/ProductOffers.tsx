import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProductOffers, useCreateProductOffer, useDeleteProductOffer, useUpdateProductOffer } from '@/hooks/useAdmin';
import { useProducts } from '@/hooks/useProducts';
import { Badge, TableSkeleton, Button, Input, Modal, ConfirmDialog, DatePicker, Select } from '@shared/components';
import { getOfferStatusBadgeVariant } from '@/shared/utils/badge';
import styles from './Offers.module.css';

const offerSchema = z.object({
  product: z.string().min(1, 'Select product'),
  discountType: z.enum(['percentage', 'flat']),
  discountValue: z.coerce.number().min(1),
  startDate: z.string().min(1, 'Required'),
  endDate: z.string().min(1, 'Required'),
});

type ProductOfferForm = z.infer<typeof offerSchema>;

export default function ProductOffers() {
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: productOffers, isLoading } = useProductOffers();
  const { mutate: createPO, isPending: creating } = useCreateProductOffer();
  const { mutate: updatePO, isPending: updating } = useUpdateProductOffer();
  const { mutate: deletePO } = useDeleteProductOffer();
  const { data: productsData } = useProducts({ limit: '100' });

  const defaultFormValues = { product: '', discountType: 'percentage' as const, discountValue: '' as any, startDate: '', endDate: '' };
  const form = useForm<ProductOfferForm>({ resolver: zodResolver(offerSchema), defaultValues: defaultFormValues });

  const formValues = form.watch();
  const isFormDirty = !!(formValues.product || formValues.discountValue || formValues.startDate || formValues.endDate) || formValues.discountType !== 'percentage';

  const handleEdit = (offer: any) => {
    form.reset({
      product: offer.product._id || offer.product,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      startDate: new Date(offer.startDate).toISOString().split('T')[0],
      endDate: new Date(offer.endDate).toISOString().split('T')[0],
    });
    setEditTarget(offer._id);
    setShowCreate(true);
  };

  const onSubmit = (data: ProductOfferForm) => {
    if (editTarget) {
      updatePO({ id: editTarget, data }, { onSuccess: () => { form.reset(defaultFormValues); setShowCreate(false); setEditTarget(null); } });
    } else {
      createPO(data, { onSuccess: () => { form.reset(defaultFormValues); setShowCreate(false); setEditTarget(null); } });
    }
  };

  return (
    <>
      <Helmet><title>Product Offers — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.sectionHeader}>
          <h1 className={styles.title}>Product Offers</h1>
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => { setEditTarget(null); form.reset(defaultFormValues); setShowCreate(true); }}>Add</Button>
        </div>

        {isLoading ? <TableSkeleton columns={5} gridTemplate="minmax(180px, 1fr) 100px 180px 100px 120px" minWidth="800px" /> : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Product</span><span>Discount</span><span>Period</span><span>Status</span><span>Actions</span>
            </div>
            {productOffers?.map((o) => {
              const name = typeof o.product === 'object' ? o.product.name : o.product;
              const active = o.isActive && new Date(o.endDate) > new Date();
              return (
                <div key={o._id} className={styles.tableRow}>
                  <div className={styles.name} title={name}>{name}</div>
                  <span>{o.discountType === 'percentage' ? `${o.discountValue}%` : `₹${o.discountValue}`}</span>
                  <span className={styles.dates}>{new Date(o.startDate).toLocaleDateString('en-IN')} — {new Date(o.endDate).toLocaleDateString('en-IN')}</span>
                  <Badge variant={getOfferStatusBadgeVariant(active)}>{active ? 'Active' : 'Expired'}</Badge>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button className={styles.editBtn} onClick={() => handleEdit(o)}><Edit2 size={14} /></button>
                    <button className={styles.deleteBtn} onClick={() => setDeleteTarget({ id: o._id, name: typeof name === 'string' ? name : '' })}><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
            {productOffers?.length === 0 && <div className={styles.empty}>No product offers</div>}
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => {
        if (isFormDirty) { setConfirmClose(true); } else { setShowCreate(false); form.reset(defaultFormValues); setEditTarget(null); }
      }} title={editTarget ? "Edit Product Offer" : "Create Product Offer"} size="md">
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <Controller name="product" control={form.control} render={({ field }) => (
            <Select label="Product" placeholder="Select product" options={productsData?.products.map((p) => ({ label: p.name, value: p._id })) || []} value={field.value} onChange={field.onChange} error={form.formState.errors.product?.message} />
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
          <Button type="submit" fullWidth loading={creating || updating}>{editTarget ? "Update Offer" : "Create Offer"}</Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmClose}
        title="Discard changes?"
        description="You have unsaved changes in the offer form. Are you sure you want to close?"
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        variant="warning"
        onConfirm={() => { setConfirmClose(false); form.reset(defaultFormValues); setShowCreate(false); setEditTarget(null); }}
        onCancel={() => setConfirmClose(false)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete offer?"
        description={`This will permanently delete the product offer${deleteTarget?.name ? ` for "${deleteTarget.name}"` : ''}. This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => { if (deleteTarget) deletePO(deleteTarget.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
