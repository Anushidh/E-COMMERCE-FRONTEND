import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProductOffers, useCategoryOffers, useCreateProductOffer, useCreateCategoryOffer, useDeleteProductOffer, useDeleteCategoryOffer } from '@/hooks/useAdmin';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Badge, Spinner, Button, Input, Modal } from '@shared/components';
import styles from './Offers.module.css';

const offerSchema = z.object({
  discountType: z.enum(['percentage', 'flat']),
  discountValue: z.coerce.number().min(1),
  startDate: z.string().min(1, 'Required'),
  endDate: z.string().min(1, 'Required'),
});

const productOfferSchema = offerSchema.extend({ product: z.string().min(1, 'Select product') });
const categoryOfferSchema = offerSchema.extend({ category: z.string().min(1, 'Select category') });

type ProductOfferForm = z.infer<typeof productOfferSchema>;
type CategoryOfferForm = z.infer<typeof categoryOfferSchema>;

export default function Offers() {
  const [showPO, setShowPO] = useState(false);
  const [showCO, setShowCO] = useState(false);

  const { data: productOffers, isLoading: loadingPO } = useProductOffers();
  const { data: categoryOffers, isLoading: loadingCO } = useCategoryOffers();
  const { mutate: createPO, isPending: creatingPO } = useCreateProductOffer();
  const { mutate: createCO, isPending: creatingCO } = useCreateCategoryOffer();
  const { mutate: deletePO } = useDeleteProductOffer();
  const { mutate: deleteCO } = useDeleteCategoryOffer();
  const { data: productsData } = useProducts({ limit: '100' });
  const { data: categories } = useCategories();

  const poForm = useForm<ProductOfferForm>({ resolver: zodResolver(productOfferSchema), defaultValues: { discountType: 'percentage' } });
  const coForm = useForm<CategoryOfferForm>({ resolver: zodResolver(categoryOfferSchema), defaultValues: { discountType: 'percentage' } });

  const onCreatePO = (data: ProductOfferForm) => {
    createPO(data, { onSuccess: () => { poForm.reset(); setShowPO(false); } });
  };

  const onCreateCO = (data: CategoryOfferForm) => {
    createCO(data, { onSuccess: () => { coForm.reset(); setShowCO(false); } });
  };

  const isLoading = loadingPO || loadingCO;

  return (
    <>
      <Helmet><title>Offers — Admin</title></Helmet>
      <div className={styles.page}>
        <h1 className={styles.title}>Offers</h1>

        {isLoading ? <Spinner size="lg" /> : (
          <>
            {/* Product Offers */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Product Offers</h2>
                <Button size="sm" variant="secondary" leftIcon={<Plus size={14} />} onClick={() => setShowPO(true)}>Add</Button>
              </div>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <span>Product</span><span>Discount</span><span>Period</span><span>Status</span><span></span>
                </div>
                {productOffers?.map((o) => {
                  const name = typeof o.product === 'object' ? o.product.name : o.product;
                  const active = o.isActive && new Date(o.endDate) > new Date();
                  return (
                    <div key={o._id} className={styles.tableRow}>
                      <span className={styles.name}>{name}</span>
                      <span>{o.discountType === 'percentage' ? `${o.discountValue}%` : `₹${o.discountValue}`}</span>
                      <span className={styles.dates}>{new Date(o.startDate).toLocaleDateString('en-IN')} — {new Date(o.endDate).toLocaleDateString('en-IN')}</span>
                      <Badge variant={active ? 'success' : 'error'}>{active ? 'Active' : 'Expired'}</Badge>
                      <button className={styles.deleteBtn} onClick={() => deletePO(o._id)}><Trash2 size={14} /></button>
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
                <Button size="sm" variant="secondary" leftIcon={<Plus size={14} />} onClick={() => setShowCO(true)}>Add</Button>
              </div>
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
                      <Badge variant={active ? 'success' : 'error'}>{active ? 'Active' : 'Expired'}</Badge>
                      <button className={styles.deleteBtn} onClick={() => deleteCO(o._id)}><Trash2 size={14} /></button>
                    </div>
                  );
                })}
                {categoryOffers?.length === 0 && <div className={styles.empty}>No category offers</div>}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Create Product Offer Modal */}
      <Modal open={showPO} onClose={() => setShowPO(false)} title="Create Product Offer" size="md">
        <form onSubmit={poForm.handleSubmit(onCreatePO)} className={styles.form}>
          <div className={styles.fieldWrap}>
            <label className={styles.label}>Product</label>
            <select className={styles.select} {...poForm.register('product')}>
              <option value="">Select product</option>
              {productsData?.products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            {poForm.formState.errors.product && <p className={styles.error}>{poForm.formState.errors.product.message}</p>}
          </div>
          <div className={styles.row}>
            <div className={styles.fieldWrap}>
              <label className={styles.label}>Type</label>
              <select className={styles.select} {...poForm.register('discountType')}>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
            </div>
            <Input label="Value" type="number" error={poForm.formState.errors.discountValue?.message} {...poForm.register('discountValue')} />
          </div>
          <div className={styles.row}>
            <Input label="Start Date" type="date" error={poForm.formState.errors.startDate?.message} {...poForm.register('startDate')} />
            <Input label="End Date" type="date" error={poForm.formState.errors.endDate?.message} {...poForm.register('endDate')} />
          </div>
          <Button type="submit" fullWidth loading={creatingPO}>Create Offer</Button>
        </form>
      </Modal>

      {/* Create Category Offer Modal */}
      <Modal open={showCO} onClose={() => setShowCO(false)} title="Create Category Offer" size="md">
        <form onSubmit={coForm.handleSubmit(onCreateCO)} className={styles.form}>
          <div className={styles.fieldWrap}>
            <label className={styles.label}>Category</label>
            <select className={styles.select} {...coForm.register('category')}>
              <option value="">Select category</option>
              {categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            {coForm.formState.errors.category && <p className={styles.error}>{coForm.formState.errors.category.message}</p>}
          </div>
          <div className={styles.row}>
            <div className={styles.fieldWrap}>
              <label className={styles.label}>Type</label>
              <select className={styles.select} {...coForm.register('discountType')}>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
            </div>
            <Input label="Value" type="number" error={coForm.formState.errors.discountValue?.message} {...coForm.register('discountValue')} />
          </div>
          <div className={styles.row}>
            <Input label="Start Date" type="date" error={coForm.formState.errors.startDate?.message} {...coForm.register('startDate')} />
            <Input label="End Date" type="date" error={coForm.formState.errors.endDate?.message} {...coForm.register('endDate')} />
          </div>
          <Button type="submit" fullWidth loading={creatingCO}>Create Offer</Button>
        </form>
      </Modal>
    </>
  );
}
