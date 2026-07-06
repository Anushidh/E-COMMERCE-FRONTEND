import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button';
import { useAddAddress, useProfile } from '@/hooks/useUser';
import styles from './AddressFormModal.module.css';

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

interface AddressFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddressFormModal({ open, onClose, onSuccess }: AddressFormModalProps) {
  const { data: profile } = useProfile();
  const { mutate: addAddress, isPending: adding } = useAddAddress();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { 
      country: 'India', 
      isDefault: false, 
      fullName: profile?.name || '', 
      phone: profile?.phone || '' 
    },
  });

  useEffect(() => {
    if (profile) {
      reset({ 
        country: 'India', 
        isDefault: false, 
        fullName: profile.name || '', 
        phone: profile.phone || '' 
      });
    }
  }, [profile, reset]);

  const onAdd = (data: AddressForm) => {
    addAddress(data as any, { 
      onSuccess: () => { 
        reset(); 
        onClose(); 
        if (onSuccess) onSuccess();
      } 
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Address" size="md">
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
  );
}
