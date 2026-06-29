import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Camera, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfile, useUpdateProfile, useChangePassword } from '@/hooks/useUser';
import { Button, Input, Skeleton } from '@shared/components';
import styles from './Settings.module.css';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function Settings() {
  const { data: profile, isLoading } = useProfile();
  const { mutate: updateProfile, isPending: updating } = useUpdateProfile();
  const { mutate: changePassword, isPending: changingPassword } = useChangePassword();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const avatarFile = useRef<File | null>(null);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: profile ? { name: profile.name, phone: profile.phone || '' } : undefined,
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Skeleton width="200px" height="1.5rem" />
        <Skeleton width="100%" height="300px" borderRadius="var(--radius-md)" />
      </div>
    );
  }

  if (!profile) return null;

  const onProfileSubmit = (data: ProfileForm) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    if (avatarFile.current) formData.append('avatar', avatarFile.current);
    updateProfile(formData);
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword }, {
      onSuccess: () => passwordForm.reset(),
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      avatarFile.current = file;
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const isGoogleUser = !!profile.avatar && !profile.avatar.includes('cloudinary');

  return (
    <>
      <Helmet><title>Account Settings — STORE</title></Helmet>
      <div className={styles.page}>
        <h1 className={styles.title}>Account Settings</h1>

        {/* Profile Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile</h2>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className={styles.form}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar} onClick={() => fileRef.current?.click()}>
                {avatarPreview || profile.avatar ? (
                  <img src={avatarPreview || profile.avatar} alt="" className={styles.avatarImg} />
                ) : (
                  <span className={styles.avatarPlaceholder}>{profile.name[0]}</span>
                )}
                <div className={styles.avatarOverlay}>
                  <Camera size={16} />
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" />
              <p className={styles.avatarHint}>Click to change photo</p>
            </div>
            <Input label="Name" error={profileForm.formState.errors.name?.message} {...profileForm.register('name')} />
            <Input label="Phone" type="tel" placeholder="+91 9876543210" {...profileForm.register('phone')} />
            <Input label="Email" value={profile.email} disabled />
            <Button type="submit" loading={updating}>Save Changes</Button>
          </form>
        </section>

        {/* Password Section — only for non-OAuth users */}
        {!isGoogleUser && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Change Password</h2>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className={styles.form}>
              <Input
                label="Current Password"
                type={showCurrent ? 'text' : 'password'}
                error={passwordForm.formState.errors.currentPassword?.message}
                rightIcon={
                  <button type="button" className={styles.eyeToggle} onClick={() => setShowCurrent((p) => !p)} tabIndex={-1}>
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                {...passwordForm.register('currentPassword')}
              />
              <Input
                label="New Password"
                type={showNew ? 'text' : 'password'}
                error={passwordForm.formState.errors.newPassword?.message}
                rightIcon={
                  <button type="button" className={styles.eyeToggle} onClick={() => setShowNew((p) => !p)} tabIndex={-1}>
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                {...passwordForm.register('newPassword')}
              />
              <Input
                label="Confirm New Password"
                type={showNew ? 'text' : 'password'}
                error={passwordForm.formState.errors.confirmPassword?.message}
                {...passwordForm.register('confirmPassword')}
              />
              <Button type="submit" loading={changingPassword}>Change Password</Button>
            </form>
          </section>
        )}
      </div>
    </>
  );
}
