import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button, Input } from '@shared/components';
import { useCreateProduct } from '@/hooks/useAdmin';
import { useCategories } from '@/hooks/useCategories';
import { useState } from 'react';
import styles from './ProductCreate.module.css';

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

  const { register, handleSubmit, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { gender: 'Unisex', gstRate: 18 },
  });

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
          <button className={styles.back} onClick={() => navigate('/admin/products')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className={styles.title}>New Product</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>General Information</h2>
            <div className={styles.grid}>
              <Input label="Product Name" error={errors.name?.message} {...register('name')} />
              <Input label="Brand (optional)" {...register('brand')} />
            </div>
            <div className={styles.textareaWrapper}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.textarea} rows={4} {...register('description')} />
              {errors.description && <p className={styles.error}>{errors.description.message}</p>}
            </div>
            <div className={styles.grid}>
              <div className={styles.selectWrapper}>
                <label className={styles.label}>Category</label>
                <select className={styles.select} {...register('category')}>
                  <option value="">Select category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                {errors.category && <p className={styles.error}>{errors.category.message}</p>}
              </div>
              <div className={styles.selectWrapper}>
                <label className={styles.label}>Gender</label>
                <select className={styles.select} {...register('gender')}>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Pricing</h2>
            <div className={styles.grid}>
              <Input label="Base Price (₹)" type="number" error={errors.basePrice?.message} {...register('basePrice')} />
              <div className={styles.selectWrapper}>
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
            <Button type="button" variant="secondary" onClick={() => navigate('/admin/products')}>Cancel</Button>
            <Button type="submit" loading={isPending}>Create Product</Button>
          </div>
        </form>
      </div>
    </>
  );
}
