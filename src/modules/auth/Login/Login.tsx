import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@shared/components';
import { useLogin } from '@/hooks/useAuth';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { GoogleIcon } from '@shared/components/icons/GoogleIcon';
import styles from './Login.module.css';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();
  const { ref: cardRef, handleKeyDown } = useFocusTrap<HTMLDivElement>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login(data);
  };

  return (
    <>
      <Helmet>
        <title>Login — Wearhaus</title>
      </Helmet>
      <div className={styles.card} ref={cardRef} onKeyDown={handleKeyDown}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your account to continue</p>
        </div>

        {/* Social login first */}
        <Button
          type="button"
          variant="secondary"
          fullWidth
          size="lg"
          leftIcon={<GoogleIcon />}
          onClick={() => { window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`; }}
        >
          Continue with Google
        </Button>

        <div className={styles.divider}>
          <span className={styles.dividerText}>or</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
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
              <button type="button" className={styles.eyeToggle} onClick={() => setShowPassword((p) => !p)} tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            {...register('password')}
          />

          <div className={styles.formMeta}>
            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth loading={isPending} size="lg">
            Sign in
          </Button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}

