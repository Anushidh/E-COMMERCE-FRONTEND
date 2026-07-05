import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfile, useAddAddress, useDeleteAddress, useSetDefaultAddress } from '@/hooks/useUser';
import { Button, Spinner, Input, Modal, Badge, ConfirmDialog } from '@shared/components';
import styles from './Addresses.module.css';

const addressSchema = z.object({
  label: z.string().min(1, 'Label required'),
  fullName: z.string().min(1, 'Name required'),
  phone: z.string().min(10, 'Valid phone required'),
  addressLine1: z.string().min(1, 'Address required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City required'),
  state: z.string().min(1, 'State required'),
  pincode: z.string().min(6, 'Valid pincode required'),
  country: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type AddressForm = z.infer<typeof addressSchema>;

export default function Addresses() {
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const { data: profile, isLoading } = useProfile();
  const { mutate: addAddress, isPending: adding } = useAddAddress();
  const { mutate: deleteAddress } = useDeleteAddress();
  const { mutate: setDefault } = useSetDefaultAddress();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'India', isDefault: false, fullName: profile?.name || '', phone: profile?.phone || '' },
  });

  const onAdd = (data: AddressForm) => {
    addAddress(data as any, { onSuccess: () => { reset(); setShowAdd(false); } });
  };

  if (isLoading) return <div className={styles.loader}><Spinner size="lg" /></div>;

  const addresses = profile?.addresses || [];

  return (
    <>
      <Helmet><title>Addresses — Wearhaus</title></Helmet>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Addresses</h1>
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowAdd(true)}>Add Address</Button>
        </div>

        {addresses.length === 0 ? (
          <p className={styles.empty}>No addresses saved yet.</p>
        ) : (
          <div className={styles.list}>
            {addresses.map((addr) => (
              <div key={addr._id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardLabel}>{addr.label}</span>
                  {addr.isDefault && <Badge variant="success">Default</Badge>}
                </div>
                <p className={styles.cardText}>{addr.fullName} · {addr.phone}</p>
                <p className={styles.cardText}>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                <p className={styles.cardText}>{addr.city}, {addr.state} — {addr.pincode}</p>
                <div className={styles.cardActions}>
                  {!addr.isDefault && (
                    <button className={styles.actionBtn} onClick={() => setDefault(addr._id)}>
                      <Star size={12} /> Set Default
                    </button>
                  )}
                  <button className={styles.deleteBtn} onClick={() => setDeleteTarget(addr._id)}>
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Address" size="md">
        <form onSubmit={handleSubmit(onAdd)} className={styles.form}>
          <div className={styles.row}>
            <Input label="Label" placeholder="Home / Work" error={errors.label?.message} {...register('label')} />
            <Input label="Full Name" error={errors.fullName?.message} {...register('fullName')} />
          </div>
          <Input label="Phone" type="tel" error={errors.phone?.message} {...register('phone')} />
          <Input label="Address Line 1" error={errors.addressLine1?.message} {...register('addressLine1')} />
          <Input label="Address Line 2 (optional)" {...register('addressLine2')} />
          <div className={styles.row}>
            <Input label="City" error={errors.city?.message} {...register('city')} />
            <Input label="State" error={errors.state?.message} {...register('state')} />
          </div>
          <div className={styles.row}>
            <Input label="Pincode" error={errors.pincode?.message} {...register('pincode')} />
            <Input label="Country" {...register('country')} />
          </div>
          <Button type="submit" fullWidth loading={adding}>Save Address</Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove address?"
        description="Are you sure you want to remove this address?"
        confirmLabel="Remove"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => { if (deleteTarget) deleteAddress(deleteTarget); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
