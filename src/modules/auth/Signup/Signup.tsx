import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@shared/components';
import { useSignup, useVerifyOTP, useResendOTP } from '@/hooks/useAuth';
import styles from './Signup.module.css';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  referralCode: z.string().optional(),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type SignupForm = z.infer<typeof signupSchema>;
type OTPForm = z.infer<typeof otpSchema>;

export default function Signup() {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const referralFromUrl = searchParams.get('ref') || '';

  const { mutate: signup, isPending: signupPending } = useSignup();
  const { mutate: verifyOTP, isPending: verifyPending } = useVerifyOTP();
  const { mutate: resendOTP, isPending: resendPending } = useResendOTP();

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { referralCode: referralFromUrl },
  });

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
  });

  const onSignup = (data: SignupForm) => {
    signup(data, {
      onSuccess: () => {
        setEmail(data.email);
        setStep('otp');
      },
    });
  };

  const onVerify = (data: OTPForm) => {
    verifyOTP({ email, otp: data.otp });
  };

  return (
    <>
      <Helmet>
        <title>Sign up — STORE</title>
      </Helmet>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {step === 'form' ? 'Create account' : 'Verify email'}
          </h1>
          <p className={styles.subtitle}>
            {step === 'form'
              ? 'Join us to start shopping'
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {step === 'form' ? (
          <form onSubmit={signupForm.handleSubmit(onSignup)} className={styles.form}>
            <Input
              label="Full name"
              placeholder="John Doe"
              autoComplete="name"
              error={signupForm.formState.errors.name?.message}
              {...signupForm.register('name')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={signupForm.formState.errors.email?.message}
              {...signupForm.register('email')}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              error={signupForm.formState.errors.password?.message}
              rightIcon={
                <button type="button" className={styles.eyeToggle} onClick={() => setShowPassword((p) => !p)} tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              {...signupForm.register('password')}
            />
            <Input
              label="Phone (optional)"
              type="tel"
              placeholder="+91 9876543210"
              {...signupForm.register('phone')}
            />
            <Input
              label="Referral code (optional)"
              placeholder="ABC123"
              {...signupForm.register('referralCode')}
            />
            <Button type="submit" fullWidth loading={signupPending} size="lg">
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={otpForm.handleSubmit(onVerify)} className={styles.form} autoComplete="off">
            <Input
              label="Verification code"
              placeholder="000000"
              maxLength={6}
              autoComplete="one-time-code"
              id="otp-input"
              error={otpForm.formState.errors.otp?.message}
              {...otpForm.register('otp')}
            />
            <Button type="submit" fullWidth loading={verifyPending} size="lg">
              Verify & Create Account
            </Button>
            <Button
              type="button"
              variant="ghost"
              fullWidth
              size="sm"
              loading={resendPending}
              onClick={() => resendOTP({ email, type: 'signup' })}
            >
              Resend OTP
            </Button>
          </form>
        )}

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
