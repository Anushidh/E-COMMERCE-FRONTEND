import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Star } from 'lucide-react';
import { useProfile, useDeleteAddress, useSetDefaultAddress } from '@/hooks/useUser';
import { Button, Spinner, Badge, ConfirmDialog, AddressFormModal } from '@shared/components';
import styles from './Addresses.module.css';

export default function Addresses() {
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const { data: profile, isLoading } = useProfile();
  const { mutate: deleteAddress } = useDeleteAddress();
  const { mutate: setDefault } = useSetDefaultAddress();

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

      <AddressFormModal open={showAdd} onClose={() => setShowAdd(false)} />

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
