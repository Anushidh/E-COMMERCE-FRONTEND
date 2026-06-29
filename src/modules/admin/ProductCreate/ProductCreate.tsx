import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { Button, Input, BackButton, ConfirmDialog, Select } from '@shared/components';
import { useCreateProduct } from '@/hooks/useAdmin';
import { useCategories } from '@/hooks/useCategories';
import { useState } from 'react';
import styles from './ProductCreate.module.css';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  brand: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  gender: z.enum(['Men', 'Women', 'Unisex']),
  basePrice: z.coerce.number().min(1, 'Price is required'),
  gstRate: z.coerce.number().refine((v) => [0, 5, 12, 18, 28].includes(v), 'Invalid GST rate'),
});

type ProductForm = z.infer<typeof productSchema>;

export default function ProductCreate() {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const { mutate: createProduct, isPending } = useCreateProduct();
  const [images, setImages] = useState<File[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', description: '', brand: '', category: '', gender: 'Unisex', basePrice: 0, gstRate: 18 },
  });

  // Check if any field has a meaningful value
  const productValues = watch();
  const isProductDirty = !!(
    productValues.name || productValues.description || productValues.brand || productValues.category ||
    productValues.basePrice
  ) || productValues.gender !== 'Unisex' || productValues.gstRate !== 18 || images.length > 0;

  const { ref: formRef, handleKeyDown } = useFocusTrap<HTMLFormElement>();

  const onSubmit = (data: ProductForm) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') formData.append(key, String(value));
    });
    images.forEach((file) => formData.append('productImages', file));

    createProduct(formData, {
      onSuccess: () => navigate('/admin/products'),
    });
  };

  return (
    <>
      <Helmet><title>Add Product — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <BackButton to="/admin/products" label="Back" isDirty={isProductDirty} />
        </div>

        <form ref={formRef} onKeyDown={handleKeyDown} onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>General Information</h2>
            <div className={styles.grid}>
              <Input label="Product Name" error={errors.name?.message} autoFocus {...register('name')} />
              <Input label="Brand (optional)" {...register('brand')} />
            </div>
            <div className={styles.textareaWrapper}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.textarea} rows={4} {...register('description')} />
              {errors.description && <p className={styles.error}>{errors.description.message}</p>}
            </div>
            <div className={styles.grid}>
              <Controller name="category" control={control} render={({ field }) => (
                <Select label="Category" placeholder="Select category" options={categories?.map((c) => ({ label: c.name, value: c._id })) || []} value={field.value} onChange={field.onChange} error={errors.category?.message} />
              )} />
              <Controller name="gender" control={control} render={({ field }) => (
                <Select label="Gender" options={[{ label: 'Men', value: 'Men' }, { label: 'Women', value: 'Women' }, { label: 'Unisex', value: 'Unisex' }]} value={field.value} onChange={field.onChange} />
              )} />
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Pricing</h2>
            <div className={styles.grid}>
              <Input label="Base Price (₹)" type="number" error={errors.basePrice?.message} {...register('basePrice')} />
              <Controller name="gstRate" control={control} render={({ field }) => (
                <Select label="GST Rate" options={[{ label: '0%', value: '0' }, { label: '5%', value: '5' }, { label: '12%', value: '12' }, { label: '18%', value: '18' }, { label: '28%', value: '28' }]} value={String(field.value)} onChange={(v) => field.onChange(Number(v))} />
              )} />
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Images</h2>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(Array.from(e.target.files || []))}
              className={styles.fileInput}
            />
            {images.length > 0 && (
              <div className={styles.imagePreview}>
                {images.map((file, i) => (
                  <div key={i} className={styles.previewItem}>
                    <img src={URL.createObjectURL(file)} alt="" className={styles.previewImg} />
                    <span className={styles.previewName}>{file.name}</span>
                  </div>
                ))}
              </div>
            )}
            <p className={styles.hint}>Upload up to 10 images. You can add variants after creating the product.</p>
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={() => {
              if (isProductDirty) {
                setShowCancelConfirm(true);
              } else {
                navigate('/admin/products');
              }
            }}>Cancel</Button>
            <Button type="submit" loading={isPending}>Create Product</Button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={showCancelConfirm}
        title="Discard new product?"
        description="You have unsaved changes. Are you sure you want to leave without saving?"
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        variant="warning"
        onConfirm={() => { setShowCancelConfirm(false); navigate('/admin/products'); }}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </>
  );
}
