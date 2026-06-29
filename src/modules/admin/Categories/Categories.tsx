import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategories } from '@/hooks/useCategories';
import { useCreateCategory, useDeleteCategory } from '@/hooks/useAdmin';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';
import { Button, Badge, CardGridSkeleton, Input, Modal, ConfirmDialog, Select } from '@shared/components';
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
  const [confirmClose, setConfirmClose] = useState<'create' | 'edit' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { data: categories, isLoading } = useCategories();
  const { mutate: create, isPending: creating } = useCreateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();
  const qc = useQueryClient();

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '', gender: 'Both' },
  });

  const editForm = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  // Track original values for edit form comparison
  const editOriginal = useRef<CategoryForm | null>(null);

  // Create form: check if any field has a value or was changed from default
  const createValues = watch();
  const isCreateDirty = !!(createValues.name || createValues.description) || createValues.gender !== 'Both' || imageFile !== null;

  // Edit form: check if any value differs from original
  const editValues = editForm.watch();
  const isEditDirty = (() => {
    if (!editOriginal.current) return false;
    return (
      editValues.name !== editOriginal.current.name ||
      editValues.description !== editOriginal.current.description ||
      editValues.gender !== editOriginal.current.gender ||
      editImageFile !== null
    );
  })();

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
    const values = { name: cat.name, description: cat.description || '', gender: cat.gender as 'Men' | 'Women' | 'Both' };
    setEditingId(cat._id);
    editOriginal.current = values;
    editForm.reset(values);
  };

  return (
    <>
      <Helmet><title>Categories — Admin</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Categories</h1>
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowCreate(true)}>Create</Button>
        </div>

        {isLoading ? <CardGridSkeleton /> : (
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
                  <div className={styles.cardActions}>
                    <button
                      className={styles.cardEdit}
                      onClick={() => openEdit(cat)}
                      aria-label={`Edit ${cat.name}`}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      className={styles.cardDelete}
                      onClick={() => setDeleteTarget({ id: cat._id, name: cat.name })}
                      aria-label={`Delete ${cat.name}`}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {categories?.length === 0 && (
              <p className={styles.empty}>No categories yet</p>
            )}
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => {
        if (isCreateDirty) { setConfirmClose('create'); } else { setShowCreate(false); reset(); }
      }} title="Create Category" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input label="Name" placeholder="T-Shirts" error={errors.name?.message} {...register('name')} />
          <Input label="Description (optional)" placeholder="Short description" {...register('description')} />
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                label="Gender"
                options={[
                  { label: 'Both', value: 'Both' },
                  { label: 'Men', value: 'Men' },
                  { label: 'Women', value: 'Women' },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
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
      <Modal open={!!editingId} onClose={() => {
        if (isEditDirty || editImageFile) { setConfirmClose('edit'); } else { setEditingId(null); }
      }} title="Edit Category" size="sm">
        <form onSubmit={editForm.handleSubmit(onEdit)} className={styles.form}>
          <Input label="Name" error={editForm.formState.errors.name?.message} {...editForm.register('name')} />
          <Input label="Description (optional)" {...editForm.register('description')} />
          <Controller
            name="gender"
            control={editForm.control}
            render={({ field }) => (
              <Select
                label="Gender"
                options={[
                  { label: 'Both', value: 'Both' },
                  { label: 'Men', value: 'Men' },
                  { label: 'Women', value: 'Women' },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <div className={styles.fieldWrap}>
            <label className={styles.label}>New Image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setEditImageFile(e.target.files?.[0] || null)} className={styles.fileInput} />
          </div>
          <Button type="submit" fullWidth loading={saving}>Save Changes</Button>
        </form>
      </Modal>

      {/* Unsaved changes confirm */}
      <ConfirmDialog
        open={confirmClose === 'create'}
        title="Discard changes?"
        description="You have unsaved changes in the form. Are you sure you want to close?"
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        variant="warning"
        onConfirm={() => { setConfirmClose(null); reset(); setImageFile(null); setShowCreate(false); }}
        onCancel={() => setConfirmClose(null)}
      />
      <ConfirmDialog
        open={confirmClose === 'edit'}
        title="Discard changes?"
        description="You have unsaved changes. Are you sure you want to close?"
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        variant="warning"
        onConfirm={() => { setConfirmClose(null); editForm.reset(); setEditImageFile(null); setEditingId(null); }}
        onCancel={() => setConfirmClose(null)}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete category?"
        description={`This will permanently delete "${deleteTarget?.name}". This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => { if (deleteTarget) deleteCategory(deleteTarget.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
