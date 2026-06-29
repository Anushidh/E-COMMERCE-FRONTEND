import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { Button, Input } from '@shared/components';
import { useForgotPassword, useResetPassword } from '@/hooks/useAuth';
import styles from './ForgotPassword.module.css';

const emailSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

const resetSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

type EmailForm = z.infer<typeof emailSchema>;
type ResetForm = z.infer<typeof resetSchema>;

export default function ForgotPassword() {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');

  const { mutate: forgotPassword, isPending: emailPending } = useForgotPassword();
  const { mutate: resetPassword, isPending: resetPending } = useResetPassword();

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onEmailSubmit = (data: EmailForm) => {
    forgotPassword(data, {
      onSuccess: () => {
        setEmail(data.email);
        setStep('reset');
      },
    });
  };

  const onReset = (data: ResetForm) => {
    resetPassword({ email, otp: data.otp, newPassword: data.newPassword });
  };

  return (
    <>
      <Helmet>
        <title>Reset Password — STORE</title>
      </Helmet>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {step === 'email' ? 'Reset password' : 'New password'}
          </h1>
          <p className={styles.subtitle}>
            {step === 'email'
              ? 'Enter your email to receive a reset code'
              : `Enter the code sent to ${email}`}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className={styles.form}>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={emailForm.formState.errors.email?.message}
              {...emailForm.register('email')}
            />
            <Button type="submit" fullWidth loading={emailPending} size="lg">
              Send reset code
            </Button>
          </form>
        ) : (
          <form onSubmit={resetForm.handleSubmit(onReset)} className={styles.form}>
            <Input
              label="Verification code"
              placeholder="000000"
              maxLength={6}
              autoComplete="one-time-code"
              error={resetForm.formState.errors.otp?.message}
              {...resetForm.register('otp')}
            />
            <Input
              label="New password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={resetForm.formState.errors.newPassword?.message}
              {...resetForm.register('newPassword')}
            />
            <Button type="submit" fullWidth loading={resetPending} size="lg">
              Reset password
            </Button>
          </form>
        )}

        <div className={styles.footer}>
          <Link to="/login" className={styles.link}>
            Back to sign in
          </Link>
        </div>
      </div>
    </>
  );
}
