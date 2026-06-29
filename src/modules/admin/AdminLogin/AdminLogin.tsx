import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Button, Input } from '@shared/components';
import { useAdminLogin } from '@/hooks/useAuth';
import styles from './AdminLogin.module.css';

const adminLoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const { mutate: login, isPending } = useAdminLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = (data: AdminLoginForm) => {
    login(data);
  };

  return (
    <>
      <Helmet>
        <title>Admin Login — STORE</title>
      </Helmet>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.badge}>ADMIN</span>
            <h1 className={styles.title}>Sign in</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Input
              label="Email"
              type="email"
              placeholder="admin@store.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
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
