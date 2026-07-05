import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@shared/components';
import { useAdminLogin } from '@/hooks/useAuth';
import styles from './AdminLogin.module.css';

const adminLoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useAdminLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
  });

  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
  if (e.key !== 'Tab') return;

  const focusable = formRef.current?.querySelectorAll<HTMLElement>(
    'input:not([disabled]), button:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
  );

  if (!focusable || focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (!first || !last) return;

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
};

  const onSubmit = (data: AdminLoginForm) => {
    login(data);
  };

  return (
    <>
      <Helmet>
        <title>Admin Login — Wearhaus</title>
      </Helmet>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.badge}>ADMIN</span>
            <h1 className={styles.title}>Sign in</h1>
          </div>

          <form ref={formRef}  onSubmit={handleSubmit(onSubmit)} className={styles.form} onKeyDown={handleKeyDown}>
            <Input
              label="Email"
              type="email"
              placeholder="admin@wearhaus.com"
              autoComplete="email"
              autoFocus
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  className={styles.eyeToggle}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              {...register('password')}
            />
            <Button type="submit" fullWidth loading={isPending} size="lg">
              Sign in to Admin
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
