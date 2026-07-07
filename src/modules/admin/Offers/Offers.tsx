import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProductOffers, useCategoryOffers, useCreateProductOffer, useCreateCategoryOffer, useDeleteProductOffer, useDeleteCategoryOffer, useUpdateProductOffer, useUpdateCategoryOffer } from '@/hooks/useAdmin';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Badge, TableSkeleton, Button, Input, Modal, ConfirmDialog, DatePicker, Select } from '@shared/components';
import { getOfferStatusBadgeVariant } from '@/shared/utils/badge';
import styles from './Offers.module.css';

const baseOfferSchema = z.object({
  discountType: z.enum(['percentage', 'flat']),
  discountValue: z.coerce.number().min(1),
  startDate: z.string().min(1, 'Required').refine((val) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(val) >= today;
  }, { message: 'Start date cannot be in the past' }),
  endDate: z.string().min(1, 'Required'),
});

const productOfferSchema = baseOfferSchema.extend({ product: z.string().min(1, 'Select product') }).refine((data) => {
  return new Date(data.endDate) >= new Date(data.startDate);
}, { message: 'End date must be after start date', path: ['endDate'] });

const categoryOfferSchema = baseOfferSchema.extend({ category: z.string().min(1, 'Select category') }).refine((data) => {
  return new Date(data.endDate) >= new Date(data.startDate);
}, { message: 'End date must be after start date', path: ['endDate'] });

type ProductOfferForm = z.infer<typeof productOfferSchema>;
type CategoryOfferForm = z.infer<typeof categoryOfferSchema>;

export default function Offers() {
  const [showPO, setShowPO] = useState(false);
  const [showCO, setShowCO] = useState(false);
  const [editPO, setEditPO] = useState<string | null>(null);
  const [editCO, setEditCO] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState<'po' | 'co' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'po' | 'co'; name: string } | null>(null);

  const { data: productOffers, isLoading: loadingPO } = useProductOffers();
  const { data: categoryOffers, isLoading: loadingCO } = useCategoryOffers();
  const { mutate: createPO, isPending: creatingPO } = useCreateProductOffer();
  const { mutate: createCO, isPending: creatingCO } = useCreateCategoryOffer();
  const { mutate: updatePO, isPending: updatingPO } = useUpdateProductOffer();
  const { mutate: updateCO, isPending: updatingCO } = useUpdateCategoryOffer();
  const { mutate: deletePO } = useDeleteProductOffer();
  const { mutate: deleteCO } = useDeleteCategoryOffer();
  const { data: productsData } = useProducts({ limit: '100' });
  const { data: categories } = useCategories();

  const poForm = useForm<ProductOfferForm>({ resolver: zodResolver(productOfferSchema), defaultValues: { discountType: 'percentage' } });
  const coForm = useForm<CategoryOfferForm>({ resolver: zodResolver(categoryOfferSchema), defaultValues: { discountType: 'percentage' } });

  // Check if any field has a value for create forms
  const poValues = poForm.watch();
  const isPODirty = !!(poValues.product || poValues.discountValue || poValues.startDate || poValues.endDate) || poValues.discountType !== 'percentage';
  const coValues = coForm.watch();
  const isCODirty = !!(coValues.category || coValues.discountValue || coValues.startDate || coValues.endDate) || coValues.discountType !== 'percentage';

  const onSubmitPO = (data: ProductOfferForm) => {
    if (editPO) {
      updatePO({ id: editPO, data }, { onSuccess: () => { poForm.reset(); setShowPO(false); setEditPO(null); } });
    } else {
      createPO(data, { onSuccess: () => { poForm.reset(); setShowPO(false); } });
    }
  };

  const onSubmitCO = (data: CategoryOfferForm) => {
    if (editCO) {
      updateCO({ id: editCO, data }, { onSuccess: () => { coForm.reset(); setShowCO(false); setEditCO(null); } });
    } else {
      createCO(data, { onSuccess: () => { coForm.reset(); setShowCO(false); } });
    }
  };

  const handleEditPO = (offer: any) => {
    poForm.reset({
      product: offer.product._id || offer.product,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      startDate: new Date(offer.startDate).toISOString().split('T')[0],
      endDate: new Date(offer.endDate).toISOString().split('T')[0],
    });
    setEditPO(offer._id);
    setShowPO(true);
  };

  const handleEditCO = (offer: any) => {
    coForm.reset({
      category: offer.category._id || offer.category,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      startDate: new Date(offer.startDate).toISOString().split('T')[0],
      endDate: new Date(offer.endDate).toISOString().split('T')[0],
    });
    setEditCO(offer._id);
    setShowCO(true);
  };

  const isLoading = loadingPO || loadingCO;

  return (
    <>
      <Helmet><title>Offers — Admin</title></Helmet>
      <div className={styles.page}>
        <h1 className={styles.title}>Offers</h1>

        {isLoading ? <TableSkeleton columns={5} gridTemplate="1fr 100px 180px 80px 40px" /> : (
          <>
            {/* Product Offers */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Product Offers</h2>
                <Button size="sm" variant="secondary" leftIcon={<Plus size={14} />} onClick={() => { setEditPO(null); poForm.reset(); setShowPO(true); }}>Add</Button>
              </div>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <span>Product</span><span>Discount</span><span>Period</span><span>Status</span><span style={{ textAlign: 'right' }}>Actions</span>
                </div>
                {productOffers?.map((o) => {
                  const name = typeof o.product === 'object' ? o.product.name : o.product;
                  const active = o.isActive && new Date(o.endDate) > new Date();
                  return (
                    <div key={o._id} className={styles.tableRow}>
                      <span className={styles.name}>{name}</span>
                      <span>{o.discountType === 'percentage' ? `${o.discountValue}%` : `₹${o.discountValue}`}</span>
                      <span className={styles.dates}>{new Date(o.startDate).toLocaleDateString('en-IN')} — {new Date(o.endDate).toLocaleDateString('en-IN')}</span>
                      <Badge variant={getOfferStatusBadgeVariant(active)}>{active ? 'Active' : 'Expired'}</Badge>
                      <div className={styles.actions} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className={styles.editBtn} onClick={() => handleEditPO(o)}><Edit2 size={14} /></button>
                        <button className={styles.deleteBtn} onClick={() => setDeleteTarget({ id: o._id, type: 'po', name: typeof name === 'string' ? name : '' })}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  );
                })}
                {productOffers?.length === 0 && <div className={styles.empty}>No product offers</div>}
              </div>
            </section>

            {/* Category Offers */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Category Offers</h2>
                <Button size="sm" variant="secondary" leftIcon={<Plus size={14} />} onClick={() => { setEditCO(null); coForm.reset(); setShowCO(true); }}>Add</Button>
              </div>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <span>Category</span><span>Discount</span><span>Period</span><span>Status</span><span style={{ textAlign: 'right' }}>Actions</span>
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
                      <div className={styles.actions} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className={styles.editBtn} onClick={() => handleEditCO(o)}><Edit2 size={14} /></button>
                        <button className={styles.deleteBtn} onClick={() => setDeleteTarget({ id: o._id, type: 'co', name: typeof name === 'string' ? name : '' })}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  );
                })}
                {categoryOffers?.length === 0 && <div className={styles.empty}>No category offers</div>}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Create/Edit Product Offer Modal */}
      <Modal open={showPO} onClose={() => {
        if (isPODirty) { setConfirmClose('po'); } else { setShowPO(false); poForm.reset(); setEditPO(null); }
      }} title={editPO ? "Edit Product Offer" : "Create Product Offer"} size="md">
        <form onSubmit={poForm.handleSubmit(onSubmitPO)} className={styles.form}>
          <Controller name="product" control={poForm.control} render={({ field }) => (
            <Select label="Product" placeholder="Select product" options={productsData?.products.map((p) => ({ label: p.name, value: p._id })) || []} value={field.value} onChange={field.onChange} error={poForm.formState.errors.product?.message} />
          )} />
          <div className={styles.row}>
            <Controller name="discountType" control={poForm.control} render={({ field }) => (
              <Select label="Type" options={[{ label: 'Percentage', value: 'percentage' }, { label: 'Flat', value: 'flat' }]} value={field.value} onChange={field.onChange} />
            )} />
            <Input label="Value" type="number" error={poForm.formState.errors.discountValue?.message} {...poForm.register('discountValue')} />
          </div>
          <div className={styles.row}>
            <Controller name="startDate" control={poForm.control} render={({ field }) => (
              <DatePicker label="Start Date" value={field.value} onChange={field.onChange} error={poForm.formState.errors.startDate?.message} />
            )} />
            <Controller name="endDate" control={poForm.control} render={({ field }) => (
              <DatePicker label="End Date" value={field.value} onChange={field.onChange} error={poForm.formState.errors.endDate?.message} />
            )} />
          </div>
          <Button type="submit" fullWidth loading={creatingPO || updatingPO}>{editPO ? "Update Offer" : "Create Offer"}</Button>
        </form>
      </Modal>

      {/* Create/Edit Category Offer Modal */}
      <Modal open={showCO} onClose={() => {
        if (isCODirty) { setConfirmClose('co'); } else { setShowCO(false); coForm.reset(); setEditCO(null); }
      }} title={editCO ? "Edit Category Offer" : "Create Category Offer"} size="md">
        <form onSubmit={coForm.handleSubmit(onSubmitCO)} className={styles.form}>
          <Controller name="category" control={coForm.control} render={({ field }) => (
            <Select label="Category" placeholder="Select category" options={categories?.map((c) => ({ label: c.name, value: c._id })) || []} value={field.value} onChange={field.onChange} error={coForm.formState.errors.category?.message} />
          )} />
          <div className={styles.row}>
            <Controller name="discountType" control={coForm.control} render={({ field }) => (
              <Select label="Type" options={[{ label: 'Percentage', value: 'percentage' }, { label: 'Flat', value: 'flat' }]} value={field.value} onChange={field.onChange} />
            )} />
            <Input label="Value" type="number" error={coForm.formState.errors.discountValue?.message} {...coForm.register('discountValue')} />
          </div>
          <div className={styles.row}>
            <Controller name="startDate" control={coForm.control} render={({ field }) => (
              <DatePicker label="Start Date" value={field.value} onChange={field.onChange} error={coForm.formState.errors.startDate?.message} />
            )} />
            <Controller name="endDate" control={coForm.control} render={({ field }) => (
              <DatePicker label="End Date" value={field.value} onChange={field.onChange} error={coForm.formState.errors.endDate?.message} />
            )} />
          </div>
          <Button type="submit" fullWidth loading={creatingCO || updatingCO}>{editCO ? "Update Offer" : "Create Offer"}</Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmClose === 'po'}
        title="Discard changes?"
        description="You have unsaved changes in the offer form. Are you sure you want to close?"
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        variant="warning"
        onConfirm={() => { setConfirmClose(null); poForm.reset(); setShowPO(false); }}
        onCancel={() => setConfirmClose(null)}
      />
      <ConfirmDialog
        open={confirmClose === 'co'}
        title="Discard changes?"
        description="You have unsaved changes in the offer form. Are you sure you want to close?"
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        variant="warning"
        onConfirm={() => { setConfirmClose(null); coForm.reset(); setShowCO(false); }}
        onCancel={() => setConfirmClose(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete offer?"
        description={`This will permanently delete the ${deleteTarget?.type === 'po' ? 'product' : 'category'} offer${deleteTarget?.name ? ` for "${deleteTarget.name}"` : ''}. This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => { if (deleteTarget) { deleteTarget.type === 'po' ? deletePO(deleteTarget.id) : deleteCO(deleteTarget.id); } setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
