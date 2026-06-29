import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategories } from '@/hooks/useCategories';
import { useCreateCategory, useDeleteCategory } from '@/hooks/useAdmin';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';
import { Button, Badge, Spinner, Input, Modal } from '@shared/components';
import styles from './Categories.module.css';
import { getGenderBadgeVariant } from '@/shared/utils/badge';

const categorySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  gender: z.enum(['Men', 'Women', 'Both']),
});

type CategoryForm = z.infer<typeof categorySchema>;

export default function Categories() {
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const { data: categories, isLoading } = useCategories();
  const { mutate: create, isPending: creating } = useCreateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();
  const qc = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { gender: 'Both' },
  });

  const editForm = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = (data: CategoryForm) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    formData.append('gender', data.gender);
    if (imageFile) formData.append('categoryImage', imageFile);

    create(formData, {
      onSuccess: () => { reset(); setImageFile(null); setShowCreate(false); },
    });
  };

  const onEdit = async (data: CategoryForm) => {
    if (!editingId) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      formData.append('gender', data.gender);
      if (editImageFile) formData.append('categoryImage', editImageFile);
      await adminService.updateCategory(editingId, formData);
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated');
      setEditingId(null);
      setEditImageFile(null);
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (cat: { _id: string; name: string; description?: string; gender: string }) => {
    setEditingId(cat._id);
    editForm.reset({ name: cat.name, description: cat.description || '', gender: cat.gender as 'Men' | 'Women' | 'Both' });
  };

  return (
    <>
      <Helmet><title>Categories — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Categories</h1>
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowCreate(true)}>Create</Button>
        </div>

        {isLoading ? <Spinner size="lg" /> : (
          <div className={styles.grid}>
            {categories?.map((cat) => (
              <div key={cat._id} className={styles.card}>
                <div className={styles.cardImage}>
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className={styles.cardImg} />
                  ) : (
                    <div className={styles.cardPlaceholder}>{cat.name[0]}</div>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.cardName}>{cat.name}</h3>
                    <Badge variant={getGenderBadgeVariant(cat.gender)}>{cat.gender}</Badge>
                  </div>
                  {cat.description && <p className={styles.cardDesc}>{cat.description}</p>}
                  <button
                    className={styles.cardDelete}
                    onClick={() => deleteCategory(cat._id)}
                    aria-label={`Delete ${cat.name}`}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                  <button
                    className={styles.cardEdit}
                    onClick={() => openEdit(cat)}
                    aria-label={`Edit ${cat.name}`}
                  >
                    <Pencil size={14} /> Edit
                  </button>
                </div>
              </div>
            ))}
            {categories?.length === 0 && (
              <p className={styles.empty}>No categories yet</p>
            )}
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Category" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input label="Name" placeholder="T-Shirts" error={errors.name?.message} {...register('name')} />
          <Input label="Description (optional)" placeholder="Short description" {...register('description')} />
          <div className={styles.fieldWrap}>
            <label className={styles.label}>Gender</label>
            <select className={styles.select} {...register('gender')}>
              <option value="Both">Both</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>
          <div className={styles.fieldWrap}>
            <label className={styles.label}>Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className={styles.fileInput}
            />
          </div>
          <Button type="submit" fullWidth loading={creating}>Create Category</Button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editingId} onClose={() => setEditingId(null)} title="Edit Category" size="sm">
        <form onSubmit={editForm.handleSubmit(onEdit)} className={styles.form}>
          <Input label="Name" error={editForm.formState.errors.name?.message} {...editForm.register('name')} />
          <Input label="Description (optional)" {...editForm.register('description')} />
          <div className={styles.fieldWrap}>
            <label className={styles.label}>Gender</label>
            <select className={styles.select} {...editForm.register('gender')}>
              <option value="Both">Both</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>
          <div className={styles.fieldWrap}>
            <label className={styles.label}>New Image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setEditImageFile(e.target.files?.[0] || null)} className={styles.fileInput} />
          </div>
          <Button type="submit" fullWidth loading={saving}>Save Changes</Button>
        </form>
      </Modal>
    </>
  );
}
